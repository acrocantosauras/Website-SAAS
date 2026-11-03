import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MarketingShell } from '@/components/marketing-shell';
import { Eyebrow } from '@/components/section-heading';

const container = 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12';

const availableNow = [
  'How an engagement is scoped, staffed and reviewed.',
  'What a pipeline review and forecast discussion covers.',
  'What the prospecting and outreach demos actually produce.',
];

export default function ProofPage() {
  return (
    <MarketingShell>
      <main>
        <section className={`${container} py-16 md:py-24`}>
          <Eyebrow className="animate-rise">Evidence</Eyebrow>
          <div className="mt-7 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <h1 className="animate-rise max-w-xl font-serif text-5xl leading-[0.98] tracking-[-0.06em] text-ink sm:text-6xl">
              Proof should come from the work.
            </h1>
            <div className="animate-rise delay-1 border-t border-rule pt-5">
              <p className="max-w-2xl text-base leading-7 text-muted">
                Customer stories and outcomes will be added when details are approved for publication. We are not
                presenting placeholder client identities, testimonials, or performance claims as real evidence.
              </p>

              <div className="mt-9 border-l-2 border-copper bg-sage/50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">Publication status</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Case studies are not yet available for publication. No results, logos or quotes are shown here.
                </p>
              </div>

              <div className="mt-9">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Available now</p>
                <ul className="mt-4 divide-y divide-rule border-y border-rule">
                  {availableNow.map((item) => (
                    <li key={item} className="flex items-start gap-3 py-3 text-sm leading-6 text-ink">
                      <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-copper" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/contact" className="btn btn-primary mt-9">
                Talk through your sales goals <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
