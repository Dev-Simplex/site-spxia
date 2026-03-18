CREATE OR REPLACE FUNCTION public.asaas_request(
  p_method TEXT,
  p_path TEXT,
  p_body JSONB DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_api_key TEXT := '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjI3ZTQwNWJlLWFiNzctNDA4Ni04ZThmLWQ2MjFiZWI4M2VmMjo6JGFhY2hfYzc4ODBiODItYzdiZS00MDk5LWI3NjItOTNkYmE5OGNlYzZj';
  v_url TEXT := 'https://api.asaas.com' || p_path;
  v_headers extensions.http_header[];
  v_res extensions.http_response;
BEGIN
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
