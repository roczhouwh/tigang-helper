'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: '训练', icon: '🧘' },
    { href: '/history', label: '记录', icon: '📊' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-sage/10">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center">
            <span className="text-lg">🧘</span>
          </span>
          <span className="font-semibold text-slate-deep tracking-tight">提肛助手</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-sage-light text-sage'
                    : 'text-slate-soft hover:text-slate-deep'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}