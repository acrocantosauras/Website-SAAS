import type { DemoRun } from '@/lib/product-demo-service';

export function resumeHref(run: DemoRun) {
  const base = run.kind === 'prospecting' ? '/prospecting' : '/outreach';
  return `${base}?run=${encodeURIComponent(run.id)}`;
}

export function draftFlagCount(run: DemoRun) {
  if (run.kind !== 'outreach') return 0;
  return run.drafts.filter((draft) => draft.qualityChecks.some((check) => check.startsWith('Review:'))).length;
}

export function runSummary(run: DemoRun) {
  if (run.kind === 'prospecting') {
    const total = run.prospects.length;
    const qualified = run.prospects.filter((prospect) => prospect.qualified).length;
    return `${total} sample record${total === 1 ? '' : 's'} · ${qualified} match all criteria`;
  }

  const contacts = run.contacts.length;
  const drafts = run.drafts.length;
  const flagged = draftFlagCount(run);
  return `${contacts} contact${contacts === 1 ? '' : 's'} · ${drafts} draft${drafts === 1 ? '' : 's'} · ${flagged} flagged by review checks`;
}

export function resumeCtaLabel(run: DemoRun) {
  return run.status === 'failed' ? 'Retry this run' : 'Resume this run';
}
