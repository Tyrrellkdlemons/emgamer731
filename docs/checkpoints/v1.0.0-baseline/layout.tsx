import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, Sniglet } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { LiveStatusProvider } from '@/components/live/LiveStatusProvider';
import { SITE } from '@/lib/utils';
import '@/styles/globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '800', '900'],
  axes: ['SOFT', 'WONK'],
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const cute = Sniglet({
  subsets: ['latin'],
  variable: '--font-cute',
  weight: ['400', '800'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FFFCF5',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.slogan}`,
    template: `%s · ${SITE.name}`,
  },
  description:
    'EMGamer731 / eatsswithemm — the cozy-glossy creator HQ. Roblox fits, breakfast plates, and the live stream the squad shows up for every morning.',
  applicationName: SITE.name,
  keywords: ['EMGamer731', 'eatsswithemm', 'Roblox', 'breakfast', 'creator', 'live stream', 'merch', 'breakfast squad'],
  authors: [{ name: SITE.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.slogan}`,
    description: 'The cozy-glossy creator HQ for Roblox + breakfast + livestreaming.',
    url: SITE.url,
    images: [{ url: '/social-preview/og-default.svg', width: 1200, height: 630, alt: 'EMGamer731 — what did you guys eat for breakfast today?' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.slogan}`,
    description: 'The cozy-glossy creator HQ for Roblox + breakfast + livestreaming.',
    images: ['/social-preview/og-default.svg'],
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicons/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${cute.variable}`}>
      <body>
        <LiveStatusProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </LiveStatusProvider>
      </body>
    </html>
  );
}
