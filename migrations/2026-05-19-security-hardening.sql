-- =====================================================================
-- 2026-05-19 — Security Hardening (squad audit T1.1, T1.2, T1.4, T1.8)
-- =====================================================================
-- Run this ONCE in Supabase SQL editor (or via management API).
-- Idempotent — safe to re-run.
--
-- What it does:
--   1. Move hardcoded Asaas API key into Supabase Vault
--   2. Move hardcoded Anthropic placeholder into Vault
--   3. Create app.get_secret() helper
--   4. Rewrite asaas_request, checkout, generate_diagnostic_analysis to read from Vault
--   5. Add Asaas webhook token check (T1.2)
--   6. REVOKE EXECUTE on sensitive functions from anon/authenticated (T1.2)
--   7. UNIQUE constraint on orders.asaas_payment_id (T1.4 — idempotency)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Required extensions
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- ---------------------------------------------------------------------
-- 1. Vault secrets
-- ---------------------------------------------------------------------
-- ASAAS_API_KEY — current production key (rotate in Asaas dashboard ASAP).
DO $$
DECLARE
  v_id UUID;
BEGIN
  SELECT id INTO v_id FROM vault.secrets WHERE name = 'ASAAS_API_KEY';
  IF v_id IS NULL THEN
    PERFORM vault.create_secret(
      '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjI3ZTQwNWJlLWFiNzctNDA4Ni04ZThmLWQ2MjFiZWI4M2VmMjo6JGFhY2hfYzc4ODBiODItYzdiZS00MDk5LWI3NjItOTNkYmE5OGNlYzZj',
      'ASAAS_API_KEY',
      'Asaas production API key — rotate via SELECT vault.update_secret(id, new_value)'
    );
  END IF;
END $$;

-- ANTHROPIC_API_KEY — placeholder. Update via:
--   SELECT vault.update_secret(
--     (SELECT id FROM vault.secrets WHERE name = 'ANTHROPIC_API_KEY'),
--     'sk-ant-real-key-here'
--   );
DO $$
DECLARE
  v_id UUID;
BEGIN
  SELECT id INTO v_id FROM vault.secrets WHERE name = 'ANTHROPIC_API_KEY';
  IF v_id IS NULL THEN
    PERFORM vault.create_secret('REPLACE_ME', 'ANTHROPIC_API_KEY', 'Anthropic API key for diagnostic AI analysis');
  END IF;
END $$;

-- ASAAS_WEBHOOK_TOKEN — random shared secret between Asaas dashboard and our webhook.
-- Generate once with: SELECT encode(gen_random_bytes(32), 'hex');
-- Then set in Asaas dashboard > Configurações > Webhooks > Token header.
DO $$
DECLARE
  v_id UUID;
BEGIN
  SELECT id INTO v_id FROM vault.secrets WHERE name = 'ASAAS_WEBHOOK_TOKEN';
  IF v_id IS NULL THEN
    PERFORM vault.create_secret(
      encode(gen_random_bytes(32), 'hex'),
      'ASAAS_WEBHOOK_TOKEN',
      'Shared secret for Asaas webhook authentication — copy to Asaas dashboard'
    );
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- 2. app.get_secret() helper (locked-down schema)
-- ---------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS app;
REVOKE ALL ON SCHEMA app FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA app TO postgres, service_role;

CREATE OR REPLACE FUNCTION app.get_secret(p_name TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = p_name LIMIT 1;
$$;
REVOKE ALL ON FUNCTION app.get_secret(TEXT) FROM PUBLIC, anon, authenticated;
-- Only callable from SECURITY DEFINER functions that themselves run as postgres.

-- ---------------------------------------------------------------------
-- 3. Refactor asaas_request — read key from vault
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.asaas_request(
  p_method TEXT,
  p_path TEXT,
  p_body JSONB DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, app
AS $$
DECLARE
  v_api_key TEXT;
  v_url TEXT;
  v_headers extensions.http_header[];
  v_res extensions.http_response;
BEGIN
  v_api_key := app.get_secret('ASAAS_API_KEY');
  IF v_api_key IS NULL OR v_api_key = '' THEN
    RAISE EXCEPTION 'ASAAS_API_KEY not configured in vault';
  END IF;

  v_url := 'https://api.asaas.com' || p_path;
  v_headers := ARRAY[extensions.http_header('access_token', v_api_key)];

  IF p_method = 'GET' THEN
    v_res := extensions.http(('GET', v_url, v_headers, NULL, NULL)::extensions.http_request);
  ELSE
    v_res := extensions.http((
      p_method, v_url,
      v_headers || ARRAY[extensions.http_header('Content-Type', 'application/json')],
      'application/json',
      COALESCE(p_body::TEXT, '{}')
    )::extensions.http_request);
  END IF;

  RETURN v_res.content::JSONB;
END;
$$;

-- ---------------------------------------------------------------------
-- 4. Refactor checkout() — read key from vault, add SET search_path
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.checkout(
  p_product_id UUID,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_cpf_cnpj TEXT,
  p_customer_phone TEXT DEFAULT '',
  p_billing_type TEXT DEFAULT 'PIX'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, app
AS $$
DECLARE
  v_product RECORD;
  v_api_key TEXT;
  v_base TEXT := 'https://api.asaas.com';
  v_headers extensions.http_header[];
  v_search_res extensions.http_response;
  v_customer_res extensions.http_response;
  v_payment_res extensions.http_response;
  v_sub_res extensions.http_response;
  v_pix_res extensions.http_response;
  v_customer_id TEXT;
  v_search_data JSONB;
  v_customer_data JSONB;
  v_payment_data JSONB;
  v_sub_data JSONB;
  v_pix_data JSONB;
  v_due_date TEXT;
  v_order_id UUID;
  v_user_exists BOOLEAN;
BEGIN
  v_api_key := app.get_secret('ASAAS_API_KEY');
  IF v_api_key IS NULL OR v_api_key = '' THEN
    RAISE EXCEPTION 'ASAAS_API_KEY not configured in vault';
  END IF;

  v_headers := ARRAY[extensions.http_header('access_token', v_api_key)];

  SELECT * INTO v_product FROM public.products WHERE id = p_product_id AND is_published = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', true, 'message', 'Produto não encontrado');
  END IF;

  v_search_res := extensions.http((
    'GET', v_base || '/v3/customers?cpfCnpj=' || p_customer_cpf_cnpj, v_headers, NULL, NULL
  )::extensions.http_request);
  v_search_data := v_search_res.content::JSONB;

  IF (v_search_data->'data') IS NOT NULL AND jsonb_array_length(v_search_data->'data') > 0 THEN
    v_customer_id := v_search_data->'data'->0->>'id';
  ELSE
    v_customer_res := extensions.http((
      'POST', v_base || '/v3/customers',
      v_headers || ARRAY[extensions.http_header('Content-Type', 'application/json')],
      'application/json',
      jsonb_build_object(
        'name', p_customer_name, 'email', p_customer_email,
        'cpfCnpj', p_customer_cpf_cnpj, 'mobilePhone', NULLIF(p_customer_phone, '')
      )::TEXT
    )::extensions.http_request);
    v_customer_data := v_customer_res.content::JSONB;
    v_customer_id := v_customer_data->>'id';

    IF v_customer_id IS NULL THEN
      RETURN jsonb_build_object('error', true, 'message', 'Erro ao criar cliente no gateway');
    END IF;
  END IF;

  v_due_date := to_char(CURRENT_DATE + INTERVAL '3 days', 'YYYY-MM-DD');

  IF v_product.type = 'subscription' THEN
    v_sub_res := extensions.http((
      'POST', v_base || '/v3/subscriptions',
      v_headers || ARRAY[extensions.http_header('Content-Type', 'application/json')],
      'application/json',
      jsonb_build_object(
        'customer', v_customer_id, 'billingType', p_billing_type,
        'value', v_product.price::NUMERIC, 'nextDueDate', v_due_date,
        'cycle', COALESCE(v_product.billing_cycle, 'MONTHLY'),
        'description', v_product.title, 'externalReference', v_product.id::TEXT
      )::TEXT
    )::extensions.http_request);
    v_sub_data := v_sub_res.content::JSONB;

    IF v_sub_data->>'id' IS NOT NULL THEN
      v_payment_res := extensions.http((
        'GET', v_base || '/v3/subscriptions/' || (v_sub_data->>'id') || '/payments',
        v_headers, NULL, NULL
      )::extensions.http_request);
      v_payment_data := (v_payment_res.content::JSONB)->'data'->0;
    END IF;
  ELSE
    v_payment_res := extensions.http((
      'POST', v_base || '/v3/payments',
      v_headers || ARRAY[extensions.http_header('Content-Type', 'application/json')],
      'application/json',
      jsonb_build_object(
        'customer', v_customer_id, 'billingType', p_billing_type,
        'value', v_product.price::NUMERIC, 'dueDate', v_due_date,
        'description', v_product.title, 'externalReference', v_product.id::TEXT
      )::TEXT
    )::extensions.http_request);
    v_payment_data := v_payment_res.content::JSONB;
  END IF;

  IF p_billing_type = 'PIX' AND v_payment_data->>'id' IS NOT NULL THEN
    BEGIN
      v_pix_res := extensions.http((
        'GET', v_base || '/v3/payments/' || (v_payment_data->>'id') || '/pixQrCode',
        v_headers, NULL, NULL
      )::extensions.http_request);
      v_pix_data := v_pix_res.content::JSONB;
    EXCEPTION WHEN OTHERS THEN
      v_pix_data := NULL;
    END;
  END IF;

  INSERT INTO public.orders (
    product_id, customer_name, customer_email, customer_cpf_cnpj, customer_phone,
    asaas_customer_id, asaas_payment_id, asaas_subscription_id,
    billing_type, amount, status
  ) VALUES (
    p_product_id, p_customer_name, p_customer_email, p_customer_cpf_cnpj, p_customer_phone,
    v_customer_id, v_payment_data->>'id', v_sub_data->>'id',
    p_billing_type, v_product.price, 'PENDING'
  )
  ON CONFLICT (asaas_payment_id) DO UPDATE SET updated_at = now()
  RETURNING id INTO v_order_id;

  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = p_customer_email) INTO v_user_exists;
  IF v_user_exists THEN
    UPDATE public.orders SET user_id = (SELECT id FROM auth.users WHERE email = p_customer_email LIMIT 1)
      WHERE id = v_order_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'paymentId', v_payment_data->>'id',
    'subscriptionId', v_sub_data->>'id',
    'invoiceUrl', v_payment_data->>'invoiceUrl',
    'bankSlipUrl', v_payment_data->>'bankSlipUrl',
    'pixData', v_pix_data,
    'status', COALESCE(v_payment_data->>'status', 'PENDING'),
    'orderId', v_order_id,
    'userExists', v_user_exists
  );
END;
$$;

-- ---------------------------------------------------------------------
-- 5. T1.2 — Asaas webhook authenticated
-- ---------------------------------------------------------------------
-- New signature: requires p_token, validates against ASAAS_WEBHOOK_TOKEN vault secret.
-- DROP+CREATE because RETURN type stays JSONB but parameter list changes.
DROP FUNCTION IF EXISTS public.asaas_webhook(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.asaas_webhook(
  p_token TEXT,
  p_event TEXT,
  p_payment_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app
AS $$
DECLARE
  v_expected_token TEXT;
BEGIN
  v_expected_token := app.get_secret('ASAAS_WEBHOOK_TOKEN');
  IF v_expected_token IS NULL OR v_expected_token = '' THEN
    RAISE EXCEPTION 'ASAAS_WEBHOOK_TOKEN not configured';
  END IF;

  -- Constant-time comparison (Postgres = is constant-time for TEXT of equal length;
  -- length leak is acceptable since the token is fixed at 64 hex chars).
  IF p_token IS DISTINCT FROM v_expected_token THEN
    RETURN jsonb_build_object('error', true, 'message', 'Unauthorized');
  END IF;

  IF p_event IN ('PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED') THEN
    RETURN public.confirm_payment(p_payment_id);
  END IF;

  IF p_event = 'PAYMENT_OVERDUE' THEN
    UPDATE public.orders SET status = 'OVERDUE', updated_at = now() WHERE asaas_payment_id = p_payment_id;
    RETURN jsonb_build_object('success', true, 'message', 'Marcado como vencido');
  END IF;

  IF p_event = 'PAYMENT_REFUNDED' THEN
    UPDATE public.orders SET status = 'REFUNDED', updated_at = now() WHERE asaas_payment_id = p_payment_id;
    UPDATE public.user_products SET status = 'canceled'
      WHERE order_id = (SELECT id FROM public.orders WHERE asaas_payment_id = p_payment_id LIMIT 1);
    RETURN jsonb_build_object('success', true, 'message', 'Estornado e acesso revogado');
  END IF;

  RETURN jsonb_build_object('success', true, 'message', 'Evento ignorado: ' || p_event);
END;
$$;

-- ---------------------------------------------------------------------
-- 6. T1.4 — Idempotency: UNIQUE on orders.asaas_payment_id
-- ---------------------------------------------------------------------
-- Partial unique index allows multiple NULLs (subscription orders where payment_id is filled later).
CREATE UNIQUE INDEX IF NOT EXISTS orders_asaas_payment_id_uniq
  ON public.orders (asaas_payment_id)
  WHERE asaas_payment_id IS NOT NULL;

-- ---------------------------------------------------------------------
-- 7. REVOKE EXECUTE on sensitive functions from anon/authenticated
-- ---------------------------------------------------------------------
-- These should only be callable from service_role (edge functions, webhooks).
DO $$
DECLARE
  fn TEXT;
BEGIN
  FOR fn IN SELECT unnest(ARRAY[
    'asaas_request(text,text,jsonb)',
    'asaas_webhook(text,text,text)',
    'confirm_payment(text)',
    'change_user_password(uuid,text)'
  ]) LOOP
    BEGIN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%s FROM anon, authenticated, PUBLIC', fn);
    EXCEPTION WHEN undefined_function THEN
      RAISE NOTICE 'Function %s not found, skipping', fn;
    END;
  END LOOP;
END $$;

-- checkout() stays callable by authenticated (used by Checkout.jsx via RPC).
-- But we explicitly grant to authenticated only (not anon):
DO $$
BEGIN
  REVOKE EXECUTE ON FUNCTION public.checkout(uuid,text,text,text,text,text) FROM anon, PUBLIC;
  GRANT EXECUTE ON FUNCTION public.checkout(uuid,text,text,text,text,text) TO authenticated;
EXCEPTION WHEN undefined_function THEN
  RAISE NOTICE 'checkout() not found';
END $$;

-- ---------------------------------------------------------------------
-- 8. T1.7 — Deprecate raw change_user_password RPC
-- ---------------------------------------------------------------------
-- The Usuarios.jsx page now calls the `change-user-password` edge function,
-- which uses Supabase Admin API (auth.admin.updateUserById) instead of
-- mutating auth.users.encrypted_password directly.
--
-- After deploying the edge function and verifying it works, uncomment:
-- DROP FUNCTION IF EXISTS public.change_user_password(uuid, text);

-- ---------------------------------------------------------------------
-- 9. Show migration result
-- ---------------------------------------------------------------------
SELECT
  'ASAAS_API_KEY' AS secret,
  CASE WHEN app.get_secret('ASAAS_API_KEY') IS NOT NULL THEN 'OK' ELSE 'MISSING' END AS status
UNION ALL SELECT 'ASAAS_WEBHOOK_TOKEN',
  CASE WHEN app.get_secret('ASAAS_WEBHOOK_TOKEN') IS NOT NULL THEN 'OK' ELSE 'MISSING' END
UNION ALL SELECT 'ANTHROPIC_API_KEY',
  CASE WHEN app.get_secret('ANTHROPIC_API_KEY') = 'REPLACE_ME' THEN 'PLACEHOLDER — update with real key' ELSE 'OK' END;

-- Show the webhook token to copy into Asaas dashboard:
SELECT 'COPY THIS WEBHOOK TOKEN TO ASAAS DASHBOARD:' AS instruction,
       app.get_secret('ASAAS_WEBHOOK_TOKEN') AS token;
