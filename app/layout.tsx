import type { Metadata } from 'next';
import { Merriweather, Urbanist } from 'next/font/google';
import './globals.css';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-merriweather',
  display: 'swap',
});

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-urbanist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Meraki 2026 | Pitch. Connect. Scale.',
  description:
    'Meraki 2026 — early-stage ideas to young ventures seeking validation or growth. 23–25 October 2026, FIIB, New Delhi.',
  icons: {
    icon: '/meraki-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${merriweather.variable} ${urbanist.variable}`}>
      <body className="font-sans bg-black text-offwhite antialiased">
        {children}
      </body>
    </html>
  );
}
