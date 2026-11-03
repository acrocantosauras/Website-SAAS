type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'mx-auto max-w-4xl text-center' : 'max-w-3xl';

  return (
    <div className={alignment}>
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-copper">{eyebrow}</p>
      <h2 className="font-serif text-4xl leading-[1.02] tracking-[-0.05em] text-ink sm:text-5xl md:text-6xl">{title}</h2>
      {description ? <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">{description}</p> : null}
    </div>
  );
}
