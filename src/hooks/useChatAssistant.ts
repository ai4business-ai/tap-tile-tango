import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    
    // Client-side validation
    const validation = validateMessage(message);
    if (!validation.isValid) {
      setIsLoading(false);
      throw new Error(validation.error);
    }

    try {
      console.log('Sending message to chat assistant:', { 
        messageLength: message.length, 
        taskContext: taskContext.substring(0, 50) + '...', 
        threadId, 
        assistantId 
      });
      
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          message,
          taskContext,
          threadId,
          assistantId,
          documentId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to send message: ${error.message}`);
      }

      if (!data) {
        throw new Error('No response data received');
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