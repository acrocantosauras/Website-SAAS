'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Download, Search, SearchCheck } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatusPill } from '@/components/status-pill';
import { productDemoService, type ProspectingInput, type ProspectingRun } from '@/lib/product-demo-service';
import { csvFilename, downloadCsv, prospectingCsvRows } from '@/lib/download';

type Step = 'define' | 'review' | 'processing' | 'failed' | 'results';

const initialInput: ProspectingInput = {
  batchName: '',
  industry: '',
  targetTitles: '',
  geography: '',
  companySize: '',
  companyType: '',
  qualificationCriteria: '',
};

const steps: { key: Step; label: string }[] = [
  { key: 'define', label: 'Define ICP' },
  { key: 'review', label: 'Review' },
  { key: 'processing', label: 'Demo run' },
  { key: 'results', label: 'Results' },
];

const fieldGroups = ['Company profile', 'People and qualification'];

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  console.error('Prospecting demo operation failed with a non-Error value.', error);
  return 'The demo could not complete this action. Please try again.';
}

async function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timeout: number | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = window.setTimeout(() => reject(new Error('The local demo took too long to finish. Retry this same run.')), milliseconds);
      }),
    ]);
  } finally {
    if (timeout !== undefined) window.clearTimeout(timeout);
  }
}

function isUnmatchedReason(reason: string) {
  return /does not|do not/.test(reason);
}

export function ProspectingWorkflow() {
  const [step, setStep] = useState<Step>('define');
  const [input, setInput] = useState(initialInput);
  const [run, setRun] = useState<ProspectingRun | null>(null);
  const [recentRuns, setRecentRuns] = useState<ProspectingRun[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'qualified' | 'not-qualified'>('all');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');
  const operationLock = useRef(false);
  const pageSize = 5;

  useEffect(() => {
    productDemoService
      .listRuns()
      .then((runs) => {
        const prospectingRuns = runs.filter((entry): entry is ProspectingRun => entry.kind === 'prospecting');
        setRecentRuns(prospectingRuns.slice(0, 3));
        const requestedRunId = new URLSearchParams(window.location.search).get('run');
        const requestedRun = prospectingRuns.find((entry) => entry.id === requestedRunId);
        const interruptedRun = requestedRun && requestedRun.status !== 'ready'
          ? requestedRun
          : prospectingRuns.find((entry) => entry.status === 'processing' || entry.status === 'failed');
        if (interruptedRun) {
          setRun(interruptedRun);
          setInput(interruptedRun.icp);
          setFailureMessage(interruptedRun.failureReason || 'A saved run was interrupted or is still processing. Retry to resume this same batch.');
          setStep('failed');
        }
      })
      .catch((reason: unknown) => setError(getErrorMessage(reason)));
  }, []);

  function updateField<K extends keyof ProspectingInput>(field: K, value: ProspectingInput[K]) {
    setInput((current) => ({ ...current, [field]: value }));
  }

  function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setStep('review');
  }

  async function handleSimulatedPurchase() {
    if (operationLock.current) return;
    operationLock.current = true;
    setBusy(true);
    setError('');
    setFailureMessage('');
    let activeRun: ProspectingRun | null = run?.status !== 'ready' ? run : null;
    try {
      if (!activeRun) {
        activeRun = await productDemoService.startProspecting(input);
        setRun(activeRun);
      }
      setStep('processing');
      await withTimeout(new Promise<void>((resolve) => window.setTimeout(resolve, 650)), 8000);
      const completedRun = await withTimeout(productDemoService.completeProspecting(activeRun.id), 8000);
      setRun(completedRun);
      setRecentRuns((current) => [completedRun, ...current.filter((entry) => entry.id !== completedRun.id)].slice(0, 3));
      setStep('results');
    } catch (reason: unknown) {
      const message = getErrorMessage(reason);
      setFailureMessage(message);
      if (activeRun) {
        setRun({ ...activeRun, status: 'failed', failureReason: message });
        try {
          const failedRun = await productDemoService.failRun(activeRun.id, message);
          if (failedRun.kind === 'prospecting') {
            setRun(failedRun);
            if (failedRun.status === 'ready') {
              setStep('results');
              return;
            }
          }
        } catch (persistReason: unknown) {
          const persistMessage = getErrorMessage(persistReason);
          setFailureMessage(`${message} The failed status could not be saved: ${persistMessage}`);
        }
      }
      setStep('failed');
    } finally {
      operationLock.current = false;
      setBusy(false);
    }
  }

  function exportResults(target: ProspectingRun) {
    downloadCsv(csvFilename(target.name, 'fictional-demo'), prospectingCsvRows(target.prospects));
  }

  const visibleProspects = useMemo(() => {
    if (!run) return [];
    const query = search.trim().toLowerCase();
    return run.prospects.filter((prospect) => {
      const matchesSearch = `${prospect.company} ${prospect.contactName} ${prospect.title} ${prospect.industry} ${prospect.geography}`
        .toLowerCase()
        .includes(query);
      const matchesFilter = filter === 'all' || (filter === 'qualified' ? prospect.qualified : !prospect.qualified);
      return matchesSearch && matchesFilter;
    });
  }, [filter, run, search]);
  const pageCount = Math.max(1, Math.ceil(visibleProspects.length / pageSize));
  const pagedProspects = visibleProspects.slice((page - 1) * pageSize, page * pageSize);
  const qualifiedCount = run?.prospects.filter((prospect) => prospect.qualified).length ?? 0;
  const partialCount = (run?.prospects.length ?? 0) - qualifiedCount;
  const currentStepIndex = step === 'failed' ? 2 : steps.findIndex(({ key }) => key === step);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link
          href="/ai-tools"
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /> AI products
        </Link>
        <PageHeader
          eyebrow="Self-service demo / 01"
          title="AI Prospecting"
          description="Describe your ideal company and decision-maker, review the brief, then compare it against a fixed set of fictional sample records."
          actions={<span className="badge badge-neutral">Demo only · no payment</span>}
        />
      </div>

      <nav aria-label="Prospecting steps" className="animate-rise">
        <ol className="grid grid-cols-4 gap-2 border-y border-rule py-4">
          {steps.map(({ key, label }, index) => {
            const state = index < currentStepIndex ? 'done' : index === currentStepIndex ? 'current' : 'upcoming';
            return (
              <li key={key} className="flex min-w-0 items-center gap-2 sm:gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center border text-[10px] font-medium ${
                    state === 'upcoming' ? 'border-rule text-muted' : 'border-ink bg-ink text-white'
                  }`}
                >
                  {state === 'done' ? <Check className="h-3.5 w-3.5" /> : String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={`hidden min-w-0 truncate text-[10px] font-medium uppercase tracking-[0.12em] sm:block ${
                    state === 'current' ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {label}
                  {state === 'current' ? <span className="sr-only"> (current step)</span> : null}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      {error ? (
        <p role="alert" className="alert alert-error">
          {error}
        </p>
      ) : null}

      {step === 'define' ? (
        <form onSubmit={handleReview} className="grid gap-8 lg:grid-cols-[1fr_0.62fr]">
          <section className="space-y-7">
            <fieldset className="animate-rise">
              <legend className="flex items-baseline gap-3 font-serif text-xl text-ink">
                <span aria-hidden="true" className="font-serif text-sm italic text-copper">01</span>
                {fieldGroups[0]}
              </legend>
              <p className="mt-1 text-xs leading-5 text-muted">Describe the kinds of organizations you want to reach.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="field-label sm:col-span-2">
                  Industry <span className="ml-1 font-normal text-copper">Required</span>
                  <input
                    required
                    value={input.industry}
                    onChange={(event) => updateField('industry', event.target.value)}
                    maxLength={80}
                    placeholder="e.g. B2B software"
                    className="form-field mt-2 font-normal"
                  />
                </label>
                <label className="field-label">
                  Geography <span className="ml-1 font-normal text-muted">Optional</span>
                  <input
                    value={input.geography}
                    onChange={(event) => updateField('geography', event.target.value)}
                    maxLength={100}
                    placeholder="e.g. Canada and United States"
                    className="form-field mt-2 font-normal"
                  />
                </label>
                <label className="field-label">
                  Company size <span className="ml-1 font-normal text-muted">Optional</span>
                  <input
                    value={input.companySize}
                    onChange={(event) => updateField('companySize', event.target.value)}
                    maxLength={80}
                    placeholder="e.g. 50–250 employees"
                    className="form-field mt-2 font-normal"
                  />
                </label>
                <label className="field-label sm:col-span-2">
                  Company type <span className="ml-1 font-normal text-muted">Optional</span>
                  <input
                    value={input.companyType}
                    onChange={(event) => updateField('companyType', event.target.value)}
                    maxLength={100}
                    placeholder="e.g. Founder-led, service business, or product company"
                    className="form-field mt-2 font-normal"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="animate-rise delay-1 border-t border-rule pt-6">
              <legend className="flex items-baseline gap-3 font-serif text-xl text-ink">
                <span aria-hidden="true" className="font-serif text-sm italic text-copper">02</span>
                {fieldGroups[1]}
              </legend>
              <p className="mt-1 text-xs leading-5 text-muted">Specify the decision-makers and any extra fit signals.</p>
              <div className="mt-4 grid gap-4">
                <label className="field-label">
                  Target job titles <span className="ml-1 font-normal text-copper">Required</span>
                  <input
                    required
                    value={input.targetTitles}
                    onChange={(event) => updateField('targetTitles', event.target.value)}
                    maxLength={120}
                    placeholder="e.g. VP Operations, COO"
                    className="form-field mt-2 font-normal"
                  />
                  <span className="field-note">Separate multiple titles with commas.</span>
                </label>
                <label className="field-label">
                  Qualification criteria <span className="ml-1 font-normal text-muted">Optional</span>
                  <textarea
                    value={input.qualificationCriteria}
                    onChange={(event) => updateField('qualificationCriteria', event.target.value)}
                    maxLength={400}
                    rows={3}
                    placeholder="e.g. Has an in-house operations team; exclude agencies."
                    className="form-field mt-2 resize-y font-normal"
                  />
                  <span className="field-note">Keywords are compared against each sample record; use “exclude” to rule a term out.</span>
                </label>
                <label className="field-label">
                  Batch name <span className="ml-1 font-normal text-muted">Optional</span>
                  <input
                    value={input.batchName}
                    onChange={(event) => updateField('batchName', event.target.value)}
                    maxLength={70}
                    placeholder="e.g. Operations leaders"
                    className="form-field mt-2 font-normal"
                  />
                </label>
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-4 border-t border-rule pt-5">
              <button type="submit" className="btn btn-primary">
                Review target brief <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
              <span className="text-[11px] text-muted">Two required fields · nothing is charged or sent.</span>
            </div>
          </section>

          <aside className="h-fit border-l-2 border-copper bg-sage/50 p-5 lg:sticky lg:top-6">
            <p className="eyebrow !text-muted">Prototype boundary</p>
            <h2 className="mt-3 font-serif text-2xl tracking-[-0.03em] text-ink">Sample companies, not live research.</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              This demo stores runs in this browser and returns fictional records using reserved example domains. No data
              provider, payment service, or external prospecting engine is connected.
            </p>
            <ul className="mt-5 space-y-2 border-t border-rule pt-4">
              {['Fixed set of fictional records', 'Reserved .example domains', 'Saved only in this browser'].map((item) => (
                <li key={item} className="flex items-start gap-3 text-xs leading-5 text-muted">
                  <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-copper" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </form>
      ) : null}

      {step === 'review' ? (
        <section className="card animate-rise max-w-3xl p-5 sm:p-7">
          <p className="eyebrow">Review before continuing</p>
          <h2 className="mt-3 break-words font-serif text-3xl tracking-[-0.04em] text-ink">
            {input.batchName || 'Prospecting target brief'}
          </h2>
          <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {[
              ['Industry', input.industry],
              ['Target titles', input.targetTitles],
              ['Geography', input.geography || 'Not specified'],
              ['Company size', input.companySize || 'Not specified'],
              ['Company type', input.companyType || 'Not specified'],
              ['Qualification criteria', input.qualificationCriteria || 'Not specified'],
            ].map(([label, value]) => (
              <div key={label} className="border-t border-rule pt-3">
                <dt className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</dt>
                <dd className="mt-1 break-words text-sm leading-6 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setStep('define')} className="btn btn-secondary">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Edit brief
            </button>
            <button type="button" disabled={busy} onClick={handleSimulatedPurchase} className="btn btn-primary">
              {busy ? 'Starting demo…' : 'Run the sample batch'} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-muted">
            Checkout is simulated and takes no payment. No price or batch size is shown because neither is confirmed.
          </p>
        </section>
      ) : null}

      {step === 'failed' ? (
        <section role="alert" className="animate-rise max-w-3xl border border-red-300 bg-red-50 p-5 sm:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-800">
            {run?.status === 'processing' ? 'Run needs resuming' : 'Demo run failed'}
          </p>
          <h2 className="mt-2 font-serif text-2xl text-ink">Your brief is still available.</h2>
          <p className="mt-2 break-words text-sm leading-6 text-red-900">{failureMessage}</p>
          <p className="mt-2 text-xs leading-5 text-red-900/80">Retry resumes this saved run rather than creating another batch.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={busy} onClick={handleSimulatedPurchase} className="btn btn-primary">
              {busy ? 'Retrying…' : 'Retry this run'}
            </button>
            <button type="button" onClick={() => { setRun(null); setStep('define'); }} className="btn btn-secondary !bg-white">
              Start a new brief
            </button>
          </div>
        </section>
      ) : null}

      {step === 'processing' ? (
        <section aria-live="polite" className="card animate-rise flex min-h-64 max-w-3xl flex-col items-start justify-center p-6">
          <SearchCheck aria-hidden="true" className="h-7 w-7 text-copper" />
          <p className="mt-5 eyebrow">Simulated processing</p>
          <h2 className="mt-2 font-serif text-3xl text-ink">Preparing fictional examples</h2>
          <p className="mt-3 text-sm leading-6 text-muted">These records are illustrative and are not the result of live prospect research.</p>
          <div className="mt-6 h-1 w-full max-w-sm overflow-hidden bg-rule">
            <div className="h-full w-2/3 animate-pulse bg-copper motion-reduce:animate-none" />
          </div>
        </section>
      ) : null}

      {step === 'results' && run ? (
        <section className="space-y-5">
          <div className="card animate-rise flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="eyebrow">Fictional prospect demo</p>
              <h2 className="mt-2 break-words font-serif text-3xl tracking-[-0.04em] text-ink">{run.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {run.prospects.length} sample record{run.prospects.length === 1 ? '' : 's'} · {qualifiedCount} match all
                criteria · {partialCount} partial
              </p>
            </div>
            <button
              type="button"
              disabled={run.prospects.length === 0}
              onClick={() => exportResults(run)}
              className="btn btn-primary shrink-0"
            >
              <Download aria-hidden="true" className="h-4 w-4" /> Download sample CSV
            </button>
          </div>

          {run.prospects.length === 0 ? (
            <EmptyState
              icon={<SearchCheck aria-hidden="true" className="h-5 w-5 text-muted" />}
              title="No sample records meet this brief"
              description="No records in this fictional sample set reach the minimum matching threshold for this ICP. Broaden one or more criteria to see whether any illustrative records fit — no prospects are invented to fill a batch."
              actions={
                <button type="button" onClick={() => setStep('define')} className="btn btn-secondary !py-2 text-xs">
                  Edit the brief
                </button>
              }
            />
          ) : qualifiedCount < run.prospects.length ? (
            <p role="status" className="alert alert-warning">
              <span>
                <strong className="font-semibold">{qualifiedCount}</strong> record{qualifiedCount === 1 ? '' : 's'} match all
                supplied criteria. The rest are partial matches, ranked by their criteria score. This is a fixed sample set,
                not live research.
              </span>
            </p>
          ) : (
            <p role="status" className="alert alert-warning">
              All displayed sample records match the entered criteria; matches are heuristic comparisons against fictional
              demo data only.
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <span className="sr-only">Search prospects</span>
              <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                placeholder="Search company, person, title, region…"
                className="form-field pl-10"
              />
            </label>
            <label>
              <span className="sr-only">Filter by match</span>
              <select
                value={filter}
                onChange={(event) => { setFilter(event.target.value as typeof filter); setPage(1); }}
                className="form-field"
              >
                <option value="all">All example records</option>
                <option value="qualified">All criteria</option>
                <option value="not-qualified">Partial match</option>
              </select>
            </label>
            <p className="self-center text-[11px] uppercase tracking-[0.12em] text-muted sm:text-right">
              {visibleProspects.length} shown
            </p>
          </div>

          <div className="space-y-3">
            {pagedProspects.map((prospect) => (
              <ProspectCard
                key={prospect.id}
                prospect={prospect}
                expanded={selectedId === prospect.id}
                onToggle={() => setSelectedId((id) => (id === prospect.id ? null : prospect.id))}
              />
            ))}
            {pagedProspects.length === 0 ? (
              <EmptyState
                title="No records match these filters"
                description="Clear the search or switch the filter back to all example records."
                actions={
                  <button
                    type="button"
                    onClick={() => { setSearch(''); setFilter('all'); setPage(1); }}
                    className="btn btn-secondary !py-2 text-xs"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : null}
          </div>

          {visibleProspects.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
              <span>
                Showing {visibleProspects.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, visibleProspects.length)} of{' '}
                {visibleProspects.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                  className="btn btn-secondary !px-3 !py-1.5 text-xs"
                >
                  Previous
                </button>
                <span className="px-1">
                  Page {page} of {pageCount}
                </span>
                <button
                  type="button"
                  disabled={page >= pageCount}
                  onClick={() => setPage((value) => value + 1)}
                  className="btn btn-secondary !px-3 !py-1.5 text-xs"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => { setInput(initialInput); setRun(null); setSearch(''); setFilter('all'); setPage(1); setStep('define'); }}
            className="link-underline"
          >
            Start another demo brief
          </button>
        </section>
      ) : null}

      {recentRuns.length > 0 ? (
        <section className="animate-rise border-t border-rule pt-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Recent demo batches</p>
            <Link href="/batches" className="link-underline !text-xs">
              View all history
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-rule">
            {recentRuns.map((recent) => (
              <li key={recent.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="min-w-0 break-words text-sm font-medium text-ink">{recent.name}</span>
                <span className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                    {recent.status === 'ready' ? `${recent.prospects.length} records` : recent.status}
                  </span>
                  <StatusPill label={recent.status === 'ready' ? 'Completed' : recent.status === 'failed' ? 'Failed' : 'In progress'} tone={recent.status === 'ready' ? 'positive' : recent.status === 'failed' ? 'danger' : 'warning'} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function ProspectCard({
  prospect,
  expanded,
  onToggle,
}: {
  prospect: ProspectingRun['prospects'][number];
  expanded: boolean;
  onToggle: () => void;
}) {
  const matchedCount = prospect.matchReasons.filter((reason) => !isUnmatchedReason(reason)).length;

  return (
    <article className="card animate-rise-sm p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              label={prospect.qualified ? 'All criteria' : 'Partial match'}
              tone={prospect.qualified ? 'positive' : 'warning'}
            />
            <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
              {prospect.industry} · {prospect.employeeRange} · {prospect.geography}
            </span>
          </div>
          <h3 className="mt-3 break-words font-serif text-2xl leading-tight tracking-[-0.03em] text-ink">{prospect.company}</h3>
          <p className="mt-1 break-words text-sm leading-6 text-ink">
            {prospect.contactName} <span aria-hidden="true" className="text-muted">·</span>{' '}
            <span className="text-muted">{prospect.title}</span>
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{prospect.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
          <p className="font-serif text-4xl leading-none tracking-[-0.04em] text-ink">
            {prospect.matchScore}
            <span className="text-lg text-muted">%</span>
          </p>
          <div>
            <div className="h-1 w-24 bg-rule" role="presentation">
              <div className="h-full bg-copper" style={{ width: `${prospect.matchScore}%` }} />
            </div>
            <p className="mt-1.5 text-[9px] uppercase tracking-[0.14em] text-muted">
              {matchedCount} of {prospect.matchReasons.length} criteria
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
        <span className="break-words">Company type: {prospect.companyType}</span>
        <span className="inline-flex items-center gap-2">
          <span className="badge badge-neutral">Fictional domain</span>
          <a
            href={prospect.website}
            target="_blank"
            rel="noreferrer"
            className="break-all text-copper underline underline-offset-2 hover:text-ink"
          >
            {prospect.website.replace(/^https?:\/\//, '')}
          </a>
        </span>
      </div>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={`criteria-${prospect.id}`}
        onClick={onToggle}
        className="link-underline mt-4 !text-xs"
      >
        {expanded ? 'Hide criteria detail' : 'Why this match'}
      </button>

      {expanded ? (
        <div id={`criteria-${prospect.id}`} className="mt-3 border-t border-rule pt-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
            Criteria comparison · illustrative matching only
          </p>
          <ul className="mt-2 space-y-2">
            {prospect.matchReasons.map((reason) => {
              const unmatched = isUnmatchedReason(reason);
              return (
                <li key={reason} className="flex items-start gap-2 text-xs leading-5">
                  {unmatched ? (
                    <AlertTriangle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                  ) : (
                    <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-copper" />
                  )}
                  <span className={unmatched ? 'text-muted' : 'text-ink'}>
                    <span className="sr-only">{unmatched ? 'Not matched: ' : 'Matched: '}</span>
                    {reason}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
