import type { Metadata } from 'next';
import CorkageCalculator from './CorkageCalculator';

export const metadata: Metadata = {
  title: 'Corkage Fee Calculator for Winery Weddings | California Winery Weddings',
  description: 'Should you bring your own wine and pay the corkage fee, or buy the venue wine package? Enter your guest count and get an exact dollar-by-dollar comparison instantly.',
  keywords: [
    'winery wedding corkage fee',
    'corkage fee calculator wedding',
    'bring your own wine wedding',
    'winery wine buyout vs corkage',
    'corkage fee winery wedding California',
    'BYO wine wedding calculator',
    'how much corkage fee wedding',
    'winery wedding wine cost',
    'vineyard wedding corkage fee',
    'California winery corkage fee',
    'wedding wine package vs corkage',
    'how many bottles wine wedding',
    'winery wedding wine calculator',
    'Napa wedding corkage fee',
    'Sonoma wedding corkage fee',
  ],
  openGraph: {
    title: 'Corkage Fee Calculator — Bring Your Own Wine vs. Venue Package',
    description: 'Get an exact dollar comparison: bring your own wine + pay corkage, or buy the venue wine package? Takes 2 minutes.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/tools/corkage-calculator',
  },
};

export default function Page() {
  return <CorkageCalculator />;
}
