'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// ─── Sunset data for CA wine regions by month ──────────────────────────────
// Approximate sunset times (24h) by region and month
const SUNSET_DATA: Record<string, number[]> = {
  napa: [17.3, 17.9, 18.5, 19.2, 19.8, 20.3, 20.3, 19.9, 19.1, 18.2, 17.4, 17.1],
  sonoma: [17.3, 17.9, 18.5, 19.2, 19.8, 20.3, 20.3, 19.9, 19.1, 18.2, 17.4, 17.1],
  paso: [17.5, 18.1, 18.6, 19.3, 19.9, 20.4, 20.3, 20.0, 19.2, 18.4, 17.6, 17.3],
  santabarbara: [17.7, 18.2, 18.7, 19.4, 20.0, 20.5, 20.4, 20.1, 19.4, 18.6, 17.8, 17.5],
  temecula: [17.6, 18.1, 18.7, 19.3, 19.9, 20.4, 20.4, 20.0, 19.3, 18.5, 17.7, 17.4],
  livermore: [17.2, 17.8, 18.5, 19.2, 19.8, 20.3, 20.2, 19.8, 19.0, 18.1, 17.3, 17.0],
  'santa-cruz': [17.3, 17.9, 18.5, 19.2, 19.8, 20.3, 20.3, 19.9, 19.1, 18.2, 17.4, 17.1],
  lodi: [17.2, 17.9, 18.5, 19.3, 20.0, 20.5, 20.4, 19.9, 19.1, 18.2, 17.3, 17.0],
};

// Noise ordinance cutoff by county (24h)
const NOISE_ORDINANCE: Record<string, { cutoff: number; note: string }> = {
  napa: { cutoff: 22.0, note: 'Napa County: amplified music must end by 10:00 PM in most areas.' },
  sonoma: { cutoff: 22.0, note: 'Sonoma County: most venues enforce a 10:00 PM music cutoff.' },
  paso: { cutoff: 22.5, note: 'San Luis Obispo County: typically 10:00–10:30 PM cutoff.' },
  santabarbara: { cutoff: 22.0, note: 'Santa Barbara County: 10:00 PM amplified music cutoff.' },
  temecula: { cutoff: 23.0, note: 'Riverside County (Temecula): often 11:00 PM — confirm with venue.' },
  livermore: { cutoff: 22.0, note: 'Alameda County (Livermore): typically 10:00 PM cutoff.' },
  'santa-cruz': { cutoff: 22.0, note: 'Santa Cruz County: 10:00 PM cutoff in most areas.' },
  lodi: { cutoff: 22.5, note: 'San Joaquin County (Lodi): typically 10:00–10:30 PM — confirm with venue.' },
};

// Harvest season flag
const HARVEST_MONTHS = [7, 8, 9]; // Aug, Sep, Oct (0-indexed)

const REGIONS = [
  { id: 'napa', label: 'Napa Valley', desc: 'Most prestigious, highest demand' },
  { id: 'sonoma', label: 'Sonoma County', desc: 'Upscale, diverse landscapes' },
  { id: 'paso', label: 'Paso Robles', desc: 'Stunning scenery, excellent value' },
  { id: 'santabarbara', label: 'Santa Barbara', desc: 'Coastal charm + wine country elegance' },
  { id: 'temecula', label: 'Temecula Valley', desc: 'Southern CA, best value for LA couples' },
  { id: 'livermore', label: 'Livermore / East Bay', desc: 'Close to Bay Area, great value' },
  { id: 'santa-cruz', label: 'Santa Cruz Mountains', desc: 'Boutique, intimate estates' },
  { id: 'lodi', label: 'Lodi / Central Valley', desc: 'Most budget-friendly' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Wedding party size → getting ready start time
function getGettingReadyDuration(bridalPartySize: number): number {
  if (bridalPartySize <= 2) return 2;
  if (bridalPartySize <= 4) return 2.5;
  if (bridalPartySize <= 6) return 3;
  if (bridalPartySize <= 8) return 3.5;
  return 4;
}

function formatTime(decimalHour: number): string {
  const totalMinutes = Math.round(decimalHour * 60);
  let h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const ampm = h < 12 ? 'AM' : 'PM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

interface TimelineEvent {
  time: number;
  label: string;
  duration: number; // hours
  icon: string;
  tip?: string;
  isHighlight?: boolean;
  isWarning?: boolean;
}

export default function WeddingTimelineTool() {
  const [region, setRegion] = useState('napa');
  const [month, setMonth] = useState(8); // September (0-indexed)
  const [ceremonyTime, setCeremonyTime] = useState(16.5); // 4:30 PM
  const [ceremonyLength, setCeremonyLength] = useState(30); // minutes
  const [bridalParty, setBridalParty] = useState(5);
  const [hasFirstLook, setHasFirstLook] = useState(true);
  const [receptionStyle, setReceptionStyle] = useState<'plated' | 'buffet'>('plated');
  const [hasLiveband, setHasLiveBand] = useState(false);

  const timeline = useMemo<TimelineEvent[]>(() => {
    const sunset = SUNSET_DATA[region][month];
    const goldenHourStart = sunset - 1.0;
    const goldenHourEnd = sunset - 0.1;
    const noiseOrdinance = NOISE_ORDINANCE[region].cutoff;
    const gettingReadyDuration = getGettingReadyDuration(bridalParty);
    const ceremonyEnd = ceremonyTime + ceremonyLength / 60;
    const cocktailDuration = hasFirstLook ? 1.0 : 1.5; // longer cocktail if no first look (couple doing portraits)
    const cocktailEnd = ceremonyEnd + cocktailDuration;
    const greetingGuests = hasFirstLook ? 0.25 : 0;

    const events: TimelineEvent[] = [];

    // Getting ready
    const gettingReadyStart = ceremonyTime - (hasFirstLook ? gettingReadyDuration + 2.0 : gettingReadyDuration + 1.5);
    events.push({
      time: gettingReadyStart,
      label: 'Getting Ready Begins',
      duration: gettingReadyDuration,
      icon: '💄',
      tip: `Hair & makeup for a party of ${bridalParty} takes about ${formatDuration(gettingReadyDuration)}. Start earlier to avoid rushing.`,
    });

    // First look / pre-ceremony portraits
    if (hasFirstLook) {
      const firstLookTime = ceremonyTime - 1.75;
      events.push({
        time: firstLookTime,
        label: 'First Look + Couple Portraits',
        duration: 1.0,
        icon: '📸',
        tip: 'First look gives you a private moment and frees up the cocktail hour for guests.',
        isHighlight: true,
      });
      const weddingPartyPortraits = firstLookTime + 1.0;
      events.push({
        time: weddingPartyPortraits,
        label: 'Wedding Party Portraits',
        duration: 0.5,
        icon: '👰',
        tip: `${bridalParty * 2} person party — allow 30–45 minutes for group shots.`,
      });
    }

    // Guests arrive
    events.push({
      time: ceremonyTime - 0.5,
      label: 'Guests Begin Arriving',
      duration: 0.5,
      icon: '🚐',
      tip: 'If using shuttles, first run should arrive 30 min before ceremony. Assign a greeter.',
    });

    // Ceremony
    events.push({
      time: ceremonyTime,
      label: 'Ceremony Begins',
      duration: ceremonyLength / 60,
      icon: '💒',
      tip: 'The ceremony is the heart of your day — keep it between 20–45 minutes for best guest experience.',
      isHighlight: true,
    });

    // Family formals
    events.push({
      time: ceremonyEnd,
      label: 'Family Formals',
      duration: 0.5,
      icon: '👨‍👩‍👧',
      tip: 'Limit to 6–8 combinations and pre-plan the list with your photographer to move quickly.',
    });

    // Greeting guests (if no first look)
    if (greetingGuests > 0) {
      events.push({
        time: ceremonyEnd + 0.5,
        label: 'Couple Greets Guests',
        duration: 0.25,
        icon: '🤝',
      });
    }

    // Cocktail hour
    events.push({
      time: ceremonyEnd + 0.5,
      label: 'Cocktail Hour',
      duration: cocktailDuration - 0.5,
      icon: '🥂',
      tip: hasFirstLook
        ? 'Since you did a first look, you can enjoy cocktail hour with your guests!'
        : 'Couple is finishing portraits during cocktail hour — guests enjoy wine and appetizers.',
    });

    // Vineyard portrait window — check against golden hour
    const portraitTime = cocktailEnd - 0.5;
    const duringGoldenHour =
      portraitTime >= goldenHourStart - 0.25 && portraitTime <= goldenHourEnd + 0.25;
    events.push({
      time: portraitTime,
      label: 'Vineyard Portraits (Golden Hour)',
      duration: 0.5,
      icon: '🌅',
      tip: duringGoldenHour
        ? `Perfect timing! Golden hour in your region this month starts around ${formatTime(goldenHourStart)} — your portraits will be beautifully lit.`
        : `Golden hour is around ${formatTime(goldenHourStart)}–${formatTime(goldenHourEnd)}. Consider adjusting your ceremony time to align your portraits with golden hour.`,
      isHighlight: duringGoldenHour,
      isWarning: !duringGoldenHour,
    });

    // Reception begins
    events.push({
      time: cocktailEnd,
      label: 'Grand Entrance & Reception Begins',
      duration: 0.25,
      icon: '🎉',
      isHighlight: true,
    });

    // First dance
    events.push({
      time: cocktailEnd + 0.25,
      label: 'First Dance',
      duration: 0.1,
      icon: '💃',
    });

    // Toasts
    events.push({
      time: cocktailEnd + 0.4,
      label: 'Welcome Toast & Blessing',
      duration: 0.25,
      icon: '🥂',
    });

    // Dinner
    const dinnerStart = cocktailEnd + 0.65;
    const dinnerDuration = receptionStyle === 'plated' ? 1.25 : 1.0;
    events.push({
      time: dinnerStart,
      label: receptionStyle === 'plated' ? 'Plated Dinner Service' : 'Buffet Dinner Opens',
      duration: dinnerDuration,
      icon: '🍽️',
      tip: receptionStyle === 'plated'
        ? 'Plated service moves in waves — allow 75–90 minutes for full dinner.'
        : 'Buffet typically completes in 60–75 minutes; guests eat at their own pace.',
    });

    const afterDinner = dinnerStart + dinnerDuration;

    // Parent dances
    events.push({
      time: afterDinner,
      label: 'Parent Dances',
      duration: 0.25,
      icon: '💛',
    });

    // Cake cutting
    events.push({
      time: afterDinner + 0.25,
      label: 'Cake Cutting',
      duration: 0.2,
      icon: '🎂',
    });

    // Open dancing
    const danceStart = afterDinner + 0.45;
    const receptionEnd = Math.min(noiseOrdinance, danceStart + 2.5);
    const danceDuration = receptionEnd - danceStart - 0.25;
    events.push({
      time: danceStart,
      label: 'Open Dancing Begins',
      duration: Math.max(danceDuration, 0.5),
      icon: hasLiveband ? '🎸' : '🎵',
      tip: hasLiveband
        ? 'Live bands typically need a break every 45–60 minutes. Factor this into dance floor energy.'
        : 'DJ sets allow continuous music — no breaks needed.',
    });

    // Last dance / bouquet toss
    events.push({
      time: receptionEnd - 0.25,
      label: 'Bouquet Toss & Last Dance',
      duration: 0.2,
      icon: '💐',
    });

    // Grand exit
    events.push({
      time: receptionEnd,
      label: 'Grand Exit',
      duration: 0.25,
      icon: '✨',
      isHighlight: true,
    });

    // Noise ordinance warning if cutting close
    if (receptionEnd >= noiseOrdinance - 0.25) {
      events.push({
        time: noiseOrdinance - 0.25,
        label: `⚠️ Music Must End by ${formatTime(noiseOrdinance)}`,
        duration: 0,
        icon: '🔇',
        tip: NOISE_ORDINANCE[region].note,
        isWarning: true,
      });
    }

    return events.sort((a, b) => a.time - b.time);
  }, [region, month, ceremonyTime, ceremonyLength, bridalParty, hasFirstLook, receptionStyle, hasLiveband]);

  const sunset = SUNSET_DATA[region][month];
  const goldenHourStart = sunset - 1.0;
  const noiseOrdinance = NOISE_ORDINANCE[region].cutoff;
  const isHarvestMonth = HARVEST_MONTHS.includes(month);

  const ceremonyHour = Math.floor(ceremonyTime);
  const ceremonyMinute = Math.round((ceremonyTime - ceremonyHour) * 60);
  const receptionEndTime = Math.min(noiseOrdinance, timeline[timeline.length - 1]?.time ?? noiseOrdinance);

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
            Build your perfect winery wedding day schedule — automatically optimized for golden hour portraits, your venue's noise ordinance, and wine country-specific logistics. No other tool does this.
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
                  onClick={() => setRegion(r.id)}
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
                  onClick={() => setMonth(i)}
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
                🍇 <strong>Harvest Season Alert:</strong> {MONTHS[month]} weddings at California wineries may coincide with active harvest (August–October). Ask your venue about harvest crew schedules, equipment noise, and any production smells that could affect your celebration.
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
              type="range"
              min={11}
              max={18}
              step={0.25}
              value={ceremonyTime}
              onChange={(e) => setCeremonyTime(parseFloat(e.target.value))}
              className="w-full accent-[#6B3E2E]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>11:00 AM</span>
              <span>6:00 PM</span>
            </div>

            <div className="mt-3">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Ceremony Length: <strong>{ceremonyLength} minutes</strong>
              </label>
              <input
                type="range"
                min={15}
                max={75}
                step={5}
                value={ceremonyLength}
                onChange={(e) => setCeremonyLength(parseInt(e.target.value))}
                className="w-full accent-[#6B3E2E]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15 min</span>
                <span>75 min</span>
              </div>
            </div>
          </div>

          {/* Bridal Party Size */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-2">Bridal Party Size</h2>
            <p className="text-sm text-gray-600 mb-3">
              Total people getting hair & makeup (including couple): <strong>{bridalParty}</strong>
            </p>
            <input
              type="range"
              min={1}
              max={12}
              step={1}
              value={bridalParty}
              onChange={(e) => setBridalParty(parseInt(e.target.value))}
              className="w-full accent-[#6B3E2E]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Just the couple</span>
              <span>12 people</span>
            </div>
          </div>

          {/* Options */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-4">Additional Options</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFirstLook}
                  onChange={(e) => setHasFirstLook(e.target.checked)}
                  className="w-4 h-4 accent-[#6B3E2E]"
                />
                <div>
                  <div className="font-medium text-gray-800">First Look</div>
                  <div className="text-xs text-gray-500">See each other before the ceremony for private portraits — unlocks cocktail hour freedom</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLiveband}
                  onChange={(e) => setHasLiveBand(e.target.checked)}
                  className="w-4 h-4 accent-[#6B3E2E]"
                />
                <div>
                  <div className="font-medium text-gray-800">Live Band</div>
                  <div className="text-xs text-gray-500">Band needs breaks every 45–60 min (vs. DJ which is continuous)</div>
                </div>
              </label>

              <div>
                <div className="font-medium text-gray-800 mb-2">Dinner Style</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setReceptionStyle('plated')}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                      receptionStyle === 'plated'
                        ? 'border-[#6B3E2E] bg-[#6B3E2E] text-white'
                        : 'border-[#C8A882] bg-white text-gray-700 hover:border-[#6B3E2E]'
                    }`}
                  >
                    🍽️ Plated
                  </button>
                  <button
                    onClick={() => setReceptionStyle('buffet')}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                      receptionStyle === 'buffet'
                        ? 'border-[#6B3E2E] bg-[#6B3E2E] text-white'
                        : 'border-[#C8A882] bg-white text-gray-700 hover:border-[#6B3E2E]'
                    }`}
                  >
                    🥘 Buffet
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats Box */}
          <div className="bg-white border-2 border-[#C8A882] rounded-xl p-6 space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#6B3E2E]">📊 Your Key Times at a Glance</h3>
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

        {/* ── RIGHT: Timeline ───────────────────────────────────────────── */}
        <div>
          <div className="sticky top-4">
            <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-6">
              📅 Your Custom Timeline
            </h2>
            <div className="bg-white border-2 border-[#C8A882] rounded-xl overflow-hidden">
              <div className="bg-[#6B3E2E] px-6 py-4">
                <div className="text-white font-semibold text-lg">
                  {REGIONS.find(r => r.id === region)?.label} · {MONTHS[month]}
                </div>
                <div className="text-[#F5E6D3] text-sm">
                  Ceremony at {formatTime(ceremonyTime)} · {ceremonyLength} min ceremony
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {timeline.map((event, i) => (
                  <div
                    key={i}
                    className={`px-5 py-4 ${
                      event.isHighlight
                        ? 'bg-[#FAF8F3] border-l-4 border-[#6B3E2E]'
                        : event.isWarning
                        ? 'bg-red-50 border-l-4 border-red-400'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl flex-shrink-0 mt-0.5">{event.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className={`font-semibold text-sm ${event.isWarning ? 'text-red-700' : 'text-gray-800'}`}>
                            {event.label}
                          </div>
                          <div className={`text-sm font-bold flex-shrink-0 ${event.isHighlight ? 'text-[#6B3E2E]' : event.isWarning ? 'text-red-600' : 'text-gray-600'}`}>
                            {formatTime(event.time)}
                          </div>
                        </div>
                        {event.duration > 0 && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            Duration: {formatDuration(event.duration)}
                          </div>
                        )}
                        {event.tip && (
                          <div className={`text-xs mt-1.5 leading-relaxed ${event.isWarning ? 'text-red-600' : 'text-gray-500'}`}>
                            💡 {event.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div className="bg-[#F5E6D3] px-6 py-4 text-xs text-gray-600 leading-relaxed">
                <strong>Note:</strong> This is a suggested framework. Work with your venue coordinator and photographer to finalize your timeline. Actual times may vary based on your specific venue, vendors, and logistics.
              </div>
            </div>
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
              <li>• Schedule your vineyard portraits to overlap with it</li>
              <li>• In fall/winter, golden hour is earlier — plan ceremony times accordingly</li>
              <li>• Ask your photographer to do a location scout at your venue beforehand</li>
              <li>• Have a champagne moment ready — this is when you pop the bottle in the vineyard</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border-2 border-[#C8A882] p-6">
            <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-4">🔇 Noise Ordinance Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Know your cutoff <em>before</em> booking — it varies by county</li>
              <li>• Build the timeline working backwards from the cutoff</li>
              <li>• Give your DJ/band a "15 minute warning" cue before cutoff</li>
              <li>• Move the last dance to 10–15 min before cutoff</li>
              <li>• Ask your venue if they have a noise permit for later events</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border-2 border-[#C8A882] p-6">
            <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-4">🚐 Winery Logistics</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Build 20–30 min of buffer time throughout — things always run late</li>
              <li>• Shuttle last run should depart 30 min after event ends</li>
              <li>• For harvest month weddings, confirm venue access hours with your coordinator</li>
              <li>• Have a dedicated timeline manager (coordinator or MOH/BM)</li>
              <li>• Give vendors a copy of your timeline 2 weeks before the wedding</li>
            </ul>
          </div>
        </div>

        {/* Golden Hour Table */}
        <div className="mt-8 bg-white rounded-xl border-2 border-[#C8A882] overflow-hidden">
          <div className="bg-[#6B3E2E] px-6 py-4">
            <h3 className="font-serif text-xl font-bold text-white">
              🌅 Golden Hour by Month — {REGIONS.find(r => r.id === region)?.label}
            </h3>
            <p className="text-[#F5E6D3] text-sm mt-1">Plan your ceremony time to hit this window for your vineyard portraits</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5E6D3]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#6B3E2E]">Month</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#6B3E2E]">Golden Hour Starts</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#6B3E2E]">Sunset</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#6B3E2E]">Best Ceremony Time</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#6B3E2E]">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MONTHS.map((m, i) => {
                  const sun = SUNSET_DATA[region][i];
                  const gh = sun - 1.0;
                  // Ideal ceremony: so cocktail hour ends right at golden hour start
                  // cocktail hour = 1–1.5h after ceremony ends (30min ceremony assumed)
                  const idealCeremony = gh - 1.5 - 0.5; // golden hour - cocktail - ceremony
                  const isSelected = month === i;
                  return (
                    <tr
                      key={m}
                      className={`cursor-pointer hover:bg-[#FAF8F3] ${isSelected ? 'bg-[#FAF8F3] font-medium' : ''}`}
                      onClick={() => setMonth(i)}
                    >
                      <td className={`px-4 py-3 ${isSelected ? 'text-[#6B3E2E] font-bold' : 'text-gray-700'}`}>
                        {m} {isSelected ? '← selected' : ''}
                        {HARVEST_MONTHS.includes(i) ? ' 🍇' : ''}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatTime(gh)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatTime(sun)}</td>
                      <td className="px-4 py-3 text-[#6B3E2E] font-semibold">{formatTime(idealCeremony)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {HARVEST_MONTHS.includes(i)
                          ? 'Harvest season — ask about crop activity'
                          : i >= 11 || i <= 1
                          ? 'Cool evenings — plan heating'
                          : i >= 5 && i <= 7
                          ? 'Hot afternoons — plan shade & cooling'
                          : 'Ideal wedding weather'}
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
            <Link
              href="/"
              className="inline-block bg-white hover:bg-gray-100 text-[#6B3E2E] font-semibold py-3 px-8 rounded-lg transition"
            >
              Browse All Wineries
            </Link>
            <Link
              href="/tools"
              className="inline-block bg-transparent hover:bg-[#5a3422] text-white font-semibold py-3 px-8 rounded-lg border-2 border-white transition"
            >
              Explore More Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
