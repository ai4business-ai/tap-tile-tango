-- Simplify RLS policies on user_skills to remove environment dependency

-- Drop existing environment-based policies
DROP POLICY IF EXISTS "Users can view their own skills in current environment" ON public.user_skills;
DROP POLICY IF EXISTS "Users can insert their own skills in current environment" ON public.user_skills;
DROP POLICY IF EXISTS "Users can update their own skills in current environment" ON public.user_skills;

-- Create new policies that only depend on user_id
CREATE POLICY "Users can view their own skills"
ON public.user_skills
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills"
ON public.user_skills
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills"
ON public.user_skills
FOR UPDATE
USING (auth.uid() = user_id);