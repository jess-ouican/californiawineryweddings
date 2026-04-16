'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TimelineCard from '@/components/TimelineCard';
import { buildTimeline, searchToParams } from '@/lib/timeline';

export default function TimelineEmbed() {
  const searchParams = useSearchParams();
  const params = useMemo(() => searchToParams(searchParams.toString()), [searchParams]);
  const timeline = useMemo(() => buildTimeline(params), [params]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] p-4 flex flex-col items-center">
      <TimelineCard
        params={params}
        timeline={timeline}
        exportMode={false}
        branded={true}
      />

      {/* Powered-by footer with backlink */}
      <div className="mt-4 text-center">
        <Link
          href={`https://www.californiawineryweddings.com/tools/wedding-timeline?${searchParams.toString()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#8B5A3C] hover:text-[#6B3E2E] underline"
        >
          ✏️ Customize this timeline at CaliforniaWineryWeddings.com
        </Link>
      </div>
    </div>
  );
}
