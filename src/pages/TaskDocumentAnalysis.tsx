import React, { useState } from 'react';
import { ArrowLeft, FileText, Target, CheckCircle, Send, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useChatAssistant } from '@/hooks/useChatAssistant';

const TaskDocumentAnalysis = () => {
  const navigate = useNavigate();
  const { sendMessage, isLoading } = useChatAssistant();
  const [userAnswer, setUserAnswer] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'tutor', content: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // States for controlling block visibility
  const [showDescription, setShowDescription] = useState(true);
  const [showTask, setShowTask] = useState(true);
  const [showCriteria, setShowCriteria] = useState(true);

  const handleSubmitTask = () => {
    if (userAnswer.trim()) {
      setIsChatMode(true);
      setChatMessages([
        {
          role: 'tutor',
          content: 'Отлично! Я изучил ваш ответ. Давайте вместе доработаем его до высокого уровня выполнения. Что именно вы выбрали в качестве документа для анализа?'
        }
      ]);
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
          'Анализ объемного документа: создание executive summary для документа 20+ страниц'
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
          <h1 className="text-xl font-semibold text-foreground">Анализ объемного документа</h1>
          <p className="text-sm text-muted-foreground">BASIC уровень</p>
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
        {(!userAnswer.trim() || showDescription) && (
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
        {(!userAnswer.trim() || showTask) && (
          <CardContent className="space-y-3">
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
        {(!userAnswer.trim() || showCriteria) && (
          <CardContent className="space-y-2">
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Executive summary читается за 2-3 минуты</li>
              <li>• Содержит 5-7 ключевых инсайтов</li>
              <li>• Структурирован по принципу "от важного к деталям"</li>
              <li>• Понятен человеку, не читавшему оригинал</li>
            </ul>
            <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm text-foreground font-medium">💡 Подсказка:</p>
              <p className="text-sm text-muted-foreground mt-1">
                Подумайте, как научить ИИ отличать важное от второстепенного именно для вашей бизнес-задачи.
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
          {isChatMode && (
            <button 
              onClick={() => setIsChatMode(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Вернуться к ответу
            </button>
          )}
        </CardHeader>
        <CardContent>
          {!isChatMode ? (
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Опишите выбранный документ, ваш промпт для ИИ и приложите получившееся executive summary..."
              className="min-h-[150px]"
            />
          ) : (
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="max-h-[300px] overflow-y-auto space-y-3">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
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
          disabled={!userAnswer.trim()}
          className="w-full py-4 text-base font-medium"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Сдать задание
        </Button>
      </div>
    </div>
  );
};

export default TaskDocumentAnalysis;