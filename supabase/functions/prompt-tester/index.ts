import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const DAILY_LIMIT = 5;

const TASK_DESCRIPTIONS: Record<string, string> = {
  'document-analysis': 'Анализ документов: составление executive summary, выделение ключевых тезисов и структурирование информации из документа.',
  'deep-research': 'Глубокое исследование: формулировка исследовательских вопросов, поиск и анализ данных, систематизация найденной информации.',
  'specialized-gpt': 'Создание специализированного GPT-ассистента: написание системной инструкции (system prompt) для кастомного AI-помощника.',
  'client-response': 'Ответ клиенту: составление профессионального, вежливого и структурированного письма клиенту.',
  'meeting-agenda': 'Повестка встречи: подготовка структурированной повестки (agenda) и follow-up письма по итогам встречи.',
  'feedback-colleagues': 'Обратная связь коллегам: составление конструктивного, доброжелательного и полезного фидбека.',
};

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

async function getCurrentCount(deviceId: string, taskId: string, environment: string): Promise<number> {
  const today = getToday();
  const { data, error } = await supabase
    .from('prompt_attempts')
    .select('count')
    .eq('device_id', deviceId)
    .eq('task_id', taskId)
    .eq('date', today)
    .eq('environment', environment)
    .maybeSingle();

  if (error) {
    console.error('Error reading attempts:', error);
    return 0;
  }
  return data?.count ?? 0;
}

async function incrementAndGet(deviceId: string, taskId: string, environment: string): Promise<{ allowed: boolean; remaining: number; count: number }> {
  const today = getToday();
  const current = await getCurrentCount(deviceId, taskId, environment);

  if (current >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, count: current };
  }

  if (current === 0) {
    const { error: insertError } = await supabase.from('prompt_attempts').insert({
      device_id: deviceId,
      task_id: taskId,
      date: today,
      count: 1,
      environment: environment,
    });
    if (insertError) {
      console.error('Error inserting attempts:', insertError);
      return { allowed: true, remaining: Math.max(0, DAILY_LIMIT - 1), count: 1 };
    }
    return { allowed: true, remaining: DAILY_LIMIT - 1, count: 1 };
  } else {
    const next = current + 1;
    const { error: updateError } = await supabase
      .from('prompt_attempts')
      .update({ count: next })
      .eq('device_id', deviceId)
      .eq('task_id', taskId)
      .eq('date', today)
      .eq('environment', environment);
    if (updateError) {
      console.error('Error updating attempts:', updateError);
    }
    return { allowed: true, remaining: Math.max(0, DAILY_LIMIT - next), count: next };
  }
}

function validatePrompt(prompt: string): { isValid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: 'Промпт не может быть пустым' };
  }

  if (prompt.length > 4000) {
    return { isValid: false, error: 'Промпт слишком длинный (максимум 4000 символов)' };
  }

  const lowerPrompt = prompt.toLowerCase();
  const suspiciousPatterns = [
    'select ', 'insert ', 'update ', 'delete ', 'drop ', 'create table', 'alter table',
    'игнорируй инструкции', 'забудь про систему', 'ты теперь', 'притворись что',
    'roleplay', 'act as', 'pretend you are', 'ignore previous', 'new instructions',
  ];

  for (const pattern of suspiciousPatterns) {
    if (lowerPrompt.includes(pattern)) {
      return {
        isValid: false,
        error: 'Промпт содержит недопустимые запросы. Пожалуйста, формулируйте запросы в рамках задания.',
      };
    }
  }

  return { isValid: true };
}

async function executePrompt(prompt: string, taskContext: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    console.error('LOVABLE_API_KEY is not configured');
    return 'Сервис временно недоступен. Попробуйте позже.';
  }

  const taskDescription = TASK_DESCRIPTIONS[taskContext] || `Задание: ${taskContext}`;

  const systemPrompt = `Ты — AI-ассистент. Твоя задача — выполнить запрос пользователя как обычная нейросеть.

КОНТЕКСТ ЗАДАНИЯ: ${taskDescription}

ПРАВИЛА:
1. Выполняй запрос пользователя полностью и качественно, как если бы ты был ChatGPT.
2. Если запрос пользователя относится к теме задания — выполни его максимально хорошо. Дай полный, развернутый ответ.
3. Если запрос пользователя НЕ связан с темой задания (например, просит рассказать сказку, написать код, обсудить погоду и т.д.) — вежливо откажи и объясни: "Этот инструмент предназначен для тестирования промптов по текущему заданию: ${taskDescription}. Пожалуйста, сформулируйте запрос в рамках задания."
4. Отвечай на русском языке.
5. Форматируй ответ используя markdown (жирный текст, списки, заголовки) для лучшей читаемости.`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (response.status === 429) {
      return 'Слишком много запросов. Пожалуйста, подождите немного и попробуйте снова.';
    }
    if (response.status === 402) {
      return 'Сервис временно недоступен. Попробуйте позже.';
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return 'Не удалось получить ответ от AI. Попробуйте позже.';
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Не удалось получить ответ от AI.';
  } catch (error) {
    console.error('Error calling AI gateway:', error);
    return 'Произошла ошибка при обращении к AI. Попробуйте позже.';
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, taskContext, taskId, deviceId } = await req.json();

    const device = (deviceId && String(deviceId))
      || (req.headers.get('x-device-id') || (req.headers.get('user-agent') || 'unknown')).slice(0, 64);

    const environment = req.headers.get('x-environment') || 'dev';

    const attempts = await incrementAndGet(device, taskId, environment);
    if (!attempts.allowed) {
      console.log(`Prompt test request - Task: ${taskContext}, Remaining attempts: 0`);
      return new Response(JSON.stringify({
        error: 'Превышен лимит попыток на сегодня (5 попыток в день)',
        remaining: 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validation = validatePrompt(prompt);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ error: validation.error, remaining: attempts.remaining }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = await executePrompt(prompt, taskContext);

    console.log(`Prompt test request - Task: ${taskContext}, Remaining attempts: ${attempts.remaining}`);

    return new Response(JSON.stringify({
      response: aiResponse,
      remaining: attempts.remaining,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in prompt-tester function:', error);
    return new Response(JSON.stringify({ error: 'Внутренняя ошибка сервера' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});