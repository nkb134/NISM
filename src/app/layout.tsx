import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'NISMPracticeTests — Free NISM V-A Practice Tests',
    template: '%s · NISMPracticeTests',
  },
  description:
    'Free, syllabus-aligned practice tests for NISM Series V-A (Mutual Fund Distributors). Mock exams, topic-wise sets, and a 100-question full simulator.',
  metadataBase: new URL('https://nismpracticetests.com'),
  openGraph: {
    type: 'website',
    siteName: 'NISMPracticeTests',
    title: 'NISMPracticeTests — Free NISM V-A Practice Tests',
    description:
      'Free, syllabus-aligned practice tests for NISM Series V-A. 530+ questions, topic mastery analytics.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1f3a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
