/*
  # Force Schema Refresh for Tasks Table - contact_ids Column

  This script ensures the contact_ids column exists in the tasks table
  and forces Supabase to refresh its schema cache to recognize the column.

  1. Column Check and Creation
    - Verify if contact_ids column exists
    - Add it if missing with proper constraints
  
  2. Schema Cache Refresh
    - Update table comment to force cache refresh
    - Recreate RLS policies to ensure proper recognition
    - Add performance index
*/

-- Step 1: Ensure the contact_ids column exists
DO $$
BEGIN
  -- Check if contact_ids column exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'tasks' 
    AND column_name = 'contact_ids'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN contact_ids uuid[] DEFAULT '{}';
    RAISE NOTICE 'Added contact_ids column to tasks table';
  ELSE
    RAISE NOTICE 'contact_ids column already exists in tasks table';
  END IF;
END $$;

-- Step 2: Ensure the column has proper default value
ALTER TABLE public.tasks ALTER COLUMN contact_ids SET DEFAULT '{}';

-- Step 3: Add or recreate index for performance
DROP INDEX IF EXISTS idx_tasks_contact_ids;
CREATE INDEX idx_tasks_contact_ids ON public.tasks USING GIN (contact_ids);

-- Step 4: Force schema cache refresh by updating table comment with timestamp
COMMENT ON TABLE public.tasks IS 'Task management table with contact associations - Schema refreshed: ' || NOW()::text;

-- Step 5: Recreate RLS policies to ensure they recognize the new column
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;

-- Recreate all RLS policies
CREATE POLICY "Users can view own tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 6: Additional schema refresh triggers
-- Update a system table to force PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

-- Final verification query
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'tasks' 
    AND column_name = 'contact_ids'
  ) THEN
    RAISE NOTICE 'SUCCESS: contact_ids column is now available in tasks table';
  ELSE
    RAISE NOTICE 'ERROR: contact_ids column still not found';
  END IF;
END $$;