export type ServiceOffering = {
  name: string;
  kicker: string;
  description: string;
  bullets: string[];
};

export const serviceOfferings: ServiceOffering[] = [
  {
    name: 'Outsourced Closing',
    kicker: 'Human-led sales execution',
    description:
      'Sales representatives work as an extension of your team to run qualified conversations and close deals.',
    bullets: [
      'Deal ownership from qualification through close',
      'A sales representative aligned with your team',
      'Clear communication on next steps and activity',
    ],
  },
  {
    name: 'Fractional Sales Leadership',
    kicker: 'Senior sales oversight',
    description:
      'Experienced leadership for teams that need stronger pipeline reviews, forecasting and sales coaching.',
    bullets: [
      'Pipeline reviews and sales forecasting',
      'Sales process design and operating cadence',
      'Coaching for founders and sales representatives',
    ],
  },
];
