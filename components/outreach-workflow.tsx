'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Copy, Download, FileUp, LoaderCircle, Search } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatusPill } from '@/components/status-pill';
import { parseContactsCsv, type ContactCsvResult, type ParsedContactRow } from '@/lib/csv';
import { csvFilename, downloadCsv, outreachCsvRows } from '@/lib/download';
import { getOutreachQualityChecks, productDemoService, type OutreachDraft, type OutreachRun, type OutreachSettings } from '@/lib/product-demo-service';

type Step = 'input' | 'review' | 'processing' | 'failed' | 'results';

const exampleCsv = 'first_name,company,title,email,context\nJordan,Example Company,VP of Operations,jordan@example.com,expanding a regional team';
const defaultSettings: OutreachSettings = {
  offering: '',
  targetCustomer: '',
  problem: '',
  valueProposition: '',
  tone: 'Warm and professional',
  length: 'Standard',
  callToAction: '',
};

const toneOptions: OutreachSettings['tone'][] = ['Warm and professional', 'Direct and concise', 'Thoughtful and consultative'];
const lengthOptions: OutreachSettings['length'][] = ['Short', 'Standard'];

const steps: { key: Step; label: string }[] = [
  { key: 'input', label: 'Add contacts' },
  { key: 'review', label: 'Preview' },
  { key: 'processing', label: 'Demo run' },
  { key: 'results', label: 'Drafts' },
];

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  console.error('Outreach demo operation failed with a non-Error value.', error);
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

export function OutreachWorkflow() {
  const [step, setStep] = useState<Step>('input');
  const [source, setSource] = useState<'paste' | 'upload'>('paste');
  const [csv, setCsv] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsed, setParsed] = useState<ContactCsvResult | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const [settings, setSettings] = useState(defaultSettings);
  const [run, setRun] = useState<OutreachRun | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'needs-review' | 'with-context'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');
  const operationLock = useRef(false);

  useEffect(() => {
    productDemoService
      .listRuns()
      .then((runs) => {
        const outreachRuns = runs.filter(
          (entry): entry is OutreachRun =>
            entry.kind === 'outreach',
        );
        const requestedRunId = new URLSearchParams(window.location.search).get('run');
        const requestedRun = outreachRuns.find((entry) => entry.id === requestedRunId);
        const interruptedRun = requestedRun && requestedRun.status !== 'ready'
          ? requestedRun
          : outreachRuns.find((entry) => entry.status === 'processing' || entry.status === 'failed');
        if (!interruptedRun) return;
        const rows = interruptedRun.contacts.map((contact) => ({ contact, errors: [], duplicate: false }));
        setRun(interruptedRun);
        setParsed({
          rows,
          emptyRows: 0,
          acceptedCount: rows.length,
          invalidCount: 0,
          duplicateCount: 0,
        });
        setCampaignName(interruptedRun.name);
        setSettings(interruptedRun.settings);
        setFailureMessage(interruptedRun.failureReason || 'A saved run was interrupted or is still processing. Retry to resume this same batch.');
        setStep('failed');
      })
      .catch((reason: unknown) => setError(getErrorMessage(reason)));
  }, []);

  function parseAndReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');
    try {
      setParsed(parseContactsCsv(csv));
      setStep('review');
    } catch (reason: unknown) {
      setError(getErrorMessage(reason));
    }
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    setError('');
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setError('Choose a CSV file to continue.');
      return;
    }
    if (file.size > 1_000_000) {
      setError('The CSV exceeds the 1 MB demo limit.');
      return;
    }
    try {
      const contents = await file.text();
      parseContactsCsv(contents);
      setCsv(contents);
      setFileName(file.name);
      setSource('upload');
    } catch (reason: unknown) {
      setError(getErrorMessage(reason));
    }
  }

  async function handleSimulatedPurchase() {
    if (operationLock.current) return;
    if (!parsed) {
      setError('Preview and validate your contacts before starting the demo.');
      return;
    }
    const contacts = parsed.rows.filter((row) => row.errors.length === 0 && !row.duplicate).map((row) => row.contact);
    if (contacts.length === 0) {
      setError('There are no valid, unique contacts to use. Edit the CSV and preview it again.');
      return;
    }
    operationLock.current = true;
    setBusy(true);
    setError('');
    setFailureMessage('');
    let activeRun: OutreachRun | null = run?.status !== 'ready' ? run : null;
    try {
      if (!activeRun) {
        activeRun = await productDemoService.startOutreach(
          campaignName.trim() || fileName.replace(/\.csv$/i, '') || 'Outreach demo',
          contacts,
          settings,
        );
        setRun(activeRun);
      }
      setStep('processing');
      await withTimeout(new Promise<void>((resolve) => window.setTimeout(resolve, 650)), 8000);
      const completedRun = await withTimeout(productDemoService.completeOutreach(activeRun.id), 8000);
      setRun(completedRun);
      setSelectedIds(completedRun.drafts.map((draft) => draft.id));
      setStep('results');
    } catch (reason: unknown) {
      const message = getErrorMessage(reason);
      setFailureMessage(message);
      if (activeRun) {
        setRun({ ...activeRun, status: 'failed', failureReason: message });
        try {
          const failedRun = await productDemoService.failRun(activeRun.id, message);
          if (failedRun.kind === 'outreach') {
            setRun(failedRun);
            if (failedRun.status === 'ready') {
              setSelectedIds(failedRun.drafts.map((draft) => draft.id));
              setStep('results');
              return;
            }
          }
        } catch (persistReason: unknown) {
          setFailureMessage(`${message} The failed status could not be saved: ${getErrorMessage(persistReason)}`);
        }
      }
      setStep('failed');
    } finally {
      operationLock.current = false;
      setBusy(false);
    }
  }

  function exportDrafts(target: OutreachRun, onlySelected = false) {
    const drafts = target.drafts.filter((draft) => !onlySelected || selectedIds.includes(draft.id));
    if (!drafts.length) {
      setError('Select at least one draft before downloading.');
      setNotice('');
      return;
    }
    downloadCsv(csvFilename(target.name, 'drafts'), outreachCsvRows(drafts));
    setError('');
    setNotice(`CSV download requested for ${drafts.length} draft${drafts.length === 1 ? '' : 's'}, including review status and quality notes.`);
  }

  function updateDrafts(drafts: OutreachDraft[]) {
    if (!run) return;
    setRun({
      ...run,
      drafts: drafts.map((draft) => ({
        ...draft,
        qualityChecks: getOutreachQualityChecks(draft, run.settings),
      })),
    });
  }

  async function saveDrafts() {
    if (!run) return;
    try {
      const saved = await productDemoService.saveOutreachDrafts(run.id, run.drafts);
      setRun(saved);
      setError('');
    } catch (reason: unknown) {
      setError(getErrorMessage(reason));
    }
  }

  async function copyDraft(draft: OutreachDraft) {
    try {
      await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
      setCopiedId(draft.id);
      setNotice('Draft copied to clipboard.');
      setError('');
      window.setTimeout(() => setCopiedId((id) => (id === draft.id ? null : id)), 1800);
    } catch (reason: unknown) {
      setError(getErrorMessage(reason));
    }
  }

  const visibleDrafts = useMemo(() => {
    if (!run) return [];
    const query = search.trim().toLowerCase();
    return run.drafts.filter((draft) => {
      const matchesSearch = `${draft.contact.firstName} ${draft.contact.company} ${draft.contact.role} ${draft.contact.email} ${draft.subject}`
        .toLowerCase().includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'with-context'
          ? Boolean(draft.contact.context.trim())
          : draft.qualityChecks.some((check) => check.startsWith('Review:')));
      return matchesSearch && matchesFilter;
    });
  }, [filter, run, search]);
  const activeIndex = step === 'failed' ? 2 : steps.findIndex(({ key }) => key === step);
  const validContacts = parsed?.rows.filter((row) => row.errors.length === 0 && !row.duplicate) ?? [];
  const flaggedDrafts = run?.drafts.filter((draft) => draft.qualityChecks.some((check) => check.startsWith('Review:'))).length ?? 0;

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
          eyebrow="Self-service demo / 02"
          title="AI Outreach"
          description="Bring contact context, set a message brief, then edit each locally generated draft before downloading. Email sending is not available."
          actions={<span className="badge badge-neutral">Demo only · no payment</span>}
        />
      </div>

      <nav aria-label="Outreach steps" className="animate-rise">
        <ol className="grid grid-cols-4 gap-2 border-y border-rule py-4">
          {steps.map(({ key, label }, index) => {
            const state = index < activeIndex ? 'done' : index === activeIndex ? 'current' : 'upcoming';
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
      {notice ? (
        <p role="status" className="alert alert-notice">
          {notice}
        </p>
      ) : null}

      {step === 'failed' ? (
        <section role="alert" className="animate-rise max-w-3xl border border-red-300 bg-red-50 p-5 sm:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-800">
            {run?.status === 'processing' ? 'Run needs resuming' : 'Demo run failed'}
          </p>
          <h2 className="mt-2 font-serif text-2xl text-ink">Your contact preview is still available.</h2>
          <p className="mt-2 break-words text-sm leading-6 text-red-900">{failureMessage}</p>
          <p className="mt-2 text-xs leading-5 text-red-900/80">Retry resumes this saved run rather than creating another batch.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={busy} onClick={handleSimulatedPurchase} className="btn btn-primary">
              {busy ? 'Retrying…' : 'Retry this run'}
            </button>
            <button type="button" onClick={() => setStep('review')} className="btn btn-secondary !bg-white">
              Review contacts
            </button>
            <button type="button" onClick={() => { setRun(null); setStep('input'); }} className="btn btn-secondary !bg-white">
              Start a new run
            </button>
          </div>
        </section>
      ) : null}

      {step === 'input' ? (
        <form onSubmit={parseAndReview} className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="animate-rise">
            <div className="flex border-b border-rule" role="tablist" aria-label="Contact data input method">
              {(['paste', 'upload'] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  role="tab"
                  aria-selected={source === method}
                  onClick={() => setSource(method)}
                  className={`-mb-px border-b-2 px-4 py-3 text-xs font-medium transition-colors ${
                    source === method ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {method === 'paste' ? 'Paste CSV' : 'Upload CSV'}
                </button>
              ))}
            </div>
            {source === 'paste' ? (
              <label className="field-label mt-5">
                CSV content
                <textarea
                  required
                  rows={8}
                  value={csv}
                  onChange={(event) => setCsv(event.target.value)}
                  placeholder={exampleCsv}
                  className="form-field mt-2 resize-y font-mono text-xs font-normal leading-6"
                />
              </label>
            ) : (
              <div className="mt-5 border border-dashed border-rule bg-surface p-6 sm:p-8">
                <label htmlFor="contact-csv" className="flex cursor-pointer flex-col items-center text-center">
                  <FileUp aria-hidden="true" className="h-7 w-7 text-copper" />
                  <span className="mt-3 break-all text-sm font-medium text-ink">{fileName || 'Choose a CSV file'}</span>
                  <span className="mt-1 text-xs text-muted">CSV only · up to 1 MB · maximum 100 contacts</span>
                </label>
                <input id="contact-csv" type="file" accept=".csv,text/csv" onChange={handleUpload} className="sr-only" />
                {fileName ? <p className="mt-4 text-center text-xs text-muted">File loaded. Preview to see accepted and flagged rows.</p> : null}
              </div>
            )}
            <label className="field-label mt-5">
              Campaign name <span className="ml-1 font-normal text-muted">Optional</span>
              <input
                value={campaignName}
                onChange={(event) => setCampaignName(event.target.value)}
                maxLength={70}
                placeholder="e.g. Operations introduction"
                className="form-field mt-2 font-normal"
              />
            </label>
            <p className="mt-4 text-[11px] leading-5 text-muted">
              Recognised columns: name/first_name, company, title/role, email, context/notes. Name or company is required.
              Invalid rows and duplicate emails are flagged, not included.
            </p>
            <button type="submit" className="btn btn-primary mt-5">
              Validate and preview <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </section>

          <section className="animate-rise delay-1 space-y-5 border-t border-rule pt-6 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">
            <div>
              <p className="eyebrow">Message brief</p>
              <h2 className="mt-2 font-serif text-2xl text-ink">Give the draft a real point of view.</h2>
              <p className="mt-1 text-xs leading-5 text-muted">Only the details you provide are used. Missing context produces a neutral opening.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field-label sm:col-span-2">
                Offering <span className="ml-1 font-normal text-muted">Optional</span>
                <input value={settings.offering} onChange={(event) => setSettings({ ...settings, offering: event.target.value })} maxLength={100} placeholder="What are you offering?" className="form-field mt-2 font-normal" />
              </label>
              <label className="field-label sm:col-span-2">
                Target customer <span className="ml-1 font-normal text-muted">Optional</span>
                <input value={settings.targetCustomer} onChange={(event) => setSettings({ ...settings, targetCustomer: event.target.value })} maxLength={120} placeholder="Who is it for?" className="form-field mt-2 font-normal" />
              </label>
              <label className="field-label sm:col-span-2">
                Customer problem <span className="ml-1 font-normal text-muted">Optional</span>
                <textarea value={settings.problem} onChange={(event) => setSettings({ ...settings, problem: event.target.value })} maxLength={240} rows={2} placeholder="What problem does it address?" className="form-field mt-2 resize-y font-normal" />
              </label>
              <label className="field-label sm:col-span-2">
                Value proposition <span className="ml-1 font-normal text-muted">Optional</span>
                <textarea value={settings.valueProposition} onChange={(event) => setSettings({ ...settings, valueProposition: event.target.value })} maxLength={240} rows={2} placeholder="Describe the value without unverified claims." className="form-field mt-2 resize-y font-normal" />
                <span className="field-note">Numbers and unverifiable claims are flagged by the review checks.</span>
              </label>

              <SegmentedControl
                label="Tone"
                name="tone"
                value={settings.tone}
                options={toneOptions}
                onChange={(tone) => setSettings({ ...settings, tone })}
              />
              <SegmentedControl
                label="Draft length"
                name="length"
                value={settings.length}
                options={lengthOptions}
                onChange={(length) => setSettings({ ...settings, length })}
                columns={2}
              />

              <label className="field-label sm:col-span-2">
                Call to action <span className="ml-1 font-normal text-muted">Optional</span>
                <input value={settings.callToAction} onChange={(event) => setSettings({ ...settings, callToAction: event.target.value })} maxLength={120} placeholder="e.g. Would a brief conversation be useful?" className="form-field mt-2 font-normal" />
              </label>
            </div>
            <aside className="border-l-2 border-copper bg-sage/50 p-4 text-xs leading-5 text-muted">
              Browser-local template demo. No AI service, enrichment provider, email provider, or sending action is connected.
            </aside>
          </section>
        </form>
      ) : null}

      {step === 'review' && parsed ? (
        <section className="space-y-5">
          <div className="card animate-rise p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="eyebrow">CSV validation · {parsed.rows.length} non-empty rows</p>
                <h2 className="mt-2 break-words font-serif text-3xl tracking-[-0.04em] text-ink">{campaignName || fileName || 'Outreach run'}</h2>
              </div>
              <button
                type="button"
                disabled={validContacts.length === 0 || busy}
                onClick={handleSimulatedPurchase}
                className="btn btn-primary shrink-0"
              >
                {busy ? 'Starting demo…' : `Use ${validContacts.length} valid, unique rows`} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Accepted" value={parsed.acceptedCount} />
              <Metric label="Invalid" value={parsed.invalidCount} />
              <Metric label="Duplicate" value={parsed.duplicateCount} />
              <Metric label="Empty rows" value={parsed.emptyRows} />
            </div>
            {parsed.invalidCount > 0 || parsed.duplicateCount > 0 ? (
              <p className="alert alert-warning mt-4 !px-3 !py-2 text-xs">
                Only the {parsed.acceptedCount} accepted unique rows will be used. Flagged rows remain visible below. To
                correct them, edit the CSV and validate it again.
              </p>
            ) : null}
          </div>
          <div className="table-shell">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="border-b border-rule bg-table-head text-[10px] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">CSV row</th>
                  <th scope="col" className="px-4 py-3 font-medium">Name / company</th>
                  <th scope="col" className="px-4 py-3 font-medium">Role / email</th>
                  <th scope="col" className="px-4 py-3 font-medium">Context</th>
                  <th scope="col" className="px-4 py-3 font-medium">Validation</th>
                </tr>
              </thead>
              <tbody>
                {parsed.rows.map((row) => <ContactRow key={row.contact.sourceRow} row={row} />)}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => setStep('input')} className="link-underline inline-flex items-center gap-2">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Edit CSV or brief
            </button>
            <p className="text-[11px] text-muted">No price is shown; checkout is simulated and takes no payment.</p>
          </div>
        </section>
      ) : null}

      {step === 'processing' ? (
        <section aria-live="polite" className="card animate-rise flex min-h-64 max-w-3xl flex-col items-start justify-center p-6">
          <LoaderCircle aria-hidden="true" className="h-7 w-7 animate-spin text-copper motion-reduce:animate-none" />
          <p className="mt-5 eyebrow">Simulated processing</p>
          <h2 className="mt-2 font-serif text-3xl text-ink">Preparing review drafts</h2>
          <p className="mt-3 text-sm leading-6 text-muted">A local template is being used; no AI API call or email send takes place.</p>
        </section>
      ) : null}

      {step === 'results' && run ? (
        <section className="space-y-5">
          <div className="card animate-rise flex flex-col gap-4 p-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="eyebrow">Drafts ready · local demo</p>
              <h2 className="mt-2 break-words font-serif text-3xl tracking-[-0.04em] text-ink">{run.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {run.drafts.length} draft{run.drafts.length === 1 ? '' : 's'} · {flaggedDrafts} flagged by heuristic review
                checks · nothing is sent
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => exportDrafts(run, true)} className="btn btn-secondary">
                <Download aria-hidden="true" className="h-4 w-4" /> Selected ({selectedIds.length})
              </button>
              <button type="button" onClick={() => exportDrafts(run)} className="btn btn-primary">
                <Download aria-hidden="true" className="h-4 w-4" /> All drafts
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Search drafts</span>
              <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, company, role, email…" className="form-field pl-10" />
            </label>
            <label>
              <span className="sr-only">Filter drafts</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="form-field">
                <option value="all">All drafts</option>
                <option value="needs-review">Flagged by checks</option>
                <option value="with-context">Context supplied</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted">
            <p>
              Showing {visibleDrafts.length} of {run.drafts.length} · heuristic checks only, not an AI quality score
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedIds(visibleDrafts.map((draft) => draft.id))}
                className="link-underline !text-[11px]"
              >
                Select visible
              </button>
              <button type="button" onClick={() => setSelectedIds([])} className="link-underline !text-[11px]">
                Clear selection
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {visibleDrafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                selected={selectedIds.includes(draft.id)}
                copied={copiedId === draft.id}
                onSelect={() => setSelectedIds((ids) => (ids.includes(draft.id) ? ids.filter((id) => id !== draft.id) : [...ids, draft.id]))}
                onCopy={() => copyDraft(draft)}
                onChange={(field, value) =>
                  updateDrafts(run.drafts.map((entry) => (entry.id === draft.id ? { ...entry, [field]: value } : entry)))
                }
                onSave={saveDrafts}
              />
            ))}
            {visibleDrafts.length === 0 ? (
              <EmptyState
                title="No drafts match these filters"
                description="Clear the search or switch the filter back to all drafts."
                actions={
                  <button type="button" onClick={() => { setSearch(''); setFilter('all'); }} className="btn btn-secondary !py-2 text-xs">
                    Clear filters
                  </button>
                }
              />
            ) : null}
          </div>

          <p className="text-[11px] leading-5 text-muted">
            Exports contain the subject and body exactly as edited, plus the review status and quality notes.
          </p>

          <button
            type="button"
            onClick={() => { setCsv(''); setFileName(''); setParsed(null); setRun(null); setStep('input'); setNotice(''); setSearch(''); setFilter('all'); setSelectedIds([]); }}
            className="link-underline"
          >
            Start another demo run
          </button>
        </section>
      ) : null}
    </div>
  );
}

function SegmentedControl<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
  columns = 3,
}: {
  label: string;
  name: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="field-label">{label}</legend>
      <div className={`mt-2 grid grid-cols-1 gap-2 ${columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        {options.map((option) => (
          <label key={option} className="relative block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span className="flex h-full items-center justify-center border border-rule bg-surface px-3 py-2.5 text-center text-[11px] leading-4 text-ink transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-copper">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-rule bg-surface p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 font-serif text-2xl text-ink">{value}</p>
    </div>
  );
}

function ContactRow({ row }: { row: ParsedContactRow }) {
  const status = row.errors.length ? 'Invalid' : row.duplicate ? 'Duplicate' : 'Accepted';
  return (
    <tr className="border-b border-rule align-top last:border-0">
      <td className="px-4 py-3 text-xs text-muted">{row.contact.sourceRow}</td>
      <td className="px-4 py-3">
        <p className="break-words font-medium text-ink">{row.contact.firstName || '—'}</p>
        <p className="mt-1 break-words text-xs text-muted">{row.contact.company || '—'}</p>
      </td>
      <td className="px-4 py-3 text-xs text-muted">
        <span className="block break-words">{row.contact.role || '—'}</span>
        <span className="mt-1 block break-all">{row.contact.email || 'No email supplied'}</span>
      </td>
      <td className="max-w-xs px-4 py-3 text-xs text-muted">{row.contact.context || '—'}</td>
      <td className="px-4 py-3">
        <StatusPill label={status} tone={status === 'Accepted' ? 'positive' : 'warning'} />
        {row.errors.map((message) => (
          <p key={message} className="mt-1 max-w-xs text-[11px] leading-4 text-red-800">{message}</p>
        ))}
        {row.duplicate ? <p className="mt-1 max-w-xs text-[11px] leading-4 text-muted">Email repeats an earlier CSV row.</p> : null}
      </td>
    </tr>
  );
}

function DraftCard({
  draft,
  selected,
  copied,
  onSelect,
  onCopy,
  onChange,
  onSave,
}: {
  draft: OutreachDraft;
  selected: boolean;
  copied: boolean;
  onSelect: () => void;
  onCopy: () => void;
  onSave: () => void;
  onChange: (field: 'subject' | 'body', value: string) => void;
}) {
  const review = draft.qualityChecks.filter((check) => check.startsWith('Review:'));
  const passed = draft.qualityChecks.filter((check) => !check.startsWith('Review:'));
  const recipient = draft.contact.firstName || 'Contact';
  const organisation = [draft.contact.company, draft.contact.role].filter(Boolean).join(' · ');

  return (
    <article className="card animate-rise-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-rule p-5">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">Recipient</p>
          <h3 className="mt-1 break-words font-serif text-2xl leading-tight tracking-[-0.03em] text-ink">{recipient}</h3>
          {organisation ? <p className="mt-1 break-words text-xs text-muted">{organisation}</p> : null}
          <p className="mt-1 break-all text-xs text-muted">{draft.contact.email || 'No email supplied'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill label={draft.status} tone="warning" />
          <label className="inline-flex items-center gap-2 text-xs text-ink">
            <input type="checkbox" checked={selected} onChange={onSelect} className="h-4 w-4 accent-copper" />
            Include in download
          </label>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <label className="field-label">
          <span className="flex items-baseline justify-between gap-3">
            Subject line
            <span className="font-normal text-[10px] text-muted">{draft.subject.length} / 120</span>
          </span>
          <input
            value={draft.subject}
            onChange={(event) => onChange('subject', event.target.value)}
            onBlur={onSave}
            maxLength={120}
            className="form-field mt-2 font-normal normal-case tracking-normal"
          />
        </label>

        <label className="field-label">
          <span className="flex items-baseline justify-between gap-3">
            Email body
            <span className={`font-normal text-[10px] ${draft.body.length > 1200 ? 'text-red-800' : 'text-muted'}`}>
              {draft.body.length} / 1200
            </span>
          </span>
          <textarea
            value={draft.body}
            onChange={(event) => onChange('body', event.target.value)}
            onBlur={onSave}
            maxLength={3000}
            rows={7}
            className="form-field mt-2 resize-y font-normal normal-case leading-6 tracking-normal"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={`border p-3 ${review.length ? 'border-copper/40 bg-copper/10' : 'border-sage bg-sage/30'}`}>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-ink">
              Requires review ({review.length})
            </p>
            {review.length ? (
              <ul className="mt-2 space-y-1.5">
                {review.map((check) => (
                  <li key={check} className="flex items-start gap-2 text-[11px] leading-4 text-ink">
                    <AlertTriangle aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 text-copper" />
                    {check.replace(/^Review:\s*/, '')}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[11px] leading-4 text-muted">Nothing flagged by the heuristic checks.</p>
            )}
          </div>
          <div className="border border-rule bg-app-canvas p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">Passed ({passed.length})</p>
            <ul className="mt-2 space-y-1.5">
              {passed.map((check) => (
                <li key={check} className="flex items-start gap-2 text-[11px] leading-4 text-muted">
                  <Check aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 text-copper" />
                  {check.replace(/^Pass:\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-rule pt-3">
          <p className="text-[11px] leading-5 text-muted">
            <span className="font-semibold text-ink">Why this draft:</span> {draft.rationale}
          </p>
          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
            Heuristic review checks · not an AI score
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={onCopy} className="btn btn-secondary !py-2 text-xs">
            <Copy aria-hidden="true" className="h-3.5 w-3.5" />
            {copied ? 'Copied' : 'Copy draft'}
          </button>
          <p className="text-[10px] text-muted">Edits save to this browser when you leave a field.</p>
        </div>
      </div>
    </article>
  );
}
