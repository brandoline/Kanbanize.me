/*
# Create Tasks Table

1. New Tables
   - `tasks`
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key to auth.users)
     - `title` (text, task title)
     - `priority` (text, task priority)
     - `contact_ids` (text array, related contact IDs)
     - `status` (text, task status)
     - `start_date` (date, start date)
     - `due_date` (date, due date)
     - `attachments` (text array, attachment file names)
     - `notes` (text, task notes)
     - `last_updated` (timestamp, last update time)
     - `category_id` (uuid, foreign key to categories)
     - `reminder_enabled` (boolean, reminder enabled)
     - `is_interrupted` (boolean, task interrupted)
     - `created_at` (timestamp)

2. Security
   - Enable RLS on `tasks` table
   - Add policies for authenticated users to manage their own tasks
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_category_id_idx ON tasks(category_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);