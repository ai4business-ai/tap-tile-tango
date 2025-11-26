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

const TaskMeetingAgenda = () => {
  const navigate = useNavigate();
  const { sendMessage, isLoading } = useChatAssistant();
  const { toast } = useToast();
  const { user } = useAuth();
  const { submitAssignment, updateSubmissionStatus, getAssignmentByTaskId } = useUserAssignments(user?.id, 'communication');
  const [agendaPrompt, setAgendaPrompt] = useState('');
  const [followupPrompt, setFollowupPrompt] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'tutor', content: string, timestamp: number}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  const [showDescription, setShowDescription] = useState(true);
  const [showTask, setShowTask] = useState(true);
  const [showCriteria, setShowCriteria] = useState(true);
  
  const hasAnyInput = agendaPrompt.trim() || followupPrompt.trim();
  const shouldShowDescription = hasAnyInput ? showDescription : true;
  const shouldShowTask = hasAnyInput ? showTask : true;
  const shouldShowCriteria = hasAnyInput ? showCriteria : true;

  const handleSubmitTask = async () => {
    if ((agendaPrompt.trim() || followupPrompt.trim()) && !isLoading) {
      const combinedAnswer = `Промпт для адженды:\n${agendaPrompt}\n\nПромпт для follow-up:\n${followupPrompt}`;
      
      setChatMessages([{ role: 'user', content: combinedAnswer, timestamp: Date.now() }]);
      setIsChatMode(true);
      
      // Save to database
      const assignment = getAssignmentByTaskId('meeting-agenda');
      if (assignment && user) {
        await submitAssignment(assignment.id, combinedAnswer);
      }
      
      try {
        const tutorResponse = await sendMessage(
          combinedAnswer,
          'Создание повестки встречи (agenda) и follow-up письма'
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
          'Создание повестки встречи (agenda) и follow-up письма'
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8 w-full md:max-w-md mx-auto overflow-x-hidden">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/skill-assignments/communication')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Повестка встречи</h1>
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
            {hasAnyInput && (
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
              В последнее время клиенты все чаще жалуются на задержки в подключении новых услуг «Умный дом». Анализ показал, что проблема кроется в несогласованности работы трех отделов.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h4 className="text-sm font-semibold text-foreground mb-3">Проблемные отделы:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>Отдел продаж:</strong> Принимает заказ, но не всегда проверяет техническую возможность</li>
                <li><strong>Технический отдел:</strong> Получает заявки с неполной информацией, что требует дополнительных уточнений</li>
                <li><strong>Отдел логистики:</strong> Доставляет оборудование, но не всегда в сроки, согласованные с клиентом</li>
              </ul>
            </div>

            <div className="bg-accent/20 rounded-lg p-4 border border-accent">
              <h4 className="text-sm font-semibold text-foreground mb-2">Финансовые показатели:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Среднее время подключения: <strong>14 дней</strong></li>
                <li>• Целевой показатель: <strong>10 дней</strong></li>
                <li>• Потерянных клиентов: <strong>~5%</strong> от всех заявок</li>
                <li>• Средний чек клиента: <strong>1500 руб./мес.</strong></li>
              </ul>
            </div>

            <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">Отзывы клиентов:</h4>
              <div className="space-y-2 text-sm text-muted-foreground italic">
                <p>"Оформил заказ на "Умный дом", прошло уже 2 недели, а мне до сих пор не могут назвать точную дату установки..."</p>
                <p>"Специалист приехал, сказал, что не хватает кабеля, и уехал. Теперь жду второй выезд. Ужасный сервис!"</p>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">Результаты встречи:</h4>
              <p className="text-sm text-muted-foreground mb-2"><strong>Решения:</strong></p>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside mb-3">
                <li>Внедрить единую цифровую форму заказа с обязательными полями</li>
                <li>Проводить ежедневные планерки между отделами на 15 минут</li>
              </ul>
              <p className="text-sm text-muted-foreground mb-2"><strong>Задачи:</strong></p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Иван Сидоров (Продажи):</strong> Разработать макет новой формы заказа до 25.10.2024</li>
                <li>• <strong>Петр Иванов (Технический):</strong> Составить чек-лист обязательных данных до 28.10.2024</li>
                <li>• <strong>Ольга Петрова (Логистика):</strong> Проинтегрировать графики в систему до 01.11.2024</li>
              </ul>
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
            {hasAnyInput && (
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
              Организовать и провести встречу с коллегами из 3 отделов (продажи, технический, логистика). Составьте:
            </p>

            <div className="space-y-3">
              <div className="bg-muted/30 rounded-lg p-3 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">1. Промпт для адженды (agenda)</h4>
                <p className="text-sm text-muted-foreground">
                  ИИ должен помочь составить и разослать четкую повестку с целями, списком вопросов для обсуждения и таймингом.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-3 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">2. Промпт для follow-up письма</h4>
                <p className="text-sm text-muted-foreground">
                  ИИ должен превратить ваши заметки после встречи в хорошее письмо с ключевыми решениями, назначенными задачами, ответственными и сроками.
                </p>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">💡 Подсказка для адженды:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Начните с роли</li>
                <li>Добавьте контекст: кратко опишите ситуацию из кейса</li>
                <li>Четко сформулируйте задачу</li>
                <li>Укажите структуру: цель, участники, список вопросов/тем, тайминг</li>
              </ul>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">💡 Подсказка для follow-up:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Роль</li>
                <li>Контекст: напомните о состоявшейся встрече</li>
                <li>Данные для письма: ключевые решения и список задач с ответственными</li>
                <li>Требования к тону и структуре</li>
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
            {hasAnyInput && (
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
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Для адженды:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Структура (цель, участники, вопросы, тайминг)</li>
                  <li>✓ Контекст ситуации</li>
                  <li>✓ Список ключевых тем для обсуждения</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Для follow-up:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Краткость и четкость решений</li>
                  <li>✓ Указание ответственных и сроков</li>
                  <li>✓ Структурированность (Что? Кто? Когда?)</li>
                  <li>✓ Практичность результата</li>
                </ul>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Prompt Tester */}
      <PromptTester 
        taskContext="meeting-agenda"
        taskId="meeting-agenda-task"
        placeholder="Протестируйте ваши промпты для адженды и follow-up письма..."
      />

      {!isChatMode ? (
        <>
          <Card className="mb-6">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground block">Промпт для создания адженды:</label>
                <Textarea
                  value={agendaPrompt}
                  onChange={(e) => setAgendaPrompt(e.target.value)}
                  placeholder="Напишите промпт для создания повестки встречи..."
                  className="min-h-[150px]"
                  maxLength={2000}
                />
                <div className="text-sm text-muted-foreground">
                  {agendaPrompt.length}/2000 символов
                </div>
              </div>

              <div className="h-px bg-border"></div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground block">Промпт для follow-up письма:</label>
                <Textarea
                  value={followupPrompt}
                  onChange={(e) => setFollowupPrompt(e.target.value)}
                  placeholder="Напишите промпт для создания итогового письма..."
                  className="min-h-[150px]"
                  maxLength={2000}
                />
                <div className="text-sm text-muted-foreground">
                  {followupPrompt.length}/2000 символов
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 mb-4 px-4 max-w-sm mx-auto">
            <Button 
              onClick={handleSubmitTask}
              disabled={(!agendaPrompt.trim() && !followupPrompt.trim()) || isLoading}
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

export default TaskMeetingAgenda;
