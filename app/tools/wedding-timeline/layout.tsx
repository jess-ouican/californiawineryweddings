import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Winery Wedding Day Timeline Generator | California Wine Country | Free Tool',
  description:
    'Build your California winery wedding day timeline — automatically optimized for golden hour portraits, noise ordinance cutoffs, and wine country logistics. Free, no signup required.',
  keywords: [
    'wedding day timeline',
    'winery wedding timeline',
    'vineyard wedding schedule',
    'wedding day timeline generator',
    'outdoor wedding timeline',
    'golden hour wedding portraits',
    'wedding day schedule California',
    'wine country wedding timeline',
    'Napa wedding timeline',
    'Sonoma wedding schedule',
    'wedding noise ordinance California',
    'wedding ceremony time calculator',
    'when should my outdoor wedding ceremony start',
  ],
  openGraph: {
    title: 'Winery Wedding Day Timeline Generator — Free & Optimized for Wine Country',
    description:
      'The only wedding timeline tool that factors in golden hour, noise ordinances, harvest season, and CA wine country logistics.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/tools/wedding-timeline',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
