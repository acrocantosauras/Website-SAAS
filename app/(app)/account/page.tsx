import { AppShell } from '@/components/app-shell';
import { brand } from '@/lib/brand';

export default function AccountPage() {
  return (
    <AppShell>
      <div className="space-y-7">
        <header className="border-b border-rule pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-copper">Workspace / Settings</p>
          <h1 className="mt-3 font-serif text-4xl tracking-[-0.05em] text-ink sm:text-5xl">Workspace details</h1>
          <p className="mt-3 text-sm text-muted">A clearly labelled prototype view. No account or payment provider is connected.</p>
        </header>
        <section className="max-w-2xl divide-y divide-rule border-y border-rule">
          <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Workspace label</p>
            <p className="text-sm font-medium text-ink">{brand.name} <span className="ml-2 border border-rule px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-muted">{brand.status}</span></p>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Authentication</p>
            <p className="text-sm text-ink">Not implemented — demo access only</p>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Billing</p>
            <p className="text-sm text-ink">No billing integration or payment data</p>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Demo history</p>
            <p className="text-sm text-ink">Saved in local browser storage; clearing browser data removes it</p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
