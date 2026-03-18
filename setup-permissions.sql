-- Grupos de permissão
CREATE TABLE IF NOT EXISTS public.permission_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vincular profile ao grupo
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.permission_groups(id) ON DELETE SET NULL;

-- RLS
ALTER TABLE public.permission_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read groups" ON public.permission_groups FOR SELECT USING (true);
CREATE POLICY "Admins manage groups" ON public.permission_groups FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policy: admins podem ver e editar todos os profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users view profiles" ON public.profiles FOR SELECT USING (
  id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
);
CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE USING (
  id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policy: admins podem ver todos os tickets
DROP POLICY IF EXISTS "Users see own tickets" ON public.support_tickets;
CREATE POLICY "Users see tickets" ON public.support_tickets FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() = assigned_to
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policy: admins veem todas as ordens
DROP POLICY IF EXISTS "Admins see all orders" ON public.orders;
CREATE POLICY "Admins see all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policy: admins veem todas as sessions de mentoria
DROP POLICY IF EXISTS "Users see own sessions" ON public.mentoring_sessions;
CREATE POLICY "Users see sessions" ON public.mentoring_sessions FOR SELECT USING (
  auth.uid() = student_id OR auth.uid() = mentor_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
);

-- Policy: admins manage courses (insert/update/delete)
CREATE POLICY "Admins insert courses" ON public.courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins update courses" ON public.courses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins delete courses" ON public.courses FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Grupos padrão do sistema
INSERT INTO public.permission_groups (name, description, permissions, is_system) VALUES
  ('Administrador', 'Acesso total ao sistema', '{"dashboard":true,"comunidade":true,"mentorias":true,"formacoes":true,"suporte":true,"financeiro":true,"produtos":true,"usuarios":true,"permissoes":true}', true),
  ('Mentor', 'Acesso a mentorias, comunidade e formações', '{"dashboard":true,"comunidade":true,"mentorias":true,"formacoes":true,"suporte":true,"financeiro":false,"produtos":false,"usuarios":false,"permissoes":false}', true),
  ('Membro', 'Acesso básico de membro da comunidade', '{"dashboard":true,"comunidade":true,"mentorias":true,"formacoes":true,"suporte":true,"financeiro":true,"produtos":false,"usuarios":false,"permissoes":false}', true)
ON CONFLICT (name) DO NOTHING;

-- Vincular admin existente ao grupo Administrador
UPDATE public.profiles SET group_id = (SELECT id FROM public.permission_groups WHERE name = 'Administrador') WHERE role = 'admin' AND group_id IS NULL;
