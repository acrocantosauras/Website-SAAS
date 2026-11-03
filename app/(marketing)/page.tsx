import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { MarketingShell } from '@/components/marketing-shell';
import { brand } from '@/lib/brand';

const container = 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12';

const disciplines = [
  {
    number: '01',
    type: 'HUMAN-LED',
    title: 'Outsourced Closing',
    detail: 'Salespeople take ownership of conversations and move qualified deals forward.',
  },
  {
    number: '02',
    type: 'AI PRODUCT',
    title: 'AI Prospecting',
    detail: 'Shape an ideal customer profile, then review a focused prospect batch.',
  },
  {
    number: '03',
    type: 'AI PRODUCT',
    title: 'AI Outreach',
    detail: 'Turn prospect details into personalised email drafts, ready for your review.',
  },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="relative border-b border-rule bg-paper">
        <div className={`${container} grid gap-14 pb-16 pt-12 md:pb-20 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-20`}>
          <div className="relative z-10 flex animate-rise flex-col items-start">
            <p className="eyebrow mb-8 flex items-center gap-3 !text-muted">
              <span aria-hidden="true" className="h-px w-8 bg-copper" />
              Operator-led. AI-enabled.
            </p>
            <h1 className="max-w-[740px] font-serif text-[clamp(3.1rem,7.4vw,7rem)] leading-[0.92] tracking-[-0.06em] text-ink">
              Sales, with the human judgment left in.
            </h1>
            <p className="mt-8 max-w-[470px] text-base leading-7 text-muted md:text-lg md:leading-8">
              Our team pairs hands-on sales leadership and deal execution with practical AI tools for finding the right
              people and preparing thoughtful outreach.
            </p>
            <div className="mt-9 flex w-full flex-col items-start gap-5 sm:w-auto sm:flex-row sm:items-center sm:gap-7">
              <Link href="/contact" className="btn btn-primary">
                Talk through your sales goals
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link href="/ai-tools" className="group inline-flex items-center gap-2 text-sm font-medium text-ink">
                Explore the AI products
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <a
              href="#approach"
              className="mt-14 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink lg:flex"
            >
              A considered approach
              <ArrowDownRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="relative flex animate-rise delay-1 flex-col justify-center pl-4 sm:pl-10 lg:ml-4 lg:pl-12">
            <div aria-hidden="true" className="absolute bottom-8 left-0 top-8 w-px bg-rule" />

            <div className="relative mb-7 flex items-end justify-between gap-4 border-b border-rule pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                  {brand.name.toUpperCase()} / How we work
                </p>
                <h2 className="mt-2 font-serif text-2xl tracking-[-0.04em] text-ink">One system. Distinct roles.</h2>
              </div>
              <span aria-hidden="true" className="pb-1 font-serif text-4xl italic text-copper">R.</span>
            </div>

            <ol className="relative">
              {disciplines.map(({ number, type, title, detail }, index) => (
                <li
                  key={number}
                  className={`grid grid-cols-[2.8rem_1fr] gap-x-4 border-b border-rule py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-x-5 ${
                    index === 0 ? 'pb-7 pt-2' : ''
                  }`}
                >
                  <span aria-hidden="true" className="font-serif text-2xl italic leading-none text-copper sm:text-3xl">{number}</span>
                  <div>
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted">{type}</p>
                    <h3 className="font-serif text-2xl leading-tight tracking-[-0.03em] text-ink sm:text-[1.75rem]">{title}</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 max-w-sm text-[11px] leading-5 text-muted">
              Human expertise leads. Purpose-built tools support the work.
            </p>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-[47%] hidden h-24 w-px bg-rule lg:block" />
      </section>

      <section id="approach" className={`${container} grid gap-12 py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24`}>
        <div className="animate-rise">
          <p className="eyebrow flex items-center gap-3 !text-muted">
            <span aria-hidden="true" className="h-px w-8 bg-copper" />
            The work
          </p>
          <h2 className="mt-6 max-w-md font-serif text-4xl leading-[1.02] tracking-[-0.05em] text-ink sm:text-5xl">
            Strong sales are built by people who know where to focus.
          </h2>
        </div>
        <div className="grid animate-rise delay-1 gap-8 sm:grid-cols-2 sm:gap-10">
          <article className="border-t border-rule pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-copper">01 / Sales execution</p>
            <h3 className="mt-5 font-serif text-2xl tracking-[-0.03em] text-ink">Outsourced Closing</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              Experienced sales representatives work alongside your team to qualify opportunities, run conversations and
              close deals.
            </p>
            <Link href="/services" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:text-copper">
              Explore services <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </article>
          <article className="border-t border-rule pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-copper">02 / Sales leadership</p>
            <h3 className="mt-5 font-serif text-2xl tracking-[-0.03em] text-ink">Fractional Sales Leadership</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              Senior guidance for pipeline reviews, forecasting and coaching, with an operating rhythm tailored to your team.
            </p>
            <Link href="/services" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:text-copper">
              Explore services <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </article>
        </div>
      </section>

      <section className="border-y border-rule bg-[#e9e4dc]">
        <div className={`${container} grid gap-10 py-16 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24`}>
          <div className="animate-rise">
            <p className="eyebrow flex items-center gap-3 !text-muted">
              <span aria-hidden="true" className="h-px w-8 bg-copper" />
              The tools
            </p>
            <h2 className="mt-6 max-w-md font-serif text-4xl leading-[1.02] tracking-[-0.05em] text-ink sm:text-5xl">
              Useful leverage, never autopilot.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted">
              Self-service products help your team research prospects and prepare outreach. You review the results;
              automated sending is not part of this product.
            </p>
            <Link href="/ai-tools" className="mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-medium text-ink transition-colors hover:border-copper hover:text-copper">
              See how the products work
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="border-t border-rule">
            <Link href="/ai-tools" className="group grid grid-cols-[3rem_1fr_auto] items-start gap-4 border-b border-rule py-6 transition-colors hover:bg-white/30 sm:grid-cols-[4rem_1fr_auto] sm:gap-6">
              <span aria-hidden="true" className="font-serif text-2xl italic text-copper">A</span>
              <span>
                <span className="block font-serif text-2xl tracking-[-0.03em] text-ink">AI Prospecting</span>
                <span className="mt-2 block max-w-lg text-sm leading-6 text-muted">
                  Define your ideal customer profile, compare it against a fictional sample set and export the results.
                </span>
              </span>
              <ArrowUpRight aria-hidden="true" className="mt-1 h-5 w-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/ai-tools" className="group grid grid-cols-[3rem_1fr_auto] items-start gap-4 border-b border-rule py-6 transition-colors hover:bg-white/30 sm:grid-cols-[4rem_1fr_auto] sm:gap-6">
              <span aria-hidden="true" className="font-serif text-2xl italic text-copper">B</span>
              <span>
                <span className="block font-serif text-2xl tracking-[-0.03em] text-ink">AI Outreach</span>
                <span className="mt-2 block max-w-lg text-sm leading-6 text-muted">
                  Paste or upload prospect details to generate local template drafts for review and download.
                </span>
              </span>
              <ArrowUpRight aria-hidden="true" className="mt-1 h-5 w-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className={`${container} flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20`}>
        <div className="animate-rise">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
            {brand.name.toUpperCase()} / Start a conversation
          </p>
          <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.02] tracking-[-0.05em] text-ink sm:text-5xl">
            Let’s find the right next move for your sales team.
          </h2>
        </div>
        <Link href="/contact" className="btn btn-primary shrink-0 self-start md:self-auto">
          Talk through your sales goals
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>
    </MarketingShell>
  );
}
