
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // First, try to get relevant card information from BankKaro API
    let cardContext = '';
    try {
      const cardsResponse = await fetch('https://bk-api.bankkaro.com/sp/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: "best-travel-credit-card",
          banks_ids: [],
          card_networks: [],
          annualFees: "",
          credit_score: "",
          sort_by: "",
          free_cards: "",
          eligiblityPayload: {},
          cardGeniusPayload: {}
        })
      });

      if (cardsResponse.ok) {
        const cardsData = await cardsResponse.json();
        const cards = cardsData.data?.cards || [];
        
        // Create a relevant context string from the cards data
        cardContext = `\n\nHere's information about available travel credit cards:\n` +
          cards.slice(0, 10).map((card: any) => {
            return `${card.name} - Annual Fee: ${card.joining_fee_text || 'N/A'}, Rating: ${card.rating || 'N/A'}/5, Type: ${card.card_type || 'N/A'}, Commission: ${card.commission || '0'} ${card.commission_type || ''}`;
          }).join('\n');
      }
    } catch (error) {
      console.log('Failed to fetch cards data, falling back to OpenAI only');
    }

    // Create system prompt with context
    const systemPrompt = `You are Aly's travel assistant, a friendly and knowledgeable AI that helps travelers find the perfect credit cards and travel deals. 

Your expertise includes:
- Travel credit cards and their benefits
- Cashback and reward programs
- Travel deals and offers
- Airport lounges and travel perks
- Smart spending strategies for travelers

IMPORTANT FORMATTING GUIDELINES:
1. Structure your responses clearly with proper paragraphs
2. Use bullet points (•) for lists and key points
3. Use headings with colons (e.g., "Key Benefits:", "Important Notes:")
4. Keep responses concise but informative (max 3-4 paragraphs)
5. Use emojis sparingly but effectively
6. Break down complex information into digestible sections

Always respond in a helpful, friendly tone. If asked about specific cards, refer to the card information provided in the context.

If you don't have specific information about a card or deal, be honest about it and offer to help find alternatives.${cardContext}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I'm here to help with travel cards and deals! Could you please rephrase your question?";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    
    // Fallback response
    const fallbackResponse = "Hey there! 👋 I'm having a small technical hiccup, but I'm still here to help! Ask me about travel credit cards, cashback offers, or the best deals for your next adventure! ✈️";
    
    return new Response(JSON.stringify({ response: fallbackResponse }), {
      status: 200, // Still return 200 to avoid UI errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
