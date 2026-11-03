'use client';

import { useState } from 'react';
import { ArrowRight, Mail, MapPin, Send } from 'lucide-react';
import { MarketingShell } from '@/components/marketing-shell';
import { SectionHeading } from '@/components/section-heading';

const container = 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <MarketingShell>
      <main>
        <section className={`${container} py-16 md:py-24`}>
          <SectionHeading
            eyebrow="Contact"
            title="Start with the sales challenge in front of you."
            description="Share a little context about your team and priorities. This form is a front-end demonstration: no destination has been configured and nothing is transmitted or stored."
            as="h1"
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="animate-rise h-fit border-t-2 border-copper bg-surface p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">A first conversation</p>
              <div className="mt-6 space-y-5 text-sm leading-6 text-ink">
                <div className="flex items-start gap-3">
                  <Mail aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-copper" />
                  <span>Use the form to describe your sales goals and current team structure.</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-copper" />
                  <span>Confirmed contact and availability details will be published here once provided.</span>
                </div>
              </div>
              <p className="mt-6 border-t border-rule pt-4 text-[11px] leading-5 text-muted">
                No email address, phone number or response time is shown because none has been confirmed for this
                prototype.
              </p>
            </div>

            <form
              className="animate-rise delay-1 border-t-2 border-ink bg-surface p-6"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              {!submitted ? (
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label htmlFor="name" className="field-label">
                      Name <span className="ml-1 font-normal text-copper">Required</span>
                      <input id="name" name="name" required autoComplete="name" className="form-field mt-2 font-normal" placeholder="Your name" />
                    </label>
                    <label htmlFor="company" className="field-label">
                      Company <span className="ml-1 font-normal text-muted">Optional</span>
                      <input id="company" name="company" autoComplete="organization" className="form-field mt-2 font-normal" placeholder="Company name" />
                    </label>
                  </div>
                  <label htmlFor="email" className="field-label">
                    Email <span className="ml-1 font-normal text-copper">Required</span>
                    <input id="email" name="email" type="email" autoComplete="email" required className="form-field mt-2 font-normal" placeholder="you@company.com" />
                  </label>
                  <label htmlFor="message" className="field-label">
                    How can we help? <span className="ml-1 font-normal text-copper">Required</span>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="form-field mt-2 resize-y font-normal"
                      placeholder="Tell us about your sales goals or product needs."
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <button type="submit" className="btn btn-primary">
                      Preview enquiry confirmation
                      <Send aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <p className="text-[11px] text-muted">Preview only — nothing is sent.</p>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[360px] flex-col items-start justify-center">
                  <p className="eyebrow">Local preview only</p>
                  <h3 className="mt-4 font-serif text-3xl tracking-[-0.05em] text-ink">Your enquiry preview is ready.</h3>
                  <p className="mt-4 max-w-md text-base leading-7 text-muted">
                    This prototype does not transmit or store your enquiry. A real contact destination has not been
                    configured.
                  </p>
                  <button type="button" onClick={() => setSubmitted(false)} className="btn btn-secondary mt-8">
                    Edit your enquiry
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
