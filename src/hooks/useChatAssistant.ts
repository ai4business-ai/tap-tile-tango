import { useState } from 'react';

interface Message {
  role: 'user' | 'tutor';
  content: string;
}

export const useChatAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const sendMessage = async (message: string, taskContext: string): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await fetch('/functions/v1/chat-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          taskContext,
          threadId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Store thread ID for conversation continuity
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }
      
      return data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};