// src/lib/webapp-api.ts - Сервис для работы с серверным API

interface SubmitHomeworkParams {
  taskId: string;
  userAnswer: string;
}

interface AnswerWebAppQueryParams {
  queryId: string;
  result: string;
}

export class WebAppAPIService {
  private apiUrl: string;
  private initData: string;

  constructor(apiUrl: string = 'https://your-server.com/api') {
    this.apiUrl = apiUrl;
    this.initData = window.Telegram?.WebApp?.initData || '';
  }

  /**
   * Отправка домашнего задания через сервер
   */
  async submitHomework(params: SubmitHomeworkParams): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/submit-homework`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': this.initData
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting homework:', error);
      throw error;
    }
  }

  /**
   * Ответ на WebApp query (для inline buttons)
   */
  async answerWebAppQuery(params: AnswerWebAppQueryParams): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/answer-webapp-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': this.initData
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error answering webapp query:', error);
      throw error;
    }
  }

  /**
   * Проверка наличия query_id для inline mode
   */
  hasQueryId(): boolean {
    return !!window.Telegram?.WebApp?.initDataUnsafe?.query_id;
  }

  /**
   * Получение query_id
   */
  getQueryId(): string | null {
    return window.Telegram?.WebApp?.initDataUnsafe?.query_id || null;
  }

  /**
   * Получение информации о пользователе
   */
  getUserInfo() {
    return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
  }
}

// Экспортируем singleton instance
export const webAppAPI = new WebAppAPIService();

// Обновленный хук с использованием серверного API
export const useTaskDetailWithAPI = () => {
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

  const handleSubmitHomework = async () => {
    if (!telegramAPI) {
      console.error('❌ TelegramAPI не инициализирован');
      return;
    }

    if (!userAnswer.trim()) {
      await telegramAPI.showAlert('Пожалуйста, введите ваш ответ перед отправкой');
      return;
    }

    setIsSubmitting(true);

    try {
      // Проверяем, есть ли query_id для inline mode
      if (webAppAPI.hasQueryId()) {
        // Используем answerWebAppQuery через сервер
        const queryId = webAppAPI.getQueryId();
        const result = `📝 Домашнее задание отправлено!\n\nЗадание: Когортный анализ и SQL\n\nОтвет:\n${userAnswer.substring(0, 200)}...`;
        
        await webAppAPI.answerWebAppQuery({
          queryId: queryId!,
          result: result
        });
        
        await telegramAPI.showAlert('Задание отправлено! Проверьте чат с ботом.');
        
        // Закрываем WebApp
        setTimeout(() => {
          window.Telegram?.WebApp?.close();
        }, 1500);
        
      } else {
        // Используем серверный API для отправки
        const response = await webAppAPI.submitHomework({
          taskId: 'cohort-analysis-sql',
          userAnswer: userAnswer
        });
        
        if (response.success) {
          await telegramAPI.showAlert('Задание отправлено на проверку! Результат появится в чате с ботом.');
        }
      }

    } catch (error) {
      console.error('❌ Error submitting homework:', error);
      await telegramAPI.showAlert('Произошла ошибка при отправке задания.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    userAnswer,
    setUserAnswer,
    isSubmitting,
    checkResult,
    handleSubmitHomework,
  };
};
