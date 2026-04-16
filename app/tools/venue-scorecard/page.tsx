'use client';

import { useState } from 'react';

export default function VenueScorecardPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/scorecard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#5C1A1A] via-[#8B2635] to-[#5C1A1A] py-20 sm:py-28 relative overflow-hidden">
        {/* subtle vine texture overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C9A84C 1px, transparent 1px), radial-gradient(circle at 80% 20%, #C9A84C 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] text-sm font-semibold px-4 py-2 rounded-full mb-8 font-sans">
            🆓 FREE — No credit card required
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            The California Winery Wedding<br className="hidden sm:block" />
            <span className="text-[#C9A84C]"> Venue Scorecard</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#F5ECD7] mb-10 max-w-2xl mx-auto leading-relaxed font-sans">
            Score and compare up to 3 winery venues across 35 winery-specific criteria. Weighted totals calculate automatically. Built for California wine country — covers the gotchas generic checklists miss.
          </p>

          {/* ── EMAIL CAPTURE ── */}
          <div className="max-w-md mx-auto">
            {status === 'success' ? (
              <div className="bg-white/10 border border-[#C9A84C]/50 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">🥂</div>
                <h2 className="text-white font-serif text-2xl font-bold mb-3">Check your inbox!</h2>
                <p className="text-[#F5ECD7] font-sans text-base">
                  Your Venue Scorecard is on its way to <strong className="text-[#C9A84C]">{email}</strong>.
                  Check your spam folder if it doesn&apos;t arrive in 2 minutes.
                </p>
                <p className="text-[#C9A84C] font-sans text-sm mt-4">
                  File → Make a copy to save it to your Google Drive.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === 'loading'}
                  className="flex-1 px-5 py-4 rounded-lg text-[#1A1A1A] font-sans text-base placeholder-gray-400 border-2 border-transparent focus:border-[#C9A84C] focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#C9A84C] hover:bg-[#b8943d] disabled:opacity-60 text-[#1A1A1A] font-bold font-sans px-7 py-4 rounded-lg transition whitespace-nowrap text-base"
                >
                  {status === 'loading' ? 'Sending…' : 'Send It to Me →'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-red-300 font-sans text-sm mt-3">{errorMsg}</p>
            )}
            {status !== 'success' && (
              <p className="text-[#F5ECD7]/60 font-sans text-xs mt-3">
                We&apos;ll send the Google Sheet link to your email. No spam, ever.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3E2E] text-center mb-4">
            What&apos;s Inside
          </h2>
          <p className="text-center text-gray-600 font-sans mb-12 text-base max-w-2xl mx-auto">
            Three tabs. Everything you need to tour, score, and confidently choose your California winery wedding venue.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Venue Scorecard',
                desc: '35 criteria across 7 categories — wine minimums, noise ordinances, corkage policy, harvest conflicts, catering flexibility, and more. Score 1–5 per criteria. Weighted totals auto-calculate as a score out of 100.',
                highlight: 'Compare up to 3 venues side by side',
              },
              {
                icon: '🍇',
                title: 'Cheat Sheet',
                desc: '15 questions to ask at every venue tour. 15 red flags to walk away from. A California region quick-guide comparing Napa, Sonoma, Paso Robles, Temecula, Santa Barbara, and more.',
                highlight: 'Winery-specific — not generic wedding content',
              },
              {
                icon: '📖',
                title: 'How To Use',
                desc: 'Step-by-step instructions, scoring tips, and guidance on how to weigh criteria based on what matters most to you. Includes advice for couples who disagree on venues.',
                highlight: 'Works for any couple, any budget',
              },
            ].map(item => (
              <div key={item.title} className="bg-[#FAF8F3] rounded-xl p-7 border border-[#E8DDD0]">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-3">{item.title}</h3>
                <p className="text-gray-600 font-sans text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="inline-block bg-[#C9A84C]/15 text-[#6B3E2E] font-sans text-xs font-semibold px-3 py-1 rounded-full">
                  {item.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OBFUSCATED PREVIEW ── */}
      <section className="py-16 sm:py-20 bg-[#F5ECD7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3E2E] mb-4">
              A Peek Inside the Scorecard
            </h2>
            <p className="text-gray-600 font-sans text-base">
              Here&apos;s a preview of the scoring sheet — enter your email above to get the full version.
            </p>
          </div>

          {/* Sheet preview mockup */}
          <div className="relative rounded-xl overflow-hidden border-2 border-[#8B5A3C]/30 shadow-2xl">

            {/* Fake browser chrome */}
            <div className="bg-gray-200 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 font-mono truncate">
                docs.google.com/spreadsheets/d/••••••••••••••••••••••••••••••••••••
              </div>
            </div>

            {/* Sheet header */}
            <div className="bg-[#5C1A1A] px-6 py-4 text-center">
              <p className="text-white font-serif text-lg font-bold">🍷 California Winery Wedding — Venue Scorecard</p>
              <p className="text-[#F5ECD7]/70 font-sans text-xs mt-1">Score each venue 1–5 for every criteria. Weighted totals are calculated automatically.</p>
            </div>

            {/* Sheet column headers */}
            <div className="bg-[#8B2635] grid font-sans text-xs font-bold text-white"
              style={{ gridTemplateColumns: '2fr 0.6fr 0.1fr 1fr 1.4fr 0.1fr 1fr 1.4fr' }}>
              <div className="px-3 py-2">CRITERIA</div>
              <div className="px-3 py-2 text-center">WEIGHT</div>
              <div className="px-1 py-2" />
              <div className="px-3 py-2 text-center">VENUE 1<br /><span className="text-white/50 font-normal">SCORE</span></div>
              <div className="px-3 py-2 text-center">NOTES</div>
              <div className="px-1 py-2" />
              <div className="px-3 py-2 text-center">VENUE 2<br /><span className="text-white/50 font-normal">SCORE</span></div>
              <div className="px-3 py-2 text-center">NOTES</div>
            </div>

            {/* Category header */}
            <div className="bg-[#C4536A] px-4 py-2 font-sans text-sm font-bold text-white">
              🏛️ VENUE FUNDAMENTALS
            </div>

            {/* Visible rows */}
            {[
              { label: 'Venue rental fee is within our budget', weight: 5, v1: 4, v2: 3, n1: 'Ask about weekday discount', n2: 'Over by ~$3k' },
              { label: 'Date availability for our preferred month/season', weight: 5, v1: 5, v2: 2, n1: 'Oct 12 available ✓', n2: 'Fully booked' },
              { label: 'Indoor backup option available (weather contingency)', weight: 4, v1: 3, v2: 4, n1: 'Small barn only', n2: 'Full barrel room' },
              { label: 'Exclusively ours on wedding day (no public overlap)', weight: 5, v1: 5, v2: 3, n1: '✓ Confirmed', n2: 'Tasting room stays open' },
              { label: 'Guest capacity matches our headcount', weight: 4, v1: 4, v2: 4, n1: 'Max 150 — we\'re at 120', n2: '' },
            ].map((row, i) => (
              <div key={i} className={`grid font-sans text-xs items-center ${i % 2 === 0 ? 'bg-white' : 'bg-[#FDF6EC]'}`}
                style={{ gridTemplateColumns: '2fr 0.6fr 0.1fr 1fr 1.4fr 0.1fr 1fr 1.4fr' }}>
                <div className="px-3 py-2 text-gray-700">{row.label}</div>
                <div className="px-3 py-2 text-center font-bold text-[#5C1A1A]">{row.weight}</div>
                <div />
                <div className={`px-3 py-2 text-center font-bold text-lg
                  ${row.v1 >= 4 ? 'text-green-700' : row.v1 >= 3 ? 'text-yellow-700' : 'text-red-700'}`}>
                  {row.v1}
                </div>
                <div className="px-3 py-2 text-gray-400 italic truncate">{row.n1}</div>
                <div />
                <div className={`px-3 py-2 text-center font-bold text-lg
                  ${row.v2 >= 4 ? 'text-green-700' : row.v2 >= 3 ? 'text-yellow-700' : 'text-red-700'}`}>
                  {row.v2}
                </div>
                <div className="px-3 py-2 text-gray-400 italic truncate">{row.n2}</div>
              </div>
            ))}

            {/* Wine policy category teaser */}
            <div className="bg-[#C4536A] px-4 py-2 font-sans text-sm font-bold text-white">
              🍷 WINE &amp; BEVERAGE POLICY
            </div>
            <div className="grid font-sans text-xs items-center bg-white"
              style={{ gridTemplateColumns: '2fr 0.6fr 0.1fr 1fr 1.4fr 0.1fr 1fr 1.4fr' }}>
              <div className="px-3 py-2 text-gray-700">Wine minimum is manageable for our guest count</div>
              <div className="px-3 py-2 text-center font-bold text-[#5C1A1A]">5</div>
              <div />
              <div className="px-3 py-2 text-center font-bold text-lg text-green-700">4</div>
              <div className="px-3 py-2 text-gray-400 italic">$4,200 min — workable</div>
              <div />
              <div className="px-3 py-2 text-center font-bold text-lg text-red-700">2</div>
              <div className="px-3 py-2 text-gray-400 italic">$9k min — too high</div>
            </div>

            {/* Blur overlay for remaining rows */}
            <div className="relative">
              {/* Fake blurred rows */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`grid font-sans text-xs items-center ${i % 2 === 0 ? 'bg-[#FDF6EC]' : 'bg-white'} opacity-60`}
                  style={{ gridTemplateColumns: '2fr 0.6fr 0.1fr 1fr 1.4fr 0.1fr 1fr 1.4fr', filter: 'blur(3px)' }}>
                  <div className="px-3 py-2">
                    <div className="h-3 bg-gray-300 rounded w-4/5" />
                  </div>
                  <div className="px-3 py-2 text-center"><div className="h-3 bg-gray-300 rounded w-4 mx-auto" /></div>
                  <div />
                  <div className="px-3 py-2 text-center"><div className="h-4 bg-gray-300 rounded w-5 mx-auto" /></div>
                  <div className="px-3 py-2"><div className="h-3 bg-gray-200 rounded w-3/4" /></div>
                  <div />
                  <div className="px-3 py-2 text-center"><div className="h-4 bg-gray-300 rounded w-5 mx-auto" /></div>
                  <div className="px-3 py-2"><div className="h-3 bg-gray-200 rounded w-2/3" /></div>
                </div>
              ))}

              {/* Gradient + CTA overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF8F3]/80 to-[#FAF8F3]" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-6 pt-4">
                <p className="font-sans text-sm text-[#6B3E2E] font-semibold mb-3">
                  + 24 more criteria across 6 categories
                </p>
                <a href="#get-scorecard"
                  className="bg-[#5C1A1A] hover:bg-[#4a1515] text-white font-bold font-sans px-8 py-3 rounded-lg transition text-sm shadow-lg">
                  Get the Full Scorecard Free →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY THIS EXISTS ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3E2E] text-center mb-10">
            Why Winery Venues Need a Different Scorecard
          </h2>
          <div className="space-y-6">
            {[
              {
                icon: '🍷',
                title: 'Wine minimums are the #1 hidden cost',
                desc: "Generic venue checklists don't ask about this. Winery wine minimums range from $2,000 to $12,000+ and are often non-negotiable. Know before you fall in love with a venue.",
              },
              {
                icon: '🌾',
                title: 'Harvest season changes everything',
                desc: "September and October are peak harvest. Tractors, workers, and public tasting events can run alongside your wedding day if you don't confirm exclusivity upfront.",
              },
              {
                icon: '📢',
                title: 'Noise ordinances end parties early',
                desc: "Many California wine country venues are in residential or agricultural zones with 9pm–10pm amplified music cutoffs. This affects your DJ, band, and reception timeline.",
              },
              {
                icon: '🍾',
                title: 'Corkage policy determines your bar budget',
                desc: "Can you bring your own wine and pay corkage? Buy the estate wine package? Bring spirits? These answers change your bar budget by thousands of dollars.",
              },
            ].map(item => (
              <div key={item.title} className="flex gap-5 items-start">
                <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#6B3E2E] mb-1">{item.title}</h3>
                  <p className="text-gray-600 font-sans text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA (anchor for preview link) ── */}
      <section id="get-scorecard" className="py-20 bg-gradient-to-br from-[#5C1A1A] via-[#8B2635] to-[#5C1A1A]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-6">🍷</div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Get Your Free Venue Scorecard
          </h2>
          <p className="text-[#F5ECD7] font-sans text-base mb-10 leading-relaxed">
            Enter your email and we&apos;ll send you the Google Sheet instantly.
            Make a copy, fill it in after each tour, and walk into your venue decision with total clarity.
          </p>

          {status === 'success' ? (
            <div className="bg-white/10 border border-[#C9A84C]/50 rounded-xl p-8">
              <div className="text-4xl mb-3">🥂</div>
              <p className="text-white font-serif text-xl font-bold mb-2">It&apos;s on its way!</p>
              <p className="text-[#F5ECD7] font-sans text-sm">Check your inbox at <strong className="text-[#C9A84C]">{email}</strong></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={status === 'loading'}
                className="flex-1 px-5 py-4 rounded-lg text-[#1A1A1A] font-sans text-base placeholder-gray-400 border-2 border-transparent focus:border-[#C9A84C] focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#C9A84C] hover:bg-[#b8943d] disabled:opacity-60 text-[#1A1A1A] font-bold font-sans px-7 py-4 rounded-lg transition whitespace-nowrap"
              >
                {status === 'loading' ? 'Sending…' : 'Send It →'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-red-300 font-sans text-sm mt-3">{errorMsg}</p>
          )}
          {status !== 'success' && (
            <p className="text-[#F5ECD7]/50 font-sans text-xs mt-4">
              No spam. Just your scorecard. Unsubscribe anytime.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}
