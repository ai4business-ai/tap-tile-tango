// src/components/debug/TelegramDebug.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TelegramAPI from '@/lib/telegram';

interface DebugInfo {
  isRealTelegram: boolean;
  platform: string;
  version: string;
  hasInitData: boolean;
  hasUser: boolean;
  colorScheme: string;
}

export const TelegramDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [telegramAPI, setTelegramAPI] = useState<TelegramAPI | null>(null);

  useEffect(() => {
    const tg = TelegramAPI.getInstance();
    setTelegramAPI(tg);
    setDebugInfo(tg.getDebugInfo());
  }, []);

  const testSendData = () => {
    if (telegramAPI) {
      telegramAPI.sendDataToBot({
        action: 'test',
        message: 'Тестовое сообщение',
        timestamp: new Date().toISOString()
      });
    }
  };

  const testAlert = async () => {
    if (telegramAPI) {
      await telegramAPI.showAlert('Тестовое уведомление');
    }
  };

  if (!debugInfo) {
    return <div>Загрузка отладочной информации...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🔍 Telegram API Debug
          <Badge variant={debugInfo.isRealTelegram ? 'default' : 'destructive'}>
            {debugInfo.isRealTelegram ? 'Real' : 'Mock'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Platform:</div>
            <div>{debugInfo.platform}</div>
            
            <div className="font-medium">Version:</div>
            <div>{debugInfo.version}</div>
            
            <div className="font-medium">Has InitData:</div>
            <div>
              <Badge variant={debugInfo.hasInitData ? 'default' : 'secondary'}>
                {debugInfo.hasInitData ? 'Yes' : 'No'}
              </Badge>
            </div>
            
            <div className="font-medium">Has User:</div>
            <div>
              <Badge variant={debugInfo.hasUser ? 'default' : 'secondary'}>
                {debugInfo.hasUser ? 'Yes' : 'No'}
              </Badge>
            </div>
            
            <div className="font-medium">Color Scheme:</div>
            <div>{debugInfo.colorScheme}</div>
          </div>

          <div className="pt-3 border-t space-y-2">
            <button 
              onClick={testSendData}
              className="w-full p-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              🧪 Тест отправки данных
            </button>
            
            <button 
              onClick={testAlert}
              className="w-full p-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              🔔 Тест уведомления
            </button>
          </div>

          {!debugInfo.isRealTelegram && (
            <div className="p-3 bg-yellow-100 border border-yellow-400 rounded text-sm">
              <strong>⚠️ Внимание:</strong> Приложение работает в режиме разработки. 
              Для полной функциональности откройте через Telegram бота.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramDebug;
