import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, FileSpreadsheet, BookOpen, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TelegramAPI from '@/lib/telegram';
import { openAIService, OpenAIService } from '@/lib/openai';

interface CheckResult {
  score: number;
  feedback: string;
  suggestions?: string[];
}

const TaskDetail = () => {
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [telegramAPI, setTelegramAPI] = useState<TelegramAPI | null>(null);

  useEffect(() => {
    const tg = TelegramAPI.getInstance();
    setTelegramAPI(tg);

    // Показываем кнопку "Назад" в Telegram
    tg.showBackButton(() => {
      navigate('/tasks/data-analysis');
    });

    return () => {
      tg.hideBackButton();
      tg.hideMainButton();
    };
  }, [navigate]);

  // Обработка скачивания таблицы через Telegram bot
  const handleDownloadTable = () => {
    if (telegramAPI) {
      // Отправляем команду боту для отправки клавиатуры с кнопкой скачивания
      telegramAPI.sendDataToBot({
        action: 'download_table',
        taskId: 'cohort-analysis-sql',
        tableType: 'cohort_data',
        timestamp: new Date().toISOString()
      });

      telegramAPI.showAlert('Кнопка для скачивания таблицы появится в чате с ботом');
    }
  };

  // Обработка ссылки на курс через Telegram bot
  const handleOpenCourse = () => {
    if (telegramAPI) {
      telegramAPI.sendDataToBot({
        action: 'open_course',
        taskId: 'cohort-analysis-sql',
        courseType: 'sql_basics',
        timestamp: new Date().toISOString()
      });

      telegramAPI.showAlert('Ссылка на курс появится в чате с ботом');
    }
  };

  // Обработка отправки домашнего задания
  const handleSubmitHomework = async () => {
    if (!userAnswer.trim()) {
      if (telegramAPI) {
        await telegramAPI.showAlert('Пожалуйста, введите ваш ответ перед отправкой');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Отправляем запрос боту на проверку домашнего задания
      if (telegramAPI) {
        telegramAPI.sendDataToBot({
          action: 'submit_homework',
          taskId: 'cohort-analysis-sql',
          userAnswer: userAnswer,
          timestamp: new Date().toISOString()
        });

        // Показываем, что задание отправлено на проверку
        await telegramAPI.showAlert('Задание отправлено на проверку! Результат появится в чате с ботом через несколько секунд.');

        // Опционально: проверяем задание локально через OpenAI (если ключи настроены)
        try {
          const result = await openAIService.checkHomework({
            taskTitle: 'Когортный анализ и SQL',
            userAnswer: userAnswer,
            timestamp: new Date().toISOString()
          });

          if (result.success) {
            setCheckResult({
              score: result.score,
              feedback: result.feedback,
              suggestions: result.suggestions
            });
          }
        } catch (error) {
          console.log('OpenAI проверка недоступна, используем только бот');
        }
      }
    } catch (error) {
      console.error('Error submitting homework:', error);
      if (telegramAPI) {
        await telegramAPI.showAlert('Произошла ошибка при отправке задания. Попробуйте еще раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "destructive" | "outline" | "secondary" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/tasks/data-analysis')}
            className="w-8 h-8 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Анализ данных</h1>
            <p className="text-sm text-muted-foreground">3 задания</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/tasks/data-analysis')}
          className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Status Badge */}
        <div>
          <Badge className="bg-purple-accent text-white">
            Новое
          </Badge>
        </div>

        {/* Title and Description */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Когортный анализ и SQL</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Проведение когортного анализа на основе данных в различных таблицах, а также формирование SQL запросов при помощи GPT
          </p>
        </div>

        {/* What You'll Learn */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Чему научишься</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-muted-foreground">Анализировать большие таблицы</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-muted-foreground">Составлять SQL-запросы</span>
            </li>
          </ul>
        </div>

        {/* Task */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Задание</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Скачай табличку и проанализируй её. Твоя задача с помощью GPT составить SQL запрос для того, чтобы выявить сумму всех транзакций у клиентов, чьё LTV больше 5000 рублей
          </p>
          
          {/* Answer Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground block">Ваш ответ:</label>
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Вставьте ваш SQL-запрос и описание анализа..."
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Materials */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Материалы</h3>
          <div className="space-y-3">
            <Card className="cursor-pointer hover:bg-muted/20 transition-colors" onClick={handleDownloadTable}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-foreground">Ссылка на таблицу</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Telegram Bot
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-muted/20 transition-colors" onClick={handleOpenCourse}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-foreground">Ссылка на курс</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Telegram Bot
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Check Result */}
        {checkResult && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span>Результат проверки</span>
                <Badge variant={getScoreBadgeVariant(checkResult.score)} className="ml-2">
                  {checkResult.score}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Обратная связь:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {checkResult.feedback}
                </p>
              </div>
              
              {checkResult.suggestions && checkResult.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Рекомендации:</h4>
                  <ul className="space-y-1">
                    {checkResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto">
        <Button 
          onClick={handleSubmitHomework}
          disabled={isSubmitting || !userAnswer.trim()}
          className="w-full py-4 text-base font-medium"
        >
          {isSubmitting ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Отправляем...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Сдать домашку
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TaskDetail;
