-- Requires: migrations/2026-05-19-security-hardening.sql (creates app.get_secret() + vault.ASAAS_API_KEY)
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
  v_url TEXT := 'https://api.asaas.com' || p_path;
  v_headers extensions.http_header[];
  v_res extensions.http_response;
BEGIN
  v_api_key := app.get_secret('ASAAS_API_KEY');
  IF v_api_key IS NULL OR v_api_key = '' THEN
    RAISE EXCEPTION 'ASAAS_API_KEY not configured in vault';
  END IF;
  v_headers := ARRAY[extensions.http_header('access_token', v_api_key)];

  IF p_method = 'GET' THEN
    v_res := extensions.http((
      'GET', v_url, v_headers, NULL, NULL
    )::extensions.http_request);
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
