'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: '训练', Icon: HomeIcon },
    { href: '/history', label: '记录', Icon: BarChartIcon },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream/85 backdrop-blur-xl border-b border-sage/10">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <span className="w-8 h-8 rounded-lg bg-sage-light flex items-center justify-center">
            <DropIcon />
          </span>
          <span className="font-semibold text-slate-deep tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            提肛助手
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-sage-light text-sage'
                    : 'text-slate-soft hover:text-slate-deep'
                }`}
              >
                <Icon className={isActive ? 'text-sage' : 'text-slate-soft'} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}