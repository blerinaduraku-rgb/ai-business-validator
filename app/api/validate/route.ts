import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `
You are a professional business analyst AI.

Always give complete, structured, detailed answers.

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

Do NOT cut the response. Be complete.
`;

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    // 🚨 EDGE CASE #1: empty input
    if (!idea || idea.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a more detailed idea." },
        { status: 400 }
      );
    }

    // 🚨 EDGE CASE #2: too long input
    if (idea.length > 2000) {
      return NextResponse.json(
        { error: "Idea is too long. Please shorten it (max 2000 characters)." },
        { status: 400 }
      );
    }

    // 🚨 EDGE CASE #3: deterministic API FAIL TEST
    // 👉 shkruaj "fail-api" për me testu error handling
    const normalized = idea.trim().toLowerCase();

    if (normalized.includes("fail-api")) {
      return NextResponse.json(
        { error: "AI service failed. Please try again later." },
        { status: 500 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API key" },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
    });

    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
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
      max_tokens: 1200,
    });

    const result = completion.choices[0]?.message?.content?.trim();

    if (!result) {
      return NextResponse.json(
        { error: "AI returned empty response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });

  } catch (err) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      { error: "AI service failed. Please try again later." },
      { status: 500 }
    );
  }
}