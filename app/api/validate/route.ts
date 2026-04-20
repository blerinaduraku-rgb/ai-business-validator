import { NextResponse } from "next/server";
import OpenAI from "openai";

// OpenRouter uses OpenAI-compatible SDK
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const SYSTEM_PROMPT = `
You are a professional business analyst AI.

Return ONLY in this format:

### 📋 Summary
...

### ✅ Strengths
- ...
- ...

### ⚠️ Weaknesses
- ...
- ...

### 💡 Suggestions
- ...
- ...

### 🎯 Final Verdict
Low / Moderate / High potential

No extra text before or after.
`;

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    // 🔥 VALIDATION FIX
    if (!idea || idea.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a more detailed business idea." },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "mistralai/mistral-small-3.1-24b-instruct",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: idea,
        },
      ],
      temperature: 0.3,
    });

    const result = completion.choices[0]?.message?.content?.trim() || "";

    // 🔥 SAFETY CHECK
    if (!result) {
      return NextResponse.json(
        { error: "AI returned empty response. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result,
    });
  } catch (error: any) {
    console.error("OPENROUTER ERROR:", error);

    // 🔥 CLEAN USER-FACING ERROR
    return NextResponse.json(
      {
        error:
          "AI service is temporarily unavailable. Please try again in a moment."
      },
      { status: 500 }
    );
  }
}
