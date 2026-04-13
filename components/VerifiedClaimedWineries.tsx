'use client';

import { useEffect, useState } from 'react';
import WineryCard from './WineryCard';

interface VerifiedClaimedWineriesProps {
  verifiedPlaceIds: string[];
  allWineries: any[];
}

export default function VerifiedClaimedWineries({
  verifiedPlaceIds,
  allWineries,
}: VerifiedClaimedWineriesProps) {
  if (verifiedPlaceIds.length === 0) {
    return null;
  }

  const verifiedWineries = allWineries.filter((w) =>
    verifiedPlaceIds.includes(w.placeId)
  );

  if (verifiedWineries.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-200 bg-green-50">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-2">
          ✓ Verified Owner Wineries
        </h2>
        <p className="text-gray-600 mb-6">
          Trusted venues verified by their owners — {verifiedWineries.length} wineries
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedWineries.map((winery) => (
            <WineryCard key={winery.placeId} winery={winery} />
          ))}
        </div>
      </div>
    </section>
  );
}
