-- Create enum for environments
CREATE TYPE public.environment_type AS ENUM ('dev', 'prod');

-- Add environment column to user_skills
ALTER TABLE public.user_skills 
ADD COLUMN environment environment_type NOT NULL DEFAULT 'dev';

-- Add environment column to user_assignment_submissions
ALTER TABLE public.user_assignment_submissions 
ADD COLUMN environment environment_type NOT NULL DEFAULT 'dev';

-- Add environment column to prompt_attempts
ALTER TABLE public.prompt_attempts 
ADD COLUMN environment environment_type NOT NULL DEFAULT 'dev';

-- Create indexes for fast filtering
CREATE INDEX idx_user_skills_environment ON public.user_skills(environment);
CREATE INDEX idx_user_assignment_submissions_environment ON public.user_assignment_submissions(environment);
CREATE INDEX idx_prompt_attempts_environment ON public.prompt_attempts(environment);

-- Update UNIQUE constraints to include environment
ALTER TABLE public.user_skills 
DROP CONSTRAINT IF EXISTS user_skills_user_id_skill_id_key,
ADD CONSTRAINT user_skills_user_id_skill_id_environment_key 
UNIQUE(user_id, skill_id, environment);

-- Create function to get current environment from JWT
CREATE OR REPLACE FUNCTION public.get_current_environment()
RETURNS environment_type
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'environment')::environment_type,
    'dev'::environment_type
  );
$$;

-- Update RLS policies for user_skills
DROP POLICY IF EXISTS "Users can view their own skills" ON public.user_skills;
DROP POLICY IF EXISTS "Users can insert their own skills" ON public.user_skills;
DROP POLICY IF EXISTS "Users can update their own skills" ON public.user_skills;

CREATE POLICY "Users can view their own skills in current environment"
  ON public.user_skills FOR SELECT
  USING (
    auth.uid() = user_id 
    AND environment = get_current_environment()
  );

CREATE POLICY "Users can insert their own skills in current environment"
  ON public.user_skills FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND environment = get_current_environment()
  );

CREATE POLICY "Users can update their own skills in current environment"
  ON public.user_skills FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND environment = get_current_environment()
  );

-- Update RLS policies for user_assignment_submissions
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.user_assignment_submissions;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.user_assignment_submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON public.user_assignment_submissions;

CREATE POLICY "Users can view their own submissions in current environment"
  ON public.user_assignment_submissions FOR SELECT
  USING (
    auth.uid() = user_id 
    AND environment = get_current_environment()
  );

CREATE POLICY "Users can insert their own submissions in current environment"
  ON public.user_assignment_submissions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND environment = get_current_environment()
  );

CREATE POLICY "Users can update their own submissions in current environment"
  ON public.user_assignment_submissions FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND environment = get_current_environment()
  );

-- Update initialize_user_skills function to support environment
CREATE OR REPLACE FUNCTION public.initialize_user_skills(
  p_user_id UUID,
  p_environment environment_type DEFAULT 'dev'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO user_skills (user_id, skill_id, current_level, target_level, progress_percent, is_goal_achieved, environment)
  SELECT 
    p_user_id,
    id,
    1,
    1,
    0,
    false,
    p_environment
  FROM skills
  ON CONFLICT (user_id, skill_id, environment) DO NOTHING;
END;
$$;

-- Migrate existing data to dev environment
UPDATE public.user_skills 
SET environment = 'dev' 
WHERE environment IS NULL;

UPDATE public.user_assignment_submissions 
SET environment = 'dev' 
WHERE environment IS NULL;

UPDATE public.prompt_attempts 
SET environment = 'dev' 
WHERE environment IS NULL;