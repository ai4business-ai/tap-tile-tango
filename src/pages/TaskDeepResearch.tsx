import React, { useState } from 'react';
import { ArrowLeft, Search, Target, CheckCircle, Send, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useChatAssistant } from '@/hooks/useChatAssistant';
import { useToast } from '@/hooks/use-toast';

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

const TaskDeepResearch = () => {
  const navigate = useNavigate();
  const { sendMessage, isLoading } = useChatAssistant();
  const { toast } = useToast();
  const [userAnswer, setUserAnswer] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'tutor', content: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // States for controlling block visibility
  const [showDescription, setShowDescription] = useState(true);
  const [showTask, setShowTask] = useState(true);
  const [showCriteria, setShowCriteria] = useState(true);
  
  // Auto-hide blocks when user starts typing
  const shouldShowDescription = userAnswer.trim() ? showDescription : true;
  const shouldShowTask = userAnswer.trim() ? showTask : true;
  const shouldShowCriteria = userAnswer.trim() ? showCriteria : true;

  const handleSubmitTask = async () => {
    if (userAnswer.trim() && !isLoading) {
      // Add user's answer as first message
      const initialMessage = userAnswer;
      setChatMessages([{ role: 'user', content: initialMessage }]);
      setIsChatMode(true);
      
      try {
        // Send the user's answer to the AI tutor with specific assistant ID
        const tutorResponse = await sendMessage(
          initialMessage,
          'Освоение Deep Research: формулирование исследовательских вопросов и использование режима глубокого поиска',
          'asst_7vzfk2VjBlBiww4QWz6PrC5C'
        );
        
        // Add tutor response
        setChatMessages(prev => [...prev, { role: 'tutor', content: tutorResponse }]);
      } catch (error) {
        // Add error message
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
          'Освоение Deep Research: формулирование исследовательских вопросов и использование режима глубокого поиска',
          'asst_7vzfk2VjBlBiww4QWz6PrC5C'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/skill-assignments/research')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Освоение Deep Research</h1>
          <p className="text-sm text-muted-foreground">PRO уровень</p>
        </div>
      </div>

      {/* Task Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
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
              Вам поручили провести исследование для стратегического решения: выход на новый рынок, запуск продукта или выбор технологии. Нужен комплексный анализ с разных сторон, а не поверхностный обзор.
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
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Шаги выполнения:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Выберите актуальную для вашей работы тему исследования</li>
                <li>• Создайте промпт с краткой формулировкой проблемы (2-3 предложения)</li>
                <li>• Расширьте до детального брифа с контекстом</li>
                <li>• Включите 5-7 конкретных исследовательских вопросов</li>
                <li>• Укажите желаемую структуру результата</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Покажите итеративный процесс:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Версия 1: Базовый запрос</li>
                <li>• Версия 2: Расширенный промпт</li>
                <li>• Версия 3: Промпт для Deep Research</li>
              </ul>
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
              <li>• Исследование охватывает минимум 5 аспектов темы</li>
              <li>• Использует 10+ источников информации</li>
              <li>• Содержит противоположные точки зрения</li>
              <li>• Дает actionable рекомендации</li>
            </ul>
            <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm text-foreground font-medium">💡 Подсказка:</p>
              <p className="text-sm text-muted-foreground mt-1">
                Deep Research работает лучше, когда вы даете ему роль (консультант, аналитик) и четкие критерии оценки информации.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Answer Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {isChatMode && <Bot className="w-5 h-5 text-primary" />}
            {isChatMode ? 'Чат с тьютором' : 'Ваш ответ'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isChatMode ? (
            <div>
              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Опишите выбранную тему, приложите все три версии промптов и результаты исследования..."
                className="min-h-[150px]"
                maxLength={4000}
              />
              <div className="text-sm text-muted-foreground mt-1">
                {userAnswer.length}/4000 символов
              </div>
            </div>
          ) : (
             <div className="space-y-4">
               {/* Chat Messages */}
               <div className="max-h-[400px] overflow-y-auto space-y-3">
                 {chatMessages.map((message, index) => (
                   <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
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
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="mb-4">
        <Button 
          onClick={handleSubmitTask}
          disabled={!userAnswer.trim() || isLoading}
          className="w-full py-4 text-base font-medium"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isLoading ? 'Отправляем...' : 'Сдать задание'}
        </Button>
      </div>
    </div>
  );
};

export default TaskDeepResearch;