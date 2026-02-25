import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useAiAssistant } from '@/hooks/useAiAssistant';
import { useIsMobile } from '@/hooks/use-mobile';
import { renderFormattedText } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const AiAssistant = () => {
  const { messages, isOpen, setIsOpen, isStreaming, sendMessage, clearChat } = useAiAssistant();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMobile) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMobile]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput('');
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed z-50 rounded-full shadow-lg transition-all duration-300",
            "bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--secondary))]",
            "text-white hover:scale-105 active:scale-95",
            "w-14 h-14 flex items-center justify-center",
            isMobile ? "bottom-24 right-4" : "bottom-8 right-8"
          )}
          aria-label="AI-помощник"
        >
          <Bot size={26} />
        </button>
      )}

      {/* Chat Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={cn(
            "flex flex-col p-0 gap-0",
            isMobile ? "h-[75vh] rounded-t-2xl" : "w-[400px] sm:max-w-[400px]"
          )}
        >
          <SheetTitle className="sr-only">AI-помощник</SheetTitle>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--secondary))] flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <span className="font-semibold text-foreground">AI-помощник</span>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button variant="ghost" size="icon" onClick={clearChat} className="h-8 w-8">
                  <Trash2 size={16} />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-8 space-y-2">
                <Bot size={40} className="mx-auto opacity-40" />
                <p>Привет! Я AI-помощник hakku.ai</p>
                <p>Задай вопрос по учебным материалам</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.role === 'user'
                    ? "ml-auto bg-[hsl(var(--primary))] text-primary-foreground rounded-br-md"
                    : "mr-auto bg-muted text-foreground rounded-bl-md"
                )}
              >
                {renderFormattedText(msg.content)}
              </div>
            ))}
            {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="mr-auto bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
                <span className="animate-pulse">●●●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border px-3 py-3 bg-card">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Задайте вопрос..."
                rows={1}
                className={cn(
                  "flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm",
                  "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                  "max-h-24"
                )}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="h-10 w-10 rounded-xl shrink-0"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
