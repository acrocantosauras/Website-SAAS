export type StatusTone = 'neutral' | 'positive' | 'warning' | 'danger';

const toneClasses: Record<StatusTone, string> = {
  neutral: 'border-rule text-muted',
  positive: 'border-sage bg-sage/60 text-ink',
  warning: 'border-copper/40 bg-copper/10 text-ink',
  danger: 'border-red-300 bg-red-50 text-red-900',
};

export function StatusPill({ label, tone = 'neutral' }: { label: string; tone?: StatusTone }) {
  return <span className={`badge ${toneClasses[tone]}`}>{label}</span>;
}

export function runStatusTone(status: 'processing' | 'ready' | 'failed'): StatusTone {
  if (status === 'ready') return 'positive';
  if (status === 'failed') return 'danger';
  return 'warning';
}

export function runStatusLabel(status: 'processing' | 'ready' | 'failed') {
  if (status === 'ready') return 'Completed';
  if (status === 'failed') return 'Failed';
  return 'In progress';
}
