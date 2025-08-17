import { useState } from 'react';

interface Message {
  role: 'user' | 'tutor';
  content: string;
}

export const useChatAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);

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
          taskContext
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
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