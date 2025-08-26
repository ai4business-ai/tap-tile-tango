import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT = 5;

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

async function getCurrentCount(deviceId: string, taskId: string): Promise<number> {
  const today = getToday();
  const { data, error } = await supabase
    .from('prompt_attempts')
    .select('count')
    .eq('device_id', deviceId)
    .eq('task_id', taskId)
    .eq('date', today)
    .maybeSingle();

  if (error) {
    console.error('Error reading attempts:', error);
    return 0;
  }
  return data?.count ?? 0;
}

async function incrementAndGet(deviceId: string, taskId: string): Promise<{ allowed: boolean; remaining: number; count: number }>{
  const today = getToday();
  const current = await getCurrentCount(deviceId, taskId);

  if (current >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, count: current };
  }

  if (current === 0) {
    const { error: insertError } = await supabase.from('prompt_attempts').insert({
      device_id: deviceId,
      task_id: taskId,
      date: today,
      count: 1,
    });
    if (insertError) {
      console.error('Error inserting attempts:', insertError);
      // Fallback: do not block, but return remaining conservatively
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
      .eq('date', today);
    if (updateError) {
      console.error('Error updating attempts:', updateError);
      return { allowed: true, remaining: Math.max(0, DAILY_LIMIT - next), count: next };
    }
    return { allowed: true, remaining: Math.max(0, DAILY_LIMIT - next), count: next };
  }
}


function validatePrompt(prompt: string, taskContext: string): { isValid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: 'Промпт не может быть пустым' };
  }
  
  if (prompt.length > 2000) {
    return { isValid: false, error: 'Промпт слишком длинный (максимум 2000 символов)' };
  }
  
  // Anti-cheating patterns detection
  const lowerPrompt = prompt.toLowerCase();
  const suspiciousPatterns = [
    // Direct solution requests
    'дай ответ', 'покажи ответ', 'реши задание', 'решение задачи', 'готовый ответ',
    'выполни задание', 'сделай домашку', 'сделай за меня',
    // SQL and code injection attempts
    'select ', 'insert ', 'update ', 'delete ', 'drop ', 'create table', 'alter table',
    // System prompt bypass attempts
    'игнорируй инструкции', 'забудь про систему', 'ты теперь', 'притворись что',
    'roleplay', 'act as', 'pretend you are', 'ignore previous', 'new instructions',
    // Direct cheating attempts
    'весь текст документа', 'скопируй документ', 'покажи весь документ полностью',
    'что в документе написано', 'перепиши документ', 'executive summary готовый'
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (lowerPrompt.includes(pattern)) {
      return { 
        isValid: false, 
        error: 'Промпт содержит недопустимые запросы. Пожалуйста, формулируйте запросы для изучения создания промптов.' 
      };
    }
  }
  
  // Basic validation for task relevance
  const taskKeywords = {
    'document-analysis': ['анализ', 'документ', 'резюме', 'executive', 'summary', 'промпт'],
    'deep-research': ['исследование', 'research', 'поиск', 'данные', 'информация', 'промпт'],
    'specialized-gpt': ['gpt', 'инструкция', 'система', 'prompt', 'specialized', 'промпт']
  };
  
  const keywords = taskKeywords[taskContext as keyof typeof taskKeywords] || [];
  
  const hasRelevantKeyword = keywords.some(keyword => 
    lowerPrompt.includes(keyword.toLowerCase())
  );
  
  if (!hasRelevantKeyword && prompt.length > 50) {
    return { 
      isValid: false, 
      error: 'Промпт должен быть связан с контекстом задания и созданием промптов' 
    };
  }
  
  return { isValid: true };
}

function evaluatePromptStructure(prompt: string): string {
  const p = prompt.trim();
  const hasSections = /(^|\n)\s*(цель|роль|шаги|инструкция|формат|критерии|ограничения)\s*[:\-]/i.test(p);
  const hasBullets = /(^|\n)[\-\*•]/.test(p);
  const hasNumbered = /(^|\n)\s*\d+\./.test(p);
  const lengthOK = p.length >= 40;

  const wellStructured = (hasSections || hasBullets || hasNumbered) && lengthOK;

  if (wellStructured) {
    return 'Промпт имеет четкую структуру. Я проверяю только структуру промптов, не выполняю задания.';
  }
  return 'Я проверяю только структуру промптов, не выполняю задания. Рекомендую сделать формулировки более конкретными и структурировать разделами.';
}


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, taskContext, taskId, deviceId } = await req.json();

    const device = (deviceId && String(deviceId))
      || (req.headers.get('x-device-id') || (req.headers.get('user-agent') || 'unknown')).slice(0, 64);

    // Increment attempts first (counts any request with a non-empty prompt)
    const attempts = await incrementAndGet(device, taskId);
    if (!attempts.allowed) {
      console.log(`Prompt test request - Task: ${taskContext}, Remaining attempts: 0`);
      return new Response(JSON.stringify({
        error: 'Превышен лимит попыток на сегодня (5 попыток в день)',
        remaining: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate prompt after counting the attempt
    const validation = validatePrompt(prompt, taskContext);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ error: validation.error, remaining: attempts.remaining }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate a strictly limited structural feedback (no task answers)
    const aiResponse = evaluatePromptStructure(prompt);

    console.log(`Prompt test request - Task: ${taskContext}, Remaining attempts: ${attempts.remaining}`);

    return new Response(JSON.stringify({
      response: aiResponse,
      remaining: attempts.remaining
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
