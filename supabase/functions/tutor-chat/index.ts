import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TASK_DESCRIPTIONS: Record<string, string> = {
  'document-analysis': 'Анализ документов: составление executive summary, выделение ключевых тезисов и структурирование информации из документа.',
  'deep-research': 'Глубокое исследование: формулировка исследовательских вопросов, поиск и анализ данных, систематизация найденной информации.',
  'specialized-gpt': 'Создание специализированного GPT-ассистента: написание системной инструкции (system prompt) для кастомного AI-помощника.',
  'client-response': 'Ответ клиенту: составление профессионального, вежливого и структурированного письма клиенту.',
  'meeting-agenda': 'Повестка встречи: подготовка структурированной повестки (agenda) и follow-up письма по итогам встречи.',
  'feedback-colleagues': 'Обратная связь коллегам: составление конструктивного, доброжелательного и полезного фидбека.',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, taskContext, history } = await req.json();

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'Сообщение не может быть пустым' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (message.length > 4000) {
      return new Response(JSON.stringify({ error: 'Сообщение слишком длинное (максимум 4000 символов)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(JSON.stringify({ error: 'Сервис временно недоступен' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const taskDescription = TASK_DESCRIPTIONS[taskContext] || `Задание: ${taskContext}`;

    const systemPrompt = `Ты — опытный тьютор по промпт-инжинирингу. Ты помогаешь пользователю улучшить его промпт, используя метод Сократа.

КОНТЕКСТ ЗАДАНИЯ: ${taskDescription}

ТВОИ ПРАВИЛА:
1. **Метод Сократа**: Не давай готовых промптов! Задавай наводящие вопросы, чтобы пользователь сам пришел к улучшению.
2. **Конкретная критика**: Указывай на конкретные слабые места промпта. Например: "Я заметил, что в вашем промпте нет указания роли для AI. Как думаете, что изменится, если вы добавите роль?"
3. **Позитивный тон**: Сначала отмечай, что хорошо в промпте, потом предлагай улучшения.
4. **Направляющие вопросы**: Используй вопросы типа:
   - "Как думаешь, что будет, если добавить...?"
   - "Что, если попробовать указать формат ответа?"
   - "Какую роль ты бы хотел задать AI в этом случае?"
   - "Что произойдет, если AI не поймет контекст? Как это предотвратить?"
5. **Оценка структуры**: Оценивай промпт по критериям:
   - Четкость цели/задачи
   - Указание роли для AI
   - Наличие контекста
   - Структурированность
   - Формат ожидаемого результата
   - Ограничения и тон
6. **Краткость**: Отвечай конкретно и по делу, не растекайся. 3-5 предложений на вопрос.
7. **Русский язык**: Всегда отвечай на русском.
8. Если пользователь задает вопрос НЕ по теме задания — вежливо верни к теме.

ФОРМАТ ОТВЕТА: Используй markdown для форматирования (жирный текст, списки).`;

    // Build messages array with history
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        messages.push({
          role: msg.role === 'tutor' ? 'assistant' : 'user',
          content: msg.content,
        });
      }
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Слишком много запросов. Подождите немного.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'Сервис временно недоступен.' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Ошибка AI сервиса' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const tutorMessage = data.choices?.[0]?.message?.content || 'Не удалось получить ответ.';

    return new Response(JSON.stringify({ message: tutorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in tutor-chat function:', error);
    return new Response(JSON.stringify({ error: 'Внутренняя ошибка сервера' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});