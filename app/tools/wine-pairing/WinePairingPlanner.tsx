'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  COURSES,
  CA_WINE_REGIONS,
  selectionsToSearch,
  searchToSelections,
  getSelectedOption,
  filterPairings,
  type Selections,
} from '@/lib/wine-pairing';

export default function WinePairingPlanner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Hydrate from URL on first render
  const [{ selections, region }, setState] = useState(() =>
    searchToSelections(searchParams.toString())
  );

  // Tracks which result accordions are open (courseId => boolean)
  const [openCourses, setOpenCourses] = useState<Record<string, boolean>>({});
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  // ── Helpers ──────────────────────────────────────────────────────────────

  const pushUrl = useCallback(
    (next: Selections, nextRegion: string) => {
      const qs = selectionsToSearch(next, nextRegion);
      router.replace(`/tools/wine-pairing${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [router]
  );

  const selectCourse = (courseId: string, optionId: string) => {
    const next = { ...selections, [courseId]: optionId };
    setState({ selections: next, region });
    pushUrl(next, region);
    // Auto-expand this course in results
    setOpenCourses(prev => ({ ...prev, [courseId]: true }));
  };

  const clearCourse = (courseId: string) => {
    const next = { ...selections };
    delete next[courseId];
    setState({ selections: next, region });
    pushUrl(next, region);
  };

  const setRegion = (r: string) => {
    setState({ selections, region: r });
    pushUrl(selections, r);
  };

  const toggleCourse = (courseId: string) => {
    setOpenCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const handleCopyShareLink = async () => {
    const qs = selectionsToSearch(selections, region);
    const url = `${window.location.origin}/tools/wine-pairing/view${qs ? `?${qs}` : ''}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2500);
    } catch {
      setShareStatus('idle');
    }
  };

  const totalSelected = Object.keys(selections).length;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAF8F3]">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tools" className="inline-flex items-center text-[#8B5A3C] hover:text-[#6B3E2E] mb-6 font-medium text-sm">
            ← Back to Tools
          </Link>
          <div className="text-5xl mb-4">🍷</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#6B3E2E] mb-4 leading-tight">
            Wedding Wine Pairing Planner
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
            Build your complete wedding wine menu. Select each course and get expert California wine pairing recommendations — varietals, regional picks, price ranges, and pro tips.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Region Filter */}
        <div className="bg-white rounded-xl border-2 border-[#E8D5C0] p-5 mb-8">
          <h2 className="font-serif text-lg font-bold text-[#6B3E2E] mb-1">
            🗺️ Filter by Wine Region <span className="text-sm font-normal text-gray-500">(optional)</span>
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Highlights pairings from your venue's region — including estate wines your winery may pour.
          </p>
          <div className="flex flex-wrap gap-2">
            {CA_WINE_REGIONS.map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                  region === r
                    ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]'
                    : 'bg-white text-[#6B3E2E] border-[#C4956A] hover:bg-[#FBF0E5]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Course Selectors */}
        <div className="space-y-4 mb-10">
          {COURSES.map(course => {
            const selected = getSelectedOption(course.id, selections);
            return (
              <div key={course.id} className="bg-white rounded-xl border-2 border-[#E8D5C0] overflow-hidden">
                <div className="bg-[#F5E6D3] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{course.emoji}</span>
                    <span className="font-serif text-lg font-bold text-[#6B3E2E]">{course.label}</span>
                    {selected && (
                      <span className="text-xs bg-[#6B3E2E] text-white px-2 py-0.5 rounded-full ml-1">
                        {selected.name}
                      </span>
                    )}
                  </div>
                  {selected && (
                    <button
                      onClick={() => clearCourse(course.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition"
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {course.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => selectCourse(course.id, opt.id)}
                      className={`text-left p-3 rounded-lg border-2 transition ${
                        selections[course.id] === opt.id
                          ? 'border-[#6B3E2E] bg-[#FBF0E5]'
                          : 'border-[#E8D5C0] hover:border-[#C4956A] hover:bg-[#FBF5EE]'
                      }`}
                    >
                      <div className="font-semibold text-[#6B3E2E] text-sm">{opt.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{opt.description}</div>
                      {selections[course.id] === opt.id && (
                        <div className="text-xs font-bold text-[#8B5A3C] mt-1">✓ Selected</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── RESULTS ─────────────────────────────────────────────────────── */}
        {totalSelected > 0 && (
          <div>

            {/* Quick Reference Summary — LEADS */}
            <div className="bg-gradient-to-br from-[#6B3E2E] to-[#8B5A3C] rounded-2xl p-6 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Your Wedding Wine Menu
                  </h2>
                  <p className="text-white/60 text-sm mt-0.5">
                    {totalSelected} course{totalSelected !== 1 ? 's' : ''} selected
                    {region !== 'All Regions' ? ` · ${region}` : ''}
                  </p>
                </div>
                {/* Share button */}
                <button
                  onClick={handleCopyShareLink}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition border-2 whitespace-nowrap ${
                    shareStatus === 'copied'
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-white/10 border-white/40 text-white hover:bg-white/20'
                  }`}
                >
                  {shareStatus === 'copied' ? '✓ Link Copied!' : '🔗 Copy Share Link'}
                </button>
              </div>

              {/* Summary grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COURSES.map(course => {
                  const sel = getSelectedOption(course.id, selections);
                  if (!sel) return null;
                  const pairings = filterPairings(sel.pairings, region);
                  const best = pairings[0];
                  return (
                    <div key={course.id} className="bg-white/10 rounded-xl p-4">
                      <div className="text-white/60 text-xs mb-1">{course.emoji} {course.label}</div>
                      <div className="text-white font-semibold text-sm">{sel.name}</div>
                      <div className="text-amber-300 text-sm mt-1 font-medium">→ {best.wine}</div>
                      <div className="text-white/50 text-xs mt-0.5">{best.priceRange}</div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-white/20 flex flex-col sm:flex-row gap-3">
                <p className="text-white/60 text-xs flex-1">
                  Share this link with your caterer, venue, or wedding planner. Recipients see your full menu details — no editing, no sign-up.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-white text-[#6B3E2E] font-bold py-2 px-5 rounded-lg hover:bg-amber-50 transition text-xs whitespace-nowrap self-start"
                >
                  Browse 435+ CA Winery Venues →
                </Link>
              </div>
            </div>

            {/* Per-course detail accordions */}
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#6B3E2E]">
                Course Details &amp; Pro Tips
              </h3>

              {COURSES.map(course => {
                const sel = getSelectedOption(course.id, selections);
                if (!sel) return null;
                const pairings = filterPairings(sel.pairings, region);
                const isOpen = !!openCourses[course.id];

                return (
                  <div key={course.id} className="bg-white rounded-xl border-2 border-[#C4956A] overflow-hidden">
                    {/* Accordion header */}
                    <button
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FBF5EE] transition"
                      onClick={() => toggleCourse(course.id)}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-xl">{course.emoji}</span>
                        <div>
                          <div className="text-xs text-gray-500 font-medium">{course.label}</div>
                          <div className="font-serif font-bold text-[#6B3E2E] text-base">{sel.name}</div>
                        </div>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium ml-1">
                          ⭐ {pairings[0].wine}
                        </span>
                      </div>
                      <span className={`text-[#8B5A3C] text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        ▾
                      </span>
                    </button>

                    {/* Accordion body */}
                    {isOpen && (
                      <div className="border-t border-[#E8D5C0] p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {pairings.map((pairing, i) => (
                          <div key={i} className="bg-[#FBF8F4] rounded-xl p-4 border border-[#E8D5C0]">
                            <div className="flex items-start justify-between mb-2 gap-2">
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
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4 text-sm">
                Want to serve estate wines from your actual venue? Many CA wineries pour their own wines at weddings — often at a discount.
              </p>
              <Link
                href="/#regions"
                className="inline-block bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg transition"
              >
                Find Wineries by Region
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {totalSelected === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-4">👆</div>
            <p className="text-lg font-medium text-gray-500">Select dishes above to build your wine menu</p>
            <p className="text-sm mt-2">You don't need to fill every course — just the ones you're serving</p>
          </div>
        )}
      </div>
    </div>
  );
}
