// src/app/library/[deanId]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PERSONA_MAP } from '@/lib/personas';

export default function PersonaDetailPage() {
  const { deanId } = useParams() as { deanId: string };
  const persona = PERSONA_MAP[deanId];

  if (!persona) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>This persona is no longer active.</p>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${persona.backdrop} px-6 py-12 text-white`}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-white/15 bg-black/40 p-8 text-center backdrop-blur-xl shadow-2xl">
        <Image
          src={persona.image}
          alt={persona.name}
          width={140}
          height={140}
          className="mx-auto rounded-2xl border border-white/20 object-cover"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Persona Profile</p>
          <h1 className="mt-3 text-3xl font-bold">{persona.name}</h1>
          <p className="text-white/70">{persona.tone}</p>
        </div>
        <blockquote className="text-lg italic text-white/80">“{persona.quote}”</blockquote>
        <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-left text-sm text-white/80 max-h-64 overflow-y-auto">
          <p className="whitespace-pre-line">{persona.bio}</p>
        </div>
        <Link
          href="/sms"
          className="mx-auto rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Jump into AiLi SMS
        </Link>
      </div>
    </main>
  );
}
