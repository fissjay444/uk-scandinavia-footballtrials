import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UK & Scandinavia FootballTrials.com | Your Talent. A Bigger Stage.',
  description: 'Football trial opportunities and relevant pathways across the UK and Scandinavia.',
  openGraph: { title: 'UK & Scandinavia FootballTrials.com', description: 'Your talent. A bigger stage.' },
  twitter: { card: 'summary_large_image', title: 'UK & Scandinavia FootballTrials.com', description: 'Your talent. A bigger stage.' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
