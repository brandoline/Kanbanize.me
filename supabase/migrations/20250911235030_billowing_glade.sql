/*
  # Create info_tecs table

  1. New Tables
    - `info_tecs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `period` (text)
      - `modality` (enum: presencial, EAD)
      - `color` (text)
      - `start_date` (date)
      - `student_days` (text)
      - `class_days` (text)
      - `duration` (integer)
      - `priority` (enum: alta, media, baixa)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `info_tecs` table
    - Add policies for authenticated users to manage their own info_tecs
*/

CREATE TABLE IF NOT EXISTS public.info_tecs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  period text NOT NULL,
  modality text CHECK (modality IN ('presencial', 'EAD')) NOT NULL,
  color text NOT NULL,
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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own info_tecs"
  ON public.info_tecs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own info_tecs"
  ON public.info_tecs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own info_tecs"
  ON public.info_tecs FOR DELETE
  USING (auth.uid() = user_id);