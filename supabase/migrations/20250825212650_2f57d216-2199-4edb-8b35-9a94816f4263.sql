-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  user_id UUID DEFAULT auth.uid(),
  details JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Log security events (in production, this could write to a dedicated security log table)
  INSERT INTO public.security_logs (event_type, user_id, details, created_at)
  VALUES (event_type, user_id, details, now())
  ON CONFLICT DO NOTHING; -- Ignore if security_logs table doesn't exist yet
EXCEPTION 
  WHEN others THEN
    -- Silently ignore errors for now, but log them
    RAISE NOTICE 'Security logging failed: %', SQLERRM;
END;
$$;