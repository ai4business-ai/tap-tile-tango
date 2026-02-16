import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { renderFormattedText } from '@/lib/utils';
import { useUserAssignments } from '@/hooks/useUserAssignments';
import { useAuth } from '@/hooks/useAuth';

interface TutorChatMessage {
  role: 'user' | 'tutor';
  content: string;
  timestamp: number;
}

interface TutorChatProps {
  taskContext: string;
  taskId: string;
  skillSlug: string;
  placeholder?: string;
  label?: string;
}

export const TutorChat = ({
  taskContext,
  taskId,
  skillSlug,
  placeholder = "Вставьте ваш промпт для оценки тьютором...",
  label = "Ваш промпт для ИИ:",
}: TutorChatProps) => {
  const { user } = useAuth();
  const { submitAssignment, updateSubmissionStatus, getAssignmentByTaskId } = useUserAssignments(user?.id, skillSlug);
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [messages, setMessages] = useState<TutorChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendToTutor = async (message: string, history: TutorChatMessage[]): Promise<string> => {
    const response = await fetch('https://nhxrajtfxavkkzqyfrok.supabase.co/functions/v1/tutor-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        taskContext,
        history: history.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка: ${response.status}`);
    }

    const data = await response.json();
    return data.message;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMsg: TutorChatMessage = {
      role: 'user',
      content: currentMessage.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setCurrentMessage('');
    setIsLoading(true);

    // Save first message as submission
    if (messages.length === 0) {
      const assignment = getAssignmentByTaskId(taskId);
      if (assignment && user) {
        await submitAssignment(assignment.id, userMsg.content);
      }
    }

    try {
      const tutorResponse = await sendToTutor(userMsg.content, messages);
      const tutorMsg: TutorChatMessage = {
        role: 'tutor',
        content: tutorResponse,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, tutorMsg]);
    } catch (error) {
      const errorMsg: TutorChatMessage = {
        role: 'tutor',
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
      toast.error(error instanceof Error ? error.message : 'Ошибка при отправке');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    const assignment = getAssignmentByTaskId(taskId);
    if (assignment && user) {
      await updateSubmissionStatus(assignment.id, 'completed', {
        chatHistory: messages.map(m => ({ role: m.role, content: m.content })),
      });
    }
    setIsCompleted(true);
    toast.success('Задание засчитано! 🎉');
  };

  const formatParagraphs = (content: string): string[] => {
    if (!content) return [content];
    const paragraphs = content
      .split(/\n\n+|\. (?=[А-ЯA-Z])/g)
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    if (paragraphs.length === 1 && content.length > 200) {
      const sentences = content.split(/\. (?=[а-яё])/gi);
      const chunks: string[] = [];
      let currentChunk = '';
      sentences.forEach(sentence => {
        if (currentChunk.length + sentence.length > 150 && currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += (currentChunk ? '. ' : '') + sentence;
        }
      });
      if (currentChunk) chunks.push(currentChunk.trim());
      return chunks.length > 1 ? chunks : paragraphs;
    }
    return paragraphs;
  };

  return (
    <Card className="p-6 relative mb-6">
      {/* Blur overlay before unlock */}
      {!isUnlocked && (
        <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <Button
            onClick={() => setIsUnlocked(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg font-medium shadow-lg"
          >
            Сдать задание
          </Button>
        </div>
      )}

      <div className={!isUnlocked ? "filter blur-sm pointer-events-none" : ""}>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          Чат с тьютором
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          Вставьте ваш промпт — тьютор оценит его и поможет улучшить с помощью наводящих вопросов.
        </p>

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="max-h-[50vh] overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/30 mb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'tutor' && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-card border border-border'
                }`}>
                  {msg.role === 'tutor' ? (
                    <div className="space-y-3">
                      {formatParagraphs(msg.content).map((paragraph, pIdx) => (
                        <p key={pIdx} className="text-sm text-card-foreground leading-relaxed">
                          {renderFormattedText(paragraph)}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <div className={`text-xs mt-1 opacity-70 ${
                    msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 text-secondary-foreground border p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Тьютор печатает...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground block">{label}</label>
          <div className="flex gap-2">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder={placeholder}
              className="min-h-[80px]"
              maxLength={4000}
              disabled={isLoading || isCompleted}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading || isCompleted}
              size="icon"
              className="h-[80px] w-12"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            {currentMessage.length}/4000 символов • Ctrl+Enter для отправки
          </span>
        </div>

        {/* Complete Task Button */}
        {messages.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            {!isCompleted ? (
              <Button
                onClick={handleCompleteTask}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-medium"
                disabled={isLoading}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Засчитать задание
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-3 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                Задание засчитано!
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};