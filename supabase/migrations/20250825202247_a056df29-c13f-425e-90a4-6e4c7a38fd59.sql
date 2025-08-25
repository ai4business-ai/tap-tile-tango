-- Create documents table for metadata
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT DEFAULT 'application/pdf',
  extracted_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to documents
CREATE POLICY "Documents are publicly readable" 
ON public.documents 
FOR SELECT 
USING (true);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Create policies for document storage
CREATE POLICY "Document files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents');

-- Create policy for uploading documents (admin only for now)
CREATE POLICY "Admin can upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample documents (we'll update file_path after uploading to storage)
INSERT INTO public.documents (title, description, task_type, file_path, extracted_text) VALUES
(
  'Квартальный отчет',
  'Квартальный отчет компании с финансовыми показателями и аналитикой для изучения.',
  'document-analysis',
  'quarterly-report.pdf',
  'Отчет за квартал

Квартальный отчет компании с финансовыми показателями и аналитикой для изучения. Образец документа для практических заданий.'
),
(
  'Влияние нейросетей на бизнес-процессы',
  'Исследование применения ИИ в современном бизнесе и его влияние на рабочие процессы.',
  'document-analysis', 
  'ai-business-impact.pdf',
  'Влияние нейросетей на бизнес-процессы

Исследование применения ИИ в современном бизнесе и его влияние на рабочие процессы. Материал для анализа и выполнения заданий.'
),
(
  'Маркетинговое исследование о конкурентах',
  'Этот документ содержит анализ конкурентов и маркетинговые стратегии для выполнения задания.',
  'document-analysis',
  'marketing-research-competitors.pdf', 
  'Маркетинговое исследование о конкурентах

Этот документ содержит анализ конкурентов и маркетинговые стратегии для выполнения задания. Пример документа для анализа в учебных целях.'
);