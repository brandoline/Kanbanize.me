/*
# Create Info Tecs Table

1. New Tables
   - `info_tecs`
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key to auth.users)
     - `name` (text, course name)
     - `period` (text, course period)
     - `modality` (text, course modality)
     - `color` (text, hex color code)
     - `start_date` (date, start date)
     - `student_days` (text, student days)
     - `class_days` (text, class days)
     - `duration` (integer, duration in hours)
     - `priority` (text, course priority)
     - `created_at` (timestamp)

2. Security
   - Enable RLS on `info_tecs` table
   - Add policies for authenticated users to manage their own info tecs
*/

-- Create info_tecs table
CREATE TABLE IF NOT EXISTS info_tecs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  period text NOT NULL,
  modality text NOT NULL CHECK (modality IN ('presencial', 'EAD')),
  color text NOT NULL,
  start_date date NOT NULL,
  student_days text NOT NULL,
  class_days text NOT NULL,
  duration integer NOT NULL,
  priority text DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baixa')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE info_tecs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own info_tecs"
  ON info_tecs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own info_tecs"
  ON info_tecs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own info_tecs"
  ON info_tecs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own info_tecs"
  ON info_tecs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS info_tecs_user_id_idx ON info_tecs(user_id);
CREATE INDEX IF NOT EXISTS info_tecs_priority_idx ON info_tecs(priority);
CREATE INDEX IF NOT EXISTS info_tecs_modality_idx ON info_tecs(modality);