import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Chat assistant function called');
    const { message, taskContext, threadId, assistantId } = await req.json()
    console.log('Request data:', { message: message?.substring(0, 100), taskContext: taskContext?.substring(0, 100), threadId, assistantId });
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment');
      throw new Error('OpenAI API key not found')
    }

    // Use provided assistant ID or fallback to default
    const currentAssistantId = assistantId || 'asst_ZhTLp1H206L1PxLZU4VIflHZ'
    console.log('Using assistant ID:', currentAssistantId);
    
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

    // Add message to thread
    await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: message
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
    
    console.log('Assistant response length:', assistantMessage.length);

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