import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Vendor Tipping Calculator | California Winery Weddings',
  description:
    'Calculate exactly how much to tip every vendor at your California winery wedding. Includes caterers, photographers, DJs, bartenders, florists, and more — with wine country-specific etiquette and CA rates.',
  keywords: [
    'wedding vendor tipping calculator',
    'how much to tip wedding vendors',
    'wedding tipping guide California',
    'winery wedding tip guide',
    'how much to tip wedding photographer',
    'how much to tip caterer wedding',
    'wedding bartender tip',
    'wedding DJ tip',
    'wedding florist tip',
    'vineyard wedding tips gratuity',
    'California winery wedding vendors',
    'wedding gratuity calculator',
    'wedding vendor tip etiquette',
    'how much tip wedding coordinator',
  ],
  openGraph: {
    title: 'Wedding Vendor Tipping Calculator — California Winery Weddings',
    description:
      'Know exactly how much to tip every vendor at your California winery wedding. Free calculator with wine country-specific etiquette.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/tools/vendor-tipping',
  },
};

export default function VendorTippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
