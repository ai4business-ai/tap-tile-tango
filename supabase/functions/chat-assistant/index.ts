import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced security headers including CSP
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.openai.com",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}

// Security configuration
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES_PER_THREAD = 50;
const ALLOWED_ASSISTANT_IDS = [
  'asst_ZhTLp1H206L1PxLZU4VIflHZ', // Default assistant
  'asst_7vzfk2VjBlBiww4QWz6PrC5C', // Deep Research assistant
];

const ALLOWED_TASK_CONTEXTS = [
  'Освоение Deep Research: формулирование исследовательских вопросов и использование режима глубокого поиска',
  'Анализ документов и создание executive summary',
  'Создание специализированного GPT для анализа документов',
  'SQL анализ и работа с данными',
  'Ответ клиенту в нужном тоне - кейс про ООО Торговые сети',
  'Конструктивная обратная связь коллегам - кейс про функцию Умный помощник',
  'Создание повестки встречи (agenda) и follow-up письма',
];

// Enhanced dangerous patterns for better prompt injection detection
const DANGEROUS_PATTERNS = [
  /ignore\s+previous\s+instructions?/i,
  /act\s+as\s+(?:a\s+)?(?:different|new|another)/i,
  /system\s*:\s*/i,
  /assistant\s*:\s*/i,
  /pretend\s+to\s+be/i,
  /jailbreak/i,
  /DAN\s+mode/i,
  /override\s+your\s+instructions/i,
  /forget\s+your\s+role/i,
  /ignore\s+your\s+guidelines/i,
  /tell\s+me\s+your\s+prompt/i,
  /what\s+are\s+your\s+instructions/i,
  /show\s+me\s+your\s+system\s+prompt/i,
  /bypass\s+your\s+restrictions/i,
  /you\s+are\s+now\s+(?:a|an)/i,
  /from\s+now\s+on\s+you\s+are/i,
  // Advanced injection techniques
  /<!--[\s\S]*?-->/,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
  /vbscript\s*:/i,
  /on\w+\s*=/i,
  /expression\s*\(/i,
  // Command injection patterns
  /\|\s*(?:ls|cat|curl|wget|nc|netcat)/i,
  /;\s*(?:rm|mv|cp|chmod)/i,
  /`[^`]*`/,
  /\$\([^)]*\)/,
  // Multi-language prompt injection
  /اتجاهل\s+التعليمات\s+السابقة/i, // Arabic
  /忽略之前的指令/i, // Chinese
  /前の指示を無視/i, // Japanese
  /이전\s+지시\s+무시/i, // Korean
  /ignorer\s+les\s+instructions\s+précédentes/i, // French
  /ignorar\s+las\s+instrucciones\s+anteriores/i, // Spanish
  /игнорировать\s+предыдущие\s+инструкции/i, // Russian
];

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function validateInput(message: string, taskContext: string, assistantId: string): { isValid: boolean; reason?: string } {
  // Check message length
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { isValid: false, reason: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` };
  }

  // Check for empty message
  if (!message.trim()) {
    return { isValid: false, reason: 'Message cannot be empty.' };
  }

  // Check assistant ID whitelist
  if (!ALLOWED_ASSISTANT_IDS.includes(assistantId)) {
    return { isValid: false, reason: 'Invalid assistant ID.' };
  }

  // Check task context whitelist
  if (!ALLOWED_TASK_CONTEXTS.includes(taskContext)) {
    return { isValid: false, reason: 'Invalid task context.' };
  }

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(message) || pattern.test(taskContext)) {
      return { isValid: false, reason: 'Message contains potentially harmful content.' };
    }
  }

  // Check for role injection attempts
  const rolePatterns = /(?:^|\n)\s*(?:system|assistant|user)\s*:/i;
  if (rolePatterns.test(message)) {
    return { isValid: false, reason: 'Message contains invalid role specifications.' };
  }

  // Check for excessive special characters (possible encoding attacks)
  const specialCharCount = (message.match(/[^\w\s\p{L}\p{N}\p{P}\p{M}]/gu) || []).length;
  if (specialCharCount > message.length * 0.1) {
    return { isValid: false, reason: 'Message contains too many special characters.' };
  }

  return { isValid: true };
}

function sanitizeInput(text: string): string {
  // Remove null bytes and control characters except newlines and tabs
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .substring(0, MAX_MESSAGE_LENGTH);
}

function checkRateLimit(identifier: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10;

  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true };
}

function logSuspiciousActivity(type: string, details: any, req?: Request) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type,
    ip: req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip') || 'unknown',
    userAgent: req?.headers.get('user-agent') || 'unknown',
    details: sanitizeLogDetails(details)
  };
  
  console.warn(`[SECURITY] ${type}:`, JSON.stringify(logEntry, null, 2));
  
  // In production, you might want to send this to a dedicated security monitoring service
  // or store in a separate security_events table
}

function sanitizeLogDetails(details: any): any {
  if (typeof details === 'string') {
    return details.substring(0, 500).replace(/[^\x20-\x7E]/g, '?');
  }
  if (typeof details === 'object' && details !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(details)) {
      if (typeof value === 'string') {
        sanitized[key] = value.substring(0, 200).replace(/[^\x20-\x7E]/g, '?');
      } else {
        sanitized[key] = '[OBJECT]';
      }
    }
    return sanitized;
  }
  return details;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Chat assistant function called');
    
    // Optional authentication check - allows both authenticated and guest users
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (user) {
        userId = user.id;
        console.log('Authenticated user:', userId);
      } else {
        console.log('Invalid token, proceeding as guest');
      }
    } else {
      console.log('No authorization header, proceeding as guest');
    }
    
    const requestBody = await req.json();
    const { message, taskContext, threadId, assistantId, documentId } = requestBody;
    
    console.log('Request data:', { 
      messageLength: message?.length || 0, 
      taskContext: taskContext?.substring(0, 100), 
      threadId, 
      assistantId 
    });

    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimitCheck = checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      logSuspiciousActivity('RATE_LIMIT_EXCEEDED', { 
        ip: clientIP, 
        resetTime: rateLimitCheck.resetTime 
      }, req);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Input validation and sanitization
    const sanitizedMessage = sanitizeInput(message || '');
    const sanitizedTaskContext = sanitizeInput(taskContext || '');
    const currentAssistantId = assistantId || 'asst_ZhTLp1H206L1PxLZU4VIflHZ';

    const validation = validateInput(sanitizedMessage, sanitizedTaskContext, currentAssistantId);
    if (!validation.isValid) {
      logSuspiciousActivity('VALIDATION_FAILED', {
        ip: clientIP,
        reason: validation.reason,
        messageSnippet: sanitizedMessage.substring(0, 200),
        taskContext: sanitizedTaskContext
      }, req);
      return new Response(
        JSON.stringify({ error: validation.reason }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment');
      throw new Error('OpenAI API key not found')
    }

    console.log('Using assistant ID:', currentAssistantId);
    console.log('Validation passed, proceeding with OpenAI request');
    
    // Create or use existing thread
    let currentThreadId = threadId
    if (!currentThreadId) {
      console.log('Creating new thread');
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({})
      })
      
      if (!threadResponse.ok) {
        const errorText = await threadResponse.text();
        console.error('Failed to create thread:', errorText);
        throw new Error(`Failed to create thread: ${threadResponse.status}`);
      }
      
      const threadData = await threadResponse.json()
      currentThreadId = threadData.id
      console.log('Created thread ID:', currentThreadId);
    } else {
      console.log('Using existing thread ID:', currentThreadId);
    }

    // Check message count in thread before adding new message
    const messagesCountResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    if (messagesCountResponse.ok) {
      const messagesData = await messagesCountResponse.json();
      if (messagesData.data && messagesData.data.length >= MAX_MESSAGES_PER_THREAD) {
        logSuspiciousActivity('MAX_MESSAGES_EXCEEDED', {
          ip: clientIP,
          threadId: currentThreadId,
          messageCount: messagesData.data.length
        }, req);
        return new Response(
          JSON.stringify({ error: 'Maximum messages per thread exceeded.' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Add sanitized message to thread with enhanced security context
    let enhancedMessage = `[SECURITY_CONTEXT: Task="${sanitizedTaskContext}"] ${sanitizedMessage}`;
    
    // Load document content if documentId is provided
    if (documentId) {
      try {
        const { data: document, error: docError } = await supabase
          .from('documents')
          .select('extracted_text, title')
          .eq('id', documentId)
          .single();

        if (document && document.extracted_text) {
          enhancedMessage = `[SECURITY_CONTEXT: Task="${sanitizedTaskContext}"] Документ для анализа "${document.title}":\n\n${document.extracted_text}\n\nВопрос пользователя: ${sanitizedMessage}`;
        }
      } catch (error) {
        console.error('Error fetching document for chat assistant:', error);
        // Continue without document content if error occurs
      }
    }
    
    await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: enhancedMessage
      })
    })

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: currentAssistantId
      })
    })

    const runData = await runResponse.json()
    const runId = runData.id

    // Poll for completion
    let run = runData
    let pollCount = 0
    const maxPolls = 30 // 30 seconds timeout
    
    while ((run.status === 'queued' || run.status === 'in_progress') && pollCount < maxPolls) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      pollCount++
      
      console.log(`Polling run status (attempt ${pollCount}):`, run.status);
      
      const pollResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      })
      
      if (!pollResponse.ok) {
        console.error('Failed to poll run status:', await pollResponse.text());
        throw new Error(`Failed to poll run status: ${pollResponse.status}`);
      }
      
      run = await pollResponse.json()
    }
    
    console.log('Final run status:', run.status);
    
    if (run.status !== 'completed') {
      console.error('Run did not complete successfully. Status:', run.status);
      throw new Error(`Assistant run failed with status: ${run.status}`);
    }

    // Get messages
    console.log('Fetching messages from thread');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })

    if (!messagesResponse.ok) {
      console.error('Failed to fetch messages:', await messagesResponse.text());
      throw new Error(`Failed to fetch messages: ${messagesResponse.status}`);
    }

    const messagesData = await messagesResponse.json()
    console.log('Retrieved messages count:', messagesData.data?.length || 0);
    
    const assistantMessage = messagesData.data[0]?.content[0]?.text?.value
    
    if (!assistantMessage) {
      console.error('No assistant message found in response');
      throw new Error('No response received from assistant');
    }
    
    // Log successful interaction for monitoring
    console.log('Assistant response length:', assistantMessage.length);
    console.log('Security validation passed, response delivered successfully');

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        threadId: currentThreadId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})