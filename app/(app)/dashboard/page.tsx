'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Clock3, FileText, MessageSquareText } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatusPill, runStatusLabel, runStatusTone } from '@/components/status-pill';
import { productDemoService, type DemoRun } from '@/lib/product-demo-service';
import { resumeCtaLabel, resumeHref, runSummary } from '@/lib/runs';

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
  const readyProspectRuns = prospectRuns.filter((run) => run.status === 'ready');
  const readyOutreachRuns = outreachRuns.filter((run) => run.status === 'ready');
  const exampleRecords = readyProspectRuns.reduce((total, run) => total + run.prospects.length, 0);
  const qualifiedRecords = readyProspectRuns.reduce(
    (total, run) => total + run.prospects.filter((prospect) => prospect.qualified).length,
    0,
  );
  const draftCount = readyOutreachRuns.reduce((total, run) => total + run.drafts.length, 0);
  const flaggedDrafts = readyOutreachRuns.reduce(
    (total, run) =>
      total + run.drafts.filter((draft) => draft.qualityChecks.some((check) => check.startsWith('Review:'))).length,
    0,
  );
  const interrupted = runs.filter((run) => run.status !== 'ready');

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
        <PageHeader
          eyebrow="Workspace / Overview"
          title="Your sales workspace"
          description="Explore sample prospecting and outreach flows. Every run stays in this browser; nothing is sent, billed or looked up externally."
          actions={
            <Link href="/prospecting" className="btn btn-primary">
              Start a prospecting brief
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          }
        />

        {error ? (
          <p role="alert" className="alert alert-error">
            {error}
          </p>
        ) : null}

        {interrupted.length > 0 ? (
          <div className="alert alert-warning justify-between gap-4">
            <p className="text-sm leading-6">
              {interrupted.length} saved {interrupted.length === 1 ? 'run needs' : 'runs need'} attention. Resuming continues
              the existing run instead of creating a new one.
            </p>
            <Link href="/batches" className="link-underline shrink-0 whitespace-nowrap">
              Open history
            </Link>
          </div>
        ) : null}

        <section aria-label="Workspace totals" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric
            label="Prospecting runs"
            value={loaded ? prospectRuns.length : '—'}
            hint={loaded && prospectRuns.length > 0 ? `${readyProspectRuns.length} completed` : 'Saved in this browser'}
          />
          <Metric
            label="Example records"
            value={loaded ? exampleRecords : '—'}
            hint={loaded ? `${qualifiedRecords} match all criteria` : 'Saved in this browser'}
          />
          <Metric
            label="Outreach runs"
            value={loaded ? outreachRuns.length : '—'}
            hint={loaded && outreachRuns.length > 0 ? `${readyOutreachRuns.length} completed` : 'Saved in this browser'}
          />
          <Metric
            label="Flagged drafts"
            value={loaded ? flaggedDrafts : '—'}
            hint={loaded && draftCount > 0 ? `of ${draftCount} drafts, by heuristic checks` : 'No drafts generated yet'}
          />
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Product tools</p>
              <h2 className="mt-2 font-serif text-2xl tracking-[-0.04em] text-ink">Choose a workflow</h2>
            </div>
            <Link href="/ai-tools" className="link-underline inline-flex items-center gap-2 !text-xs">
              Product details <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/prospecting"
              className="card animate-rise group p-5 transition-colors hover:border-copper"
            >
              <div className="flex items-start justify-between gap-3">
                <span aria-hidden="true" className="font-serif text-2xl italic leading-none text-copper">01</span>
                <BarChart3 aria-hidden="true" className="h-5 w-5 text-copper" />
              </div>
              <h3 className="mt-6 font-serif text-2xl text-ink">AI Prospecting</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                Build an ideal customer brief, compare it against a fixed fictional sample set, and export clearly labelled rows.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                Start demo <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/outreach"
              className="card animate-rise delay-1 group p-5 transition-colors hover:border-copper"
            >
              <div className="flex items-start justify-between gap-3">
                <span aria-hidden="true" className="font-serif text-2xl italic leading-none text-copper">02</span>
                <MessageSquareText aria-hidden="true" className="h-5 w-5 text-copper" />
              </div>
              <h3 className="mt-6 font-serif text-2xl text-ink">AI Outreach</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                Paste or upload contacts, generate local template drafts, and edit each one before downloading.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                Start demo <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>

        <section className="border-t border-rule pt-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Activity</p>
              <h2 className="mt-2 font-serif text-2xl tracking-[-0.04em] text-ink">Recent demo runs</h2>
            </div>
            <Link href="/batches" className="link-underline !text-xs">
              View history
            </Link>
          </div>

          {!loaded && !error ? (
            <p role="status" className="mt-4 text-sm text-muted">
              Loading browser history…
            </p>
          ) : null}

          {loaded && !error && runs.length === 0 ? (
            <EmptyState
              className="mt-4"
              icon={<Clock3 aria-hidden="true" className="h-5 w-5 text-muted" />}
              title="No demo runs yet"
              description="Complete either workflow to see its results saved here. Nothing leaves this browser."
              actions={
                <>
                  <Link href="/prospecting" className="link-underline !text-xs">
                    Try Prospecting
                  </Link>
                  <Link href="/outreach" className="link-underline !text-xs">
                    Try Outreach
                  </Link>
                </>
              }
            />
          ) : null}

          {runs.length > 0 ? (
            <ul className="mt-4 divide-y divide-rule border-y border-rule">
              {runs.slice(0, 5).map((run) => (
                <li key={run.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <FileText aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-ink">{run.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                        {run.kind === 'prospecting' ? 'Prospecting' : 'Outreach'} · {runSummary(run)}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        <time dateTime={run.createdAt}>{new Date(run.createdAt).toLocaleString()}</time>
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <StatusPill label={runStatusLabel(run.status)} tone={runStatusTone(run.status)} />
                    {run.status !== 'ready' ? (
                      <Link href={resumeHref(run)} className="link-underline !text-xs whitespace-nowrap">
                        {resumeCtaLabel(run)}
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <p className="text-[11px] leading-5 text-muted">
          All runs, rows, and drafts are illustrative. No payments, external data lookups, or emails are sent.
        </p>
      </div>
    </AppShell>
  );
}

function Metric({ label, value, hint }: { label: string; value: number | string; hint: string }) {
  return (
    <div className="stat-card animate-rise">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl tracking-[-0.04em] text-ink">{value}</p>
      <p className="mt-1 text-[10px] leading-4 text-muted">{hint}</p>
    </div>
  );
}
