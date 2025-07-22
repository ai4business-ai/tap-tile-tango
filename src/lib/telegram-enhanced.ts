// src/lib/telegram-enhanced.ts - Улучшенный класс для работы с Telegram WebApp

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: any;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: any;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
  };
  ready(): void;
  expand(): void;
  close(): void;
  sendData(data: string): void;
  showPopup(params: any, callback?: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export class TelegramAPIEnhanced {
  private static instance: TelegramAPIEnhanced;
  private webApp: TelegramWebApp | null;
  private isReady: boolean = false;

  private constructor() {
    this.webApp = this.initializeWebApp();
  }

  static getInstance(): TelegramAPIEnhanced {
    if (!TelegramAPIEnhanced.instance) {
      TelegramAPIEnhanced.instance = new TelegramAPIEnhanced();
    }
    return TelegramAPIEnhanced.instance;
  }

  private initializeWebApp(): TelegramWebApp | null {
    if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
      console.warn('⚠️ Telegram WebApp недоступен');
      return null;
    }

    const webApp = window.Telegram.WebApp;
    
    // Инициализация WebApp
    try {
      webApp.ready();
      webApp.expand();
      this.isReady = true;
      
      console.log('✅ Telegram WebApp инициализирован:', {
        platform: webApp.platform,
        version: webApp.version,
        canSendData: typeof webApp.sendData === 'function'
      });
      
      // Настройка темы
      if (webApp.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      
      // Отключаем подтверждение закрытия
      webApp.isClosingConfirmationEnabled = false;
      
    } catch (error) {
      console.error('❌ Ошибка инициализации WebApp:', error);
    }

    return webApp;
  }

  // Проверка, запущено ли приложение в Telegram
  isInTelegram(): boolean {
    return !!this.webApp && !!this.webApp.initData;
  }

  // Проверка, можно ли использовать sendData
  canSendData(): boolean {
    return this.isInTelegram() && typeof this.webApp?.sendData === 'function';
  }

  // Отправка данных боту через sendData
  async sendDataToBot(data: any): Promise<boolean> {
    if (!this.canSendData()) {
      console.error('❌ sendData недоступен. Приложение должно быть открыто через KeyboardButton');
      await this.showAlert(
        'Для отправки данных откройте приложение через кнопку "Открыть тренажер" в чате с ботом'
      );
      return false;
    }

    try {
      const jsonData = JSON.stringify(data);
      console.log('📤 Отправляем данные боту:', data);
      
      // Отправляем данные
      this.webApp!.sendData(jsonData);
      
      console.log('✅ Данные успешно отправлены');
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка отправки данных:', error);
      await this.showAlert('Произошла ошибка при отправке данных');
      return false;
    }
  }

  // Показ уведомления
  async showAlert(message: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.webApp?.showAlert) {
        this.webApp.showAlert(message, () => resolve());
      } else {
        alert(message);
        resolve();
      }
    });
  }

  // Показ подтверждения
  async showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.webApp?.showConfirm) {
        this.webApp.showConfirm(message, (confirmed) => resolve(confirmed));
      } else {
        resolve(confirm(message));
      }
    });
  }

  // Работа с кнопкой "Назад"
  showBackButton(callback: () => void): void {
    if (this.webApp?.BackButton) {
      this.webApp.BackButton.onClick(callback);
      this.webApp.BackButton.show();
    }
  }

  hideBackButton(): void {
    if (this.webApp?.BackButton) {
      this.webApp.BackButton.hide();
    }
  }

  // Работа с главной кнопкой
  showMainButton(text: string, callback: () => void): void {
    if (this.webApp?.MainButton) {
      this.webApp.MainButton.setText(text);
      this.webApp.MainButton.onClick(callback);
      this.webApp.MainButton.show();
    }
  }

  hideMainButton(): void {
    if (this.webApp?.MainButton) {
      this.webApp.MainButton.hide();
    }
  }

  // Получение информации для отладки
  getDebugInfo() {
    return {
      isInTelegram: this.isInTelegram(),
      canSendData: this.canSendData(),
      platform: this.webApp?.platform || 'unknown',
      version: this.webApp?.version || 'unknown',
      hasInitData: !!this.webApp?.initData,
      initDataLength: this.webApp?.initData?.length || 0,
      isReady: this.isReady
    };
  }
}

// src/hooks/useTaskDetailFixed.ts - Исправленный хук для работы с заданиями

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TelegramAPIEnhanced } from '@/lib/telegram-enhanced';

interface CheckResult {
  score: number;
  feedback: string;
  suggestions?: string[];
}

export const useTaskDetailFixed = () => {
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [telegramAPI, setTelegramAPI] = useState<TelegramAPIEnhanced | null>(null);

  useEffect(() => {
    const tg = TelegramAPIEnhanced.getInstance();
    setTelegramAPI(tg);

    // Настройка кнопки "Назад"
    tg.showBackButton(() => {
      navigate('/tasks/data-analysis');
    });

    // Логируем информацию для отладки
    console.log('📱 WebApp Debug Info:', tg.getDebugInfo());

    return () => {
      tg.hideBackButton();
      tg.hideMainButton();
    };
  }, [navigate]);

  const handleDownloadTable = async () => {
    if (!telegramAPI) return;

    const payload = {
      action: 'download_table',
      taskId: 'cohort-analysis-sql',
      timestamp: new Date().toISOString()
    };

    const success = await telegramAPI.sendDataToBot(payload);
    
    if (success) {
      await telegramAPI.showAlert('Кнопка для скачивания таблицы появится в чате с ботом');
    }
  };

  const handleOpenCourse = async () => {
    if (!telegramAPI) return;

    const payload = {
      action: 'open_course',
      taskId: 'cohort-analysis-sql',
      timestamp: new Date().toISOString()
    };

    const success = await telegramAPI.sendDataToBot(payload);
    
    if (success) {
      await telegramAPI.showAlert('Ссылка на курс появится в чате с ботом');
    }
  };

  const handleSubmitHomework = async () => {
    if (!telegramAPI) return;

    if (!userAnswer.trim()) {
      await telegramAPI.showAlert('Пожалуйста, введите ваш ответ перед отправкой');
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

      const success = await telegramAPI.sendDataToBot(payload);
      
      if (success) {
        await telegramAPI.showAlert(
          'Задание отправлено на проверку! Результат появится в чате с ботом через несколько секунд.'
        );
        
        // Очищаем форму после успешной отправки
        setUserAnswer('');
      }

    } catch (error) {
      console.error('❌ Ошибка отправки:', error);
      await telegramAPI.showAlert('Произошла ошибка при отправке задания');
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
    telegramAPI
  };
};
