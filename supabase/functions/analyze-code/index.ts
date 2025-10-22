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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Analyzing ${language} code...`);

    const systemPrompt = `You are an expert code analyzer. Analyze the provided ${language} code and return a JSON response with:
1. errors: Array of issues found (line number, severity, message, snippet)
2. corrected_code: The improved version of the code
3. explanation: Brief explanation of improvements made
4. one_line_summary: One sentence summary
5. suggestions: Array of 3-5 additional suggestions

Be constructive and educational. Focus on best practices, performance, and readability.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this ${language} code:\n\n${code}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("AI analysis complete");

    // Parse AI response and structure it
    const analysisResult = {
      language,
      confidence: 0.95,
      errors: [],
      corrected_code: code,
      explanation: aiResponse,
      one_line_summary: "Code analysis complete",
      suggestions: [],
    };

    try {
      // Try to parse JSON if AI returned structured response
      const parsed = JSON.parse(aiResponse);
      Object.assign(analysisResult, parsed);
    } catch {
      // If not JSON, use the raw response as explanation
      analysisResult.explanation = aiResponse;
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-code function:", error);
    const errorMessage = error instanceof Error ? error.message : "Analysis failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
