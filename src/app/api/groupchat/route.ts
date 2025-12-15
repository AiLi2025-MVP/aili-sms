// src/app/api/groupchat/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type CelebrityId = 'pharrell' | 'tyler' | 'rihanna';

type HistoryMessage = {
  role: 'user' | 'celebrity' | 'system';
  personaId?: CelebrityId;
  content: string;
};

type ProfileSnapshot = {
  persona?: string;
  creator_style?: string;
  learning_style?: string;
  goal?: string;
};

const CELEBRITIES: Record<
  CelebrityId,
  {
    name: string;
    tagline: string;
    weights: {
      humor: number;
      technical: number;
      emotional: number;
      brevity: number;
      encouragement: number;
      debate: number;
      metaphor: number;
      anecdote: number;
    };
    expertise: string[];
    temperature: number;
  }
> = {
  pharrell: {
    name: 'Pharrell Williams',
    tagline: 'Purpose & Presence',
    weights: {
      humor: 0.52,
      technical: 0.42,
      emotional: 0.78,
      brevity: 0.58,
      encouragement: 0.82,
      debate: 0.35,
      metaphor: 0.6,
      anecdote: 0.5,
    },
    expertise: ['music storytelling', 'cultural presence', 'brand resonance'],
    temperature: 0.85,
  },
  tyler: {
    name: 'Tyler, The Creator',
    tagline: 'Chaos & Craft',
    weights: {
      humor: 0.75,
      technical: 0.45,
      emotional: 0.5,
      brevity: 0.45,
      encouragement: 0.4,
      debate: 0.65,
      metaphor: 0.72,
      anecdote: 0.55,
    },
    expertise: ['creative direction', 'left-field brand building', 'experiential drops'],
    temperature: 0.92,
  },
  rihanna: {
    name: 'Rihanna',
    tagline: 'Empire & Energy',
    weights: {
      humor: 0.4,
      technical: 0.48,
      emotional: 0.66,
      brevity: 0.62,
      encouragement: 0.7,
      debate: 0.4,
      metaphor: 0.45,
      anecdote: 0.68,
    },
    expertise: ['beauty brands', 'audience loyalty', 'global go-to-market'],
    temperature: 0.8,
  },
};

type OpenAIChatMessage =
  | OpenAI.ChatCompletionSystemMessageParam
  | OpenAI.ChatCompletionAssistantMessageParam
  | OpenAI.ChatCompletionUserMessageParam;

const buildSystemPrompt = (celebrity: (typeof CELEBRITIES)[CelebrityId], profile?: ProfileSnapshot) => {
  const { weights } = celebrity;

  const personaVector = `Humor:${weights.humor} Technical:${weights.technical} Emotional:${weights.emotional} Brevity:${weights.brevity} Encouragement:${weights.encouragement} Debate:${weights.debate} Metaphor:${weights.metaphor} Anecdote:${weights.anecdote}`;

  const profileSnippet = profile
    ? `The user persona is "${profile.persona || 'emerging founder'}" who learns through "${profile.learning_style || 'conversation'}" and is focused on "${
        profile.goal || 'building cultural IP'
      }".`
    : '';

  return `
You are ${celebrity.name}, representing "${celebrity.tagline}" in AiLi's patented closed SMS-style ecosystem.
- Enforce one-to-many chat: speak only to the user, never to other celebrities.
- Keep each response under 280 characters and sound like a natural SMS.
- Blend social, creative, and educational value (α=0.4, β=0.3, γ=0.3) while mirroring your persona vector ${personaVector}.
- Reference your expertise lanes: ${celebrity.expertise.join(', ')}.
- Encourage legal/brand integrity reminders when relevant.
- ${profileSnippet}
  `.trim();
};

const normalizeHistoryForPersona = (
  history: HistoryMessage[],
  personaId: CelebrityId
): OpenAIChatMessage[] => {
  return history
    .filter((message) => message.role === 'user' || (message.role === 'celebrity' && message.personaId === personaId))
    .filter((message) => message.content?.trim().length)
    .map((message) => ({
      role: message.role === 'user' ? 'user' : 'assistant',
      content: message.content,
    }));
};

export async function POST(req: Request) {
  try {
    // Validate OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('🔥 OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const { history, profile }: { history: HistoryMessage[]; profile?: ProfileSnapshot } = await req.json();

    if (!Array.isArray(history) || history.length === 0) {
      return NextResponse.json({ error: 'Conversation history is required.' }, { status: 400 });
    }

    const payload = await Promise.all(
      (Object.keys(CELEBRITIES) as CelebrityId[]).map(async (personaId) => {
        const celebrity = CELEBRITIES[personaId];
        const historyForPersona = normalizeHistoryForPersona(history, personaId);

        if (historyForPersona.length === 0) {
          return [personaId, ''] as const;
        }

        const messages: OpenAIChatMessage[] = [
          { role: 'system' as const, content: buildSystemPrompt(celebrity, profile) },
          ...historyForPersona,
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: celebrity.temperature,
          max_tokens: 220,
          messages,
        });

        const reply = completion.choices[0]?.message?.content?.trim() || '';
        return [personaId, reply] as const;
      })
    );

    return NextResponse.json({ messages: Object.fromEntries(payload) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('🔥 Group chat error', message, error);

    // Check if it's an OpenAI authentication error
    if (error instanceof Error && (message.includes('Incorrect API key') || message.includes('invalid_api_key') || message.includes('401'))) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    // Check if it's an OpenAI rate limit error
    if (error instanceof Error && (message.includes('Rate limit') || message.includes('429'))) {
      return NextResponse.json(
        { error: 'OpenAI rate limit reached. Please try again in a minute.' },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: 'Failed to generate celebrity responses.' }, { status: 500 });
  }
}
