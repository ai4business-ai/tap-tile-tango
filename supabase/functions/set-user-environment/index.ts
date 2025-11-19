import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, environment } = await req.json();

    if (!userId || !environment) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or environment' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['dev', 'prod'].includes(environment)) {
      return new Response(
        JSON.stringify({ error: 'Invalid environment. Must be dev or prod' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Setting environment for user ${userId} to ${environment}`);

    // Update app_metadata for the user
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        app_metadata: { environment }
      }
    );

    if (error) {
      console.error('Error updating user metadata:', error);
      throw error;
    }

    console.log(`Successfully set environment to ${environment} for user ${userId}`);

    return new Response(
      JSON.stringify({ success: true, environment }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in set-user-environment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
