import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea || idea.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a more detailed idea." },
        { status: 400 }
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
      model: "mistralai/mistral-small-3.1-24b-instruct",
      messages: [
        { role: "user", content: idea },
      ],
    });

    return NextResponse.json({
      result: completion.choices[0]?.message?.content ?? "",
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}