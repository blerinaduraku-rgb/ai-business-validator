import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // 🔥 IMPORTANT për Vercel

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

    if (!idea || idea.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a more detailed business idea." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    // 🔥 HARD GUARD (kjo ta tregon real problemin në Vercel)
    if (!apiKey) {
      console.error("MISSING OPENROUTER_API_KEY");
      return NextResponse.json(
        { error: "Server misconfigured (missing API key)" },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
    });

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

    const result = completion.choices[0]?.message?.content?.trim();

    if (!result) {
      return NextResponse.json(
        { error: "AI returned empty response. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("OPENROUTER ERROR:", error);

    return NextResponse.json(
      {
        error: "AI service is temporarily unavailable. Please try again."
      },
      { status: 500 }
    );
  }
}