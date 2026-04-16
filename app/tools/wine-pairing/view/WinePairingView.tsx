'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  COURSES,
  searchToSelections,
  selectionsToSearch,
  getSelectedOption,
  filterPairings,
} from '@/lib/wine-pairing';

export default function WinePairingView() {
  const searchParams = useSearchParams();

  const { selections, region } = useMemo(
    () => searchToSelections(searchParams.toString()),
    [searchParams]
  );

  const totalSelected = Object.keys(selections).length;

  // Link back to builder with same params so they can edit
  const builderUrl = useMemo(() => {
    const qs = selectionsToSearch(selections, region);
    return `/tools/wine-pairing${qs ? `?${qs}` : ''}`;
  }, [selections, region]);

  if (totalSelected === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">🍷</div>
        <h1 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-3">No menu found</h1>
        <p className="text-gray-600 mb-6">This link doesn't include any course selections.</p>
        <Link
          href="/tools/wine-pairing"
          className="inline-block bg-[#6B3E2E] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#5a3422] transition"
        >
          Build Your Wine Menu →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">

      {/* Header */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-10 sm:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-4xl mb-3">🍷</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3E2E] mb-2 leading-tight">
            Wedding Wine Menu
          </h1>
          <p className="text-gray-600 text-base">
            {totalSelected}-course menu
            {region !== 'All Regions' ? ` · ${region}` : ' · California wine country'}
          </p>

          {/* Course chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            {COURSES.map(course => {
              const sel = getSelectedOption(course.id, selections);
              if (!sel) return null;
              const best = filterPairings(sel.pairings, region)[0];
              return (
                <span
                  key={course.id}
                  className="bg-white border border-[#C8A882] text-[#6B3E2E] px-3 py-1.5 rounded-full font-medium text-xs"
                >
                  {course.emoji} {best.wine}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full course cards */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {COURSES.map(course => {
          const sel = getSelectedOption(course.id, selections);
          if (!sel) return null;
          const pairings = filterPairings(sel.pairings, region);

          return (
            <div key={course.id} className="bg-white rounded-2xl border-2 border-[#C4956A] overflow-hidden shadow-sm">
              {/* Course header */}
              <div className="bg-gradient-to-r from-[#6B3E2E] to-[#8B5A3C] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{course.emoji}</span>
                  <div>
                    <div className="text-white/60 text-xs font-medium uppercase tracking-wider">{course.label}</div>
                    <div className="text-white font-bold text-lg">{sel.name}</div>
                  </div>
                </div>
              </div>

              {/* Pairings */}
              <div className="p-5 space-y-4">
                {pairings.map((pairing, i) => (
                  <div key={i} className="bg-[#FBF8F4] rounded-xl p-4 border border-[#E8D5C0]">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${i === 0 ? 'text-[#6B3E2E]' : 'text-gray-400'}`}>
                          {i === 0 ? '⭐ Best Pairing' : 'Also Excellent'}
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#5a3422]">{pairing.wine}</h3>
                      </div>
                      <span className="text-xs bg-[#F5E6D3] text-[#8B5A3C] px-2 py-1 rounded-full font-medium whitespace-nowrap">
                        {pairing.priceRange}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {pairing.varietals.map(v => (
                        <span key={v} className="text-xs bg-white border border-[#E8D5C0] text-gray-600 px-2 py-0.5 rounded-full">
                          {v}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{pairing.description}</p>

                    <div className="mb-3">
                      <div className="text-xs font-semibold text-[#8B5A3C] mb-1">🗺️ Best CA Regions</div>
                      <div className="flex flex-wrap gap-1">
                        {pairing.caRegions.map(r => (
                          <span key={r} className="text-xs bg-[#F0D5B8] text-[#6B3E2E] px-2 py-0.5 rounded-full">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="text-xs font-bold text-amber-800 mb-1">💡 Pro Tip</div>
                      <p className="text-xs text-amber-900 leading-relaxed">{pairing.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer CTAs */}
        <div className="text-center pt-4 pb-8">
          <Link
            href={builderUrl}
            className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition text-sm mb-3"
          >
            ✏️ Customize this menu →
          </Link>
          <p className="text-xs text-gray-400 mt-3">
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
