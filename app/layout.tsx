import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { brand } from '@/lib/brand';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: `${brand.name} | Sales execution and AI tools`,
  description: 'Human-led sales execution and leadership, supported by practical prospecting and outreach tools.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-paper font-sans text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
