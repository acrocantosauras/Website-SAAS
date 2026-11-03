'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, Search, SearchCheck } from 'lucide-react';
import { productDemoService, type ProspectingInput, type ProspectingRun } from '@/lib/product-demo-service';
import { downloadCsv, prospectingCsvRows } from '@/lib/download';

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
    downloadCsv(`${target.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-fictional-demo.csv`, prospectingCsvRows(target.prospects));
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
  const currentStepIndex = step === 'failed' ? 2 : steps.findIndex(({ key }) => key === step);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 border-b border-rule pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/ai-tools" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted hover:text-ink">
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /> AI products
          </Link>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-copper">Self-service demo / 01</p>
          <h1 className="mt-2 font-serif text-4xl tracking-[-0.05em] text-ink sm:text-5xl">AI Prospecting</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Describe your ideal company and decision-maker. Review the complete brief before starting a simulated batch.</p>
        </div>
        <span className="w-fit border border-rule bg-white/70 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">Demo only · no payment</span>
      </header>

      <nav aria-label="Prospecting steps" className="grid grid-cols-4 border-y border-rule py-4">
        {steps.map(({ key, label }, index) => (
          <div key={key} className="flex items-center gap-2 sm:gap-3">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center border text-[10px] font-medium ${index <= currentStepIndex ? 'border-ink bg-ink text-white' : 'border-rule text-muted'}`}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className={`hidden text-[10px] font-medium uppercase tracking-[0.12em] sm:block ${index === currentStepIndex ? 'text-ink' : 'text-muted'}`}>{label}</span>
          </div>
        ))}
      </nav>

      {error ? <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p> : null}

      {step === 'define' ? (
        <form onSubmit={handleReview} className="grid gap-8 lg:grid-cols-[1fr_0.62fr]">
          <section className="space-y-6">
            <fieldset>
              <legend className="font-serif text-xl text-ink">Company profile</legend>
              <p className="mt-1 text-xs text-muted">Describe the kinds of organizations you want to reach.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-medium text-ink sm:col-span-2">
                  Industry <span className="text-copper">Required</span>
                  <input required value={input.industry} onChange={(event) => updateField('industry', event.target.value)} maxLength={80} placeholder="e.g. B2B software" className="form-field mt-2" />
                </label>
                <label className="block text-xs font-medium text-ink">
                  Geography <span className="font-normal text-muted">Optional</span>
                  <input value={input.geography} onChange={(event) => updateField('geography', event.target.value)} maxLength={100} placeholder="e.g. Canada and United States" className="form-field mt-2" />
                </label>
                <label className="block text-xs font-medium text-ink">
                  Company size <span className="font-normal text-muted">Optional</span>
                  <input value={input.companySize} onChange={(event) => updateField('companySize', event.target.value)} maxLength={80} placeholder="e.g. 50–250 employees" className="form-field mt-2" />
                </label>
                <label className="block text-xs font-medium text-ink sm:col-span-2">
                  Company type <span className="font-normal text-muted">Optional</span>
                  <input value={input.companyType} onChange={(event) => updateField('companyType', event.target.value)} maxLength={100} placeholder="e.g. Founder-led, service business, or product company" className="form-field mt-2" />
                </label>
              </div>
            </fieldset>

            <fieldset className="border-t border-rule pt-5">
              <legend className="font-serif text-xl text-ink">People and qualification</legend>
              <p className="mt-1 text-xs text-muted">Specify the decision-makers and any extra fit signals.</p>
              <div className="mt-4 grid gap-4">
                <label className="block text-xs font-medium text-ink">
                  Target job titles <span className="text-copper">Required</span>
                  <input required value={input.targetTitles} onChange={(event) => updateField('targetTitles', event.target.value)} maxLength={120} placeholder="e.g. VP Operations, COO" className="form-field mt-2" />
                  <span className="mt-1 block font-normal text-muted">Separate multiple titles with commas.</span>
                </label>
                <label className="block text-xs font-medium text-ink">
                  Qualification criteria <span className="font-normal text-muted">Optional</span>
                  <textarea value={input.qualificationCriteria} onChange={(event) => updateField('qualificationCriteria', event.target.value)} maxLength={400} rows={3} placeholder="e.g. Has an in-house operations team; exclude agencies." className="form-field mt-2 resize-y" />
                </label>
                <label className="block text-xs font-medium text-ink">
                  Batch name <span className="font-normal text-muted">Optional</span>
                  <input value={input.batchName} onChange={(event) => updateField('batchName', event.target.value)} maxLength={70} placeholder="e.g. Operations leaders" className="form-field mt-2" />
                </label>
              </div>
            </fieldset>
            <button type="submit" className="inline-flex items-center gap-3 bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-[#303b36]">
              Review target brief <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </section>
          <aside className="h-fit border-l-2 border-copper bg-sage/50 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Prototype boundary</p>
            <h2 className="mt-3 font-serif text-2xl tracking-[-0.03em] text-ink">Sample companies, not live research.</h2>
            <p className="mt-3 text-sm leading-6 text-muted">This demo stores runs in this browser and returns fictional records using reserved example domains. No data provider, payment service, or external prospecting engine is connected.</p>
          </aside>
        </form>
      ) : null}

      {step === 'review' ? (
        <section className="max-w-3xl border border-rule bg-surface p-5 sm:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-copper">Review before continuing</p>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-ink">{input.batchName || 'Prospecting target brief'}</h2>
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
                <dd className="mt-1 text-sm text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={() => setStep('define')} className="inline-flex items-center gap-2 border border-rule px-4 py-3 text-sm font-medium text-ink hover:border-ink">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Edit brief
            </button>
            <button type="button" disabled={busy} onClick={handleSimulatedPurchase} className="inline-flex items-center gap-2 bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-[#303b36] disabled:cursor-wait disabled:opacity-60">
              {busy ? 'Starting demo…' : 'Simulate checkout'} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-muted">No price or batch size is shown; both remain unconfirmed.</p>
        </section>
      ) : null}

      {step === 'failed' ? (
        <section role="alert" className="max-w-3xl border border-red-300 bg-red-50 p-5 sm:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-800">{run?.status === 'processing' ? 'Run needs resuming' : 'Demo run failed'}</p>
          <h2 className="mt-2 font-serif text-2xl text-ink">Your brief is still available.</h2>
          <p className="mt-2 text-sm leading-6 text-red-900">{failureMessage}</p>
          <p className="mt-2 text-xs leading-5 text-muted">Retry resumes this saved run rather than creating another batch.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={busy} onClick={handleSimulatedPurchase} className="bg-ink px-4 py-3 text-sm font-medium text-white disabled:opacity-60">Retry this run</button>
            <button type="button" onClick={() => { setRun(null); setStep('define'); }} className="border border-rule px-4 py-3 text-sm font-medium text-ink">Start a new brief</button>
          </div>
        </section>
      ) : null}

      {step === 'processing' ? (
        <section aria-live="polite" className="flex min-h-64 max-w-3xl flex-col items-start justify-center border border-rule bg-surface p-6">
          <SearchCheck aria-hidden="true" className="h-7 w-7 text-copper" />
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-copper">Simulated processing</p>
          <h2 className="mt-2 font-serif text-3xl text-ink">Preparing fictional examples</h2>
          <p className="mt-3 text-sm text-muted">These records are illustrative and are not the result of live prospect research.</p>
          <div className="mt-6 h-1 w-full max-w-sm overflow-hidden bg-rule"><div className="h-full w-2/3 animate-pulse bg-copper motion-reduce:animate-none" /></div>
        </section>
      ) : null}

      {step === 'results' && run ? (
        <section className="space-y-5">
          <div className="flex flex-col gap-4 border border-rule bg-surface p-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-copper">Fictional prospect demo</p>
              <h2 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-ink">{run.name}</h2>
              <p className="mt-2 text-sm text-muted">Illustrative matching only · {run.prospects.length} sample records · {qualifiedCount} match all supplied criteria</p>
            </div>
            <button type="button" disabled={run.prospects.length === 0} onClick={() => exportResults(run)} className="inline-flex items-center justify-center gap-2 bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-[#303b36] disabled:cursor-not-allowed disabled:opacity-40">
              <Download aria-hidden="true" className="h-4 w-4" /> Download fictional sample CSV
            </button>
          </div>
          {run.prospects.length === 0 ? (
            <p role="status" className="border border-dashed border-rule bg-surface p-6 text-sm leading-6 text-muted">No records in this fictional sample set meet the minimum matching threshold for this ICP. Broaden one or more criteria to see whether any illustrative records fit; no prospects were invented to fill a batch.</p>
          ) : qualifiedCount < run.prospects.length ? (
            <p role="status" className="border-l-2 border-copper bg-sage/40 px-4 py-3 text-sm leading-6 text-ink">{qualifiedCount} record{qualifiedCount === 1 ? '' : 's'} match all supplied criteria. Other displayed examples are partial matches, ranked by their criteria score. This is a fixed sample set, not live research.</p>
          ) : (
            <p role="status" className="border-l-2 border-copper bg-sage/40 px-4 py-3 text-sm leading-6 text-ink">All displayed sample records match the entered criteria; matches are heuristic comparisons against fictional demo data only.</p>
          )}
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Search prospects</span>
              <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search company, person, title, region…" className="form-field pl-10" />
            </label>
            <label className="flex items-center gap-2 text-xs text-muted">
              <span className="sr-only">Filter by match</span>
              <select value={filter} onChange={(event) => { setFilter(event.target.value as typeof filter); setPage(1); }} className="form-field py-2">
                <option value="all">All example records</option>
                <option value="qualified">All criteria</option>
                <option value="not-qualified">Partial match</option>
              </select>
            </label>
          </div>
          <div className="overflow-x-auto border border-rule bg-surface">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="border-b border-rule bg-table-head text-[10px] uppercase tracking-[0.12em] text-muted">
                <tr><th className="px-4 py-3 font-medium">Company / contact</th><th className="px-4 py-3 font-medium">Industry / region</th><th className="px-4 py-3 font-medium">Team size</th><th className="px-4 py-3 font-medium">Example ICP fit</th><th className="px-4 py-3 font-medium">Detail</th></tr>
              </thead>
              <tbody>
                {pagedProspects.map((prospect) => (
                  <FragmentRow
                    key={prospect.id}
                    prospect={prospect}
                    expanded={selectedId === prospect.id}
                    onToggle={() => setSelectedId((id) => id === prospect.id ? null : prospect.id)}
                  />
                ))}
                {pagedProspects.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">No sample records match this search.</td></tr> : null}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Showing {visibleProspects.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, visibleProspects.length)} of {visibleProspects.length}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="border border-rule px-3 py-2 disabled:opacity-40">Previous</button>
              <span className="px-2 py-2">Page {page} / {pageCount}</span>
              <button type="button" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)} className="border border-rule px-3 py-2 disabled:opacity-40">Next</button>
            </div>
          </div>
          <button type="button" onClick={() => { setInput(initialInput); setRun(null); setStep('define'); }} className="text-sm font-medium text-ink underline underline-offset-4">Start another demo brief</button>
        </section>
      ) : null}

      {recentRuns.length > 0 ? (
        <section className="border-t border-rule pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Recent demo batches</p>
          <ul className="mt-3 divide-y divide-rule">
            {recentRuns.map((recent) => <li key={recent.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><span className="font-medium text-ink">{recent.name}</span><span className="text-[10px] uppercase tracking-[0.14em] text-muted">{recent.status} · fictional data</span></li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function FragmentRow({ prospect, expanded, onToggle }: {
  prospect: ProspectingRun['prospects'][number];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-rule align-top">
        <td className="px-4 py-3">
          <p className="font-medium text-ink">{prospect.company}</p>
          <p className="mt-1 text-xs text-muted">{prospect.contactName} · {prospect.title}</p>
          <a className="mt-1 block text-xs text-copper underline underline-offset-2" href={prospect.website} target="_blank" rel="noreferrer">{prospect.website}</a>
        </td>
        <td className="px-4 py-3 text-muted">{prospect.industry}<br />{prospect.geography}</td>
        <td className="px-4 py-3 text-muted">{prospect.employeeRange}</td>
        <td className="px-4 py-3">
          <span className={`border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.1em] ${prospect.qualified ? 'border-sage bg-sage/50 text-ink' : 'border-rule text-muted'}`}>{prospect.qualified ? 'All criteria' : 'Partial match'}</span>
          <span className="mt-1 block text-[10px] text-muted">{prospect.matchScore}% fit</span>
        </td>
        <td className="px-4 py-3"><button type="button" aria-expanded={expanded} onClick={onToggle} className="text-xs font-medium text-ink underline underline-offset-4">{expanded ? 'Hide' : 'Why?'}</button></td>
      </tr>
      {expanded ? (
        <tr className="border-b border-rule bg-sage/20">
          <td colSpan={5} className="px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Illustrative matching rationale · {prospect.matchScore}%</p>
            <p className="mt-2 text-sm text-ink">{prospect.description}</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">{prospect.matchReasons.map((reason) => <li key={reason}>• {reason}</li>)}</ul>
          </td>
        </tr>
      ) : null}
    </>
  );
}
