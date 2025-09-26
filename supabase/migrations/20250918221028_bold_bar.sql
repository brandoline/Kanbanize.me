-- Complete Database Setup for New Supabase Project
-- Run this script in your Supabase SQL Editor to create all required tables

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  phone text DEFAULT '',
  email text NOT NULL,
  institution text DEFAULT '',
  city text DEFAULT '',
  position text DEFAULT '',
  notes text DEFAULT '',
  is_faculty boolean DEFAULT false,
  courses text[],
  sgn_link text,
  course_modality text CHECK (course_modality IN ('qualificação', 'desenvolvimento', 'técnico')),
  class_days text[],
  available_days text[],
  available_shifts text[],
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contacts"
  ON public.contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contacts"
  ON public.contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
  ON public.contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
  ON public.contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Create tasks table with contact_ids column
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  priority text CHECK (priority IN ('baixa', 'média', 'alta')) DEFAULT 'média',
  contact_ids uuid[] DEFAULT '{}',
  status text CHECK (status IN ('não-iniciado', 'em-andamento', 'concluído')) DEFAULT 'não-iniciado',
  start_date date,
  due_date date,
  attachments text[] DEFAULT '{}',
  notes text DEFAULT '',
  last_updated timestamptz DEFAULT now(),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  reminder_enabled boolean DEFAULT false,
  is_interrupted boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Create info_tecs table
CREATE TABLE IF NOT EXISTS public.info_tecs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  period text NOT NULL,
  modality text CHECK (modality IN ('presencial', 'EAD')) NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  start_date date NOT NULL,
  student_days text NOT NULL,
  class_days text NOT NULL,
  duration integer NOT NULL,
  priority text CHECK (priority IN ('alta', 'media', 'baixa')) DEFAULT 'media',
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.info_tecs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own info_tecs"
  ON public.info_tecs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own info_tecs"
  ON public.info_tecs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own info_tecs"
  ON public.info_tecs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own info_tecs"
  ON public.info_tecs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON public.tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_contact_ids ON public.tasks USING GIN(contact_ids);
CREATE INDEX IF NOT EXISTS idx_info_tecs_user_id ON public.info_tecs(user_id);

-- 6. Force schema refresh
COMMENT ON TABLE public.tasks IS 'Task management table - Schema created: ' || NOW()::text;
NOTIFY pgrst, 'reload schema';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'SUCCESS: All tables created successfully with proper RLS policies and indexes';
END $$;