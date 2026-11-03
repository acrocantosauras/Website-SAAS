import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Wand2 } from 'lucide-react';
import { MarketingShell } from '@/components/marketing-shell';
import { SectionHeading } from '@/components/section-heading';

const products = [
  {
    name: 'AI Prospecting System',
    description: 'Define your ICP, buy a prospecting batch, review the results and export the list when it is ready.',
    benefits: ['Targeted lead generation aligned to a clear ICP', 'Reviewable prospect batches before export', 'Future-ready workflow for additional qualification layers'],
    cta: 'Start Prospecting demo',
    href: '/prospecting',
    accent: 'bg-[#eee8df]',
    icon: Sparkles,
  },
  {
    name: 'AI Outreach System',
    description: 'Upload a CSV or paste prospect data to generate personalised outreach drafts for faster iteration and review.',
    benefits: ['Quick draft generation from structured lead records', 'Human review and editing before final export', 'Useful workflow for sales enablement and account outreach'],
    cta: 'Start Outreach demo',
    href: '/outreach',
    accent: 'bg-[#edf1f9]',
    icon: Wand2,
  },
];

export default function AiToolsPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Self-service products"
          title="Focused tools for prospect research and thoughtful outreach."
          description="Explore the customer journeys in a browser-based prototype. All results are simulated; no prospecting engine, payment service, or email provider is connected."
        />

        <div className="mt-12 space-y-8">
          {products.map(({ name, description, benefits, cta, href, accent, icon: Icon }) => (
            <article key={name} className={`border-t-2 border-copper ${accent} p-6 md:p-8`}>
              <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center bg-[#18201e] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 font-serif text-3xl tracking-[-0.05em] text-ink md:text-4xl">{name}</h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-muted">{description}</p>
                  <ul className="mt-6 space-y-3">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-[#1f2937]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4d7a5f]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <Link href={href} className="inline-flex items-center gap-2 rounded-full bg-[#101828] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d2633]">
                      {cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <div className="text-sm text-[#475467]">Pricing placeholder — not yet confirmed</div>
                  </div>
                </div>

                <div className="border-l border-rule bg-white/70 p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">How it works</p>
                  <div className="mt-5 space-y-4">
                    {[
                      'Define the ideal customer profile or upload lead data.',
                      'Ask the system to generate candidate options or draft outreach.',
                      'Review, edit and export the final deliverable.',
                    ].map((step, index) => (
                      <div key={step} className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center bg-[#18201e] font-serif text-sm italic text-white">{index + 1}</div>
                        <p className="text-sm leading-6 text-ink">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </MarketingShell>
  );
}
