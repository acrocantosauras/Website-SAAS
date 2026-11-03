'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu } from 'lucide-react';
import { brand } from '@/lib/brand';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/proof', label: 'Proof' },
  { href: '/ai-tools', label: 'AI Tools' },
  { href: '/contact', label: 'Contact' },
];

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3 text-ink" aria-label={`${brand.name} home`}>
            <span aria-hidden="true" className="relative flex h-9 w-9 items-center justify-center border border-copper">
              <span className="font-serif text-xl italic">R</span>
              <span className="absolute -bottom-0.5 right-1 h-3 w-px rotate-45 bg-copper" />
            </span>
            <span className="flex flex-col gap-1 leading-none">
              <span className="text-[11px] font-semibold tracking-[0.2em]">{brand.name.toUpperCase()}</span>
              <span className="text-[9px] font-medium tracking-[0.18em] text-muted">{brand.status.toUpperCase()}</span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-xs font-medium text-muted md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={`border-b py-1 transition-colors hover:border-copper hover:text-ink ${
                  pathname === item.href ? 'border-copper text-ink' : 'border-transparent'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/dashboard" className="border border-rule px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-ink">
              Demo app
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-ink px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#303b36]">
              Talk through your sales goals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-rule text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-marketing-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
        {menuOpen ? (
          <nav id="mobile-marketing-navigation" aria-label="Mobile navigation" className="border-t border-rule bg-paper px-5 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-rule py-3 text-sm text-ink last:border-b-0"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex gap-3">
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="border border-rule px-3 py-2 text-xs font-medium text-ink">
                  Demo app
                </Link>
                <Link href="/contact" onClick={() => setMenuOpen(false)} className="bg-ink px-3 py-2 text-xs font-medium text-white">
                  Talk through your sales goals
                </Link>
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      {children}

      <footer className="border-t border-rule bg-[#e9e4dc]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-12">
          <div>
            <div className="flex items-center gap-3 text-ink">
              <span aria-hidden="true" className="relative flex h-9 w-9 items-center justify-center border border-copper">
                <span className="font-serif text-xl italic">R</span>
                <span className="absolute -bottom-0.5 right-1 h-3 w-px rotate-45 bg-copper" />
              </span>
              <span className="flex flex-col gap-1 leading-none">
                <span className="text-[11px] font-semibold tracking-[0.2em]">{brand.name.toUpperCase()}</span>
                <span className="text-[9px] font-medium tracking-[0.18em] text-muted">{brand.status.toUpperCase()}</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              Human-led sales execution and leadership, supported by practical prospecting and outreach tools.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ink">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Start a conversation</p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink">
              Talk through your sales goals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
