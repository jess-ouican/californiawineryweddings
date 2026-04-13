'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import VerifiedOwnerBadge from './VerifiedOwnerBadge';

interface WineryHeaderActionsProps {
  wineryTitle: string;
  placeId: string;
  slug: string;
}

export default function WineryHeaderActions({
  wineryTitle,
  placeId,
  slug,
}: WineryHeaderActionsProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkVerification() {
      try {
        const response = await fetch(`/api/claim/status?placeId=${placeId}`);
        if (response.ok) {
          const data = await response.json();
          setIsVerified(data.verified);
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      } finally {
        setLoading(false);
      }
    }

    checkVerification();
  }, [placeId]);

  if (loading) {
    return null;
  }

  if (isVerified) {
    return (
      <div className="flex items-center gap-2">
        <VerifiedOwnerBadge />
      </div>
    );
  }

  return (
    <Link
      href={`/claim/${slug}`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Claim Your Listing
    </Link>
  );
}
