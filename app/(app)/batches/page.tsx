'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, FileText, Search } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { downloadCsv, prospectingCsvRows } from '@/lib/download';
import { productDemoService, type DemoRun } from '@/lib/product-demo-service';

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
      downloadCsv(`${run.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-fictional-demo.csv`, prospectingCsvRows(run.prospects));
      return;
    }

    downloadCsv(`${run.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-drafts.csv`, [
      ['Name', 'Company', 'Email', 'Subject', 'Draft'],
      ...run.drafts.map(({ contact, subject, body }) => [contact.firstName, contact.company, contact.email, subject, body]),
    ]);
  }

  return (
    <AppShell>
      <div className="space-y-7">
        <header className="flex flex-col gap-4 border-b border-rule pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-copper">Workspace / History</p>
            <h1 className="mt-3 font-serif text-4xl tracking-[-0.05em] text-ink sm:text-5xl">Demo run history</h1>
            <p className="mt-3 text-sm text-muted">Saved locally in this browser. Runs are illustrative and not connected to a live service.</p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search demo runs</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search runs" className="w-full border border-rule bg-[#fbfaf7] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-ink" />
          </label>
        </header>

        {error ? <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p> : null}
        {!loaded && !error ? <p className="text-sm text-muted">Loading browser history…</p> : null}
        {loaded && !error && visibleRuns.length === 0 ? (
          <div className="border border-dashed border-rule bg-[#fbfaf7] p-6">
            <p className="text-sm font-medium text-ink">{runs.length === 0 ? 'Your demo history is empty.' : 'No runs match that search.'}</p>
            <p className="mt-2 text-xs text-muted">Saved runs from the Prospecting and Outreach demos will appear here.</p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link href="/prospecting" className="text-xs font-medium text-ink underline underline-offset-4">Try Prospecting</Link>
              <Link href="/outreach" className="text-xs font-medium text-ink underline underline-offset-4">Try Outreach</Link>
            </div>
          </div>
        ) : null}
        {visibleRuns.length > 0 ? (
          <section aria-label="Demo run records" className="divide-y divide-rule border-y border-rule">
            {visibleRuns.map((run) => (
              <article key={run.id} className="py-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex items-start gap-3">
                    <FileText aria-hidden="true" className="mt-0.5 h-4 w-4 text-copper" />
                    <div>
                      <h2 className="text-sm font-medium text-ink">{run.name}</h2>
                      <p className="mt-1 text-xs text-muted">
                        {run.kind === 'prospecting'
                          ? `Prospecting · ${run.prospects.length} fictional example records`
                          : `Outreach · ${run.contacts.length} contacts · ${run.drafts.length} drafts`}
                        {' · '}{run.status}
                      </p>
                      {run.status === 'failed' && run.failureReason ? <p className="mt-1 max-w-2xl text-xs text-red-800">{run.failureReason}</p> : null}
                      {run.status === 'processing' ? <p className="mt-1 max-w-2xl text-xs text-muted">This browser-local run has not been completed. Reopen its workflow to resume it.</p> : null}
                      {run.status !== 'ready' ? <Link href={`${run.kind === 'prospecting' ? '/prospecting' : '/outreach'}?run=${encodeURIComponent(run.id)}`} className="mt-2 inline-block text-xs font-medium text-ink underline underline-offset-4">Resume this workflow</Link> : null}
                      <time className="mt-1 block text-[10px] text-muted" dateTime={run.createdAt}>{new Date(run.createdAt).toLocaleString()}</time>
                    </div>
                  </div>
                  <button type="button" disabled={run.status !== 'ready'} onClick={() => exportRun(run)} className="inline-flex items-center gap-2 border border-rule px-3 py-2 text-xs font-medium text-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-40">
                    Download results <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
                <details className="mt-3 ml-7 border-t border-rule pt-3">
                  <summary className="cursor-pointer text-xs font-medium text-ink">View saved result details</summary>
                  {run.kind === 'prospecting' ? (
                    <div className="mt-3 space-y-3">
                      <p className="text-[10px] leading-5 text-muted">Fictional prospect examples · ICP: {run.icp.industry} · Titles: {run.icp.targetTitles}</p>
                      {run.prospects.map((prospect) => (
                        <div key={prospect.id} className="border-l border-rule pl-3">
                          <p className="text-xs font-medium text-ink">{prospect.company} · {prospect.contactName}, {prospect.title}</p>
                          <p className="mt-1 text-[11px] leading-5 text-muted">{prospect.description} Match notes: {prospect.matchReasons.join('; ')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 space-y-4">
                      <p className="text-[10px] leading-5 text-muted">Local draft examples · all require human review · no email is sent.</p>
                      {run.drafts.map((draft) => (
                        <div key={draft.id} className="border-l border-rule pl-3">
                          <p className="text-xs font-medium text-ink">{draft.contact.firstName || 'Contact'}{draft.contact.company ? ` · ${draft.contact.company}` : ''} — {draft.subject}</p>
                          <p className="mt-1 whitespace-pre-line text-xs leading-5 text-muted">{draft.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </details>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
