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

const container = 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12';

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#marketing-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-ink focus:bg-surface focus:px-4 focus:py-2 focus:text-xs focus:font-medium"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
        <div className={`${container} flex items-center justify-between gap-3 py-3.5`}>
          <Link href="/" className="flex min-w-0 items-center gap-3 text-ink" aria-label={`${brand.name} home`}>
            <span aria-hidden="true" className="relative flex h-9 w-9 shrink-0 items-center justify-center border border-copper">
              <span className="font-serif text-xl italic">R</span>
              <span className="absolute -bottom-0.5 right-1 h-3 w-px rotate-45 bg-copper" />
            </span>
            <span className="flex min-w-0 flex-col gap-1 leading-none">
              <span className="truncate text-[11px] font-semibold tracking-[0.2em]">{brand.name.toUpperCase()}</span>
              <span className="truncate text-[9px] font-medium tracking-[0.18em] text-muted">{brand.status.toUpperCase()}</span>
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
            <Link href="/dashboard" className="btn btn-secondary !py-2 text-xs">
              Demo app
            </Link>
            <Link href="/contact" className="btn btn-primary !py-2 text-xs">
              Talk through your sales goals
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-rule text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-marketing-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        {menuOpen ? (
          <nav id="mobile-marketing-navigation" aria-label="Mobile navigation" className="border-t border-rule bg-paper px-5 py-4 md:hidden">
            <div className={`${container} !px-0 flex flex-col`}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between border-b border-rule py-3 text-sm last:border-b-0 ${
                    pathname === item.href ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {item.label}
                  {pathname === item.href ? <span aria-hidden="true" className="h-px w-5 bg-copper" /> : null}
                </Link>
              ))}
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn btn-secondary flex-1 text-xs">
                  Demo app
                </Link>
                <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn btn-primary flex-1 text-xs">
                  Talk through your sales goals
                </Link>
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      <main id="marketing-main">{children}</main>

      <footer className="border-t border-rule bg-[#e9e4dc]">
        <div className={`${container} grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]`}>
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
            <p className="mt-4 max-w-md text-[11px] leading-5 text-muted">
              The live product is a demonstration: results are simulated, no emails are sent and no payment is taken.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-ink">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Start a conversation</p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-copper">
              Talk through your sales goals <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-[11px] leading-5 text-muted">
              Or open the <Link href="/dashboard" className="underline underline-offset-2 hover:text-ink">demo workspace</Link>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
