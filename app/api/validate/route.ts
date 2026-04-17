import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const SYSTEM_PROMPT = `You are an AI Business Idea Validator. Evaluate startup ideas across: problem, market, competition, monetization, scalability. Be honest and constructive. Structure: Summary, Strengths, Weaknesses, Suggestions, Verdict.`;

// Server-side Supabase client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateMockResponse(idea: string): string {
  const isComplex = idea.length > 50;
  
  if (!isComplex) {
    return `📋 **Summary:** ${idea}

✅ **Strengths:**
- Simple concept
- Easy to understand

⚠️ **Weaknesses:**
- Likely competition exists

💡 **Suggestions:**
- Add unique features

🎯 **Final Verdict:** Moderate potential`;
  }

  return `📋 **Summary:** ${idea.substring(0, 100)}...

✅ **Strengths:**
- Addresses market need
- Growth potential

⚠️ **Weaknesses:**
- High competition

💡 **Suggestions:**
- Build MVP first

🎯 **Final Verdict:** Good potential`;
}

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea || idea.trim().length === 0) {
      return NextResponse.json({ error: "No idea provided" }, { status: 400 });
    }

    // Check for unclear ideas
    const isUnclear = idea.trim().split(" ").length < 3 || 
                      (idea.toLowerCase().includes("i have an idea") && idea.length < 20);

    if (isUnclear) {
      const response = `❓ **Idea Unclear**

I need more details. Please tell me:
1. What problem does it solve?
2. Who is your target customer?
3. How does your solution work?`;

      // Save to Supabase
      await supabaseAdmin.from('idea_validations').insert({
        idea,
        ai_response: response,
        is_mock: true
      });

      return NextResponse.json({ result: response });
    }

    let aiResponse: string;
    let isMock = false;

    // Try Hugging Face API
    try {
      const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.2:fastest",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Evaluate this business idea: "${idea}"` }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (response.ok) {
        const data = await response.json();
        aiResponse = data.choices[0]?.message?.content;
      } else {
        throw new Error("API failed");
      }
    } catch (apiError) {
      console.log("API failed, using mock response");
      aiResponse = generateMockResponse(idea);
      isMock = true;
    }

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from('idea_validations')
      .insert({
        idea,
        ai_response: aiResponse,
        is_mock: isMock
      });

    if (dbError) {
      console.error("Supabase error:", dbError);
    }

    return NextResponse.json({ result: aiResponse });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}