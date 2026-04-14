'use client';

import { useState } from 'react';
import { WineryReview } from '@/lib/types';

interface WeddingTestimonialsProps {
  reviews?: WineryReview[];
}

const MAX_PREVIEW_HEIGHT = 120; // ~3 lines of text

function formatReviewDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  } catch {
    return dateString;
  }
}

interface ReviewCardProps {
  review: WineryReview;
}

function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate if text is long enough to show "read more"
  const textLength = review.text.length;
  const shouldShowReadMore = textLength > 200;
  
  // Preview text (first 200 chars + ellipsis)
  const previewText = shouldShowReadMore && !isExpanded 
    ? review.text.substring(0, 200) + '...' 
    : review.text;

  return (
    <div className="bg-gradient-to-br from-[#FBF5F0] to-[#F5EEE8] p-6 rounded-lg border-l-4 border-[#9B8B7E]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-serif font-semibold text-[#6B3E2E]">
            {review.name}
          </p>
          <p className="text-xs text-gray-600">
            {formatReviewDate(review.publishedAtDate)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg text-yellow-600">
            {'★'.repeat(review.stars)}
            {'☆'.repeat(5 - review.stars)}
          </div>
          <p className="text-xs text-gray-600">{review.stars}.0 out of 5</p>
        </div>
      </div>
      <p className="text-gray-700 italic leading-relaxed">
        "{previewText}"
      </p>
      {shouldShowReadMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#6B3E2E] hover:underline text-sm font-medium mt-3 inline-block"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}
      {review.likesCount > 0 && (
        <p className="text-xs text-gray-600 mt-3">
          👍 {review.likesCount} {review.likesCount === 1 ? 'person' : 'people'} found this helpful
        </p>
      )}
    </div>
  );
}

export default function WeddingTestimonials({ reviews }: WeddingTestimonialsProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Filter for wedding-related reviews
  const weddingKeywords = ['wedding', 'ceremony', 'reception', 'bridal', 'bride'];
  const weddingReviews = reviews.filter((review) => {
    const text = review.text.toLowerCase();
    return weddingKeywords.some((keyword) => text.includes(keyword));
  });

  if (weddingReviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-6">
        Wedding Experiences
      </h2>
      <div className="space-y-4">
        {weddingReviews.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </div>
    </div>
  );
}
