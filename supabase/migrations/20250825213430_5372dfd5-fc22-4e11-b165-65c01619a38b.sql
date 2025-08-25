-- Create policy to allow public access to document-analysis type documents
CREATE POLICY "Public can read document-analysis documents" 
ON public.documents 
FOR SELECT 
USING (task_type = 'document-analysis');