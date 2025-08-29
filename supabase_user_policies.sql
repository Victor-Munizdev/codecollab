-- supabase_user_policies.sql

-- Enable RLS on the public.users table if not already enabled
-- Note: You might want to check if it's already enabled in your Supabase dashboard
-- to avoid running this unnecessarily.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to insert their own data
-- This policy allows a newly authenticated user (right after sign-up)
-- to add their own record to the public.users table.
CREATE POLICY "Allow authenticated users to insert their own user record"
ON public.users
FOR INSERT
WITH CHECK (auth.uid()::text = id);

-- Policy: Allow users to read their own data
-- This is generally a good policy to have.
CREATE POLICY "Allow individual users to read their own user record"
ON public.users
FOR SELECT
USING (auth.uid()::text = id);

-- Policy: Allow users to update their own data
-- Optional, but useful if you allow users to update their profile.
CREATE POLICY "Allow individual users to update their own user record"
ON public.users
FOR UPDATE
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);
