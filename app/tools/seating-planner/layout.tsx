import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Wedding Seating Chart Planner | California Winery Weddings',
  description:
    'Free wedding seating chart tool for California winery weddings. Manage your guest list, RSVP tracking, dietary restrictions, drag-and-drop table assignments, and per-table wine pairing suggestions. No signup required.',
  keywords: [
    'wedding seating chart',
    'wedding seating planner',
    'free wedding seating chart tool',
    'winery wedding seating',
    'vineyard wedding seating chart',
    'wedding guest list tracker',
    'wedding RSVP tracker',
    'wedding table planner',
    'wedding dietary restrictions tracker',
    'California winery wedding planning',
    'wedding seating chart maker free',
    'wedding table assignments',
    'how to make a wedding seating chart',
    'wedding seating chart app free',
  ],
  openGraph: {
    title: 'Free Wedding Seating Chart Planner | California Winery Weddings',
    description:
      'Manage your winery wedding guest list, track RSVPs, assign tables, handle dietary restrictions, and get per-table wine suggestions — all free, no signup.',
    type: 'website',
    url: 'https://www.californiawineryweddings.com/tools/seating-planner',
  },
};

export default function SeatingPlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
