/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `priority` (text with check constraint)
      - `contact_ids` (text array)
      - `status` (text with check constraint)
      - `start_date` (date)
      - `due_date` (date)
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

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  priority text DEFAULT 'média' CHECK (priority IN ('baixa', 'média', 'alta')),
  contact_ids text[] DEFAULT '{}',
  status text DEFAULT 'não-iniciado' CHECK (status IN ('não-iniciado', 'em-andamento', 'concluído')),
  start_date date,
  due_date date,
  attachments text[] DEFAULT '{}',
  notes text DEFAULT '',
  last_updated timestamptz DEFAULT now(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  reminder_enabled boolean DEFAULT false,
  is_interrupted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);