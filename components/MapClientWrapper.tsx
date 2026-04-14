'use client';

import dynamic from 'next/dynamic';
import type { Winery } from '@/lib/types';

const WineriesMapComponent = dynamic(() => import('@/components/WineriesMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#FAF8F3]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A3C] mx-auto mb-4"></div>
        <p className="text-[#6B3E2E] font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapClientWrapper({ wineries }: { wineries: Winery[] }) {
  return <WineriesMapComponent wineries={wineries} />;
}
