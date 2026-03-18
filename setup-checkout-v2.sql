CREATE OR REPLACE FUNCTION public.checkout(
  p_product_id UUID,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_cpf_cnpj TEXT,
  p_customer_phone TEXT DEFAULT '',
  p_billing_type TEXT DEFAULT 'PIX'
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_product RECORD;
  v_api_key TEXT := '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjI3ZTQwNWJlLWFiNzctNDA4Ni04ZThmLWQ2MjFiZWI4M2VmMjo6JGFhY2hfYzc4ODBiODItYzdiZS00MDk5LWI3NjItOTNkYmE5OGNlYzZj';
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
  v_headers := ARRAY[extensions.http_header('access_token', v_api_key)];

  -- 1) Get product
  SELECT * INTO v_product FROM public.products WHERE id = p_product_id AND is_published = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', true, 'message', 'Produto não encontrado');
  END IF;

  -- 2) Search customer by CPF
  v_search_res := extensions.http((
    'GET',
    v_base || '/v3/customers?cpfCnpj=' || p_customer_cpf_cnpj,
    v_headers, NULL, NULL
  )::extensions.http_request);
  v_search_data := v_search_res.content::JSONB;

  IF (v_search_data->'data') IS NOT NULL AND jsonb_array_length(v_search_data->'data') > 0 THEN
    v_customer_id := v_search_data->'data'->0->>'id';
  ELSE
    v_customer_res := extensions.http((
      'POST',
      v_base || '/v3/customers',
      v_headers || ARRAY[extensions.http_header('Content-Type', 'application/json')],
      'application/json',
      jsonb_build_object(
        'name', p_customer_name,
        'email', p_customer_email,
        'cpfCnpj', p_customer_cpf_cnpj,
        'mobilePhone', NULLIF(p_customer_phone, '')
      )::TEXT
    )::extensions.http_request);
    v_customer_data := v_customer_res.content::JSONB;
    v_customer_id := v_customer_data->>'id';

    IF v_customer_id IS NULL THEN
      RETURN jsonb_build_object('error', true, 'message', 'Erro ao criar cliente', 'detail', v_customer_data);
    END IF;
  END IF;

  v_due_date := to_char(CURRENT_DATE + INTERVAL '3 days', 'YYYY-MM-DD');

  IF v_product.type = 'subscription' THEN
    v_sub_res := extensions.http((
      'POST',
      v_base || '/v3/subscriptions',
      v_headers || ARRAY[extensions.http_header('Content-Type', 'application/json')],
      'application/json',
      jsonb_build_object(
        'customer', v_customer_id,
        'billingType', p_billing_type,
        'value', v_product.price::NUMERIC,
        'nextDueDate', v_due_date,
        'cycle', COALESCE(v_product.billing_cycle, 'MONTHLY'),
        'description', v_product.title,
        'externalReference', v_product.id::TEXT
      )::TEXT
    )::extensions.http_request);
    v_sub_data := v_sub_res.content::JSONB;

    IF v_sub_data->>'id' IS NOT NULL THEN
      v_payment_res := extensions.http((
        'GET',
        v_base || '/v3/subscriptions/' || (v_sub_data->>'id') || '/payments',
        v_headers, NULL, NULL
      )::extensions.http_request);
      v_payment_data := (v_payment_res.content::JSONB)->'data'->0;
    END IF;
  ELSE
    v_payment_res := extensions.http((
      'POST',
      v_base || '/v3/payments',
      v_headers || ARRAY[extensions.http_header('Content-Type', 'application/json')],
      'application/json',
      jsonb_build_object(
        'customer', v_customer_id,
        'billingType', p_billing_type,
        'value', v_product.price::NUMERIC,
        'dueDate', v_due_date,
        'description', v_product.title,
        'externalReference', v_product.id::TEXT
      )::TEXT
    )::extensions.http_request);
    v_payment_data := v_payment_res.content::JSONB;
  END IF;

  -- 4) Pix QR
  IF p_billing_type = 'PIX' AND v_payment_data->>'id' IS NOT NULL THEN
    BEGIN
      v_pix_res := extensions.http((
        'GET',
        v_base || '/v3/payments/' || (v_payment_data->>'id') || '/pixQrCode',
        v_headers, NULL, NULL
      )::extensions.http_request);
      v_pix_data := v_pix_res.content::JSONB;
    EXCEPTION WHEN OTHERS THEN
      v_pix_data := NULL;
    END;
  END IF;

  -- 5) Save order
  INSERT INTO public.orders (
    product_id, customer_name, customer_email, customer_cpf_cnpj, customer_phone,
    asaas_customer_id, asaas_payment_id, asaas_subscription_id,
    billing_type, amount, status
  ) VALUES (
    p_product_id, p_customer_name, p_customer_email, p_customer_cpf_cnpj, p_customer_phone,
    v_customer_id, v_payment_data->>'id', v_sub_data->>'id',
    p_billing_type, v_product.price, 'PENDING'
  ) RETURNING id INTO v_order_id;

  -- 6) Check if user already exists, link order
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = p_customer_email) INTO v_user_exists;
  IF v_user_exists THEN
    UPDATE public.orders SET user_id = (SELECT id FROM auth.users WHERE email = p_customer_email) WHERE id = v_order_id;
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
