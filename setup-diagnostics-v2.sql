ALTER TABLE public.diagnostics ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.diagnostics ADD COLUMN IF NOT EXISTS cnpj TEXT;
ALTER TABLE public.diagnostics ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.diagnostics ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}';
ALTER TABLE public.diagnostics ADD COLUMN IF NOT EXISTS ai_analysis TEXT;
