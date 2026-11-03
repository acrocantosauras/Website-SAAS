import type { ReactNode } from 'react';

export function Eyebrow({ children, rule = true, className = '' }: { children: ReactNode; rule?: boolean; className?: string }) {
  if (!rule) return <p className={`eyebrow ${className}`}>{children}</p>;

  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="h-px w-8 bg-copper" />
      {children}
    </p>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
};

export function SectionHeading({ eyebrow, title, description, align = 'left', as = 'h2' }: SectionHeadingProps) {
  const centered = align === 'center';
  const titleClass = 'mt-5 font-serif text-4xl leading-[1.02] tracking-[-0.05em] text-ink sm:text-5xl';

  return (
    <div className={`animate-rise ${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      <Eyebrow rule={!centered} className={centered ? 'justify-center' : undefined}>
        {eyebrow}
      </Eyebrow>
      {as === 'h1' ? <h1 className={titleClass}>{title}</h1> : <h2 className={titleClass}>{title}</h2>}
      {description ? (
        <p className={`mt-5 text-base leading-7 text-muted md:text-lg md:leading-8 ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
