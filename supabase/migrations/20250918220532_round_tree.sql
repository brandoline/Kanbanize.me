/*
  # Fix missing contact_ids column in tasks table

  This script adds the missing 'contact_ids' column to the tasks table
  and ensures proper constraints and indexes are in place.

  1. Table Modifications
    - Add `contact_ids` column as UUID array to tasks table
    - Add index for better query performance
  
  2. Data Migration
    - Handle any existing data appropriately
*/

-- Add the missing contact_ids column to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'contact_ids'
  ) THEN
    ALTER TABLE tasks ADD COLUMN contact_ids uuid[] DEFAULT '{}';
  END IF;
END $$;

-- Add index for better performance on contact_ids queries
CREATE INDEX IF NOT EXISTS idx_tasks_contact_ids ON tasks USING GIN (contact_ids);

-- Update RLS policy to include contact_ids in allowed columns (if needed)
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Refresh the schema cache by updating table comment
COMMENT ON TABLE tasks IS 'Task management table with contact associations - Updated: ' || NOW();