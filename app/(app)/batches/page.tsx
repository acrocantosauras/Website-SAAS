'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, FileText, Search } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatusPill, runStatusLabel, runStatusTone } from '@/components/status-pill';
import { csvFilename, downloadCsv, outreachCsvRows, prospectingCsvRows } from '@/lib/download';
import { productDemoService, type DemoRun } from '@/lib/product-demo-service';
import { draftFlagCount, resumeCtaLabel, resumeHref, runSummary } from '@/lib/runs';

function errorText(error: unknown) {
  if (error instanceof Error) return error.message;
  console.error('Unable to read demo run history.', error);
  return 'Demo history could not be loaded.';
}

export default function BatchesPage() {
  const [runs, setRuns] = useState<DemoRun[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    productDemoService
      .listRuns()
      .then(setRuns)
      .catch((reason: unknown) => setError(errorText(reason)))
      .finally(() => setLoaded(true));
  }, []);

  const visibleRuns = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return runs;
    return runs.filter((run) => `${run.name} ${run.kind} ${run.status}`.toLowerCase().includes(query));
  }, [runs, search]);

  function exportRun(run: DemoRun) {
    if (run.kind === 'prospecting') {
      downloadCsv(csvFilename(run.name, 'fictional-demo'), prospectingCsvRows(run.prospects));
      return;
    }

    downloadCsv(csvFilename(run.name, 'drafts'), outreachCsvRows(run.drafts));
  }

  return (
    <AppShell>
      <div className="space-y-7">
        <PageHeader
          eyebrow="Workspace / History"
          title="Demo run history"
          description="Every run saved in this browser, with the results you can inspect, resume or export. Runs are illustrative and not connected to a live service."
          actions={
            <Link href="/dashboard" className="btn btn-secondary">
              Back to overview
            </Link>
          }
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search demo runs</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, type or status"
              className="form-field pl-10"
            />
          </label>
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted">
            {loaded ? `${visibleRuns.length} of ${runs.length} saved run${runs.length === 1 ? '' : 's'}` : 'Reading browser history'}
          </p>
        </div>

        {error ? (
          <p role="alert" className="alert alert-error">
            {error}
          </p>
        ) : null}

        {!loaded && !error ? (
          <p role="status" className="text-sm text-muted">
            Loading browser history…
          </p>
        ) : null}

        {loaded && !error && runs.length === 0 ? (
          <EmptyState
            icon={<FileText aria-hidden="true" className="h-5 w-5 text-muted" />}
            title="Your demo history is empty"
            description="Saved runs from the Prospecting and Outreach demos will appear here, with their results and exports."
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

        {loaded && !error && runs.length > 0 && visibleRuns.length === 0 ? (
          <EmptyState
            title="No runs match that search"
            description="Try a run name, or clear the search to see every saved run."
            actions={
              <button type="button" onClick={() => setSearch('')} className="btn btn-secondary !py-2 text-xs">
                Clear search
              </button>
            }
          />
        ) : null}

        {visibleRuns.length > 0 ? (
          <section aria-label="Demo run records" className="divide-y divide-rule border-y border-rule">
            {visibleRuns.map((run) => {
              const canExport = run.status === 'ready' && (run.kind === 'prospecting' ? run.prospects.length > 0 : run.drafts.length > 0);

              return (
                <article key={run.id} className="animate-rise-sm py-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <FileText aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="min-w-0 break-words text-sm font-medium text-ink">{run.name}</h2>
                          <StatusPill label={run.kind === 'prospecting' ? 'Prospecting' : 'Outreach'} />
                          <StatusPill label={runStatusLabel(run.status)} tone={runStatusTone(run.status)} />
                        </div>
                        <p className="mt-2 text-xs leading-5 text-muted">{runSummary(run)}</p>
                        <p className="mt-1 text-[11px] text-muted">
                          <time dateTime={run.createdAt}>{new Date(run.createdAt).toLocaleString()}</time>
                        </p>

                        {run.status === 'failed' && run.failureReason ? (
                          <p role="alert" className="alert alert-error mt-3 !px-3 !py-2 text-xs">
                            {run.failureReason}
                          </p>
                        ) : null}
                        {run.status === 'processing' ? (
                          <p className="alert alert-warning mt-3 !px-3 !py-2 text-xs">
                            This browser-local run has not finished. Reopen its workflow to resume the same run.
                          </p>
                        ) : null}

                        {run.status !== 'ready' ? (
                          <Link href={resumeHref(run)} className="link-underline mt-3 inline-flex items-center gap-2 !text-xs">
                            {resumeCtaLabel(run)} <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                          </Link>
                        ) : null}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!canExport}
                      onClick={() => exportRun(run)}
                      className="btn btn-secondary shrink-0 !py-2 text-xs"
                      title={canExport ? 'Download the saved results as CSV' : 'Results are only available for completed runs'}
                    >
                      Download results <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <details className="ml-0 mt-4 border-t border-rule pt-3 sm:ml-7">
                    <summary className="cursor-pointer text-xs font-medium text-ink marker:text-copper">
                      View saved result details
                    </summary>
                    {run.kind === 'prospecting' ? (
                      <div className="mt-3 space-y-3">
                        <p className="text-[10px] leading-5 text-muted">
                          Fictional prospect examples · ICP: {run.icp.industry} · Titles: {run.icp.targetTitles}
                        </p>
                        {run.prospects.length === 0 ? (
                          <p className="text-xs text-muted">No sample records met the matching threshold for this brief.</p>
                        ) : null}
                        {run.prospects.map((prospect) => (
                          <div key={prospect.id} className="border-l border-rule pl-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="break-words text-xs font-medium text-ink">
                                {prospect.company} · {prospect.contactName}, {prospect.title}
                              </p>
                              <StatusPill
                                label={prospect.qualified ? 'All criteria' : 'Partial match'}
                                tone={prospect.qualified ? 'positive' : 'warning'}
                              />
                              <span className="text-[10px] uppercase tracking-[0.12em] text-muted">{prospect.matchScore}% fit</span>
                            </div>
                            <p className="mt-1 text-[11px] leading-5 text-muted">
                              {prospect.description} Match notes: {prospect.matchReasons.join('; ')}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 space-y-4">
                        <p className="text-[10px] leading-5 text-muted">
                          Local draft examples · {draftFlagCount(run)} of {run.drafts.length} flagged by heuristic review checks ·
                          no email is sent.
                        </p>
                        {run.drafts.map((draft) => (
                          <div key={draft.id} className="border-l border-rule pl-3">
                            <p className="break-words text-xs font-medium text-ink">
                              {draft.contact.firstName || 'Contact'}
                              {draft.contact.company ? ` · ${draft.contact.company}` : ''} — {draft.subject}
                            </p>
                            <p className="mt-1 whitespace-pre-line break-words text-xs leading-5 text-muted">{draft.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </details>
                </article>
              );
            })}
          </section>
        ) : null}

        <p className="text-[11px] leading-5 text-muted">
          Exports contain only the fictional records saved with each run. Downloads use the same CSV structure as the
          workflow that created them.
        </p>
      </div>
    </AppShell>
  );
}
