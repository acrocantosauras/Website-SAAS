import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { MarketingShell } from '@/components/marketing-shell';

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
      <main>
        <section className="relative overflow-hidden border-b border-[#d9d1c7] bg-[#f2eee7]">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-16 pt-12 sm:px-8 md:pb-20 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-20">
            <div className="relative z-10 flex flex-col items-start">
              <p className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#756a5d]">
                <span className="h-px w-8 bg-[#a56f48]" />
                Operator-led. AI-enabled.
              </p>
              <h1 className="max-w-[740px] font-serif text-[clamp(3.6rem,8vw,7.8rem)] leading-[0.9] tracking-[-0.065em] text-[#18201e]">
                Sales, with the human judgment left in.
              </h1>
              <p className="mt-8 max-w-[470px] text-base leading-7 text-[#525b56] md:text-lg md:leading-8">
                Our team pairs hands-on sales leadership and deal execution with practical AI tools for finding the right people and preparing thoughtful outreach.
              </p>
              <div className="mt-9 flex w-full flex-col items-start gap-5 sm:w-auto sm:flex-row sm:items-center sm:gap-7">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 border border-[#18201e] bg-[#18201e] px-5 py-3.5 text-sm font-medium text-[#f8f5ef] transition-colors hover:bg-[#303b36]"
                >
                  Talk through your sales goals
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/ai-tools"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[#26312c]"
                >
                  Explore the AI products
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
              <a href="#approach" className="mt-14 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#756a5d] lg:flex">
                A considered approach
                <ArrowDownRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="relative flex min-h-[420px] flex-col justify-center pl-4 sm:pl-10 lg:ml-4 lg:min-h-[590px] lg:pl-12">
              <div aria-hidden="true" className="absolute bottom-8 left-0 top-8 w-px bg-[#d1c5b7]" />

              <div className="relative mb-7 flex items-end justify-between border-b border-[#d1c5b7] pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#756a5d]">REVENUE PRACTICE / How we work</p>
                  <h2 className="mt-2 font-serif text-2xl tracking-[-0.04em] text-[#18201e]">One system. Distinct roles.</h2>
                </div>
                <span className="pb-1 font-serif text-4xl italic text-[#a56f48]">R.</span>
              </div>

              <ol className="relative">
                {disciplines.map(({ number, type, title, detail }, index) => (
                  <li
                    key={number}
                    className={`grid grid-cols-[2.8rem_1fr] gap-x-4 border-b border-[#d1c5b7] py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-x-5 ${
                      index === 0 ? 'pb-7 pt-2' : ''
                    }`}
                  >
                    <span className="font-serif text-2xl italic leading-none text-[#a56f48] sm:text-3xl">{number}</span>
                    <div>
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#756a5d]">{type}</p>
                      <h3 className="font-serif text-2xl leading-tight tracking-[-0.03em] text-[#18201e] sm:text-[1.75rem]">{title}</h3>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-[#59615c]">{detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-5 max-w-sm text-[11px] leading-5 text-[#756a5d]">
                Human expertise leads. Purpose-built tools support the work.
              </p>
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-[47%] hidden h-24 w-px bg-[#d9d1c7] lg:block" />
        </section>

        <section id="approach" className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#756a5d]">
              <span className="h-px w-8 bg-[#a56f48]" />
              The work
            </p>
            <h2 className="mt-6 max-w-md font-serif text-4xl leading-[1.02] tracking-[-0.05em] text-[#18201e] sm:text-5xl">
              Strong sales are built by people who know where to focus.
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
            <article className="border-t border-[#bcae9e] pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a56f48]">01 / Sales execution</p>
              <h3 className="mt-5 font-serif text-2xl tracking-[-0.03em] text-[#18201e]">Outsourced Closing</h3>
              <p className="mt-3 text-sm leading-6 text-[#59615c]">
                Experienced sales representatives work alongside your team to qualify opportunities, run conversations and close deals.
              </p>
              <Link href="/services" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#26312c]">
                Explore services <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
            <article className="border-t border-[#bcae9e] pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a56f48]">02 / Sales leadership</p>
              <h3 className="mt-5 font-serif text-2xl tracking-[-0.03em] text-[#18201e]">Fractional Sales Leadership</h3>
              <p className="mt-3 text-sm leading-6 text-[#59615c]">
                Senior guidance for pipeline reviews, forecasting and coaching, with an operating rhythm tailored to your team.
              </p>
              <Link href="/services" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#26312c]">
                Explore services <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          </div>
        </section>

        <section className="border-y border-[#d9d1c7] bg-[#e9e4dc]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#756a5d]">
                <span className="h-px w-8 bg-[#a56f48]" />
                The tools
              </p>
              <h2 className="mt-6 max-w-md font-serif text-4xl leading-[1.02] tracking-[-0.05em] text-[#18201e] sm:text-5xl">
                Useful leverage, never autopilot.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-[#59615c]">
                Self-service products help your team research prospects and prepare outreach. You review the results; automated sending is not part of this product.
              </p>
              <Link href="/ai-tools" className="mt-7 inline-flex items-center gap-2 border-b border-[#26312c] pb-1 text-sm font-medium text-[#26312c]">
                See how the products work
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="border-t border-[#bcae9e]">
              <Link href="/ai-tools" className="group grid grid-cols-[3rem_1fr_auto] items-start gap-4 border-b border-[#bcae9e] py-6 sm:grid-cols-[4rem_1fr_auto] sm:gap-6">
                <span className="font-serif text-2xl italic text-[#a56f48]">A</span>
                <span>
                  <span className="block font-serif text-2xl tracking-[-0.03em] text-[#18201e]">AI Prospecting</span>
                  <span className="mt-2 block max-w-lg text-sm leading-6 text-[#59615c]">Define your ideal customer profile, review a prospect batch and export the results.</span>
                </span>
                <ArrowUpRight className="mt-1 h-5 w-5 text-[#756a5d] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/ai-tools" className="group grid grid-cols-[3rem_1fr_auto] items-start gap-4 border-b border-[#bcae9e] py-6 sm:grid-cols-[4rem_1fr_auto] sm:gap-6">
                <span className="font-serif text-2xl italic text-[#a56f48]">B</span>
                <span>
                  <span className="block font-serif text-2xl tracking-[-0.03em] text-[#18201e]">AI Outreach</span>
                  <span className="mt-2 block max-w-lg text-sm leading-6 text-[#59615c]">Upload or paste prospect details to generate email drafts for review and download.</span>
                </span>
                <ArrowUpRight className="mt-1 h-5 w-5 text-[#756a5d] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-end md:justify-between md:py-20 lg:px-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#756a5d]">REVENUE PRACTICE / Start a conversation</p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.02] tracking-[-0.05em] text-[#18201e] sm:text-5xl">
              Let’s find the right next move for your sales team.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-between gap-8 border border-[#18201e] bg-[#18201e] px-5 py-3.5 text-sm font-medium text-[#f8f5ef] transition-colors hover:bg-[#303b36]"
          >
            Talk through your sales goals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </MarketingShell>
  );
}
