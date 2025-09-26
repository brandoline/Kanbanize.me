/*
# Table Modification Scripts

Use these scripts to modify existing tables if needed.
Run these ONLY if you need to make changes to existing tables.
*/

-- Add column to existing table (example)
-- ALTER TABLE tasks ADD COLUMN IF NOT EXISTS new_column text DEFAULT '';

-- Modify column type (example)
-- ALTER TABLE tasks ALTER COLUMN priority TYPE text;

-- Add constraint (example)
-- ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check CHECK (priority IN ('baixa', 'média', 'alta'));

-- Drop column (example - BE CAREFUL!)
-- ALTER TABLE tasks DROP COLUMN IF EXISTS old_column;

-- Rename column (example)
-- ALTER TABLE tasks RENAME COLUMN old_name TO new_name;

-- Add index (example)
-- CREATE INDEX IF NOT EXISTS tasks_new_column_idx ON tasks(new_column);

-- Drop index (example)
-- DROP INDEX IF EXISTS tasks_old_index_idx;

-- Update RLS policy (example)
-- DROP POLICY IF EXISTS "old_policy_name" ON tasks;
-- CREATE POLICY "new_policy_name" ON tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Add foreign key constraint (example)
-- ALTER TABLE tasks ADD CONSTRAINT tasks_new_fk FOREIGN KEY (new_column) REFERENCES other_table(id);

-- Drop foreign key constraint (example)
-- ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_old_fk;