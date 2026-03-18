ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can read posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Auth users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Anyone can read comments" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Auth users can create comments" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Anyone can read published courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can read modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Anyone can read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Users manage own progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own sessions" ON public.mentoring_sessions FOR SELECT USING (auth.uid() = student_id OR auth.uid() = mentor_id);
CREATE POLICY "Users create own sessions" ON public.mentoring_sessions FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users see own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id OR auth.uid() = assigned_to);
CREATE POLICY "Users create own tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users see own messages" ON public.support_messages FOR SELECT USING (true);
CREATE POLICY "Auth users create messages" ON public.support_messages FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users see own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users see own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
