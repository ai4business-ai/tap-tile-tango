// src/hooks/useTaskDetail.ts - Исправленная версия

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

    // Показываем информацию о подключении к Telegram
    const debugInfo = tg.getDebugInfo();
    console.log('🔍 Telegram Debug Info:', debugInfo);

    tg.showBackButton(() => {
      navigate('/tasks/data-analysis');
    });

    return () => {
      tg.hideBackButton();
      tg.hideMainButton();
    };
  }, [navigate]);

  const handleDownloadTable = () => {
    if (!telegramAPI) {
      console.error('❌ TelegramAPI не инициализирован');
      alert('❌ Ошибка инициализации Telegram API');
      return;
    }

    // Проверяем, запущено ли приложение в Telegram
    if (!telegramAPI.isInTelegram()) {
      console.error('❌ Приложение не запущено в Telegram');
      telegramAPI.showAlert(
        'Приложение должно быть запущено через Telegram бота для отправки данных.'
      );
      return;
    }

    const payload = {
      action: 'download_table',
      taskId: 'cohort-analysis-sql',
      tableType: 'cohort_data',
      timestamp: new Date().toISOString()
    };

    console.log('📤 Отправляем запрос на скачивание таблицы:', payload);

    try {
      telegramAPI.sendDataToBot(payload);
      telegramAPI.showAlert('Кнопка для скачивания таблицы появится в чате с ботом');
    } catch (error) {
      console.error('❌ Ошибка при отправке данных:', error);
      telegramAPI.showAlert('Произошла ошибка при отправке запроса. Попробуйте еще раз.');
    }
  };

  const handleOpenCourse = () => {
    if (!telegramAPI) {
      console.error('❌ TelegramAPI не инициализирован');
      alert('❌ Ошибка инициализации Telegram API');
      return;
    }

    // Проверяем, запущено ли приложение в Telegram
    if (!telegramAPI.isInTelegram()) {
      console.error('❌ Приложение не запущено в Telegram');
      telegramAPI.showAlert(
        'Приложение должно быть запущено через Telegram бота для отправки данных.'
      );
      return;
    }

    const payload = {
      action: 'open_course',
      taskId: 'cohort-analysis-sql',
      courseType: 'sql_basics',
      timestamp: new Date().toISOString()
    };

    console.log('📤 Отправляем запрос на открытие курса:', payload);

    try {
      telegramAPI.sendDataToBot(payload);
      telegramAPI.showAlert('Ссылка на курс появится в чате с ботом');
    } catch (error) {
      console.error('❌ Ошибка при отправке данных:', error);
      telegramAPI.showAlert('Произошла ошибка при отправке запроса. Попробуйте еще раз.');
    }
  };

  const handleSubmitHomework = async () => {
    if (!telegramAPI) {
      console.error('❌ TelegramAPI не инициализирован');
      alert('❌ Ошибка инициализации Telegram API');
      return;
    }

    if (!userAnswer.trim()) {
      await telegramAPI.showAlert('Пожалуйста, введите ваш ответ перед отправкой');
      return;
    }

    // Проверяем, запущено ли приложение в Telegram
    if (!telegramAPI.isInTelegram()) {
      console.error('❌ Приложение не запущено в Telegram');
      await telegramAPI.showAlert(
        'Приложение должно быть запущено через Telegram бота для отправки заданий.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        action: 'submit_homework',
        taskId: 'cohort-analysis-sql',
        userAnswer: userAnswer,
        timestamp: new Date().toISOString()
      };

      console.log('📤 Отправляем домашнее задание:', payload);

      telegramAPI.sendDataToBot(payload);
      await telegramAPI.showAlert('Задание отправлено на проверку! Результат появится в чате с ботом через несколько секунд.');

      // Пробуем также проверить через OpenAI (если доступно)
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
        console.log('⚠️ OpenAI проверка недоступна, используем только бот');
      }

    } catch (error) {
      console.error('❌ Error submitting homework:', error);
      await telegramAPI.showAlert('Произошла ошибка при отправке задания. Попробуйте еще раз.');
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
    navigate,
    // Добавляем отладочную информацию
    isInTelegram: telegramAPI?.isInTelegram() ?? false,
    debugInfo: telegramAPI?.getDebugInfo() ?? null
  };
};
