'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Winery } from '@/lib/types';
import { slugify, isCouplesFavorite } from '@/lib/utils';
import VerificationBadge from './VerificationBadge';
import CouplesFavoriteBadge from './CouplesFavoriteBadge';

interface WineryCardProps {
  winery: Winery;
  variant?: 'grid' | 'list';
}

export default function WineryCard({ winery, variant = 'grid' }: WineryCardProps) {
  const slug = slugify(winery.title);
  const ratingColor = winery.totalScore >= 4.7 ? 'text-yellow-600' : winery.totalScore >= 4.3 ? 'text-yellow-500' : 'text-gray-600';

  if (variant === 'list') {
    return (
      <Link href={`/wineries/${slug}`}>
        <div className=\"flex gap-4 pb-4 border-b border-gray-200 hover:bg-gray-50 p-3 rounded cursor-pointer transition\">
          <div className=\"relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200\">
            <Image
              src={winery.imageUrl}
              alt={winery.title}
              fill
              className=\"object-cover\"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
              }}
            />
          </div>
          <div className=\"flex-grow\">
            <h3 className=\"font-serif text-lg font-semibold text-[#6B3E2E] hover:text-[#8B5A3C]\">
              {winery.title}
            </h3>
            <div className=\"my-1 space-y-1\">
              {isCouplesFavorite(winery) && <CouplesFavoriteBadge />}
              {winery.weddingConfidence && (
                <VerificationBadge confidence={winery.weddingConfidence} size=\"sm\" />
              )}
            </div>
            <p className=\"text-sm text-gray-600\">{winery.city}, California</p>
            <div className=\"flex items-center gap-2 mt-2\">
              <span className={`text-sm font-semibold ${ratingColor}`}>★ {winery.totalScore}</span>
              <span className=\"text-xs text-gray-500\">({winery.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/wineries/${slug}`}>
      <div className=\"bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer h-full flex flex-col\">
        <div className=\"relative w-full h-48 bg-gray-200\">
          <Image
            src={winery.imageUrl}
            alt={winery.title}
            fill
            className=\"object-cover\"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>
        <div className=\"p-4 flex-grow flex flex-col\">
          <div className=\"flex items-start justify-between gap-2 mb-2\">
            <h3 className=\"font-serif text-lg font-semibold text-[#6B3E2E] line-clamp-2 flex-grow\">
              {winery.title}
            </h3>
          </div>
          <div className=\"mb-2 space-y-1\">
            {isCouplesFavorite(winery) && <CouplesFavoriteBadge />}
            {winery.weddingConfidence && (
              <VerificationBadge confidence={winery.weddingConfidence} size=\"sm\" />
            )}
          </div>
          <p className=\"text-sm text-gray-600 mb-3\">{winery.city}, California</p>
          
          <div className=\"flex items-center gap-2 mb-3 mt-auto\">
            <span className={`text-sm font-semibold ${ratingColor}`}>★ {winery.totalScore}</span>
            <span className=\"text-xs text-gray-500\">({winery.reviewsCount})</span>
          </div>

          {winery.website && (
            <a
              href={winery.website}
              target=\"_blank\"
              rel=\"noopener noreferrer\"
              onClick={(e) => e.stopPropagation()}
              className=\"text-xs text-[#6B3E2E] hover:underline\"
            >
              Visit Website →
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}
