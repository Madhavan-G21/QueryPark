-- QPark Supabase Schema Setup Script
-- Run this in your Supabase SQL Editor to create tables, security policies, and admin roles.

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT,
  department TEXT DEFAULT 'General',
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  details TEXT,
  domain TEXT NOT NULL,
  author TEXT NOT NULL,
  author_name TEXT NOT NULL,
  date BIGINT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  upvoted_by TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under-review', 'in-progress', 'resolved')),
  urgency TEXT DEFAULT 'low' CHECK (urgency IN ('low', 'medium', 'urgent', 'critical')),
  is_anonymous BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  inserted_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST SEARCH AND FILTERING
CREATE INDEX IF NOT EXISTS idx_questions_domain ON public.questions(domain);
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_date ON public.questions(date DESC);
CREATE INDEX IF NOT EXISTS idx_comments_question_id ON public.comments(question_id);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ & WRITE POLICIES
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Allow public read access on questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Allow public write access on questions" ON public.questions FOR ALL USING (true);

CREATE POLICY "Allow public read access on comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public write access on comments" ON public.comments FOR ALL USING (true);

-- -------------------------------------------------------------
-- CREATE OFFICIAL ADMIN ACCOUNT IN SUPABASE
-- -------------------------------------------------------------
INSERT INTO public.profiles (email, name, password, department, role)
VALUES
  ('admin@college.edu', 'Campus Administrator', 'admin123', 'Administration', 'admin')
ON CONFLICT (email) 
DO UPDATE SET role = 'admin';

-- -------------------------------------------------------------
-- HELPER QUERY: MAKE ANY USER AN ADMIN IN SUPABASE
-- (Run this SQL whenever you want to convert a user to Admin)
-- -------------------------------------------------------------
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'your-admin-email@college.edu';
