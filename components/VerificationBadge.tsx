'use client';

interface VerificationBadgeProps {
  confidence?: 'confirmed' | 'likely' | 'unverified';
  size?: 'sm' | 'md' | 'lg';
}

export default function VerificationBadge({ confidence, size = 'md' }: VerificationBadgeProps) {
  if (!confidence || confidence === 'unverified') {
    return null;
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  if (confidence === 'confirmed') {
    return (
      <div className={`${sizeClasses[size]} bg-yellow-100 text-yellow-900 rounded-full font-semibold flex items-center gap-1.5 w-fit`}>
        <span className="text-lg">✓</span>
        Official Wedding Venue
      </div>
    );
  }

  if (confidence === 'likely') {
    return (
      <div className={`${sizeClasses[size]} bg-red-100 text-red-900 rounded-full font-semibold flex items-center gap-1.5 w-fit`}>
        <span className="text-lg">♦</span>
        Hosts Weddings
      </div>
    );
  }

  return null;
}
