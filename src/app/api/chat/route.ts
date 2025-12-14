// src/app/api/chat/route.ts

import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Secure server-side key
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type ChatRole = 'system' | 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  tone?: string;
  userId?: string;
  assetId?: string;
}

export async function POST(req: Request) {
  try {
    const { messages, tone, userId, assetId }: ChatRequestBody = await req.json();

    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((msg) => msg.role === 'user');

    const prompt = lastUserMessage?.content || '';

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    const reply = chat.choices[0].message.content;

    if (userId) {
      const { error: insertError } = await supabase.from('chat_logs').insert({
        prompt,
        tone,
        asset_id: assetId,
        user_id: userId,
      });

      if (insertError) {
        console.error('❌ Failed to insert chat log:', insertError.message);
      }
    }

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Chat API error:', message);
    return NextResponse.json({ reply: 'Sorry, something went wrong.' });
  }
}
