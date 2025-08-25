-- Update document file paths to use Supabase Storage paths
UPDATE documents 
SET file_path = '1.1.2.ai-business-impact.pdf'
WHERE title = 'Влияние нейросетей на бизнес-процессы' AND task_type = 'document-analysis';

UPDATE documents 
SET file_path = '1.1.2.marketing-research-competitors.pdf'
WHERE title = 'Маркетинговое исследование о конкурентах' AND task_type = 'document-analysis';

UPDATE documents 
SET file_path = '1.1.2.quarterly-report.pdf'
WHERE title = 'Квартальный отчет' AND task_type = 'document-analysis';