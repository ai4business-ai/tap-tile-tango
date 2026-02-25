import { useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface PageContext {
  page: string;
  courseTitle?: string;
  lessonTitle?: string;
  lessonContent?: string;
  description?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function buildContext(pathname: string): PageContext {
  if (pathname.includes('/lesson/')) {
    return { page: 'Урок курса', description: 'Пользователь на странице урока' };
  }
  if (pathname.startsWith('/course/')) {
    return { page: 'Страница курса', description: 'Пользователь просматривает программу курса' };
  }
  if (pathname === '/my-progress') {
    return { page: 'Мой прогресс', description: 'Пользователь просматривает свой прогресс и карту компетенций' };
  }
  if (pathname === '/catalog') {
    return { page: 'Каталог курсов', description: 'Пользователь выбирает курс' };
  }
  if (pathname.startsWith('/task')) {
    return { page: 'Задание', description: 'Пользователь выполняет практическое задание' };
  }
  if (pathname === '/my-courses') {
    return { page: 'Мои курсы', description: 'Пользователь на странице своих курсов' };
  }
  return { page: 'Главная', description: 'Главная страница LMS hakku.ai' };
}

export function useAiAssistant() {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const location = useLocation();
  const abortRef = useRef<AbortController | null>(null);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: AiMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsStreaming(true);

    const context = buildContext(location.pathname);
    const controller = new AbortController();
    abortRef.current = controller;

    let assistantSoFar = '';

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/learning-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Ошибка сервера' }));
        throw new Error(err.error || `Ошибка ${resp.status}`);
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              const snapshot = assistantSoFar;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: snapshot } : m);
                }
                return [...prev, { role: 'assistant', content: snapshot }];
              });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      console.error('AI assistant error:', e);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ ${e.message || 'Произошла ошибка. Попробуйте позже.'}` },
      ]);
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, location.pathname]);

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { messages, isOpen, setIsOpen, isStreaming, sendMessage, clearChat, cancelStream };
}
