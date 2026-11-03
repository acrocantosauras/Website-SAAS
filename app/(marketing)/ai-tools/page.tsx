import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MarketingShell } from '@/components/marketing-shell';
import { SectionHeading } from '@/components/section-heading';

const container = 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12';

const products = [
  {
    mark: 'A',
    name: 'AI Prospecting',
    description:
      'Define an ideal customer profile, then compare it against a fixed set of fictional sample records. Each record shows its match score and which criteria it met.',
    benefits: [
      'Every record is clearly labelled as fictional demo data',
      'Match scores expose which criteria were met and missed',
      'Export includes the rationale for each match',
    ],
    cta: 'Open prospecting demo',
    href: '/prospecting',
    limitation: 'No data provider is queried; the sample set never changes.',
  },
  {
    mark: 'B',
    name: 'AI Outreach',
    description:
      'Paste or upload contact rows, set a message brief, and generate local template drafts. You edit each draft before exporting it.',
    benefits: [
      'CSV validation flags invalid rows and duplicate emails',
      'Heuristic review checks highlight claims worth verifying',
      'Exports keep your edits, review status and quality notes',
    ],
    cta: 'Open outreach demo',
    href: '/outreach',
    limitation: 'Drafts come from local templates, not an AI model, and no email is sent.',
  },
];

const excluded = [
  'No AI generation provider or live prospecting engine.',
  'No enrichment, payment or billing integration.',
  'No automated email sending.',
  'No customer accounts or production authentication.',
];

export default function AiToolsPage() {
  return (
    <MarketingShell>
      <main>
        <section className={`${container} py-16 md:py-24`}>
          <SectionHeading
            eyebrow="Self-service products"
            title="Focused tools for prospect research and thoughtful outreach."
            description="Explore both customer journeys in a browser-based prototype. All results are simulated and saved only in your browser."
            as="h1"
          />

          <div className="mt-14 border-t border-rule">
            {products.map(({ mark, name, description, benefits, cta, href, limitation }) => (
              <article
                key={name}
                className="animate-rise grid gap-10 border-b border-rule py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
              >
                <div>
                  <div className="flex items-baseline gap-4">
                    <span aria-hidden="true" className="font-serif text-3xl italic leading-none text-copper">{mark}</span>
                    <h2 className="font-serif text-3xl tracking-[-0.05em] text-ink md:text-4xl">{name}</h2>
                  </div>
                  <p className="mt-5 max-w-xl text-base leading-7 text-muted">{description}</p>
                  <Link href={href} className="btn btn-primary mt-7">
                    {cta} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                  <p className="mt-4 text-[11px] leading-5 text-muted">{limitation}</p>
                </div>

                <div className="lg:border-l lg:border-rule lg:pl-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">What you can do</p>
                  <ul className="mt-5 divide-y divide-rule border-y border-rule">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 py-3 text-sm leading-6 text-ink">
                        <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-copper" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-[11px] leading-5 text-muted">
                    Pricing is discussed per engagement. Checkout is not part of this demo.
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-8 border-t-2 border-copper bg-surface p-6 md:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="eyebrow">Prototype boundary</p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.05em] text-ink">What this demo does not include.</h2>
            </div>
            <ul className="divide-y divide-rule border-y border-rule">
              {excluded.map((item) => (
                <li key={item} className="flex items-start gap-3 py-3 text-sm leading-6 text-muted">
                  <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-copper" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
