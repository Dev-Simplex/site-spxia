-- Requires: migrations/2026-05-19-security-hardening.sql (creates app.get_secret() + vault.ANTHROPIC_API_KEY)
-- Default model intentionally pinned to a current Sonnet — update as needed.
CREATE OR REPLACE FUNCTION public.generate_diagnostic_analysis(p_diagnostic_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, app
AS $$
DECLARE
  v_diag RECORD;
  v_prompt TEXT;
  v_answers JSONB;
  v_res extensions.http_response;
  v_body JSONB;
  v_analysis TEXT;
  v_api_key TEXT;
BEGIN
  v_api_key := app.get_secret('ANTHROPIC_API_KEY');
  IF v_api_key IS NULL OR v_api_key = '' OR v_api_key = 'REPLACE_ME' THEN
    RETURN jsonb_build_object('error', true, 'message', 'ANTHROPIC_API_KEY not configured in vault');
  END IF;

  SELECT * INTO v_diag FROM public.diagnostics WHERE id = p_diagnostic_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', true, 'message', 'Diagnóstico não encontrado');
  END IF;

  v_answers := COALESCE(v_diag.answers, '{}'::JSONB);

  v_prompt := 'Você é um consultor sênior de IA e automação da SPXIA. Analise o diagnóstico abaixo e gere um relatório estruturado em português com:

1. **RESUMO EXECUTIVO** (3-4 linhas sobre a empresa e sua maturidade)
2. **OPORTUNIDADES DE IA IDENTIFICADAS** (lista com prioridade Alta/Média/Baixa)
3. **PROCESSOS PARA AUTOMAÇÃO IMEDIATA** (quick wins em 30 dias)
4. **RISCOS E ALERTAS** (pontos de atenção)
5. **ROI ESTIMADO** (projeção de ganhos nos primeiros 90 dias)
6. **PLANO DE AÇÃO SUGERIDO** (próximos passos concretos)

DADOS DO DIAGNÓSTICO:
- Empresa: ' || COALESCE(v_diag.company_name, 'Não informado') || '
- CNPJ: ' || COALESCE(v_diag.cnpj, 'Não informado') || '
- Ramo: ' || COALESCE(v_diag.industry, 'Não informado') || '
- Contato: ' || v_diag.name || ' (' || v_diag.email || ')
- Descrição: ' || COALESCE(v_diag.business_description, '') || '

RESPOSTAS DO QUESTIONÁRIO:
' || (SELECT string_agg(key || ': ' || value #>> '{}', E'\n') FROM jsonb_each(v_answers)) || '

Seja direto, técnico e prático. Foque em ações concretas e ROI mensurável.';

  v_body := jsonb_build_object(
    'model', 'claude-sonnet-4-20250514',
    'max_tokens', 4000,
    'messages', jsonb_build_array(
      jsonb_build_object('role', 'user', 'content', v_prompt)
    )
  );

  v_res := extensions.http((
    'POST',
    'https://api.anthropic.com/v1/messages',
    ARRAY[
      extensions.http_header('x-api-key', v_api_key),
      extensions.http_header('anthropic-version', '2023-06-01'),
      extensions.http_header('Content-Type', 'application/json')
    ],
    'application/json',
    v_body::TEXT
  )::extensions.http_request);

  -- Extract text from Claude response
  BEGIN
    v_analysis := (v_res.content::JSONB)->'content'->0->>'text';
  EXCEPTION WHEN OTHERS THEN
    v_analysis := 'Erro ao gerar análise: ' || v_res.content;
  END;

  -- Save analysis
  UPDATE public.diagnostics SET ai_analysis = v_analysis, updated_at = now() WHERE id = p_diagnostic_id;

  RETURN jsonb_build_object('success', true, 'analysis', v_analysis);
END;
$$;
