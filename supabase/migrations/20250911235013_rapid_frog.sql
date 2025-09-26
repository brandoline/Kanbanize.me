/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `priority` (enum: baixa, média, alta)
      - `contact_ids` (text array)
      - `status` (enum: não-iniciado, em-andamento, concluído)
      - `start_date` (date, nullable)
      - `due_date` (date, nullable)
      - `attachments` (text array)
      - `notes` (text)
      - `last_updated` (timestamp)
      - `category_id` (uuid, foreign key to categories)
      - `reminder_enabled` (boolean)
      - `is_interrupted` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for authenticated users to manage their own tasks
*/

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  priority text CHECK (priority IN ('baixa', 'média', 'alta')) DEFAULT 'média',
  contact_ids text[] DEFAULT '{}',
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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);