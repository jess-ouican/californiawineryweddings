'use client';

interface VerifiedOwnerBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function VerifiedOwnerBadge({ size = 'md' }: VerifiedOwnerBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div className={`${sizeClasses[size]} bg-green-100 text-green-900 rounded-full font-semibold flex items-center gap-1.5 w-fit`}>
      <span className="text-lg">✓</span>
      Verified Owner
    </div>
  );
}
