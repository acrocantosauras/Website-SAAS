'use client';

import { useState } from 'react';
import { ArrowRight, Mail, MapPin, Send } from 'lucide-react';
import { MarketingShell } from '@/components/marketing-shell';
import { SectionHeading } from '@/components/section-heading';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <MarketingShell>
      <main className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Start with the sales challenge in front of you."
          description="Share a little context about your team and priorities. This contact form is only a front-end demonstration; no destination has been configured."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-t-2 border-copper bg-[#eee8df] p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">A first conversation</p>
            <div className="mt-6 space-y-5 text-sm text-[#1f2937]">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4" aria-hidden="true" />
                <span>Use the form to share a little about your sales goals.</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4" aria-hidden="true" />
                <span>We will add confirmed contact and availability details when they are provided.</span>
              </div>
            </div>
          </div>

          <form
            className="border-t-2 border-ink bg-[#fbfaf7] p-6"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            {!submitted ? (
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#1f2937]">Name</label>
                  <input id="name" name="name" required autoComplete="name" className="w-full rounded-2xl border border-[#dfe3e8] bg-white px-4 py-3 text-sm text-[#101828] outline-none transition focus:border-[#101828]" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-medium text-[#1f2937]">Company</label>
                  <input id="company" name="company" autoComplete="organization" className="w-full rounded-2xl border border-[#dfe3e8] bg-white px-4 py-3 text-sm text-[#101828] outline-none transition focus:border-[#101828]" placeholder="Company name" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1f2937]">Email</label>
                  <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-2xl border border-[#dfe3e8] bg-white px-4 py-3 text-sm text-[#101828] outline-none transition focus:border-[#101828]" placeholder="you@company.com" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#1f2937]">How can we help?</label>
                  <textarea id="message" name="message" required rows={5} className="w-full rounded-2xl border border-[#dfe3e8] bg-white px-4 py-3 text-sm text-[#101828] outline-none transition focus:border-[#101828]" placeholder="Tell us about your sales goals or product needs." />
                </div>

                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#101828] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d2633]">
                  Preview enquiry confirmation
                  <Send className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-start justify-center">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-copper">Local preview only</p>
                <h3 className="mt-4 font-serif text-3xl tracking-[-0.05em] text-ink">Your enquiry preview is ready.</h3>
                <p className="mt-4 max-w-md text-base leading-7 text-muted">
                  This prototype does not transmit or store your enquiry. A real contact destination has not been configured.
                </p>
                <button type="button" onClick={() => setSubmitted(false)} className="mt-8 inline-flex items-center gap-2 border border-rule bg-white px-5 py-3 text-sm font-medium text-ink">
                  Edit your enquiry
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </MarketingShell>
  );
}
