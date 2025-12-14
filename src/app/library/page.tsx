// src/app/library/page.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PERSONA_LIBRARY } from '@/lib/personas';

export default function LibraryPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 h-full w-full object-cover"
      >
        <source src="/videos/dean_vault_v2.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/70" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
        <section className="rounded-3xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-md shadow-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-red-400">AiLi</p>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Persona Library</p>
          <p className="mt-3 text-white/70 text-sm">
            Licensed profiles that feed the SMS experience. Browse their tone, ethos, and bio to see why each response stays distinctive.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-sm uppercase tracking-[0.35em] text-white/50">What to expect</h2>
          <div className="mt-4 grid gap-4 text-sm text-white/70 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              Persona vectors, tone tags, and bios that directly inform SMS outputs.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              Every profile links to a deeper dossier so you can learn their context.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              Library + SMS is the entire product surface—no extra noise.
            </div>
          </div>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONA_LIBRARY.map((persona) => (
            <Link
              key={persona.id}
              href={`/library/${persona.id}`}
              className={`rounded-3xl bg-gradient-to-br ${persona.gradient} p-[1px] shadow-xl transition hover:scale-[1.015]`}
            >
              <div className="flex h-full flex-col items-center rounded-3xl bg-black/85 p-5 text-center">
                <Image
                  src={persona.image}
                  alt={persona.name}
                  width={120}
                  height={120}
                  className="h-28 w-28 rounded-full border-2 border-white/30 object-cover shadow-lg"
                />
                <h3 className="mt-4 text-xl font-semibold">{persona.name}</h3>
                <p className="text-sm text-white/70">{persona.tone}</p>
                <blockquote className="mt-3 text-xs text-white/60">“{persona.quote}”</blockquote>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
