import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'tutor';
  content: string;
}

export const useChatAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const sendMessage = async (message: string, taskContext: string, assistantId?: string): Promise<string> => {
    setIsLoading(true);
    try {
      console.log('Sending message to chat assistant:', { message, taskContext, threadId, assistantId });
      
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          message,
          taskContext,
          threadId,
          assistantId
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