import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const DAILY_LIMIT = 5;
const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

function getRateLimitKey(taskId: string, userAgent: string): string {
  return `${taskId}_${userAgent?.slice(0, 50)}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, { count: 0, resetTime: now + RESET_INTERVAL });
    return { allowed: true, remaining: DAILY_LIMIT };
  }
  
  if (record.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  
  return { allowed: true, remaining: DAILY_LIMIT - record.count };
}

function incrementRateLimit(key: string): void {
  const record = rateLimitStore.get(key);
  if (record) {
    record.count += 1;
  }
}

function validatePrompt(prompt: string, taskContext: string): { isValid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: 'Промпт не может быть пустым' };
  }
  
  if (prompt.length > 2000) {
    return { isValid: false, error: 'Промпт слишком длинный (максимум 2000 символов)' };
  }
  
  // Basic validation for task relevance
  const taskKeywords = {
    'document-analysis': ['анализ', 'документ', 'резюме', 'executive', 'summary'],
    'deep-research': ['исследование', 'research', 'поиск', 'данные', 'информация'],
    'specialized-gpt': ['gpt', 'инструкция', 'система', 'prompt', 'specialized']
  };
  
  const keywords = taskKeywords[taskContext as keyof typeof taskKeywords] || [];
  const lowerPrompt = prompt.toLowerCase();
  
  const hasRelevantKeyword = keywords.some(keyword => 
    lowerPrompt.includes(keyword.toLowerCase())
  );
  
  if (!hasRelevantKeyword && prompt.length > 50) {
    return { 
      isValid: false, 
      error: 'Промпт должен быть связан с контекстом задания' 
    };
  }
  
  return { isValid: true };
}

function getSystemPrompt(taskContext: string): string {
  const systemPrompts = {
    'document-analysis': `Ты помогаешь пользователю научиться анализировать документы и создавать executive summary. 
Отвечай кратко и по существу. Если пользователь предоставил документ, анализируй его согласно его промпту.
Фокусируйся на практических советах по анализу документов.`,
    
    'deep-research': `Ты помогаешь пользователю освоить навыки глубокого исследования и поиска информации.
Отвечай кратко и по существу. Помогай формулировать исследовательские вопросы и методы поиска.
Фокусируйся на методологии исследования.`,
    
    'specialized-gpt': `Ты помогаешь пользователю научиться создавать специализированные GPT-ассистенты.
Отвечай кратко и по существу. Помогай с написанием инструкций и настройкой поведения GPT.
Фокусируйся на лучших практиках создания GPT.`
  };
  
  return systemPrompts[taskContext as keyof typeof systemPrompts] || 
         'Ты помогаешь пользователю с учебным заданием. Отвечай кратко и по существу.';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, taskContext, taskId, documentId } = await req.json();
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const rateLimitKey = getRateLimitKey(taskId, userAgent);
    const rateLimit = checkRateLimit(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Превышен лимит попыток на сегодня (5 попыток в день)',
        remaining: 0
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate prompt
    const validation = validatePrompt(prompt, taskContext);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Increment rate limit counter
    incrementRateLimit(rateLimitKey);

    // Prepare messages
    const messages = [
      { role: 'system', content: getSystemPrompt(taskContext) }
    ];

    // Load document content if documentId is provided
    if (documentId && taskContext === 'document-analysis') {
      try {
        const { data: document, error: docError } = await supabase
          .from('documents')
          .select('extracted_text, title')
          .eq('id', documentId)
          .single();

        if (docError || !document) {
          console.error('Error loading document:', docError);
          return new Response(JSON.stringify({ error: 'Документ не найден' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const documentContent = document.extracted_text || '';
        
        messages.push({
          role: 'user',
          content: `Документ для анализа "${document.title}":\n\n${documentContent}\n\nЗапрос пользователя: ${prompt}`
        });
      } catch (error) {
        console.error('Error fetching document:', error);
        return new Response(JSON.stringify({ error: 'Ошибка загрузки документа' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    console.log(`Prompt test request - Task: ${taskContext}, Remaining attempts: ${rateLimit.remaining - 1}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return new Response(JSON.stringify({ 
        error: 'Ошибка при обращении к OpenAI API',
        remaining: rateLimit.remaining - 1
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = data.choices[0]?.message?.content;
    
    return new Response(JSON.stringify({ 
      response: aiResponse,
      remaining: rateLimit.remaining - 1
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in prompt-tester function:', error);
    return new Response(JSON.stringify({ error: 'Внутренняя ошибка сервера' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});