// src/lib/personas.ts

export type PersonaProfile = {
  id: string;
  name: string;
  image: string;
  tone: string;
  quote: string;
  gradient: string;
  backdrop: string;
  bio: string;
};

const personaLibrary: PersonaProfile[] = [
  {
    id: 'pharrell',
    name: 'Pharrell Williams',
    image: '/deans/pharrell.jpg',
    tone: 'Purpose & Presence',
    quote: 'Purpose keeps the signal clean.',
    gradient: 'from-lime-300 to-emerald-500',
    backdrop: 'from-blue-600 via-indigo-500 to-purple-700',
    bio: `Pharrell Williams is a multi-hyphenate creative — producer, designer, entrepreneur — whose work bridges pop culture and purpose. He delivers optimism with structure, translating vibe into repeatable systems across music, fashion, and social impact.`,
  },
  {
    id: 'tyler',
    name: 'Tyler, The Creator',
    image: '/deans/tyler_red.jpeg',
    tone: 'Chaos & Craft',
    quote: 'Your weird is the leverage. Press it.',
    gradient: 'from-orange-400 to-amber-500',
    backdrop: 'from-orange-500 via-amber-500 to-yellow-500',
    bio: `Tyler, The Creator is a polymath known for converting off-center imagination into concrete brands—from Odd Future to Golf le Fleur. He challenges founders to design the entire experience: product, packaging, and performance.`,
  },
  {
    id: 'rihanna',
    name: 'Rihanna',
    image: '/deans/rihanna.jpg',
    tone: 'Empire & Energy',
    quote: 'Build the thing you wish existed, then scale the feeling.',
    gradient: 'from-pink-400 to-purple-500',
    backdrop: 'from-rose-500 via-pink-500 to-purple-600',
    bio: `Rihanna is the architect of the Fenty universe. She brings pragmatic instinct to beauty, fashion, and community launches—showing how fearless tone, inclusivity, and operational focus create empires.`,
  },
  {
    id: 'rocky',
    name: 'A$AP Rocky',
    image: '/deans/asap_rocky.jpeg',
    tone: 'Avant Luxury',
    quote: 'Style is a supply chain. Touch every layer.',
    gradient: 'from-gray-200 to-slate-500',
    backdrop: 'from-slate-800 via-gray-800 to-black',
    bio: `A$AP Rocky fuses Harlem grit with couture precision. From AWGE to global fashion houses, he treats aesthetics like infrastructure—directing teams, narrative, and supply chains with equal obsession.`,
  },
  {
    id: 'willow',
    name: 'Willow Smith',
    image: '/deans/willow.jpeg',
    tone: 'Quantum Soul',
    quote: 'Curiosity is a muscle—train it daily.',
    gradient: 'from-violet-400 to-sky-400',
    backdrop: 'from-indigo-700 via-violet-700 to-blue-800',
    bio: `Willow Smith moves between music, wellness, and speculative art. She guides founders to hold space for experimentation, building rituals that keep products emotionally honest and intellectually expansive.`,
  },
  {
    id: 'druski',
    name: 'Druski',
    image: '/deans/druski.jpg',
    tone: 'Humor & Hustle',
    quote: 'Laugh the audience in, then give them the offer.',
    gradient: 'from-amber-400 to-orange-500',
    backdrop: 'from-amber-600 via-orange-600 to-brown-700',
    bio: `Druski scaled comedy sketches into a media platform by mixing relatability with relentless touring. He teaches how to convert attention into revenue using community cues, quick iteration, and smart partnerships.`,
  },
  {
    id: 'kai',
    name: 'Kai Cenat',
    image: '/deans/kai_cenat.jpg',
    tone: 'Community Voltage',
    quote: 'If the chat is lit, the business can be too.',
    gradient: 'from-red-400 to-purple-500',
    backdrop: 'from-red-700 via-purple-700 to-black',
    bio: `Kai Cenat turns livestream energy into product launches, meetups, and pop-up economies. He obsesses over community feedback loops, rapid-fire drops, and rewarding his audience with tangible participation.`,
  },
  {
    id: 'bad_bunny',
    name: 'Bad Bunny',
    image: '/deans/bad_bunny.jpeg',
    tone: 'Global Pulse',
    quote: 'Blend hometown texture with world-stage discipline.',
    gradient: 'from-amber-300 to-red-400',
    backdrop: 'from-amber-600 via-red-600 to-black',
    bio: `Bad Bunny scaled Puerto Rican roots into a world tour empire by pairing cultural authenticity with meticulous production. He advises on crafting experiences that feel both intimate and stadium-ready, ensuring local stories travel globally.`,
  },
  {
    id: 'virgil',
    name: 'Virgil Abloh',
    image: '/deans/virgil.png',
    tone: 'Remix & Design',
    quote: 'You’re supposed to break the rules and leave new ones behind.',
    gradient: 'from-yellow-300 to-pink-400',
    backdrop: 'from-yellow-400 via-pink-500 to-purple-600',
    bio: `Virgil Abloh was a designer, architect, and visionary who shattered boundaries across fashion, music, and design. He bridged streetwear and luxury, bringing cultural literacy to the runway.`,
  },
  {
    id: 'kimk',
    name: 'Kim Kardashian',
    image: '/deans/kim_k.jpg',
    tone: 'Empire & Ownership',
    quote: 'Own the conversation, then own the pipeline.',
    gradient: 'from-teal-400 to-emerald-500',
    backdrop: 'from-emerald-400 via-teal-500 to-green-600',
    bio: `Kim Kardashian transformed influence into infrastructure through SKIMS and multiple media ventures. She leads with style, disciplined execution, and unapologetic control over distribution.`,
  },
  {
    id: 'nipsey',
    name: 'Nipsey Hussle',
    image: '/deans/nipsey.png',
    tone: 'Marathon & Ownership',
    quote: 'All money in. No shortcuts.',
    gradient: 'from-blue-500 to-indigo-500',
    backdrop: 'from-blue-700 via-indigo-700 to-black',
    bio: `Nipsey Hussle combined community building with entrepreneurial rigor. His playbook centered on vertical integration, co-ops, and measurable impact across neighborhoods.`,
  },
  {
    id: 'solange',
    name: 'Solange Knowles',
    image: '/deans/solange2.png',
    tone: 'Art & Alignment',
    quote: 'Design a life that sounds like you.',
    gradient: 'from-purple-400 to-indigo-500',
    backdrop: 'from-purple-700 via-indigo-700 to-black',
    bio: `Solange Knowles is an interdisciplinary artist who translates sculpture, movement, and sound into cultural architecture. She guides founders to connect intuition with intentional systems.`,
  },
];

export const PERSONA_LIBRARY = personaLibrary;
export const PERSONA_MAP = personaLibrary.reduce<Record<string, PersonaProfile>>((acc, persona) => {
  acc[persona.id] = persona;
  return acc;
}, {});
