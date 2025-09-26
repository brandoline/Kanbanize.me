/*
  # Create contacts table

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `phone` (text)
      - `email` (text)
      - `institution` (text)
      - `city` (text)
      - `position` (text)
      - `notes` (text)
      - `is_faculty` (boolean)
      - `courses` (text array)
      - `sgn_link` (text)
      - `course_modality` (text with check constraint)
      - `class_days` (text array)
      - `available_days` (text array)
      - `available_shifts` (text array)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `contacts` table
    - Add policies for authenticated users to manage their own contacts
*/

CREATE TABLE IF NOT EXISTS contacts (
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
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contacts"
  ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);