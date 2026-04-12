'use client';

import { WineryReview } from '@/lib/types';

interface WeddingTestimonialsProps {
  reviews?: WineryReview[];
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
          <div
            key={review.reviewId}
            className="bg-gradient-to-br from-[#FBF5F0] to-[#F5EEE8] p-6 rounded-lg border-l-4 border-[#9B8B7E]"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-serif font-semibold text-[#6B3E2E]">
                  {review.name}
                </p>
                <p className="text-xs text-gray-600">
                  {review.publishedAtDate}
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
              "{review.text}"
            </p>
            {review.likesCount > 0 && (
              <p className="text-xs text-gray-600 mt-3">
                👍 {review.likesCount} {review.likesCount === 1 ? 'person' : 'people'} found this helpful
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
