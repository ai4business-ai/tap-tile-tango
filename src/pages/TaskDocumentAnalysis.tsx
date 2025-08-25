import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Target, CheckCircle, Send, Bot, ChevronDown, ChevronUp, Download, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useChatAssistant } from '@/hooks/useChatAssistant';
import { PromptTester } from '@/components/PromptTester';
import { BlurredAnswerBlock } from '@/components/BlurredAnswerBlock';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [userAnswer, setUserAnswer] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'tutor', content: string}[]>([]);
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
      
      setChatMessages([{ role: 'user', content: contextualMessage }]);
      setIsChatMode(true);
      
      try {
        const tutorResponse = await sendMessage(
          contextualMessage,
          'Анализ объемного документа: создание executive summary для документа 20+ страниц',
          undefined,
          selectedDocument
        );
        
        setChatMessages(prev => [...prev, { role: 'tutor', content: tutorResponse }]);
      } catch (error) {
        setChatMessages(prev => [...prev, { 
          role: 'tutor', 
          content: 'Извините, произошла ошибка при отправке вашего ответа. Попробуйте еще раз.' 
        }]);
      }
    }
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim() && !isLoading) {
      const userMessage = currentMessage;
      setCurrentMessage('');
      
      // Add user message immediately
      setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      
      try {
        const tutorResponse = await sendMessage(
          userMessage,
          'Анализ объемного документа: создание executive summary для документа 20+ страниц',
          undefined,
          selectedDocument
        );
        
        // Add tutor response
        setChatMessages(prev => [...prev, { role: 'tutor', content: tutorResponse }]);
      } catch (error) {
        // Add error message
        setChatMessages(prev => [...prev, { 
          role: 'tutor', 
          content: 'Извините, произошла ошибка. Попробуйте еще раз.' 
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
      // Find the document to get its file_path
      const selectedDoc = documents.find(doc => doc.id === documentId);
      if (!selectedDoc) {
        throw new Error('Document not found');
      }

      // Get public URL from Supabase Storage
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(selectedDoc.file_path);

      if (urlData?.publicUrl) {
        const link = document.createElement('a');
        link.href = urlData.publicUrl;
        link.download = selectedDoc.file_path;
        link.target = '_blank';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Файл скачивается",
          description: `"${displayName}" начинает загрузку`,
        });
      } else {
        throw new Error('Could not get download URL');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Ошибка скачивания",
        description: "Не удалось скачать файл. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8 w-full max-w-4xl mx-auto overflow-x-hidden">
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
            <div className="max-h-[50vh] overflow-y-auto space-y-3">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] sm:max-w-[75%] p-3 rounded-lg text-sm break-words overflow-wrap-break-word ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
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
                      <div className="leading-relaxed">{message.content}</div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                      <span className="ml-2">Тьютор печатает...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
           
            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Введите ваш ответ..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default TaskDocumentAnalysis;