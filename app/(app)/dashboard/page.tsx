'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Clock3, FileText, MessageSquareText } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { productDemoService, type DemoRun } from '@/lib/product-demo-service';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  console.error('Unable to load demo workspace history.', error);
  return 'Demo history could not be loaded.';
}

export default function DashboardPage() {
  const [runs, setRuns] = useState<DemoRun[]>([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const prospectRuns = runs.filter((run) => run.kind === 'prospecting');
  const outreachRuns = runs.filter((run) => run.kind === 'outreach');
  const prospectExamples = prospectRuns.reduce((total, run) => total + (run.status === 'ready' ? run.prospects.length : 0), 0);
  const outreachDrafts = outreachRuns.reduce((total, run) => total + run.drafts.length, 0);

  useEffect(() => {
    productDemoService
      .listRuns()
      .then(setRuns)
      .catch((reason: unknown) => setError(getErrorMessage(reason)))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="border-b border-rule pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-copper">Workspace / Overview</p>
          <h1 className="mt-3 font-serif text-4xl tracking-[-0.05em] text-ink sm:text-5xl">Your sales workspace</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Explore sample prospecting and outreach flows. This prototype keeps its demo runs in your browser and does not connect to a sales platform.
          </p>
        </header>

        <div className="flex items-start gap-3 border-l-2 border-copper bg-sage/50 px-4 py-3 text-xs leading-5 text-ink">
          <span className="font-semibold uppercase tracking-[0.13em]">Demo</span>
          <p>All runs, rows, and drafts are illustrative. No payments, external data lookups, or emails are sent.</p>
        </div>

        <section aria-label="Local demo totals" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryMetric label="Prospecting runs" value={loaded ? prospectRuns.length : '—'} />
          <SummaryMetric label="Example records" value={loaded ? prospectExamples : '—'} />
          <SummaryMetric label="Outreach runs" value={loaded ? outreachRuns.length : '—'} />
          <SummaryMetric label="Drafts for review" value={loaded ? outreachDrafts : '—'} />
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Product tools</p>
              <h2 className="mt-2 font-serif text-2xl tracking-[-0.04em] text-ink">Choose a workflow</h2>
            </div>
            <Link href="/ai-tools" className="inline-flex items-center gap-2 text-xs font-medium text-ink hover:text-copper">
              Product details <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/prospecting" className="group border border-rule bg-[#fbfaf7] p-5 transition-colors hover:border-copper">
              <BarChart3 aria-hidden="true" className="h-5 w-5 text-copper" />
              <h3 className="mt-5 font-serif text-2xl text-ink">AI Prospecting</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">Build an ideal customer brief, review a simulated batch, and export clearly labelled sample rows.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">Start demo <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
            </Link>
            <Link href="/outreach" className="group border border-rule bg-[#fbfaf7] p-5 transition-colors hover:border-copper">
              <MessageSquareText aria-hidden="true" className="h-5 w-5 text-copper" />
              <h3 className="mt-5 font-serif text-2xl text-ink">AI Outreach</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">Preview a CSV or paste records, generate local draft examples, and download for human review.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">Start demo <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </div>
        </section>

        <section className="border-t border-rule pt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Activity</p>
              <h2 className="mt-2 font-serif text-2xl tracking-[-0.04em] text-ink">Recent demo runs</h2>
            </div>
            <Link href="/batches" className="text-xs font-medium text-ink underline underline-offset-4">View history</Link>
          </div>

          {error ? <p role="alert" className="mt-4 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p> : null}
          {!loaded && !error ? <p className="mt-4 text-sm text-muted">Loading browser history…</p> : null}
          {loaded && !error && runs.length === 0 ? (
            <div className="mt-4 flex flex-col items-start border border-dashed border-rule bg-[#fbfaf7] p-5">
              <Clock3 aria-hidden="true" className="h-5 w-5 text-muted" />
              <p className="mt-3 text-sm font-medium text-ink">No demo runs yet</p>
              <p className="mt-1 text-xs text-muted">Complete either product workflow to see its results saved here.</p>
            </div>
          ) : null}
          {runs.length > 0 ? (
            <ul className="mt-4 divide-y divide-rule border-y border-rule">
              {runs.slice(0, 5).map((run) => (
                <li key={run.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <FileText aria-hidden="true" className="h-4 w-4 text-copper" />
                    <div>
                      <p className="text-sm font-medium text-ink">{run.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                        {run.kind} · {run.status} · {run.kind === 'prospecting' ? `${run.prospects.length} example records` : `${run.drafts.length} drafts`}
                      </p>
                    </div>
                  </div>
                  <time className="text-xs text-muted" dateTime={run.createdAt}>{new Date(run.createdAt).toLocaleString()}</time>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-rule bg-surface p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl tracking-[-0.04em] text-ink">{value}</p>
      <p className="mt-1 text-[10px] text-muted">Saved in this browser</p>
    </div>
  );
}
