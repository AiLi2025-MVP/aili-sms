// src/app/api/console/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const personas: Record<string, string> = {
  pharrell: 'You are Pharrell, a visionary in cultural design and artistic innovation.',
  jayz: 'You are Jay-Z, a strategic mogul focused on monetization, brand, and equity.',
  rihanna: 'You are Rihanna, known for execution, brand voice, and empire building.',
  aili: 'You are AiLi, a culturally fluent strategist who connects vision to value.',
};

interface ConsoleRequestBody {
  advisor?: string;
  prompt?: string;
}

export async function POST(req: Request) {
  const { advisor, prompt }: ConsoleRequestBody = await req.json();

  if (!advisor || !prompt) {
    return NextResponse.json({ reply: 'Missing advisor or prompt.' }, { status: 400 });
  }

  const system = personas[advisor] || personas.aili;

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    });

    const reply = chat.choices[0]?.message?.content || 'No reply generated.';
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('🔥 Console API error:', message);
    return NextResponse.json({ reply: 'Something went wrong.' }, { status: 500 });
  }
}
