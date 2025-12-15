// src/app/sms/page.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Mic, SendHorizonal } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { PERSONA_MAP, type PersonaProfile } from '@/lib/personas';

const SMS_PERSONA_IDS = ['pharrell', 'tyler', 'rihanna'] as const;
type SMSPersonaId = (typeof SMS_PERSONA_IDS)[number];

const SMS_PERSONAS: Record<SMSPersonaId, PersonaProfile> = SMS_PERSONA_IDS.reduce(
  (acc, id) => {
    const profile = PERSONA_MAP[id];
    if (profile) acc[id] = profile;
    return acc;
  },
  {} as Record<SMSPersonaId, PersonaProfile>
);

type MessageRole = 'user' | 'celebrity' | 'system';

type Message = {
  id: string;
  role: MessageRole;
  content: string;
  personaId?: SMSPersonaId;
  timestamp: number;
};

type ProfileSnapshot = {
  persona?: string;
  creator_style?: string;
  learning_style?: string;
  goal?: string;
};

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const EXAMPLES = [
  'Need a textable mission line the trio can stand behind.',
  'What’s a bold-but-doable activation for next Friday?',
  'How do I flip my fan energy into real ownership?',
];

export default function SmsPage() {
  const [profile, setProfile] = useState<ProfileSnapshot | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: createId(),
      role: 'system',
      content:
        'Drop one SMS inside AiLi’s SMS lab. Pharrell, Tyler, and Rihanna each reply directly to you—never to each other.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data as ProfileSnapshot);
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const threadActive = messages.some((msg) => msg.role === 'user');

  const sendPrompt = async () => {
    if (!input.trim() || loading) return;

    const outbound: Message = {
      id: createId(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const history = [...messages, outbound];
    setMessages(history);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/groupchat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: history.filter((msg) => msg.role !== 'system'),
          profile,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Celebrity switchboard glitch.');
      }

      const data = await res.json();
      const replies: Message[] = SMS_PERSONA_IDS.map((id) => {
        const content = data.messages?.[id];
        if (!content) return null;
        return {
          id: `${outbound.id}-${id}`,
          role: 'celebrity',
          personaId: id,
          content,
          timestamp: Date.now(),
        } satisfies Message;
      }).filter(Boolean) as Message[];

      if (replies.length) {
        setMessages((prev) => [...prev, ...replies]);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Line jammed. Send that take again in a minute.';
      
      // Provide user-friendly error messages
      let displayMessage = errorMessage;
      if (errorMessage.includes('OpenAI API key')) {
        displayMessage = '⚠️ OpenAI configuration issue. Please contact support or check your API key setup.';
      } else if (errorMessage.includes('rate limit')) {
        displayMessage = '⏱️ Rate limit reached. Please wait a minute and try again.';
      } else if (errorMessage.includes('Celebrity switchboard glitch')) {
        displayMessage = 'Line jammed. Send that take again in a minute.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'system',
          content: displayMessage,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 h-full w-full object-cover"
      >
        <source src="/videos/pharrell-syllabus-v1.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/65" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <section className="rounded-3xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-md shadow-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-red-400">AiLi</p>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">SMS Learning Lab</p>
          <h1 className="mt-4 text-4xl font-semibold leading-snug">
            Popular-Figure SMS Short-Form Group Chat
          </h1>
          <p className="mt-3 text-white/70 text-sm">
            Patent-driven orchestration keeps the conversation laser-focused on you. Every SMS is
            cryptographically bound to our private stack, and each celebrity persona blends social,
            creative, and educational value.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur">
              <h3 className="text-sm uppercase tracking-[0.35em] text-white/50">SMS Thread</h3>
              <div
                ref={scrollRef}
                className="mt-4 flex min-h-[460px] flex-col gap-4 overflow-y-auto rounded-2xl border border-white/5 bg-white/5 p-4"
              >
                {messages.map((message) => {
                  if (message.role === 'system') {
                    return (
                      <p key={message.id} className="text-center text-xs text-white/65">
                        {message.content}
                      </p>
                    );
                  }

                  if (message.role === 'user') {
                    return (
                      <div key={message.id} className="flex justify-end">
                        <div className="max-w-[80%] rounded-3xl bg-gradient-to-br from-fuchsia-400/90 to-orange-400/80 px-4 py-3 text-sm shadow-lg">
                          {message.content}
                        </div>
                      </div>
                    );
                  }

                  const persona = message.personaId ? SMS_PERSONAS[message.personaId] : null;
                  return (
                    <div key={message.id} className="flex items-start gap-3">
                      {persona && (
                        <Image
                          src={persona.image}
                          alt={persona.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-2xl border border-white/30 object-cover"
                        />
                      )}
                      <div className="max-w-[80%]">
                        {persona && (
                          <p className="text-xs font-semibold text-white/60">
                            {persona.name} • {persona.tone}
                          </p>
                        )}
                        <div className="mt-1 rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span className="h-2 w-2 animate-ping rounded-full bg-white/80" />
                    Tri-modal scoring in progress…
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <textarea
                rows={3}
                placeholder="Draft one text — brand move, wild idea, next activation..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-transparent p-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={sendPrompt}
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-semibold text-black transition hover:bg-white disabled:opacity-50"
                >
                  <SendHorizonal size={16} /> Send SMS
                </button>
                <span className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/60">
                  <Mic size={14} className="mr-1 inline-block" />
                  Voice capture coming soon
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h3 className="text-sm uppercase tracking-[0.35em] text-white/50">Active roster</h3>
              <div className="mt-4 space-y-3">
                {SMS_PERSONA_IDS.map((id) => {
                  const persona = SMS_PERSONAS[id];
                  if (!persona) return null;
                  return (
                    <div
                      key={id}
                      className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r ${persona.gradient} p-3`}
                    >
                      <Image
                        src={persona.image}
                        alt={persona.name}
                        width={42}
                        height={42}
                        className="h-11 w-11 rounded-2xl border border-white/50 object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold">{persona.name}</p>
                        <p className="text-xs text-white/70">{persona.tone}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={`rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all duration-500 ${
                threadActive ? 'pointer-events-none max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
              }`}
            >
              <h2 className="text-lg font-semibold">How it works</h2>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>• One user group-chat messages with Pharrell, Tyler, and Rihanna.</li>
                <li>• Personas cannot talk to each other—only to you.</li>
                <li>• Replies stay under 280 characters with SMS pacing.</li>
                <li>• Persona vectors stay δ ≥ 0.35 apart for distinct tones.</li>
              </ul>
            </div>

            <div
              className={`rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all duration-500 ${
                threadActive ? 'pointer-events-none max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
              }`}
            >
              <h3 className="text-sm uppercase tracking-[0.35em] text-white/50">Prompt sparks</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
