import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Gauge, Users } from 'lucide-react';
import { MarketingShell } from '@/components/marketing-shell';
import { SectionHeading } from '@/components/section-heading';
import { serviceOfferings } from '@/lib/mock-data';

export default function ServicesPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Human-led services"
          title="Sales execution and leadership, with clear ownership."
          description="Work with a sales representative focused on moving opportunities forward, or bring in senior leadership to strengthen process and forecast decisions."
        />

        <div className="mt-12 space-y-8">
          {serviceOfferings.map(({ name, kicker, description, bullets }, index) => (
            <article key={name} className={`border-t-2 border-copper ${index === 0 ? 'bg-[#eee8df]' : 'bg-[#e9e9e1]'} p-6 md:p-8`}>
              <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#756a5d]">{kicker}</p>
                  <h2 className="mt-4 font-serif text-3xl tracking-[-0.05em] text-[#18201e] md:text-4xl">{name}</h2>
                  <p className="mt-5 max-w-xl text-base leading-7 text-[#59615c]">{description}</p>
                  <ul className="mt-6 space-y-3">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-[#18201e]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4d7a5f]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-l border-rule bg-white/50 p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#756a5d]">Engagement focus</p>
                  <div className="mt-5 space-y-4">
                    {[
                      { label: 'Ownership', value: index === 0 ? 'Deal execution to close' : 'Sales strategy and review cadence', icon: BriefcaseBusiness },
                      { label: 'Team fit', value: index === 0 ? 'Rep-led execution' : 'Founder or exec support', icon: Users },
                      { label: 'Focus', value: index === 0 ? 'Faster conversions' : 'Forecast clarity', icon: Gauge },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-3 border-b border-rule py-3">
                        <div className="flex h-9 w-9 items-center justify-center bg-[#18201e] text-white">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-[#756a5d]">{label}</p>
                          <p className="mt-1 text-sm font-medium text-[#18201e]">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#18201e]">
                Talk through your sales goals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </main>
    </MarketingShell>
  );
}
