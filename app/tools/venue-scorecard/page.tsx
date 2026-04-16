'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VenueScorecardPage() {
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
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
        body: JSON.stringify({ email: email.trim(), optIn }),
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
      <section className="bg-gradient-to-br from-[#FAF8F3] via-[#F5E6D3] to-[#F0D5B8] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12">

            {/* Left: copy */}
            <div className="flex-1">
              <div className="inline-block bg-[#6B3E2E]/10 text-[#6B3E2E] text-xs font-semibold font-sans px-3 py-1.5 rounded-full mb-6 tracking-wide">
                FREE GOOGLE SHEET
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#6B3E2E] mb-5 leading-tight">
                The California Winery Wedding Venue Scorecard
              </h1>
              <p className="text-lg text-gray-600 font-sans leading-relaxed mb-4">
                Touring venues is exciting — until you realize every winery has different wine minimums, noise curfews, corkage rules, and harvest-season fine print.
              </p>
              <p className="text-lg text-gray-600 font-sans leading-relaxed">
                This scorecard helps you evaluate and compare up to 3 venues across 35 winery-specific criteria so you can choose with confidence, not just vibes.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                {['35 criteria', 'Weighted scoring out of 100', 'Up to 3 venues', 'Red flags cheat sheet', 'CA region guide'].map(tag => (
                  <span key={tag} className="text-[#8B5A3C] font-sans text-sm flex items-center gap-1.5">
                    <span className="text-[#6B3E2E]">✓</span> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: email capture card */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm p-8">
                {status === 'success' ? (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-4">🥂</div>
                    <h2 className="font-serif text-2xl font-bold text-[#6B3E2E] mb-3">Check your inbox</h2>
                    <p className="text-gray-600 font-sans text-sm leading-relaxed mb-3">
                      The scorecard is on its way to <span className="font-semibold text-[#6B3E2E]">{email}</span>.
                    </p>
                    <p className="text-gray-500 font-sans text-xs">
                      Open it and go <span className="font-semibold">File → Make a copy</span> to save it to your Google Drive.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-serif text-xl font-bold text-[#6B3E2E] mb-2">
                      Get the free scorecard
                    </h2>
                    <p className="text-gray-500 font-sans text-sm mb-6">
                      We&apos;ll send the Google Sheet link to your email.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3 rounded-lg border border-[#E8DDD0] text-gray-800 font-sans text-sm placeholder-gray-400 focus:outline-none focus:border-[#6B3E2E] focus:ring-1 focus:ring-[#6B3E2E] disabled:opacity-60 bg-[#FAF8F3]"
                      />
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-[#6B3E2E] hover:bg-[#5a3422] disabled:opacity-60 text-white font-semibold font-sans py-3 px-6 rounded-lg transition text-sm"
                      >
                        {status === 'loading' ? 'Sending…' : 'Send it to my email →'}
                      </button>
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={optIn}
                          onChange={e => setOptIn(e.target.checked)}
                          className="mt-0.5 accent-[#6B3E2E] flex-shrink-0"
                        />
                        <span className="text-gray-500 font-sans text-xs leading-relaxed">
                          Add me to the newsletter for venue spotlights &amp; planning tips
                        </span>
                      </label>
                    </form>
                    {status === 'error' && (
                      <p className="text-red-500 font-sans text-xs mt-3">{errorMsg}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3E2E] text-center mb-3">
            What&apos;s inside
          </h2>
          <p className="text-center text-gray-500 font-sans text-base mb-12 max-w-xl mx-auto">
            Three tabs. Everything you need to tour, score, and decide.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📋',
                title: 'Venue Scorecard',
                desc: '35 criteria across 7 categories — wine minimums, noise ordinances, corkage, harvest conflicts, catering flexibility, and more. Score 1–5 per row. Weighted totals auto-calculate out of 100.',
                note: 'Up to 3 venues side by side',
              },
              {
                icon: '🍇',
                title: 'Cheat Sheet',
                desc: '15 questions to bring to every tour. 15 red flags that mean walk away. Plus a California region quick-guide comparing Napa, Sonoma, Paso Robles, Temecula, Santa Barbara, and more.',
                note: 'Winery-specific — not generic',
              },
              {
                icon: '📖',
                title: 'How To Use',
                desc: 'Step-by-step instructions, tips for scoring honestly, and guidance for couples who disagree. Adjust the weights to reflect what matters most to you.',
                note: 'Works for any budget',
              },
            ].map(item => (
              <div key={item.title} className="bg-[#FAF8F3] rounded-xl p-7 border border-[#E8DDD0]">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl font-bold text-[#6B3E2E] mb-3">{item.title}</h3>
                <p className="text-gray-600 font-sans text-sm leading-relaxed mb-4">{item.desc}</p>
                <p className="text-[#8B5A3C] font-sans text-xs font-semibold">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OBFUSCATED PREVIEW ── */}
      <section className="py-16 sm:py-20 bg-[#FAF8F3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3E2E] mb-3">
              A peek inside
            </h2>
            <p className="text-gray-500 font-sans text-base max-w-lg mx-auto">
              Here&apos;s a preview of the scoring tab. Enter your email above to get the full version.
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-[#E8DDD0] shadow-lg bg-white">

            {/* Browser chrome */}
            <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-3 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-400 font-mono border border-gray-200 truncate">
                docs.google.com/spreadsheets/d/••••••••••••••••••••••••••
              </div>
            </div>

            {/* Sheet header */}
            <div className="bg-[#6B3E2E] px-6 py-3 text-center">
              <p className="text-white font-serif text-base font-semibold">🍷 California Winery Wedding — Venue Scorecard</p>
              <p className="text-white/60 font-sans text-xs mt-0.5">Score each venue 1–5 · Weighted totals calculate automatically</p>
            </div>

            {/* Column headers */}
            <div className="bg-[#8B5A3C] grid font-sans text-xs font-bold text-white"
              style={{ gridTemplateColumns: '2fr 0.55fr 0.08fr 0.9fr 1.3fr 0.08fr 0.9fr 1.3fr' }}>
              <div className="px-3 py-2">CRITERIA</div>
              <div className="px-2 py-2 text-center">WEIGHT</div>
              <div />
              <div className="px-2 py-2 text-center">VENUE 1</div>
              <div className="px-2 py-2">NOTES</div>
              <div />
              <div className="px-2 py-2 text-center">VENUE 2</div>
              <div className="px-2 py-2">NOTES</div>
            </div>

            {/* Category band */}
            <div className="bg-[#F5ECD7] px-4 py-1.5 font-sans text-xs font-bold text-[#6B3E2E] border-y border-[#E8DDD0]">
              🏛️ VENUE FUNDAMENTALS
            </div>

            {/* Data rows */}
            {[
              { label: 'Venue rental fee is within our budget', w: 5, v1: 4, v2: 3, n1: 'Ask about weekday rate', n2: 'Over by ~$3k' },
              { label: 'Date available for our preferred month', w: 5, v1: 5, v2: 2, n1: 'Oct 12 open ✓', n2: 'Fully booked' },
              { label: 'Indoor backup option (weather contingency)', w: 4, v1: 3, v2: 4, n1: 'Small barn only', n2: 'Full barrel room' },
              { label: 'Exclusively ours — no public tasting overlap', w: 5, v1: 5, v2: 3, n1: 'Confirmed ✓', n2: 'Tasting stays open' },
              { label: 'Guest capacity fits our headcount', w: 4, v1: 4, v2: 4, n1: 'Max 150, we\'re at 120', n2: '' },
            ].map((row, i) => (
              <div key={i}
                className={`grid font-sans text-xs items-center border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F3]'}`}
                style={{ gridTemplateColumns: '2fr 0.55fr 0.08fr 0.9fr 1.3fr 0.08fr 0.9fr 1.3fr' }}>
                <div className="px-3 py-2 text-gray-700">{row.label}</div>
                <div className="px-2 py-2 text-center font-semibold text-[#6B3E2E]">{row.w}</div>
                <div />
                <div className={`px-2 py-2 text-center font-bold ${row.v1 >= 4 ? 'text-green-700' : row.v1 >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>{row.v1}</div>
                <div className="px-2 py-2 text-gray-400 italic truncate">{row.n1}</div>
                <div />
                <div className={`px-2 py-2 text-center font-bold ${row.v2 >= 4 ? 'text-green-700' : row.v2 >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>{row.v2}</div>
                <div className="px-2 py-2 text-gray-400 italic truncate">{row.n2}</div>
              </div>
            ))}

            {/* Wine policy teaser row */}
            <div className="bg-[#F5ECD7] px-4 py-1.5 font-sans text-xs font-bold text-[#6B3E2E] border-y border-[#E8DDD0]">
              🍷 WINE &amp; BEVERAGE POLICY
            </div>
            <div className="grid font-sans text-xs items-center bg-white border-b border-gray-100"
              style={{ gridTemplateColumns: '2fr 0.55fr 0.08fr 0.9fr 1.3fr 0.08fr 0.9fr 1.3fr' }}>
              <div className="px-3 py-2 text-gray-700">Wine minimum is manageable for our guest count</div>
              <div className="px-2 py-2 text-center font-semibold text-[#6B3E2E]">5</div>
              <div />
              <div className="px-2 py-2 text-center font-bold text-green-700">4</div>
              <div className="px-2 py-2 text-gray-400 italic">$4,200 min — ok</div>
              <div />
              <div className="px-2 py-2 text-center font-bold text-red-600">2</div>
              <div className="px-2 py-2 text-gray-400 italic">$9k min — too high</div>
            </div>

            {/* Blurred rows */}
            <div className="relative">
              {[...Array(7)].map((_, i) => (
                <div key={i}
                  className={`grid font-sans text-xs items-center border-b border-gray-100 ${i % 2 === 0 ? 'bg-[#FAF8F3]' : 'bg-white'}`}
                  style={{ gridTemplateColumns: '2fr 0.55fr 0.08fr 0.9fr 1.3fr 0.08fr 0.9fr 1.3fr', filter: 'blur(3px)', userSelect: 'none' }}>
                  <div className="px-3 py-2"><div className="h-2.5 bg-gray-200 rounded w-4/5" /></div>
                  <div className="px-2 py-2 text-center"><div className="h-2.5 bg-gray-200 rounded w-4 mx-auto" /></div>
                  <div />
                  <div className="px-2 py-2 text-center"><div className="h-3 bg-gray-200 rounded w-4 mx-auto" /></div>
                  <div className="px-2 py-2"><div className="h-2.5 bg-gray-100 rounded w-3/4" /></div>
                  <div />
                  <div className="px-2 py-2 text-center"><div className="h-3 bg-gray-200 rounded w-4 mx-auto" /></div>
                  <div className="px-2 py-2"><div className="h-2.5 bg-gray-100 rounded w-2/3" /></div>
                </div>
              ))}

              {/* Fade + unlock CTA */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-6">
                <p className="text-gray-500 font-sans text-sm mb-3">+ 24 more criteria across 6 categories</p>
                <a href="#get-scorecard"
                  className="bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold font-sans px-7 py-2.5 rounded-lg transition text-sm">
                  Get the full scorecard free →
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
            Why winery venues need a different checklist
          </h2>
          <div className="space-y-8">
            {[
              {
                icon: '🍷',
                title: 'Wine minimums are the #1 hidden cost',
                desc: "Generic venue checklists don't ask about this. Winery wine minimums range from $2,000 to $12,000+ and are often non-negotiable. Know before you fall in love with a venue.",
              },
              {
                icon: '🌾',
                title: 'Harvest season changes everything',
                desc: "September and October are peak harvest. Tractors, workers, and public tasting events can run alongside your wedding if you don't confirm exclusivity upfront.",
              },
              {
                icon: '📢',
                title: 'Noise ordinances end parties early',
                desc: "Many wine country venues sit in residential or agricultural zones with 9–10pm amplified music cutoffs. This affects your DJ, band, and the whole reception vibe.",
              },
              {
                icon: '🍾',
                title: 'Corkage policy changes your bar budget by thousands',
                desc: "Can you bring your own wine and pay corkage? Buy the estate package? Bring spirits? These answers determine a massive chunk of your bar costs.",
              },
            ].map(item => (
              <div key={item.title} className="flex gap-5">
                <div className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#6B3E2E] mb-1">{item.title}</h3>
                  <p className="text-gray-600 font-sans text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section id="get-scorecard" className="py-20 bg-[#F5ECD7]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl mb-5">🍷</div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3E2E] mb-4">
            Get your free scorecard
          </h2>
          <p className="text-gray-600 font-sans text-base mb-8 leading-relaxed">
            Enter your email and we&apos;ll send the Google Sheet instantly. Make a copy, fill it in after each tour, walk into your venue decision with total clarity.
          </p>

          {status === 'success' ? (
            <div className="bg-white rounded-xl border border-[#E8DDD0] p-8">
              <div className="text-3xl mb-3">🥂</div>
              <p className="font-serif text-xl font-bold text-[#6B3E2E] mb-2">It&apos;s on its way!</p>
              <p className="text-gray-500 font-sans text-sm">
                Check <span className="font-semibold text-[#6B3E2E]">{email}</span> — then File → Make a copy.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8DDD0] text-gray-800 font-sans text-sm placeholder-gray-400 focus:outline-none focus:border-[#6B3E2E] focus:ring-1 focus:ring-[#6B3E2E] disabled:opacity-60 bg-[#FAF8F3]"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#6B3E2E] hover:bg-[#5a3422] disabled:opacity-60 text-white font-semibold font-sans py-3 px-6 rounded-lg transition text-sm"
                >
                  {status === 'loading' ? 'Sending…' : 'Send it to my email →'}
                </button>
                <label className="flex items-start gap-2.5 cursor-pointer text-left">
                  <input
                    type="checkbox"
                    checked={optIn}
                    onChange={e => setOptIn(e.target.checked)}
                    className="mt-0.5 accent-[#6B3E2E] flex-shrink-0"
                  />
                  <span className="text-gray-400 font-sans text-xs leading-relaxed">
                    Add me to the newsletter for venue spotlights &amp; planning tips
                  </span>
                </label>
              </form>
              {status === 'error' && (
                <p className="text-red-500 font-sans text-xs mt-3">{errorMsg}</p>
              )}
            </div>
          )}

          <p className="text-gray-400 font-sans text-xs mt-5">
            No spam. Just your scorecard.
          </p>
        </div>
      </section>

      {/* ── BACK TO TOOLS ── */}
      <section className="py-10 bg-white border-t border-[#E8DDD0]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Link href="/tools" className="text-[#6B3E2E] font-sans text-sm hover:underline">
            ← Back to all free tools
          </Link>
        </div>
      </section>

    </div>
  );
}
