import type { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions, meta }: PageHeaderProps) {
  return (
    <header className="animate-rise border-b border-rule pb-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-[2rem] leading-[1.03] tracking-[-0.05em] text-ink sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {meta ? <div className="mt-4">{meta}</div> : null}
    </header>
  );
}
