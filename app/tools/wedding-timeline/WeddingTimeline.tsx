'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TimelineCard from '@/components/TimelineCard';
import {
  REGIONS,
  MONTHS,
  HARVEST_MONTHS,
  SUNSET_DATA,
  NOISE_ORDINANCE,
  DEFAULT_PARAMS,
  TimelineParams,
  buildTimeline,
  formatTime,
  paramsToSearch,
  searchToParams,
} from '@/lib/timeline';

// ─── Export helpers (lazy-loaded so they don't bloat initial bundle) ────────

async function exportPNG(el: HTMLElement, filename: string) {
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function exportPDF(el: HTMLElement, filename: string) {
  const { default: html2canvas } = await import('html2canvas');
  const { jsPDF } = await import('jspdf');
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });
  const imgData = canvas.toDataURL('image/png');
  const pageW = 148; // A5 width mm
  const imgH = (canvas.height / canvas.width) * pageW;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pageW, imgH + 10] });
  pdf.addImage(imgData, 'PNG', 0, 5, pageW, imgH);
  pdf.save(filename);
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function WeddingTimelineTool() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Hydrate state from URL on first render
  const [params, setParams] = useState<TimelineParams>(() =>
    searchToParams(searchParams.toString())
  );

  // Destructure for convenience
  const { region, month, ceremonyTime, ceremonyLength, bridalParty, hasFirstLook, receptionStyle, hasLiveband } = params;

  // Helper to update a single param + push to URL
  const set = useCallback(<K extends keyof TimelineParams>(key: K, value: TimelineParams[K]) => {
    setParams(prev => {
      const next = { ...prev, [key]: value };
      const qs = paramsToSearch(next);
      router.replace(`/tools/wedding-timeline?${qs}`, { scroll: false });
      return next;
    });
  }, [router]);

  const timeline = useMemo(() => buildTimeline(params), [params]);

  const sunset = SUNSET_DATA[region][month];
  const goldenHourStart = sunset - 1.0;
  const noiseOrdinance = NOISE_ORDINANCE[region].cutoff;
  const isHarvestMonth = HARVEST_MONTHS.includes(month);

  // Export ref — points at the TimelineCard DOM node
  const exportRef = useRef<HTMLDivElement>(null);

  // Share state
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/tools/wedding-timeline/view?${paramsToSearch(params)}`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2500);
    } catch {
      setShareStatus('error');
      setTimeout(() => setShareStatus('idle'), 2500);
    }
  };

  const handleExportPNG = async () => {
    if (!exportRef.current) return;
    setExporting('png');
    try {
      const regionLabel = REGIONS.find(r => r.id === region)?.label ?? region;
      await exportPNG(exportRef.current, `wedding-timeline-${regionLabel.toLowerCase().replace(/\s+/g, '-')}.png`);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    setExporting('pdf');
    try {
      const regionLabel = REGIONS.find(r => r.id === region)?.label ?? region;
      await exportPDF(exportRef.current, `wedding-timeline-${regionLabel.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/tools" className="text-[#8B5A3C] hover:text-[#6B3E2E] text-sm font-medium mb-6 block">
            ← Back to Tools
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#6B3E2E] mb-4 leading-tight">
            🕐 Winery Wedding Day Timeline Generator
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
            Build your perfect winery wedding day schedule — optimized for golden hour portraits, noise ordinance cutoffs, and wine country logistics. Share it with your planner, photographer, and bridal party.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ── LEFT: Inputs ─────────────────────────────────────────────── */}
        <div className="space-y-8">

          {/* Region */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-4">Wine Region</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => set('region', r.id)}
                  className={`text-left px-4 py-3 rounded-lg border-2 transition text-sm ${
                    region === r.id
                      ? 'border-[#6B3E2E] bg-[#6B3E2E] text-white'
                      : 'border-[#C8A882] bg-white text-gray-700 hover:border-[#6B3E2E]'
                  }`}
                >
                  <div className="font-semibold">{r.label}</div>
                  <div className={`text-xs mt-0.5 ${region === r.id ? 'text-[#F5E6D3]' : 'text-gray-500'}`}>
                    {r.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Month */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-4">Wedding Month</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  onClick={() => set('month', i)}
                  className={`px-3 py-2 rounded-lg border-2 transition text-sm font-medium ${
                    month === i
                      ? 'border-[#6B3E2E] bg-[#6B3E2E] text-white'
                      : 'border-[#C8A882] bg-white text-gray-700 hover:border-[#6B3E2E]'
                  }`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
            {isHarvestMonth && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-lg text-sm text-amber-800">
                🍇 <strong>Harvest Season Alert:</strong> {MONTHS[month]} weddings may coincide with active harvest (Aug–Oct). Ask your venue about harvest crew schedules and equipment noise.
              </div>
            )}
            <div className="mt-3 p-3 bg-[#F5E6D3] rounded-lg text-sm text-[#6B3E2E]">
              🌅 <strong>Sunset in {MONTHS[month]}:</strong> ~{formatTime(sunset)} · Golden hour begins ~{formatTime(goldenHourStart)}
            </div>
          </div>

          {/* Ceremony Time */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">Ceremony Start Time</h2>
            <p className="text-sm text-gray-600 mb-3">
              Current: <strong>{formatTime(ceremonyTime)}</strong>
            </p>
            <input
              type="range" min={11} max={18} step={0.25} value={ceremonyTime}
              onChange={(e) => set('ceremonyTime', parseFloat(e.target.value))}
              className="w-full accent-[#6B3E2E]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>11:00 AM</span><span>6:00 PM</span>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Ceremony Length: <strong>{ceremonyLength} minutes</strong>
              </label>
              <input
                type="range" min={15} max={75} step={5} value={ceremonyLength}
                onChange={(e) => set('ceremonyLength', parseInt(e.target.value))}
                className="w-full accent-[#6B3E2E]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15 min</span><span>75 min</span>
              </div>
            </div>
          </div>

          {/* Bridal Party */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">Bridal Party Size</h2>
            <p className="text-sm text-gray-600 mb-3">
              People getting hair & makeup (including couple): <strong>{bridalParty}</strong>
            </p>
            <input
              type="range" min={1} max={12} step={1} value={bridalParty}
              onChange={(e) => set('bridalParty', parseInt(e.target.value))}
              className="w-full accent-[#6B3E2E]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Just the couple</span><span>12 people</span>
            </div>
          </div>

          {/* Options */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-4">Additional Options</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={hasFirstLook}
                  onChange={(e) => set('hasFirstLook', e.target.checked)}
                  className="w-4 h-4 accent-[#6B3E2E]" />
                <div>
                  <div className="font-medium text-gray-800">First Look</div>
                  <div className="text-xs text-gray-500">Private portraits before ceremony — lets you enjoy cocktail hour with guests</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={hasLiveband}
                  onChange={(e) => set('hasLiveband', e.target.checked)}
                  className="w-4 h-4 accent-[#6B3E2E]" />
                <div>
                  <div className="font-medium text-gray-800">Live Band</div>
                  <div className="text-xs text-gray-500">Band needs breaks every 45–60 min (vs. DJ which is continuous)</div>
                </div>
              </label>
              <div>
                <div className="font-medium text-gray-800 mb-2">Dinner Style</div>
                <div className="flex gap-3">
                  {(['plated', 'buffet'] as const).map(style => (
                    <button key={style} onClick={() => set('receptionStyle', style)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                        receptionStyle === style
                          ? 'border-[#6B3E2E] bg-[#6B3E2E] text-white'
                          : 'border-[#C8A882] bg-white text-gray-700 hover:border-[#6B3E2E]'
                      }`}>
                      {style === 'plated' ? '🍽️ Plated' : '🥘 Buffet'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="bg-white border-2 border-[#C8A882] rounded-xl p-6 space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#6B3E2E]">📊 Key Times at a Glance</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Golden Hour Starts</div>
                <div className="font-bold text-[#6B3E2E] text-lg">{formatTime(goldenHourStart)}</div>
              </div>
              <div>
                <div className="text-gray-500">Sunset</div>
                <div className="font-bold text-[#6B3E2E] text-lg">{formatTime(sunset)}</div>
              </div>
              <div>
                <div className="text-gray-500">Noise Ordinance</div>
                <div className="font-bold text-[#6B3E2E] text-lg">{formatTime(noiseOrdinance)}</div>
              </div>
              <div>
                <div className="text-gray-500">Event Window</div>
                <div className="font-bold text-[#6B3E2E] text-lg">
                  {Math.round(noiseOrdinance - ceremonyTime + 0.5)}h total
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              {NOISE_ORDINANCE[region].note}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Timeline + Export / Share ──────────────────────────── */}
        <div>
          <div className="sticky top-4 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#6B3E2E]">
              📅 Your Custom Timeline
            </h2>

            {/* Export + Share bar */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportPNG}
                disabled={!!exporting}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-[#C8A882] hover:border-[#6B3E2E] text-[#6B3E2E] font-semibold text-sm rounded-lg transition disabled:opacity-50"
              >
                {exporting === 'png' ? (
                  <span className="animate-pulse">Exporting…</span>
                ) : (
                  <>🖼️ Save as PNG</>
                )}
              </button>
              <button
                onClick={handleExportPDF}
                disabled={!!exporting}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-[#C8A882] hover:border-[#6B3E2E] text-[#6B3E2E] font-semibold text-sm rounded-lg transition disabled:opacity-50"
              >
                {exporting === 'pdf' ? (
                  <span className="animate-pulse">Exporting…</span>
                ) : (
                  <>📄 Save as PDF</>
                )}
              </button>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2 font-semibold text-sm rounded-lg transition border-2 ${
                  shareStatus === 'copied'
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-[#6B3E2E] border-[#6B3E2E] text-white hover:bg-[#5a3422]'
                }`}
              >
                {shareStatus === 'copied' ? '✓ Link Copied!' : '🔗 Copy Share Link'}
              </button>
            </div>

            {/* The actual timeline card (also the export target) */}
            <TimelineCard
              ref={exportRef}
              params={params}
              timeline={timeline}
              branded={true}
              showTips={true}
            />
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border-2 border-[#C8A882] p-6">
            <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-4">🌅 Maximize Golden Hour</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Golden hour lasts ~45–60 minutes — your most beautiful light window</li>
              <li>• Schedule vineyard portraits to overlap with it</li>
              <li>• In fall/winter, golden hour is earlier — plan ceremony times accordingly</li>
              <li>• Ask your photographer to scout the venue beforehand</li>
              <li>• Have champagne ready — pop the bottle in the vineyard at golden hour</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border-2 border-[#C8A882] p-6">
            <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-4">🔇 Noise Ordinance Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Know your cutoff <em>before</em> booking — it varies by county</li>
              <li>• Build the timeline working backwards from the cutoff</li>
              <li>• Give your DJ/band a "15 minute warning" cue before cutoff</li>
              <li>• Move the last dance 10–15 min before cutoff</li>
              <li>• Ask your venue if they have a permit for later events</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border-2 border-[#C8A882] p-6">
            <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-4">📤 Share Your Timeline</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Copy the share link and send to your planner, photographer, DJ</li>
              <li>• Download as PDF to print and distribute to vendors</li>
              <li>• Save as PNG to share in a group chat or email</li>
              <li>• Anyone with the link sees your exact settings — no signup needed</li>
              <li>• Save it to your camera roll so it's always on hand on the day</li>
            </ul>
          </div>
        </div>

        {/* Golden Hour Table */}
        <div className="mt-8 bg-white rounded-xl border-2 border-[#C8A882] overflow-hidden">
          <div className="bg-[#6B3E2E] px-6 py-4">
            <h3 className="font-serif text-xl font-bold text-white">
              🌅 Golden Hour by Month — {REGIONS.find(r => r.id === region)?.label}
            </h3>
            <p className="text-[#F5E6D3] text-sm mt-1">Click a month to update your timeline</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5E6D3]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#6B3E2E]">Month</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#6B3E2E]">Golden Hour</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#6B3E2E]">Sunset</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#6B3E2E]">Best Ceremony Start</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#6B3E2E]">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MONTHS.map((m, i) => {
                  const sun = SUNSET_DATA[region][i];
                  const gh = sun - 1.0;
                  const idealCeremony = gh - 1.5 - 0.5;
                  const isSelected = month === i;
                  return (
                    <tr
                      key={m}
                      className={`cursor-pointer hover:bg-[#FAF8F3] ${isSelected ? 'bg-[#FAF8F3]' : ''}`}
                      onClick={() => set('month', i)}
                    >
                      <td className={`px-4 py-3 font-medium ${isSelected ? 'text-[#6B3E2E]' : 'text-gray-700'}`}>
                        {m}{HARVEST_MONTHS.includes(i) ? ' 🍇' : ''}{isSelected ? ' ←' : ''}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatTime(gh)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatTime(sun)}</td>
                      <td className="px-4 py-3 text-[#6B3E2E] font-semibold">{formatTime(idealCeremony)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {HARVEST_MONTHS.includes(i) ? 'Ask about harvest activity' :
                          i >= 11 || i <= 1 ? 'Cool evenings — plan heating' :
                          i >= 5 && i <= 7 ? 'Hot afternoons — plan shade' :
                          'Ideal wedding weather'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#6B3E2E] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Venue?
          </h2>
          <p className="text-[#F5E6D3] mb-8 text-lg">
            Browse 435+ verified California winery wedding venues — filter by region, capacity, and style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block bg-white hover:bg-gray-100 text-[#6B3E2E] font-semibold py-3 px-8 rounded-lg transition">
              Browse All Wineries
            </Link>
            <Link href="/tools" className="inline-block bg-transparent hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg border-2 border-white transition">
              Explore More Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
