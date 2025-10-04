import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'en' } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const systemPrompt = language === 'ml' 
      ? `നിങ്ങൾ KrishiBot ആണ്, കേരളത്തിലെ കർഷകരെ സഹായിക്കുന്ന ഒരു AI അസിസ്റ്റന്റ്. കേരളത്തിലെ സുസ്ഥിര കൃഷി രീതികൾ, ജൈവ കൃഷി, മണ്ണ് സംരക്ഷണം, ജലസംരക്ഷണം, കീടനിയന്ത്രണം എന്നിവയെക്കുറിച്ച് നിങ്ങൾക്ക് വിദഗ്ധ അറിവുണ്ട്. എല്ലായ്പ്പോഴും സഹായകരവും പ്രായോഗികവുമായ ഉപദേശങ്ങൾ നൽകുക. KrishiKhel പ്ലാറ്റ്ഫോമിനെക്കുറിച്ചും മിഷനുകളെക്കുറിച്ചും XP സമ്പാദിക്കുന്നതിനെക്കുറിച്ചും നിങ്ങൾക്ക് സഹായിക്കാനാകും.`
      : `You are KrishiBot, an AI assistant helping farmers in Kerala with sustainable agriculture. You have expert knowledge about Kerala agriculture practices, organic farming, soil conservation, water management, pest control, and sustainable farming techniques. Always provide helpful, practical advice in a friendly manner. You can also help with questions about the KrishiKhel platform, missions, and earning XP.`;

    // Format messages for Gemini API
    const formattedMessages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...messages.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});