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
    const { language, level, count = 5, excludeQuestions = [] } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const excludedQuestionsText = excludeQuestions.length > 0 
      ? `\n\nDO NOT generate these questions that were already asked:\n${excludeQuestions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}`
      : '';

    const systemPrompt = `You are an expert programming quiz generator. Generate ${count} unique, non-repeating quiz questions for ${language} programming language at difficulty level ${level} (1-5).

Each question should test understanding of ${language} concepts appropriate for level ${level}:
- Level 1: Variables, basic syntax, data types
- Level 2: Conditionals, comparison operators, boolean logic
- Level 3: Loops, iteration, loop control
- Level 4: Functions, scope, parameters
- Level 5: Arrays/Lists, data structures, methods
${excludedQuestionsText}

Return ONLY a valid JSON array with this exact structure:
[
  {
    "question": "Clear question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "concept": "Brief concept name",
    "explanation": "Why this answer is correct"
  }
]

CRITICAL: 
- Return ONLY the JSON array, no markdown formatting, no code blocks, no additional text.
- DO NOT repeat any questions from the excluded list above.
- Generate completely NEW questions with different wording and topics.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${count} ${language} questions for level ${level}` }
        ],
        temperature: 0.8,
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Failed to generate quiz questions');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    let questions;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      questions = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid response format from AI');
    }

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate quiz' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
