import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CANONICAL_HOST } from '@/lib/canonical';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { Analytics } from '@/components/Analytics';
import { getLocale } from '@/i18n';

export const metadata: Metadata = {
  title: {
    default: 'NISMPracticeTests — Free NISM Study Guides & Practice Tests',
    template: '%s · NISMPracticeTests',
  },
  description:
    'Free, syllabus-aligned study guides and practice tests for every NISM certification. Topic mastery analytics. Mock exams that match the real Schoolnet interface.',
  metadataBase: new URL(CANONICAL_HOST),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'NISMPracticeTests',
    title: 'NISMPracticeTests — Free NISM Study Guides & Practice Tests',
    description:
      'Free study guides + practice tests for every NISM certification. V-A available now; more exams rolling out.',
    url: CANONICAL_HOST,
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NISMPractice',
  },
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1f3a',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        {children}
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  );
}
