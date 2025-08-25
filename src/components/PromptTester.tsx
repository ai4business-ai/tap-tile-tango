import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TestTube, Copy, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PromptTesterProps {
  taskContext: string;
  taskId: string;
  documentContent?: string;
  placeholder?: string;
}

export const PromptTester = ({ taskContext, taskId, documentContent, placeholder }: PromptTesterProps) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [error, setError] = useState('');

  // Load attempts from localStorage on component mount
  useEffect(() => {
    const storageKey = `prompt_attempts_${taskId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();
        
        // Check if 24 hours have passed
        if (now - data.timestamp > 24 * 60 * 60 * 1000) {
          // Reset attempts
          localStorage.removeItem(storageKey);
          setAttemptsRemaining(5);
        } else {
          setAttemptsRemaining(Math.max(0, 5 - data.count));
        }
      } catch {
        localStorage.removeItem(storageKey);
        setAttemptsRemaining(5);
      }
    }
  }, [taskId]);

  const updateAttempts = (remaining: number) => {
    const storageKey = `prompt_attempts_${taskId}`;
    const data = {
      count: 5 - remaining,
      timestamp: Date.now()
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
    setAttemptsRemaining(remaining);
  };

  const handleTestPrompt = async () => {
    if (!prompt.trim()) {
      setError('Введите промпт для тестирования');
      return;
    }

    if (attemptsRemaining <= 0) {
      setError('Исчерпаны все попытки на сегодня');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('prompt-tester', {
        body: {
          prompt,
          taskContext,
          taskId,
          documentContent: documentContent || undefined
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
        setResponse(data.response);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
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
            🧪 Тестирование промпта
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Попыток: {attemptsRemaining}/5
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Это окно предназначено только для тестирования промптов в рамках данного задания. 
            У вас есть 5 попыток в день.
            {documentContent && ' Выбранный документ автоматически передается в контексте.'}
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ваш промпт:</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholderText()}
            className="min-h-[100px]"
            maxLength={4000}
            disabled={isLoading || attemptsRemaining <= 0}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{prompt.length}/4000 символов</span>
          </div>
        </div>

        <Button
          onClick={handleTestPrompt}
          disabled={isLoading || !prompt.trim() || attemptsRemaining <= 0}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Тестирование...
            </>
          ) : (
            'Протестировать промпт'
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Ответ ИИ:</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(response)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Копировать
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg border">
              <div className="text-sm whitespace-pre-wrap">{response}</div>
            </div>
          </div>
        )}

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