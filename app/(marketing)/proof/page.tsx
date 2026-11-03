import { MarketingShell } from '@/components/marketing-shell';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ProofPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
          <span className="h-px w-8 bg-copper" />
          Evidence
        </p>
        <div className="mt-7 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <h1 className="max-w-xl font-serif text-5xl leading-[0.98] tracking-[-0.06em] text-ink sm:text-6xl">
            Proof should come from the work.
          </h1>
          <div className="border-t border-rule pt-5">
            <p className="text-base leading-7 text-muted">
              Customer stories and outcomes will be added when details are approved for publication. We are not presenting placeholder client identities, testimonials, or performance claims as real evidence.
            </p>
            <p className="mt-8 border-l-2 border-copper bg-sage/50 px-4 py-3 text-xs leading-5 text-ink">
              Case studies are not yet available for publication.
            </p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-3 bg-ink px-5 py-3.5 text-sm font-medium text-white hover:bg-[#303b36]">
              Talk through your sales goals <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}
