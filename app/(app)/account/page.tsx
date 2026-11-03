import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { brand } from '@/lib/brand';

const details = [
  { label: 'Workspace label', value: `${brand.name} · ${brand.status}` },
  { label: 'Authentication', value: 'Not implemented — demo access only' },
  { label: 'Billing', value: 'No billing integration or payment data' },
  { label: 'Demo history', value: 'Saved in local browser storage; clearing browser data removes it' },
  { label: 'Data sources', value: 'Fixed fictional sample records — no external lookups' },
];

const boundaries = [
  'No account system, billing provider or payment flow is connected.',
  'No prospecting engine or enrichment provider is queried.',
  'No AI service generates the drafts; local templates are used.',
  'No email is sent from this application.',
];

export default function AccountPage() {
  return (
    <AppShell>
      <div className="space-y-7">
        <PageHeader
          eyebrow="Workspace / Settings"
          title="Workspace details"
          description="A clearly labelled prototype view. These settings describe the demo boundaries rather than a live subscription."
          actions={
            <Link href="/batches" className="btn btn-secondary">
              View history
            </Link>
          }
        />

        <section aria-label="Workspace details" className="divide-y divide-rule border-y border-rule">
          {details.map(({ label, value }) => (
            <div key={label} className="grid gap-2 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{label}</p>
              <p className="break-words text-sm text-ink">{value}</p>
            </div>
          ))}
        </section>

        <section aria-label="Demo boundaries" className="card p-5">
          <p className="eyebrow">What this demo does not do</p>
          <ul className="mt-4 space-y-2">
            {boundaries.map((boundary) => (
              <li key={boundary} className="flex items-start gap-3 text-sm leading-6 text-muted">
                <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-copper" />
                {boundary}
              </li>
            ))}
          </ul>
          <Link href="/ai-tools" className="link-underline mt-5 inline-flex items-center gap-2 !text-xs">
            Read the product overview <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
