-- Create table for persistent prompt attempt tracking
CREATE TABLE IF NOT EXISTS public.prompt_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  task_id text NOT NULL,
  date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT prompt_attempts_unique UNIQUE (device_id, task_id, date)
);

-- Enable RLS (service role in edge functions bypasses RLS)
ALTER TABLE public.prompt_attempts ENABLE ROW LEVEL SECURITY;

-- Optional: No public policies (only service role should write). Allow read by no one by default.
-- You can add policies later if needed.

-- Trigger for updated_at
DO $$ BEGIN
  CREATE TRIGGER update_prompt_attempts_updated_at
  BEFORE UPDATE ON public.prompt_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Index to speed up lookups
CREATE INDEX IF NOT EXISTS idx_prompt_attempts_device_task_date
  ON public.prompt_attempts (device_id, task_id, date);
