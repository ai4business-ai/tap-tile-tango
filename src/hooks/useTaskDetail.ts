
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TelegramAPI from '@/lib/telegram';
import { openAIService } from '@/lib/openai';

interface CheckResult {
  score: number;
  feedback: string;
  suggestions?: string[];
}

export const useTaskDetail = () => {
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [telegramAPI, setTelegramAPI] = useState<TelegramAPI | null>(null);

  useEffect(() => {
    const tg = TelegramAPI.getInstance();
    setTelegramAPI(tg);

    tg.showBackButton(() => {
      navigate('/tasks/data-analysis');
    });

    return () => {
      tg.hideBackButton();
      tg.hideMainButton();
    };
  }, [navigate]);

  const handleDownloadTable = () => {
    if (telegramAPI) {
      telegramAPI.sendDataToBot({
        action: 'download_table',
        taskId: 'cohort-analysis-sql',
        tableType: 'cohort_data',
        timestamp: new Date().toISOString()
      });

      telegramAPI.showAlert('Кнопка для скачивания таблицы появится в чате с ботом');
    }
  };

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

  const handleSubmitHomework = async () => {
    if (!userAnswer.trim()) {
      if (telegramAPI) {
        await telegramAPI.showAlert('Пожалуйста, введите ваш ответ перед отправкой');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      if (telegramAPI) {
        telegramAPI.sendDataToBot({
          action: 'submit_homework',
          taskId: 'cohort-analysis-sql',
          userAnswer: userAnswer,
          timestamp: new Date().toISOString()
        });

        await telegramAPI.showAlert('Задание отправлено на проверку! Результат появится в чате с ботом через несколько секунд.');

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

  return {
    userAnswer,
    setUserAnswer,
    isSubmitting,
    checkResult,
    handleDownloadTable,
    handleOpenCourse,
    handleSubmitHomework,
    navigate
  };
};
