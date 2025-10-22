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
    const { code, language } = await req.json();

    if (!code || !language) {
      return new Response(
        JSON.stringify({ error: 'Code and language are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert ${language} programming assistant. Analyze the provided code and return a JSON object with this EXACT structure:

{
  "language": "${language}",
  "confidence": 0.95,
  "errors": [
    {
      "line": 5,
      "severity": "error",
      "message": "Clear error description",
      "snippet": "code snippet with error"
    }
  ],
  "corrected_code": "Full corrected version of the code",
  "explanation": "Detailed explanation of fixes and improvements",
  "one_line_summary": "Brief summary",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}

Focus on:
- Syntax errors
- Logic errors
- Best practices for ${language}
- Performance improvements
- Code readability

Return ONLY valid JSON, no markdown formatting, no code blocks.`;

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
          { role: 'user', content: `Analyze this ${language} code:\n\n${code}` }
        ],
        temperature: 0.7,
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
      throw new Error('Analysis failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    let analysisResult;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Return a fallback response
      analysisResult = {
        language,
        confidence: 0.8,
        errors: [],
        corrected_code: code,
        explanation: content,
        one_line_summary: 'Code analysis complete',
        suggestions: []
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Analysis failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
