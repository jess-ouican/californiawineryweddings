import type { Metadata } from 'next';
import { Crimson_Text, Outfit } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-crimson',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'California Winery Weddings - Find Your Perfect Venue',
  description:
    'Discover 435+ verified California wineries and vineyards for your dream wedding. Browse by region, read reviews, and request information from your favorite venues.',
  keywords: [
    'winery weddings',
    'California',
    'wedding venues',
    'wine country',
    'Napa',
    'Sonoma',
    'Temecula',
  ],
  openGraph: {
    title: 'California Winery Weddings',
    description: 'Discover 435+ verified California wineries and vineyards for your dream wedding.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'California Winery Weddings',
    description: 'Discover 435+ verified California wineries and vineyards for your dream wedding.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${crimsonText.variable} ${outfit.variable}`}>
      <head>
        <meta name="theme-color" content="#6B3E2E" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'California Winery Weddings',
              url: 'https://www.californiawineryweddings.com',
              description:
                'Discover 435+ verified California wineries and vineyards for your perfect wedding venue.',
            }),
          }}
        />
      </head>
      <body className="font-outfit text-gray-900 bg-[#FAF8F3]">
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
