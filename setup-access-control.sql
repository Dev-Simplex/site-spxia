-- Status do profile: pending (aguardando), active (liberado), suspended (suspenso)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended'));

-- Atualizar profiles existentes (admin) para active
UPDATE public.profiles SET status = 'active' WHERE role = 'admin';

-- Produtos vinculados ao usuário (o que ele comprou/tem acesso)
CREATE TABLE IF NOT EXISTS public.user_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  asaas_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'canceled', 'pending')),
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.user_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own products" ON public.user_products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage user_products" ON public.user_products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Atualizar orders: adicionar user_id para vincular ao profile quando existir
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Trigger: novo signup cria profile com status pendente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, status, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    'pending',
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: confirmar pagamento e liberar acesso
-- Chamada pelo webhook do Asaas ou manualmente
CREATE OR REPLACE FUNCTION public.confirm_payment(
  p_payment_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_product RECORD;
  v_profile_id UUID;
  v_group_id UUID;
BEGIN
  -- Buscar order pelo payment_id
  SELECT * INTO v_order FROM public.orders WHERE asaas_payment_id = p_payment_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', true, 'message', 'Order não encontrada para payment ' || p_payment_id);
  END IF;

  -- Atualizar status da order
  UPDATE public.orders SET status = 'CONFIRMED', updated_at = now() WHERE id = v_order.id;

  -- Buscar produto
  SELECT * INTO v_product FROM public.products WHERE id = v_order.product_id;

  -- Buscar ou criar profile pelo email
  SELECT id INTO v_profile_id FROM public.profiles
    WHERE id IN (SELECT id FROM auth.users WHERE email = v_order.customer_email);

  IF v_profile_id IS NULL THEN
    -- Usuário ainda não tem conta, apenas marcar a order com user_id null
    RETURN jsonb_build_object('success', true, 'message', 'Pagamento confirmado, aguardando registro do usuário', 'order_id', v_order.id);
  END IF;

  -- Vincular order ao profile
  UPDATE public.orders SET user_id = v_profile_id WHERE id = v_order.id;

  -- Buscar grupo Membro
  SELECT id INTO v_group_id FROM public.permission_groups WHERE name = 'Membro';

  -- Ativar profile
  UPDATE public.profiles SET
    status = 'active',
    group_id = COALESCE(group_id, v_group_id),
    updated_at = now()
  WHERE id = v_profile_id AND status = 'pending';

  -- Vincular produto ao usuário
  INSERT INTO public.user_products (user_id, product_id, order_id, asaas_subscription_id, status)
  VALUES (
    v_profile_id,
    v_order.product_id,
    v_order.id,
    v_order.asaas_subscription_id,
    'active'
  ) ON CONFLICT (user_id, product_id) DO UPDATE SET
    status = 'active',
    order_id = v_order.id,
    asaas_subscription_id = v_order.asaas_subscription_id;

  RETURN jsonb_build_object('success', true, 'message', 'Acesso liberado', 'user_id', v_profile_id, 'product', v_product.title);
END;
$$;

-- Função: quando usuário faz registro, checar se tem orders pendentes pelo email e vincular
CREATE OR REPLACE FUNCTION public.link_orders_on_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_order RECORD;
  v_group_id UUID;
  v_has_confirmed BOOLEAN := false;
BEGIN
  -- Buscar orders confirmadas pelo email do novo usuário
  FOR v_order IN
    SELECT * FROM public.orders
    WHERE customer_email = (SELECT email FROM auth.users WHERE id = NEW.id)
    AND status IN ('CONFIRMED', 'RECEIVED')
    AND user_id IS NULL
  LOOP
    v_has_confirmed := true;

    -- Vincular order
    UPDATE public.orders SET user_id = NEW.id WHERE id = v_order.id;

    -- Vincular produto
    INSERT INTO public.user_products (user_id, product_id, order_id, asaas_subscription_id, status)
    VALUES (NEW.id, v_order.product_id, v_order.id, v_order.asaas_subscription_id, 'active')
    ON CONFLICT (user_id, product_id) DO NOTHING;
  END LOOP;

  -- Se tem compras confirmadas, ativar o profile
  IF v_has_confirmed THEN
    SELECT id INTO v_group_id FROM public.permission_groups WHERE name = 'Membro';
    UPDATE public.profiles SET status = 'active', group_id = COALESCE(group_id, v_group_id) WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_link_orders ON public.profiles;
CREATE TRIGGER on_profile_created_link_orders
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.link_orders_on_signup();

-- Webhook do Asaas: receber notificação de pagamento confirmado
CREATE OR REPLACE FUNCTION public.asaas_webhook(
  p_event TEXT,
  p_payment_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF p_event IN ('PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED') THEN
    RETURN public.confirm_payment(p_payment_id);
  END IF;

  IF p_event = 'PAYMENT_OVERDUE' THEN
    UPDATE public.orders SET status = 'OVERDUE', updated_at = now() WHERE asaas_payment_id = p_payment_id;
    RETURN jsonb_build_object('success', true, 'message', 'Marcado como vencido');
  END IF;

  IF p_event = 'PAYMENT_REFUNDED' THEN
    UPDATE public.orders SET status = 'REFUNDED', updated_at = now() WHERE asaas_payment_id = p_payment_id;
    -- Revogar acesso ao produto
    UPDATE public.user_products SET status = 'canceled'
    WHERE order_id = (SELECT id FROM public.orders WHERE asaas_payment_id = p_payment_id);
    RETURN jsonb_build_object('success', true, 'message', 'Estornado e acesso revogado');
  END IF;

  RETURN jsonb_build_object('success', true, 'message', 'Evento ignorado: ' || p_event);
END;
$$;
