import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Target, CheckCircle, Send, Bot, ChevronDown, ChevronUp, Download, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChatAssistant } from '@/hooks/useChatAssistant';
import { PromptTester } from '@/components/PromptTester';
import { BlurredAnswerBlock } from '@/components/BlurredAnswerBlock';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserAssignments } from '@/hooks/useUserAssignments';
import { useAuth } from '@/hooks/useAuth';

// Helper function to format assistant messages into paragraphs
const formatAssistantMessage = (content: string): string[] => {
  if (!content) return [content];
  
  // Split by double line breaks or sentences that seem like natural paragraph breaks
  const paragraphs = content
    .split(/\n\n+|\. (?=[А-ЯA-Z])/g)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  // If no natural breaks found, split long text into smaller chunks
  if (paragraphs.length === 1 && content.length > 200) {
    const sentences = content.split(/\. (?=[а-яё])/gi);
    const chunks: string[] = [];
    let currentChunk = '';
    
    sentences.forEach(sentence => {
      if (currentChunk.length + sentence.length > 150 && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    });
    
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks.length > 1 ? chunks : paragraphs;
  }
  
  return paragraphs;
};

const TaskDocumentAnalysis = () => {
  const navigate = useNavigate();
  const { sendMessage, isLoading } = useChatAssistant();
  const { toast } = useToast();
  const { user } = useAuth();
  const { submitAssignment, updateSubmissionStatus, getAssignmentByTaskId } = useUserAssignments(user?.id, 'research');
  const [userAnswer, setUserAnswer] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'tutor', content: string, timestamp: number}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Array<{
    id: string;
    title: string;
    description: string;
    file_path: string;
  }>>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  // Load documents from database
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
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить документы",
            variant: "destructive",
          });
        } else {
          setDocuments(data || []);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить документы",
          variant: "destructive",
        });
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    loadDocuments();
  }, [toast]);
  
  // States for controlling block visibility
  const [showDescription, setShowDescription] = useState(true);
  const [showTask, setShowTask] = useState(true);
  const [showCriteria, setShowCriteria] = useState(true);
  
  // Auto-hide blocks when user starts typing
  const shouldShowDescription = userAnswer.trim() ? showDescription : true;
  const shouldShowTask = userAnswer.trim() ? showTask : true;
  const shouldShowCriteria = userAnswer.trim() ? showCriteria : true;

  const handleSubmitTask = async () => {
    if (!selectedDocument) {
      toast({
        title: "Выберите документ",
        description: "Сначала выберите один из предложенных документов для анализа",
        variant: "destructive",
      });
      return;
    }

    if (userAnswer.trim() && !isLoading) {
      const selectedDoc = documents.find(doc => doc.id === selectedDocument);
      const contextualMessage = `Выбранный документ: "${selectedDoc?.title}"\n\n${userAnswer}`;
      
      setChatMessages([{ role: 'user', content: contextualMessage, timestamp: Date.now() }]);
      setIsChatMode(true);
      
      // Save to database
      const assignment = getAssignmentByTaskId('document-analysis');
      if (assignment && user) {
        await submitAssignment(assignment.id, contextualMessage);
      }
      
      try {
        const tutorResponse = await sendMessage(
          contextualMessage,
          'Анализ документов и создание executive summary',
          undefined,
          selectedDocument
        );
        
        setChatMessages(prev => [...prev, { role: 'tutor', content: tutorResponse, timestamp: Date.now() }]);
        
        // Update status to completed after receiving feedback
        if (assignment && user) {
          await updateSubmissionStatus(assignment.id, 'completed', { feedback: tutorResponse });
        }
      } catch (error) {
        setChatMessages(prev => [...prev, { 
          role: 'tutor', 
          content: 'Извините, произошла ошибка при отправке вашего ответа. Попробуйте еще раз.',
          timestamp: Date.now()
        }]);
      }
    }
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim() && !isLoading) {
      const userMessage = currentMessage;
      setCurrentMessage('');
      
      // Add user message immediately
      setChatMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: Date.now() }]);
      
      try {
        const tutorResponse = await sendMessage(
          userMessage,
          'Анализ документов и создание executive summary',
          undefined,
          selectedDocument
        );
        
        // Add tutor response
        setChatMessages(prev => [...prev, { role: 'tutor', content: tutorResponse, timestamp: Date.now() }]);
      } catch (error) {
        // Add error message
        setChatMessages(prev => [...prev, { 
          role: 'tutor', 
          content: 'Извините, произошла ошибка. Попробуйте еще раз.',
          timestamp: Date.now()
        }]);
      }
    }
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocument(documentId);
    const selectedDoc = documents.find(doc => doc.id === documentId);
    if (selectedDoc) {
      handleDocumentDownload(documentId, selectedDoc.title);
    }
  };

  const handleDocumentDownload = async (documentId: string, displayName: string) => {
    try {
      const selectedDoc = documents.find(doc => doc.id === documentId);
      if (!selectedDoc) {
        throw new Error('Document not found');
      }

      console.log('Starting download', { documentId, file_path: selectedDoc.file_path });

      // 1) Надёжный путь: скачать файл через Supabase Storage (аутентифицированный запрос)
      const { data, error } = await supabase.storage
        .from('documents')
        .download(selectedDoc.file_path);

      if (!error && data) {
        const blobUrl = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = blobUrl;
        // используем читаемое имя файла
        link.download = `${displayName}.pdf`;
        link.target = '_blank';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);

        toast({
          title: 'Файл скачивается',
          description: `"${displayName}" начинает загрузку`,
        });
        return;
      }

      console.warn('Supabase download failed, trying publicUrl fallback', error);

      // 2) Публичная ссылка из бакета, если объект действительно загружен в Storage
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(selectedDoc.file_path);

      if (urlData?.publicUrl) {
        const link = document.createElement('a');
        link.href = urlData.publicUrl;
        link.download = `${displayName}.pdf`;
        link.target = '_blank';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: 'Файл скачивается',
          description: `"${displayName}" начинает загрузку (public URL)`,
        });
        return;
      }

      // 3) Локальный fallback на статические файлы из /public/documents
      const deriveLocalFileName = (path: string) => {
        let name = path.split('/').pop() || path;
        const parts = name.split('.');
        // отбрасываем числовые префиксы вида 1.1.2.
        let idx = 0;
        while (idx < parts.length - 1 && /^\d+$/.test(parts[idx])) idx++;
        return parts.slice(idx).join('.');
      };

      const fallbackName = deriveLocalFileName(selectedDoc.file_path);
      const localUrl = `/documents/${fallbackName}`;
      console.warn('Falling back to local public file', { localUrl, fallbackName });

      const link = document.createElement('a');
      link.href = localUrl;
      link.download = fallbackName;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Файл скачивается',
        description: `"${displayName}" открыт по локальной ссылке`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Ошибка скачивания',
        description: 'Не удалось скачать файл. Попробуйте еще раз.',
        variant: 'destructive',
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8 w-full max-w-4xl mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/skill-assignments/research')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Анализ объемного документа</h1>
          <p className="text-sm text-muted-foreground">BASIC уровень | Исследования и обработка информации</p>
        </div>
      </div>

      {/* Task Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Описание задания
            </div>
            {userAnswer.trim() && !showDescription && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDescription(true)}
                className="h-6 px-2"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            )}
            {userAnswer.trim() && showDescription && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDescription(false)}
                className="h-6 px-2"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        {shouldShowDescription && (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Представьте, что ваш руководитель переслал вам годовой отчет конкурента (или отраслевое исследование) со словами: "Посмотри, пожалуйста, что там важного. Мне нужны ключевые выводы к завтрашнему совещанию". У вас есть 30 минут и документ на 20+ страниц.
            </p>
          </CardContent>
        )}
      </Card>

      {/* Task Requirements */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Ваша задача
            </div>
            {userAnswer.trim() && !showTask && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTask(true)}
                className="h-6 px-2"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            )}
            {userAnswer.trim() && showTask && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTask(false)}
                className="h-6 px-2"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        {shouldShowTask && (
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
                  <div className="p-4 text-center text-muted-foreground">
                    Загрузка документов...
                  </div>
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
                            {doc.description && (
                              <span className="text-xs text-muted-foreground">{doc.description}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedDocument === doc.id && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                            <Download 
                              className="w-4 h-4 text-muted-foreground" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDocumentDownload(doc.id, doc.title);
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {selectedDocument && (
                  <div className="mt-2 p-2 bg-accent/20 border border-green-accent rounded-lg">
                    <p className="text-sm text-green-accent font-medium">
                      ✓ Документ выбран и загружается
                    </p>
                  </div>
                )}
              </div>
          </CardContent>
        )}
      </Card>

      {/* Success Criteria */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Критерии успешного выполнения
            </div>
            {userAnswer.trim() && !showCriteria && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCriteria(true)}
                className="h-6 px-2"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            )}
            {userAnswer.trim() && showCriteria && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCriteria(false)}
                className="h-6 px-2"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        {shouldShowCriteria && (
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

      {/* Prompt Tester */}
      <PromptTester 
        taskContext="document-analysis"
        taskId="document-analysis-task"
        documentId={selectedDocument}
        placeholder="Проанализируй этот документ и создай executive summary..."
      />

      {/* Блок ответа */}
      {!isChatMode ? (
        <BlurredAnswerBlock
          value={userAnswer}
          onChange={setUserAnswer}
          onSubmit={handleSubmitTask}
          disabled={isLoading}
          isSubmitting={isLoading}
          canSubmit={selectedDocument && userAnswer.trim().length >= 10}
          taskDescription="Выберите документ для анализа и опишите ваши выводы на основе изучения материала."
          placeholder="Опишите ваши выводы после анализа документа..."
        />
      ) : (
        <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="w-5 h-5 text-primary" />
            Чат с тьютором
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat Messages */}
            <div className="max-h-[50vh] overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/30">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[90%] p-3 rounded-lg text-sm break-words overflow-wrap-break-word ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-secondary/50 text-secondary-foreground border'
                  }`}>
                    {message.role === 'tutor' ? (
                      <div className="space-y-2">
                        {formatAssistantMessage(message.content).map((paragraph, pIndex) => (
                          <p key={pIndex} className="leading-relaxed">
                            {paragraph.endsWith('.') ? paragraph : paragraph + '.'}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <div className="leading-relaxed whitespace-pre-wrap break-words">{message.content}</div>
                    )}
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary/50 text-secondary-foreground border p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Тьютор печатает...
                    </div>
                  </div>
                </div>
              )}
            </div>
           
            {/* Message Input */}
            <div className="space-y-3">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Введите ваш ответ..."
                className="min-h-[100px]"
                maxLength={4000}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {currentMessage.length}/4000 символов • Ctrl+Enter для отправки
                </span>
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !currentMessage.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Отправить
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default TaskDocumentAnalysis;