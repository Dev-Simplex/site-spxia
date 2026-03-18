-- Materiais/anexos das aulas
CREATE TABLE IF NOT EXISTS public.lesson_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'document',
  file_size_bytes BIGINT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.lesson_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read materials" ON public.lesson_materials FOR SELECT USING (true);
CREATE POLICY "Admins manage materials" ON public.lesson_materials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Adicionar campos extras a lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'quiz'));
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS text_content TEXT;

-- Adicionar campos extras a courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructor_name TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructor_bio TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS total_hours DECIMAL(5,1);
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'iniciante' CHECK (level IN ('iniciante', 'intermediario', 'avancado'));
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS what_you_learn JSONB DEFAULT '[]';

-- Storage bucket para uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('course-files', 'course-files', true)
ON CONFLICT (id) DO NOTHING;

-- Policy storage: admins fazem upload, todos leem
CREATE POLICY "Public read course files" ON storage.objects FOR SELECT USING (bucket_id = 'course-files');
CREATE POLICY "Admins upload course files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'course-files' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins delete course files" ON storage.objects FOR DELETE USING (
  bucket_id = 'course-files' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admins podem gerenciar modules
CREATE POLICY "Admins insert modules" ON public.course_modules FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins update modules" ON public.course_modules FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins delete modules" ON public.course_modules FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admins podem gerenciar lessons
CREATE POLICY "Admins insert lessons" ON public.lessons FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins update lessons" ON public.lessons FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins delete lessons" ON public.lessons FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
