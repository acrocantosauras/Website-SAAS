'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CircleUserRound,
  FileText,
  LayoutDashboard,
  MessageSquareText,
} from 'lucide-react';
import { brand } from '@/lib/brand';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/prospecting', label: 'Prospecting', icon: BarChart3 },
  { href: '/outreach', label: 'Outreach', icon: MessageSquareText },
  { href: '/batches', label: 'History', icon: FileText },
  { href: '/account', label: 'Workspace', icon: CircleUserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-app-canvas text-ink">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-rule bg-[#fbfaf7] lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-rule px-5 py-4 lg:block lg:px-6 lg:py-6">
            <Link href="/" className="flex items-center gap-3 text-ink" aria-label={`${brand.name} public site`}>
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center border border-copper font-serif text-xl italic">
                R
              </span>
              <span className="flex flex-col gap-1 leading-none">
                <span className="text-[11px] font-semibold tracking-[0.18em]">{brand.name.toUpperCase()}</span>
                <span className="text-[9px] font-medium tracking-[0.18em] text-muted">{brand.status.toUpperCase()}</span>
              </span>
            </Link>
            <span className="border border-rule px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-muted lg:mt-5 lg:inline-flex">
              Demo workspace
            </span>
          </div>

          <nav aria-label="Workspace navigation" className="grid grid-cols-2 gap-1 px-3 py-3 sm:grid-cols-5 lg:block lg:space-y-1 lg:px-3">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-w-0 items-center gap-2.5 border px-3 py-2.5 text-xs font-medium transition-colors lg:w-full ${
                    isActive
                      ? 'border-ink bg-ink text-white'
                      : 'border-transparent text-muted hover:border-rule hover:bg-white hover:text-ink'
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto hidden border-t border-rule px-6 py-5 lg:block">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted">Prototype</p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Actions and data in this workspace are simulated and saved only in this browser.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-app-canvas px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
