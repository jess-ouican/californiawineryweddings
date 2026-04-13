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
      <VerifiedOwnerBadge size="md" />
    );
  }

  return (
    <Link
      href={`/claim/${slug}`}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B3E2E] hover:bg-[#5a3422] text-white rounded-lg transition text-base font-semibold"
    >
      <svg
        className="w-5 h-5"
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
