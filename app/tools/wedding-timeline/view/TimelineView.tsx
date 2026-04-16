'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TimelineCard from '@/components/TimelineCard';
import {
  buildTimeline,
  searchToParams,
  paramsToSearch,
  REGIONS,
  MONTHS,
  SUNSET_DATA,
  NOISE_ORDINANCE,
  formatTime,
} from '@/lib/timeline';

export default function TimelineView() {
  const searchParams = useSearchParams();
  const params = useMemo(() => searchToParams(searchParams.toString()), [searchParams]);
  const timeline = useMemo(() => buildTimeline(params), [params]);

  const { region, month, ceremonyTime } = params;
  const regionLabel = REGIONS.find(r => r.id === region)?.label ?? region;
  const sunset = SUNSET_DATA[region][month];
  const goldenHourStart = sunset - 1.0;
  const noiseOrdinance = NOISE_ORDINANCE[region].cutoff;

  // Link back to generator with same params so they can tweak
  const generatorUrl = `/tools/wedding-timeline?${paramsToSearch(params)}`;

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-10 sm:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-4xl mb-3">🕐</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3E2E] mb-2 leading-tight">
            {regionLabel} · {MONTHS[month]}
          </h1>
          <p className="text-gray-600 text-base">
            Ceremony at {formatTime(ceremonyTime)}
          </p>

          {/* Key callouts */}
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-white border border-[#C8A882] text-[#6B3E2E] px-3 py-1.5 rounded-full font-medium">
              🌅 Golden hour {formatTime(goldenHourStart)}
            </span>
            <span className="bg-white border border-[#C8A882] text-[#6B3E2E] px-3 py-1.5 rounded-full font-medium">
              🔇 Music off by {formatTime(noiseOrdinance)}
            </span>
            <span className="bg-white border border-[#C8A882] text-[#6B3E2E] px-3 py-1.5 rounded-full font-medium">
              🌇 Sunset {formatTime(sunset)}
            </span>
          </div>
        </div>
      </section>

      {/* Timeline card — no tips, branded */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
        <TimelineCard
          params={params}
          timeline={timeline}
          branded={true}
          showTips={false}
        />

        {/* CTA back to generator */}
        <div className="mt-6 text-center">
          <Link
            href={generatorUrl}
            className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition text-sm"
          >
            ✏️ Customize this timeline →
          </Link>
          <p className="mt-3 text-xs text-gray-500">
            Free tool by{' '}
            <Link href="/" className="text-[#8B5A3C] hover:text-[#6B3E2E] underline">
              CaliforniaWineryWeddings.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
