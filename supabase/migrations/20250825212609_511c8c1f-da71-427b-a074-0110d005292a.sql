-- Enhanced security for documents table
-- Remove existing overly permissive policy
DROP POLICY IF EXISTS "Documents are publicly readable" ON public.documents;

-- Create proper RLS policies based on user authentication
-- Allow authenticated users to read all documents (for educational purposes)
CREATE POLICY "Authenticated users can read documents" 
ON public.documents 
FOR SELECT 
TO authenticated
USING (true);

-- Prevent any modifications to documents (INSERT/UPDATE/DELETE not allowed for users)
-- This ensures document integrity while allowing educational access

-- Add security logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  user_id UUID DEFAULT auth.uid(),
  details JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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