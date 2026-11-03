import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, actions, className = '' }: EmptyStateProps) {
  return (
    <div className={`empty-state ${className}`}>
      {icon}
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 max-w-lg text-xs leading-5 text-muted">{description}</p>
      {actions ? <div className="mt-4 flex flex-wrap items-center gap-4">{actions}</div> : null}
    </div>
  );
}
