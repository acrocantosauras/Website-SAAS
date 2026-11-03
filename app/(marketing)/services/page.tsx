import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MarketingShell } from '@/components/marketing-shell';
import { SectionHeading } from '@/components/section-heading';
import { serviceOfferings } from '@/lib/mock-data';

const container = 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12';

const focusByOffering = [
  [
    { label: 'Ownership', value: 'Deal execution through to close' },
    { label: 'Team fit', value: 'A representative working inside your process' },
    { label: 'Reporting', value: 'Clear activity and next-step communication' },
  ],
  [
    { label: 'Ownership', value: 'Sales strategy and review cadence' },
    { label: 'Team fit', value: 'Founder or executive support' },
    { label: 'Reporting', value: 'Pipeline reviews and forecast clarity' },
  ],
];

export default function ServicesPage() {
  return (
    <MarketingShell>
      <main>
        <section className={`${container} py-16 md:py-24`}>
          <SectionHeading
            eyebrow="Human-led services"
            title="Sales execution and leadership, with clear ownership."
            description="Work with a sales representative focused on moving opportunities forward, or bring in senior leadership to strengthen process and forecast decisions."
            as="h1"
          />

          <div className="mt-14 space-y-10">
            {serviceOfferings.map(({ name, kicker, description, bullets }, index) => (
              <article
                key={name}
                className="animate-rise border-t-2 border-copper bg-surface p-6 md:p-8"
              >
                <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{kicker}</p>
                    <h2 className="mt-4 font-serif text-3xl tracking-[-0.05em] text-ink md:text-4xl">{name}</h2>
                    <p className="mt-5 max-w-xl text-base leading-7 text-muted">{description}</p>
                    <ul className="mt-7 space-y-3 border-t border-rule pt-5">
                      {bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-ink">
                          <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-copper" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="h-fit">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Engagement focus</p>
                    <dl className="mt-4 divide-y divide-rule border-y border-rule">
                      {focusByOffering[index].map(({ label, value }) => (
                        <div key={label} className="grid grid-cols-[86px_1fr] gap-4 py-3">
                          <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">{label}</dt>
                          <dd className="text-sm leading-6 text-ink">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <Link href="/contact" className="link-underline mt-6 inline-flex items-center gap-2 !text-xs">
                      Talk through your sales goals <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-[11px] leading-5 text-muted">
            Engagement scope, pricing and availability are agreed per team. This site does not publish fixed packages.
          </p>
        </section>
      </main>
    </MarketingShell>
  );
}
