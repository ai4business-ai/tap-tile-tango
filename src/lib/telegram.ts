// src/lib/telegram.ts - Исправленная версия

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
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (buttonId: string) => void): void;
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

export class TelegramAPI {
  private static instance: TelegramAPI;
  private webApp: TelegramWebApp;
  private isRealTelegram: boolean;

  private constructor() {
    // Проверяем, действительно ли мы в Telegram
    this.isRealTelegram = this.checkIfRealTelegram();
    
    if (this.isRealTelegram) {
      this.webApp = window.Telegram.WebApp;
      this.initializeWebApp();
      console.log('✅ Telegram WebApp инициализирован');
    } else {
      console.warn('⚠️ Telegram WebApp не доступен. Работаем в режиме разработки.');
      this.webApp = this.createMockWebApp();
    }
  }

  static getInstance(): TelegramAPI {
    if (!TelegramAPI.instance) {
      TelegramAPI.instance = new TelegramAPI();
    }
    return TelegramAPI.instance;
  }

  private checkIfRealTelegram(): boolean {
    // Более строгая проверка на реальный Telegram
    return (
      typeof window !== 'undefined' &&
      window.Telegram?.WebApp &&
      window.Telegram.WebApp.platform !== undefined &&
      window.Telegram.WebApp.version !== undefined &&
      // Дополнительная проверка: в реальном Telegram есть initData
      (window.Telegram.WebApp.initData?.length > 0 || 
       // Или хотя бы есть пользователь в initDataUnsafe
       window.Telegram.WebApp.initDataUnsafe?.user)
    );
  }

  private initializeWebApp(): void {
    this.webApp.ready();
    this.webApp.expand();
    
    // Настройка темы
    if (this.webApp.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    
    // Отключение подтверждения закрытия
    this.webApp.isClosingConfirmationEnabled = false;
  }

  private createMockWebApp(): TelegramWebApp {
    return {
      initData: '',
      initDataUnsafe: {},
      version: '6.0',
      platform: 'web',
      colorScheme: 'light',
      themeParams: {},
      isExpanded: true,
      viewportHeight: window.innerHeight,
      viewportStableHeight: window.innerHeight,
      isClosingConfirmationEnabled: false,
      isVerticalSwipesEnabled: true,
      headerColor: '#ffffff',
      backgroundColor: '#ffffff',
      BackButton: {
        isVisible: false,
        show: () => console.log('🔄 BackButton.show()'),
        hide: () => console.log('🔄 BackButton.hide()'),
        onClick: (callback: () => void) => console.log('🔄 BackButton.onClick()'),
        offClick: (callback: () => void) => console.log('🔄 BackButton.offClick()'),
      },
      MainButton: {
        text: '',
        color: '#2481cc',
        textColor: '#ffffff',
        isVisible: false,
        isActive: true,
        setText: (text: string) => console.log('🔄 MainButton.setText():', text),
        onClick: (callback: () => void) => console.log('🔄 MainButton.onClick()'),
        offClick: (callback: () => void) => console.log('🔄 MainButton.offClick()'),
        show: () => console.log('🔄 MainButton.show()'),
        hide: () => console.log('🔄 MainButton.hide()'),
        enable: () => console.log('🔄 MainButton.enable()'),
        disable: () => console.log('🔄 MainButton.disable()'),
        showProgress: () => console.log('🔄 MainButton.showProgress()'),
        hideProgress: () => console.log('🔄 MainButton.hideProgress()'),
      },
      ready: () => console.log('🔄 WebApp.ready()'),
      expand: () => console.log('🔄 WebApp.expand()'),
      close: () => console.log('🔄 WebApp.close()'),
      sendData: (data: string) => console.log('🔄 WebApp.sendData() [MOCK]:', data),
      showPopup: (params, callback) => {
        console.log('🔄 WebApp.showPopup() [MOCK]:', params);
        if (callback) callback('ok');
      },
      showAlert: (message, callback) => {
        console.log('🔄 WebApp.showAlert() [MOCK]:', message);
        alert(`[MOCK TELEGRAM] ${message}`);
        if (callback) callback();
      },
      showConfirm: (message, callback) => {
        console.log('🔄 WebApp.showConfirm() [MOCK]:', message);
        const result = confirm(`[MOCK TELEGRAM] ${message}`);
        if (callback) callback(result);
      },
    };
  }

  getWebApp(): TelegramWebApp {
    return this.webApp;
  }

  // Методы для работы с главной кнопкой
  showMainButton(text: string, callback: () => void): void {
    const mainButton = this.webApp.MainButton;
    mainButton.setText(text);
    mainButton.onClick(callback);
    mainButton.show();
  }

  hideMainButton(): void {
    this.webApp.MainButton.hide();
  }

  // Методы для работы с кнопкой "Назад"
  showBackButton(callback: () => void): void {
    const backButton = this.webApp.BackButton;
    backButton.onClick(callback);
    backButton.show();
  }

  hideBackButton(): void {
    this.webApp.BackButton.hide();
  }

  // Отправка данных в бот - ИСПРАВЛЕНО
  sendDataToBot(data: any): void {
    const jsonData = JSON.stringify(data);
    
    if (!this.isRealTelegram) {
      console.error('❌ ОШИБКА: Попытка отправить данные боту в режиме разработки!');
      console.log('📤 Данные которые должны были отправиться:', data);
      alert(`❌ Не в Telegram!\n\nДанные: ${JSON.stringify(data, null, 2)}\n\nПожалуйста, откройте приложение через Telegram бота.`);
      return;
    }

    console.log('📤 Отправляем данные боту:', data);
    this.webApp.sendData(jsonData);
  }

  // Показ всплывающих окон
  showAlert(message: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isRealTelegram) {
        alert(`[РЕЖИМ РАЗРАБОТКИ] ${message}`);
        resolve();
        return;
      }
      this.webApp.showAlert(message, () => resolve());
    });
  }

  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isRealTelegram) {
        const result = confirm(`[РЕЖИМ РАЗРАБОТКИ] ${message}`);
        resolve(result);
        return;
      }
      this.webApp.showConfirm(message, (confirmed) => resolve(confirmed));
    });
  }

  // Проверка, запущено ли приложение в Telegram
  isInTelegram(): boolean {
    return this.isRealTelegram;
  }

  // Получение данных пользователя
  getUserData() {
    return this.webApp.initDataUnsafe.user || null;
  }

  // Закрытие мини-приложения
  close(): void {
    this.webApp.close();
  }

  // Новый метод для отладки
  getDebugInfo() {
    return {
      isRealTelegram: this.isRealTelegram,
      platform: this.webApp.platform,
      version: this.webApp.version,
      hasInitData: !!this.webApp.initData,
      hasUser: !!this.webApp.initDataUnsafe?.user,
      colorScheme: this.webApp.colorScheme
    };
  }
}

export default TelegramAPI;
