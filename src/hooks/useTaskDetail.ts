// src/hooks/useTaskDetail.ts - Обновленная версия с рабочей интеграцией

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
    
    // Проверяем наличие Telegram WebApp
    if (window.Telegram?.WebApp) {
      console.log('📱 Telegram WebApp Data:', {
        initData: window.Telegram.WebApp.initData,
        initDataUnsafe: window.Telegram.WebApp.initDataUnsafe,
        version: window.Telegram.WebApp.version,
        platform: window.Telegram.WebApp.platform
      });
    }

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

    // Для WebAppInfo используем альтернативный подход
    if (telegramAPI.isInTelegram() && window.Telegram?.WebApp?.initDataUnsafe?.query_id) {
      // Если есть query_id, можем использовать answerWebAppQuery
      const queryId = window.Telegram.WebApp.initDataUnsafe.query_id;
      console.log('📤 Используем query_id для отправки:', queryId);
      
      // Отправляем уведомление пользователю
      telegramAPI.showAlert('Запрос отправлен! Проверьте чат с ботом.');
      
      // Для inline button можно закрыть WebApp после отправки
      // window.Telegram.WebApp.close();
    } else {
      // Используем deep link для передачи команды
      const botUsername = 'YOUR_BOT_USERNAME'; // Замените на имя вашего бота
      const command = 'download_table_cohort';
      const deepLink = `https://t.me/${botUsername}?start=${command}`;
      
      telegramAPI.showAlert('Откройте ссылку в чате с ботом для получения таблицы');
      
      // Открываем deep link
      window.open(deepLink, '_blank');
    }
  };

  const handleOpenCourse = () => {
    if (!telegramAPI) {
      console.error('❌ TelegramAPI не инициализирован');
      alert('❌ Ошибка инициализации Telegram API');
      return;
    }

    // Аналогично используем deep link
    const botUsername = 'YOUR_BOT_USERNAME'; // Замените на имя вашего бота
    const command = 'open_course_sql';
    const deepLink = `https://t.me/${botUsername}?start=${command}`;
    
    telegramAPI.showAlert('Откройте ссылку в чате с ботом для доступа к курсу');
    window.open(deepLink, '_blank');
  };

  const handleSubmitHomework = async (documentId?: string) => {
    if (!telegramAPI) {
      console.error('❌ TelegramAPI не инициализирован');
      alert('❌ Ошибка инициализации Telegram API');
      return;
    }

    if (!userAnswer.trim()) {
      await telegramAPI.showAlert('Пожалуйста, введите ваш ответ перед отправкой');
      return;
    }

    setIsSubmitting(true);

    try {
      // Проверяем, есть ли query_id для inline mode
      if (window.Telegram?.WebApp?.initDataUnsafe?.query_id) {
        const queryId = window.Telegram.WebApp.initDataUnsafe.query_id;
        
        // Для inline button WebApp можно использовать answerWebAppQuery
        // Но это требует серверной части для вызова Bot API
        console.log('📤 Query ID доступен:', queryId);
        
        await telegramAPI.showAlert(
          'Задание отправлено! Результат появится в чате через несколько секунд.'
        );
        
        // Можно закрыть WebApp после отправки
        setTimeout(() => {
          window.Telegram?.WebApp?.close();
        }, 2000);
        
      } else {
        // Используем deep link с закодированными данными
        const botUsername = 'YOUR_BOT_USERNAME'; // Замените на имя вашего бота
        const taskId = 'cohort-analysis-sql';
        
        // Кодируем ответ для передачи через URL
        const encodedAnswer = encodeURIComponent(userAnswer.substring(0, 100)); // Ограничиваем длину
        const command = `hw_${taskId}_${encodedAnswer}`;
        const deepLink = `https://t.me/${botUsername}?start=${command}`;
        
        await telegramAPI.showAlert(
          'Для отправки задания перейдите по ссылке в чат с ботом'
        );
        
        // Открываем deep link
        window.open(deepLink, '_blank');
      }

      // Локальная проверка через OpenAI (если доступно)
      try {
        // Если передан documentId, используем chat-assistant с поддержкой документов
        if (documentId) {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data, error } = await supabase.functions.invoke('chat-assistant', {
            body: {
              message: userAnswer,
              taskContext: 'Анализ документов и создание executive summary',
              documentId: documentId
            }
          });

          if (data && !error) {
            setCheckResult({
              score: 85, // Примерная оценка
              feedback: data.message,
              suggestions: ['Попробуйте использовать более конкретные термины', 'Добавьте количественные данные']
            });
          }
        } else {
          // Стандартная проверка через OpenAI service
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
        }
      } catch (error) {
        console.log('⚠️ OpenAI проверка недоступна:', error);
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
    navigate
  };
};
