import { useState } from 'react';


interface Message {
  role: 'user' | 'tutor';
  content: string;
}

export const useChatAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const validateMessage = (message: string): { isValid: boolean; error?: string } => {
    if (!message.trim()) {
      return { isValid: false, error: 'Сообщение не может быть пустым' };
    }
    
    if (message.length > 4000) {
      return { isValid: false, error: 'Сообщение слишком длинное. Максимум 4000 символов.' };
    }

    // Basic client-side pattern detection
    const suspiciousPatterns = [
      /ignore\s+previous\s+instructions?/i,
      /system\s*:\s*/i,
      /assistant\s*:\s*/i,
      /act\s+as\s+(?:a\s+)?(?:different|new)/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(message)) {
        return { isValid: false, error: 'Сообщение содержит недопустимый контент' };
      }
    }

    return { isValid: true };
  };

  const sendMessage = async (
    message: string, 
    taskContext: string, 
    assistantId?: string,
    documentId?: string
  ): Promise<string> => {
    setIsLoading(true);
    
    try {
      console.log('Sending message to chat assistant:', {
        messageLength: message.length,
        taskContext: taskContext.substring(0, 50) + '...',
        threadId,
        assistantId,
      });

      const response = await fetch('https://nhxrajtfxavkkzqyfrok.supabase.co/functions/v1/chat-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          taskContext,
          threadId,
          assistantId,
          documentId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP error from chat-assistant:', response.status, errorText);

        if (response.status === 401) {
          throw new Error('Необходима авторизация. Пожалуйста, войдите в систему.');
        }

        if (response.status === 429) {
          throw new Error('Превышен лимит запросов. Попробуйте позже.');
        }

        throw new Error(`Ошибка отправки сообщения: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      if (!data) {
        throw new Error('Не получен ответ от сервера');
      }

      console.log('Received response from chat assistant:', data);
      
      // Store thread ID for conversation continuity
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }
      
      return data.message || 'No response received';
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};