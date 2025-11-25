import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Target, CheckCircle, Send, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChatAssistant } from '@/hooks/useChatAssistant';
import { useToast } from '@/hooks/use-toast';
import { PromptTester } from '@/components/PromptTester';
import { useUserAssignments } from '@/hooks/useUserAssignments';
import { useAuth } from '@/hooks/useAuth';

const formatAssistantMessage = (content: string): string[] => {
  if (!content) return [content];
  
  const paragraphs = content
    .split(/\n\n+|\. (?=[А-ЯA-Z])/g)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
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

const TaskFeedback = () => {
  const navigate = useNavigate();
  const { sendMessage, isLoading } = useChatAssistant();
  const { toast } = useToast();
  const { user } = useAuth();
  const { submitAssignment, updateSubmissionStatus, getAssignmentByTaskId } = useUserAssignments(user?.id, 'communication');
  const [userAnswer, setUserAnswer] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'tutor', content: string, timestamp: number}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  const [showDescription, setShowDescription] = useState(true);
  const [showTask, setShowTask] = useState(true);
  const [showCriteria, setShowCriteria] = useState(true);
  
  const shouldShowDescription = userAnswer.trim() ? showDescription : true;
  const shouldShowTask = userAnswer.trim() ? showTask : true;
  const shouldShowCriteria = userAnswer.trim() ? showCriteria : true;

  const handleSubmitTask = async () => {
    if (userAnswer.trim() && !isLoading) {
      setChatMessages([{ role: 'user', content: userAnswer, timestamp: Date.now() }]);
      setIsChatMode(true);
      
      // Save to database
      const assignment = getAssignmentByTaskId('feedback-colleagues');
      if (assignment && user) {
        await submitAssignment(assignment.id, userAnswer);
      }
      
      try {
        const tutorResponse = await sendMessage(
          userAnswer,
          'Конструктивная обратная связь коллегам - кейс про функцию Умный помощник'
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
      
      setChatMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: Date.now() }]);
      
      try {
        const tutorResponse = await sendMessage(
          userMessage,
          'Конструктивная обратная связь коллегам - кейс про функцию Умный помощник'
        );
        
        setChatMessages(prev => [...prev, { role: 'tutor', content: tutorResponse, timestamp: Date.now() }]);
      } catch (error) {
        setChatMessages(prev => [...prev, { 
          role: 'tutor', 
          content: 'Извините, произошла ошибка. Попробуйте еще раз.',
          timestamp: Date.now()
        }]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8 w-full max-w-4xl mx-auto overflow-x-hidden">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/skill-assignments/communication')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Обратная связь коллегам</h1>
          <p className="text-sm text-muted-foreground">BASIC уровень | Коммуникация и работа в команде</p>
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
            {userAnswer.trim() && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDescription(!showDescription)}
                className="h-6 px-2"
              >
                {showDescription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        {shouldShowDescription && (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Компания «Инновация» планирует запустить новую функцию «Умный помощник» в своем мобильном приложении. Эта функция использует ИИ для анализа финансовых привычек пользователя и дает персональные рекомендации по экономии и инвестициям.
            </p>

            <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">⚠️ Проблема:</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Юридический отдел заблокировал запуск фичи. Юристы считают, что рекомендации ИИ могут быть истолкованы как финансовая консультация, что требует специальной лицензии и несет огромные риски для компании (иски, штрафы, репутационный ущерб).
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Команда продукта и маркетинга в ярости, так как все готово к запуску промо-кампании, а конкуренты уже выпускают похожие функции.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Аргументы юристов:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Нужна лицензия на финансовое консультирование</li>
                  <li>Высокие риски исков от пользователей</li>
                  <li>Возможны штрафы от регуляторов</li>
                  <li>Репутационные риски для компании</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Аргументы команды продукта:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Конкуренты уже запустили похожие функции</li>
                  <li>Промо-кампания готова к запуску</li>
                  <li>Пользователи ждут эту функцию</li>
                  <li>Упущенная выгода</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">Ваша роль:</h4>
              <p className="text-sm text-muted-foreground">
                Вам, как продакт-менеджеру, поручили найти компромиссное решение. Вам нужно быстро проанализировать аргументы сторон и дать конструктивную обратную связь коллегам из юридического отдела.
              </p>
            </div>
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
            {userAnswer.trim() && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTask(!showTask)}
                className="h-6 px-2"
              >
                {showTask ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        {shouldShowTask && (
          <CardContent className="space-y-4">
            <p className="text-sm font-medium text-foreground">
              Составьте промпт для ИИ, который поможет вам подготовить конструктивный ответ юристам и предложить решение.
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Цель промпта:</h4>
              <p className="text-sm text-muted-foreground">
                Получить от ИИ проект письма с конструктивной обратной связью по ситуации для юридического отдела.
              </p>
            </div>

            <div className="bg-accent/20 rounded-lg p-4 border border-accent">
              <h4 className="text-sm font-semibold text-foreground mb-2">Письмо должно включать:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>1. Понимание их позиции и рисков</strong><br/>Покажите, что вы услышали и поняли их аргументы</li>
                <li><strong>2. Предложение конкретных решений</strong><br/>Вместо спора — конструктивное предложение по изменению текста функции</li>
                <li><strong>3. Варианты нового текста (3-4 варианта)</strong><br/>Описание функции «Умный помощник», которое:
                  <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
                    <li>Сохраняет пользу и привлекательность для пользователя</li>
                    <li>Исключает формулировки про «финансовую консультацию»</li>
                    <li>Юридически безопасно</li>
                  </ul>
                </li>
                <li><strong>4. Нацеленность на сотрудничество</strong><br/>Предложите совместно доработать варианты</li>
              </ul>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">💡 Подсказка:</h4>
              <p className="text-sm text-muted-foreground mb-2">Структура эффективного промпта:</p>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li><strong>Роль:</strong> Кто вы в этой ситуации?</li>
                <li><strong>Контекст:</strong> Опишите ситуацию и позиции сторон</li>
                <li><strong>Задача:</strong> Что конкретно нужно создать?</li>
                <li><strong>Требования:</strong> Какие элементы должны быть в письме?</li>
                <li><strong>Тон:</strong> Конструктивный, эмпатичный, нацеленный на сотрудничество</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Evaluation Criteria */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Критерии оценки
            </div>
            {userAnswer.trim() && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCriteria(!showCriteria)}
                className="h-6 px-2"
              >
                {showCriteria ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        {shouldShowCriteria && (
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Эмпатия к позиции юристов</li>
              <li>✓ Конструктивность предложений</li>
              <li>✓ Юридическая безопасность альтернативных формулировок</li>
              <li>✓ Тон сотрудничества (не конфронтации)</li>
              <li>✓ Практичность решения</li>
              <li>✓ Наличие 3-4 вариантов текста функции</li>
            </ul>
          </CardContent>
        )}
      </Card>

      {/* Prompt Tester */}
      <PromptTester 
        taskContext="feedback-colleagues"
        taskId="feedback-colleagues-task"
        placeholder="Напишите промпт для составления конструктивной обратной связи юристам..."
      />

      {!isChatMode ? (
        <>
          <Card className="mb-6">
            <CardContent className="pt-6 space-y-3">
              <label className="text-sm font-medium text-foreground block">Ваш промпт для ИИ:</label>
              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Напишите промпт, который поможет ИИ создать конструктивное письмо юристам..."
                className="min-h-[200px]"
                maxLength={4000}
              />
              <div className="text-sm text-muted-foreground">
                {userAnswer.length}/4000 символов
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 mb-4 px-4 max-w-sm mx-auto">
            <Button 
              onClick={handleSubmitTask}
              disabled={!userAnswer.trim() || isLoading}
              className="w-full py-4 text-base font-medium"
            >
              {isLoading ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-spin" />
                  Отправляем...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Отправить на проверку
                </>
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="space-y-4 mb-6">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'tutor' && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-card border border-border'
                }`}>
                  {msg.role === 'tutor' ? (
                    <div className="space-y-3">
                      {formatAssistantMessage(msg.content).map((paragraph, pIdx) => (
                        <p key={pIdx} className="text-sm text-card-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Задайте вопрос тьютору..."
              className="min-h-[80px]"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              size="icon"
              className="h-[80px] w-12"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFeedback;
