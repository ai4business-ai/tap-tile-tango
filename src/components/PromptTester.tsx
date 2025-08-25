import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, TestTube, Copy, Info, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PromptTesterProps {
  taskContext: string;
  taskId: string;
  documentId?: string | null;
  placeholder?: string;
}

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export const PromptTester = ({ taskContext, taskId, documentId, placeholder }: PromptTesterProps) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load attempts and chat history from localStorage on component mount
  useEffect(() => {
    const storageKey = `prompt_attempts_${taskId}`;
    const chatKey = `prompt_chat_${taskId}`;
    
    // Load attempts
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();
        
        if (now - data.timestamp > 24 * 60 * 60 * 1000) {
          localStorage.removeItem(storageKey);
          localStorage.removeItem(chatKey);
          setAttemptsRemaining(5);
          setMessages([]);
        } else {
          setAttemptsRemaining(Math.max(0, 5 - data.count));
        }
      } catch {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(chatKey);
        setAttemptsRemaining(5);
      }
    }

    // Load chat history
    const chatHistory = localStorage.getItem(chatKey);
    if (chatHistory) {
      try {
        const history = JSON.parse(chatHistory);
        setMessages(history);
      } catch {
        localStorage.removeItem(chatKey);
      }
    }
  }, [taskId]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateAttempts = (remaining: number) => {
    const storageKey = `prompt_attempts_${taskId}`;
    const data = {
      count: 5 - remaining,
      timestamp: Date.now()
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
    setAttemptsRemaining(remaining);
  };

  const saveChatHistory = (newMessages: ChatMessage[]) => {
    const chatKey = `prompt_chat_${taskId}`;
    localStorage.setItem(chatKey, JSON.stringify(newMessages));
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      setError('Введите промпт для тестирования');
      return;
    }

    if (attemptsRemaining <= 0) {
      setError('Исчерпаны все попытки на сегодня');
      return;
    }

    const userMessage: ChatMessage = {
      type: 'user',
      content: prompt.trim(),
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveChatHistory(newMessages);

    setIsLoading(true);
    setError('');
    setPrompt('');

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('prompt-tester', {
        body: {
          prompt: userMessage.content,
          taskContext,
          taskId,
          documentId: documentId || undefined
        }
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (data.error) {
        setError(data.error);
        if (data.remaining !== undefined) {
          updateAttempts(data.remaining);
        }
      } else {
        const aiMessage: ChatMessage = {
          type: 'ai',
          content: data.response,
          timestamp: Date.now()
        };
        
        const updatedMessages = [...newMessages, aiMessage];
        setMessages(updatedMessages);
        saveChatHistory(updatedMessages);
        updateAttempts(data.remaining);
        toast.success('Промпт протестирован успешно');
      }
    } catch (err) {
      console.error('Error testing prompt:', err);
      setError('Ошибка при тестировании промпта');
    } finally {
      setIsLoading(false);
    }
  };

  const copyLastPrompt = () => {
    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    if (lastUserMessage) {
      navigator.clipboard.writeText(lastUserMessage.content);
      toast.success('Промпт скопирован в буфер обмена');
    } else {
      toast.error('Нет промптов для копирования');
    }
  };

  const clearChat = () => {
    setMessages([]);
    const chatKey = `prompt_chat_${taskId}`;
    localStorage.removeItem(chatKey);
    toast.success('История чата очищена');
  };

  const getPlaceholderText = () => {
    if (placeholder) return placeholder;
    
    const placeholders = {
      'document-analysis': 'Проанализируй этот документ и создай executive summary...',
      'deep-research': 'Помоги сформулировать исследовательские вопросы по теме...',
      'specialized-gpt': 'Создай инструкцию для GPT-ассистента, который...'
    };
    
    return placeholders[taskContext as keyof typeof placeholders] || 'Введите ваш промпт...';
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TestTube className="h-5 w-5 text-primary" />
            Тестирование промпта
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">О тестировании промптов</h4>
                  <p className="text-sm text-muted-foreground">
                    Это окно предназначено только для тестирования промптов в рамках данного задания. 
                    У вас есть 5 попыток в день.
                    {documentId && ' Выбранный документ автоматически передается в контексте.'}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Попыток: {attemptsRemaining}/5
            </span>
            {messages.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={clearChat}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Очистить историю чата</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="max-h-[50vh] overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/30">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[90%] p-3 rounded-lg text-sm break-words overflow-wrap-break-word ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-secondary/50 text-secondary-foreground border'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  <div className={`text-xs mt-1 opacity-70 ${
                    message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 text-secondary-foreground border p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    ИИ печатает...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholderText()}
            className="min-h-[100px]"
            maxLength={4000}
            disabled={isLoading || attemptsRemaining <= 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSendPrompt();
              }
            }}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {prompt.length}/4000 символов • Ctrl+Enter для отправки
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSendPrompt}
            disabled={isLoading || !prompt.trim() || attemptsRemaining <= 0}
            className="w-full sm:flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Отправить
              </>
            )}
          </Button>
          
          {messages.some(m => m.type === 'user') && (
            <Button
              variant="outline"
              onClick={copyLastPrompt}
              disabled={isLoading}
              className="w-full sm:w-auto whitespace-normal sm:whitespace-nowrap"
            >
              <Copy className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="break-words">Копировать промпт</span>
            </Button>
          )}
        </div>

        {/* Attempt Warnings */}
        {attemptsRemaining <= 1 && attemptsRemaining > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              У вас осталась последняя попытка на сегодня!
            </AlertDescription>
          </Alert>
        )}

        {attemptsRemaining <= 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              Исчерпаны все попытки на сегодня. Попробуйте завтра.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};