import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Target, CheckCircle, ChevronDown, ChevronUp, Download, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptTester } from '@/components/PromptTester';
import { TutorChat } from '@/components/TutorChat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const TaskDocumentAnalysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Array<{
    id: string; title: string; description: string; file_path: string;
  }>>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showTask, setShowTask] = useState(true);
  const [showCriteria, setShowCriteria] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('id, title, description, file_path')
          .eq('task_type', 'document-analysis')
          .order('created_at', { ascending: true });
        if (error) {
          console.error('Error loading documents:', error);
          toast({ title: "Ошибка", description: "Не удалось загрузить документы", variant: "destructive" });
        } else {
          setDocuments(data || []);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
        toast({ title: "Ошибка", description: "Не удалось загрузить документы", variant: "destructive" });
      } finally {
        setIsLoadingDocuments(false);
      }
    };
    loadDocuments();
  }, [toast]);

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocument(documentId);
    const selectedDoc = documents.find(doc => doc.id === documentId);
    if (selectedDoc) handleDocumentDownload(documentId, selectedDoc.title);
  };

  const handleDocumentDownload = async (documentId: string, displayName: string) => {
    try {
      const selectedDoc = documents.find(doc => doc.id === documentId);
      if (!selectedDoc) throw new Error('Document not found');
      const { data, error } = await supabase.storage.from('documents').download(selectedDoc.file_path);
      if (!error && data) {
        const blobUrl = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = blobUrl; link.download = `${displayName}.pdf`; link.target = '_blank'; link.style.display = 'none';
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
        toast({ title: 'Файл скачивается', description: `"${displayName}" начинает загрузку` });
        return;
      }
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(selectedDoc.file_path);
      if (urlData?.publicUrl) {
        const link = document.createElement('a');
        link.href = urlData.publicUrl; link.download = `${displayName}.pdf`; link.target = '_blank'; link.style.display = 'none';
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        toast({ title: 'Файл скачивается', description: `"${displayName}" начинает загрузку (public URL)` });
        return;
      }
      const deriveLocalFileName = (path: string) => {
        let name = path.split('/').pop() || path;
        const parts = name.split('.');
        let idx = 0;
        while (idx < parts.length - 1 && /^\d+$/.test(parts[idx])) idx++;
        return parts.slice(idx).join('.');
      };
      const fallbackName = deriveLocalFileName(selectedDoc.file_path);
      const localUrl = `/documents/${fallbackName}`;
      const link = document.createElement('a');
      link.href = localUrl; link.download = fallbackName; link.target = '_blank'; link.style.display = 'none';
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      toast({ title: 'Файл скачивается', description: `"${displayName}" открыт по локальной ссылке` });
    } catch (error) {
      console.error('Download error:', error);
      toast({ title: 'Ошибка скачивания', description: 'Не удалось скачать файл.', variant: 'destructive' });
    }
  };

  const taskContent = (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Описание задания
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowDescription(!showDescription)} className="h-6 px-2">
              {showDescription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        {showDescription && (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Представьте, что ваш руководитель переслал вам годовой отчет конкурента (или отраслевое исследование) со словами: "Посмотри, пожалуйста, что там важного. Мне нужны ключевые выводы к завтрашнему совещанию". У вас есть 30 минут и документ на 20+ страниц.
            </p>
          </CardContent>
        )}
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Ваша задача
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowTask(!showTask)} className="h-6 px-2">
              {showTask ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        {showTask && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Шаги выполнения:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Выберите любой публичный документ объемом 20+ страниц</li>
                <li>• Создайте промпт для ИИ для анализа документа</li>
                <li>• Результат должен содержать ключевые цифры и факты</li>
                <li>• Основные выводы и тренды</li>
                <li>• Практические рекомендации</li>
                <li>• Все это на 1 странице A4</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Выберите документ для анализа:</h4>
              {isLoadingDocuments ? (
                <div className="p-4 text-center text-muted-foreground">Загрузка документов...</div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {documents.map((doc, index) => {
                    const colors = [
                      { color: 'text-progress-blue', bgColor: 'bg-secondary/50 border-border', selectedBg: 'bg-secondary border-progress-blue' },
                      { color: 'text-green-accent', bgColor: 'bg-secondary/50 border-border', selectedBg: 'bg-secondary border-green-accent' },
                      { color: 'text-purple-accent', bgColor: 'bg-secondary/50 border-border', selectedBg: 'bg-secondary border-purple-accent' }
                    ];
                    const colorTheme = colors[index % colors.length];
                    return (
                      <div 
                        key={doc.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedDocument === doc.id 
                            ? `${colorTheme.selectedBg} ring-2 ring-offset-2 ring-primary/50` 
                            : `${colorTheme.bgColor} hover:bg-opacity-80`
                        }`}
                        onClick={() => handleDocumentSelect(doc.id)}
                      >
                        <FileText className={`w-5 h-5 ${colorTheme.color}`} />
                        <div className="flex-1">
                          <span className="text-sm text-foreground block">{doc.title}</span>
                          {doc.description && <span className="text-xs text-muted-foreground">{doc.description}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedDocument === doc.id && <Check className="w-4 h-4 text-primary" />}
                          <Download className="w-4 h-4 text-muted-foreground" onClick={(e) => { e.stopPropagation(); handleDocumentDownload(doc.id, doc.title); }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {selectedDocument && (
                <div className="mt-2 p-2 bg-accent/20 border border-green-accent rounded-lg">
                  <p className="text-sm text-green-accent font-medium">✓ Документ выбран и загружается</p>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="mb-6 lg:mb-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Критерии успешного выполнения
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowCriteria(!showCriteria)} className="h-6 px-2">
              {showCriteria ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        {showCriteria && (
          <CardContent className="space-y-2">
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Executive summary читается за 2-3 минуты</li>
              <li>• Содержит 5-7 ключевых инсайтов</li>
              <li>• Структурирован по принципу "от важного к деталям"</li>
              <li>• Понятен человеку, не читавшему оригинал</li>
            </ul>
            <div className="mt-3 p-3 bg-accent/20 rounded-lg border border-accent">
              <p className="text-sm text-foreground font-medium">💡 Подсказка:</p>
              <p className="text-sm text-muted-foreground mt-1">
                Подумайте, как научить ИИ отличать важное от второстепенного именно для вашей бизнес-задачи.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );

  const workContent = (
    <>
      <PromptTester 
        taskContext="document-analysis"
        taskId="document-analysis-task"
        documentId={selectedDocument}
        placeholder="Напишите промпт для анализа документа и получите ответ нейросети..."
      />
      <TutorChat
        taskContext="document-analysis"
        taskId="document-analysis"
        skillSlug="research"
        placeholder="Вставьте ваш промпт для оценки тьютором..."
        label="Ваш промпт для анализа документа:"
      />
    </>
  );

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/skill-assignments/research')} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Анализ объемного документа</h1>
          <p className="text-sm text-muted-foreground">BASIC уровень | Исследования и обработка информации</p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div className="lg:sticky lg:top-8 lg:self-start">{taskContent}</div>
        <div>{workContent}</div>
      </div>
    </div>
  );
};

export default TaskDocumentAnalysis;
