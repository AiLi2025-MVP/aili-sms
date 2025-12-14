// src/components/MobileNav.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquareText, Sparkles } from 'lucide-react';

const nav = [
  { href: '/sms', label: 'SMS', icon: <MessageSquareText size={22} /> },
  { href: '/library', label: 'Library', icon: <Sparkles size={22} /> },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex h-14 items-center justify-around border-t border-white/10 bg-black/80 backdrop-blur">
      {nav.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center text-xs ${
            pathname === href ? 'text-white font-bold' : 'text-gray-500'
          }`}
        >
          {icon}
          <span className="mt-1">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
