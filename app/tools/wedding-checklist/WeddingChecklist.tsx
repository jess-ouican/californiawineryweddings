'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface ChecklistItem {
  id: string;
  task: string;
  detail?: string;
  winerySpecific?: boolean;
}

interface ChecklistPhase {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  items: ChecklistItem[];
}

const CHECKLIST_PHASES: ChecklistPhase[] = [
  {
    id: '12mo',
    title: '12+ Months Out',
    subtitle: 'Lock in your venue before it\'s gone',
    emoji: '🔑',
    items: [
      {
        id: '12-1',
        task: 'Set your approximate guest count and total budget',
        detail: 'Winery weddings in California range from $25,000–$150,000+ depending on region, season, and guest count. Nail down your range early.',
      },
      {
        id: '12-2',
        task: 'Choose your California wine region',
        detail: 'Napa, Sonoma, Paso Robles, Santa Barbara, Temecula, and Livermore each have distinct vibes, price points, and weather. Your choice affects every other budget line.',
      },
      {
        id: '12-3',
        task: 'Tour 3–5 winery venues and compare capacity, style, and exclusivity',
        detail: 'Many wineries are semi-exclusive (you have the grounds, but the tasting room stays open). Ask specifically whether your event is fully private.',
        winerySpecific: true,
      },
      {
        id: '12-4',
        task: 'Ask every venue about their wine minimum requirement',
        detail: 'Most California winery venues require you to purchase a minimum amount of estate wine — often $3,000–$15,000+. This is separate from the venue fee.',
        winerySpecific: true,
      },
      {
        id: '12-5',
        task: 'Ask about their corkage fee policy',
        detail: 'Some wineries allow outside wine with a corkage fee ($15–$50/bottle). Others prohibit it entirely. Know this before signing.',
        winerySpecific: true,
      },
      {
        id: '12-6',
        task: 'Check harvest season conflicts for your date range',
        detail: 'Harvest runs roughly August–October depending on region. Some wineries black out dates or reduce event space during crush. Confirm availability explicitly.',
        winerySpecific: true,
      },
      {
        id: '12-7',
        task: 'Confirm the venue\'s noise ordinance cutoff time',
        detail: 'Rural wine country properties often have strict county noise ordinances — music must stop by 10pm or even 9pm in some areas. This affects your timeline significantly.',
        winerySpecific: true,
      },
      {
        id: '12-8',
        task: 'Sign venue contract and pay deposit',
        detail: 'Top winery venues in Napa and Sonoma book 18–24 months out. Don\'t wait.',
      },
      {
        id: '12-9',
        task: 'Purchase wedding insurance',
        detail: 'Outdoor rural venues are higher risk for weather, vendor cancellations, and liability. Most wineries require $1M liability coverage minimum.',
        winerySpecific: true,
      },
      {
        id: '12-10',
        task: 'Set your wedding date — confirm it doesn\'t conflict with major wine events',
        detail: 'Events like BottleRock, Harvest Festival, and Taste of Sonoma can spike hotel rates and fill nearby accommodations. Check local event calendars.',
        winerySpecific: true,
      },
    ],
  },
  {
    id: '9mo',
    title: '9–12 Months Out',
    subtitle: 'Build your vendor team',
    emoji: '📋',
    items: [
      {
        id: '9-1',
        task: 'Book your photographer — prioritize vineyard and outdoor experience',
        detail: 'Ask specifically about golden hour timing at vineyard venues. The best vineyard shots happen in the 45 minutes before sunset.',
        winerySpecific: true,
      },
      {
        id: '9-2',
        task: 'Book your caterer (if not venue-provided)',
        detail: 'Many wineries require you to use their preferred caterer or pay a kitchen access fee. Confirm this before reaching out to outside caterers.',
        winerySpecific: true,
      },
      {
        id: '9-3',
        task: 'Book your officiant',
      },
      {
        id: '9-4',
        task: 'Book your DJ or band — confirm they\'ve worked outdoor vineyard venues',
        detail: 'Outdoor acoustics are very different from ballrooms. Ask for references at winery or estate venues specifically. Also confirm they can pack down by your noise cutoff.',
        winerySpecific: true,
      },
      {
        id: '9-5',
        task: 'Plan guest transportation — winery venues are almost always rural',
        detail: 'Most winery venues have limited parking and are not accessible by rideshare. Shuttle service from nearby hotels is standard. Budget $800–$3,500 depending on guest count.',
        winerySpecific: true,
      },
      {
        id: '9-6',
        task: 'Book a room block at nearby hotels',
        detail: 'Wine country hotels fill fast, especially on weekends in peak season. Block rooms 9–12 months out. Tip: look for hotels with shuttle-friendly access to your venue.',
      },
      {
        id: '9-7',
        task: 'Hire a wedding planner familiar with wine country venues',
        detail: 'Winery weddings have logistical layers (wine minimums, harvest blackouts, noise ordinances, generator needs) that benefit from a planner who knows the territory.',
        winerySpecific: true,
      },
      {
        id: '9-8',
        task: 'Begin florals research — consider seasonal vineyard blooms',
        detail: 'Wisteria, lavender, and wildflowers are abundant in wine country spring. Harvest season offers grape leaves and warm tones. Lean into what\'s growing around you.',
        winerySpecific: true,
      },
    ],
  },
  {
    id: '6mo',
    title: '6–9 Months Out',
    subtitle: 'Details, design, and the guest experience',
    emoji: '✏️',
    items: [
      {
        id: '6-1',
        task: 'Send save-the-dates',
        detail: 'Include the wine region or even a photo of the venue — it sets the tone and gets guests excited about the destination.',
      },
      {
        id: '6-2',
        task: 'Finalize your wine list with the winery',
        detail: 'Work with the winery\'s event coordinator to select your ceremony pour, cocktail hour wines, and dinner pours. Ask about estate vs. reserve options and pricing tiers.',
        winerySpecific: true,
      },
      {
        id: '6-3',
        task: 'Decide on outside wine vs. estate wine — run the numbers',
        detail: 'If the venue allows outside wine with corkage, compare the total cost: (cases × price) + (bottles × corkage fee) vs. buying direct through the winery at their event pricing.',
        winerySpecific: true,
      },
      {
        id: '6-4',
        task: 'Finalize catering menu',
        detail: 'Pair food courses with your wine selection. A good pairing creates a cohesive guest experience that feels intentional and elevated.',
      },
      {
        id: '6-5',
        task: 'Plan your ceremony layout and check sun/shade timing',
        detail: 'Outdoor vineyard ceremonies in summer can be brutally sunny. Walk the venue at the same time of day you\'ll be marrying. Know where the shade falls.',
        winerySpecific: true,
      },
      {
        id: '6-6',
        task: 'Book hair and makeup artists',
      },
      {
        id: '6-7',
        task: 'Order wedding dress and suits',
        detail: 'Allow 4–6 months for custom or semi-custom gowns plus alterations.',
      },
      {
        id: '6-8',
        task: 'Confirm generator or power requirements with your venue',
        detail: 'Outdoor vineyard venues often have limited power access. Confirm whether your DJ, caterer, lighting, and other vendors need a generator and who\'s responsible for renting it.',
        winerySpecific: true,
      },
      {
        id: '6-9',
        task: 'Create your wedding website and share hotel room block info',
      },
      {
        id: '6-10',
        task: 'Research and book a videographer if desired',
      },
    ],
  },
  {
    id: '3mo',
    title: '3–6 Months Out',
    subtitle: 'Lock in every detail',
    emoji: '🔒',
    items: [
      {
        id: '3-1',
        task: 'Send formal invitations',
        detail: 'Include travel logistics — your venue is likely 30–90 minutes from major cities. Give guests clear driving and shuttle directions.',
      },
      {
        id: '3-2',
        task: 'Finalize rentals: tables, chairs, linens, lounge furniture',
        detail: 'Many winery venues have limited inventory. If your venue provides only the space, you\'ll need to rent everything. Get quotes early — wine country rental companies are busy in peak season.',
        winerySpecific: true,
      },
      {
        id: '3-3',
        task: 'Book lighting and décor for the vineyard setting',
        detail: 'String lights, lanterns, and bistro lighting are wildly popular at vineyard venues and photograph beautifully. Many venues allow market lights strung across barrel rooms or pergolas.',
        winerySpecific: true,
      },
      {
        id: '3-4',
        task: 'Confirm your shuttle schedule with the transportation company',
        detail: 'Map out pickup hotels, departure times, return runs, and late-night pickup. Rural venues mean guests can\'t easily call an Uber at 11pm.',
        winerySpecific: true,
      },
      {
        id: '3-5',
        task: 'Order your cake or desserts',
        detail: 'Wine country cake trends: olive oil cakes, wine-infused buttercream, vineyard-themed toppers, charcuterie dessert towers.',
        winerySpecific: true,
      },
      {
        id: '3-6',
        task: 'Finalize floral arrangements with your florist',
      },
      {
        id: '3-7',
        task: 'Draft your day-of timeline with noise ordinance cutoff in mind',
        detail: 'Work backward from your music cutoff. If cutoff is 10pm, plan last dance at 9:45, dinner ends at 9pm, etc. Don\'t let the timeline creep.',
        winerySpecific: true,
      },
      {
        id: '3-8',
        task: 'Plan weather contingency if ceremony is fully outdoors',
        detail: 'Even in California, spring rain and summer heat require backup plans. Ask your venue about tent options, shade structures, and heat/cooling availability.',
        winerySpecific: true,
      },
      {
        id: '3-9',
        task: 'Schedule hair and makeup trial run',
      },
      {
        id: '3-10',
        task: 'Plan rehearsal dinner — consider hosting it at a nearby winery or wine bar',
        detail: 'Many winery venues offer private dining or barrel room events for rehearsal dinners. It keeps the wine country experience going for your guests.',
        winerySpecific: true,
      },
    ],
  },
  {
    id: '1mo',
    title: '1–3 Months Out',
    subtitle: 'Final confirmations and last-minute prep',
    emoji: '📌',
    items: [
      {
        id: '1-1',
        task: 'Collect RSVPs and finalize guest count',
        detail: 'Your final headcount drives wine order quantities, catering portions, table rentals, and shuttle capacity. Get this locked as early as possible.',
      },
      {
        id: '1-2',
        task: 'Submit final guest count to your caterer and winery',
        detail: 'Most wineries and caterers need a final count 2–4 weeks out. Confirm the exact deadline in your contracts.',
        winerySpecific: true,
      },
      {
        id: '1-3',
        task: 'Confirm final wine quantities with the winery',
        detail: 'Rule of thumb: 1 bottle per guest for a 4-hour reception, slightly more for wine-focused crowds. Confirm your pour plan (cocktail hour, dinner, toasts) with the sommelier or event manager.',
        winerySpecific: true,
      },
      {
        id: '1-4',
        task: 'Create seating chart and table assignments',
      },
      {
        id: '1-5',
        task: 'Purchase and assemble favors',
        detail: 'Mini wine bottles, personalized wine stoppers, local olive oil, and honey are classic wine country favors that guests actually keep.',
        winerySpecific: true,
      },
      {
        id: '1-6',
        task: 'Confirm all vendor arrival times with the venue',
        detail: 'Winery venues often have strict load-in windows — vendors can\'t arrive before a certain time, and must be out by a hard cutoff. Share the venue\'s rules with every vendor.',
        winerySpecific: true,
      },
      {
        id: '1-7',
        task: 'Prepare vendor tip envelopes',
        detail: 'Prepare cash or envelopes in advance. Assign a coordinator or trusted person to distribute tips at the end of the night.',
      },
      {
        id: '1-8',
        task: 'Write your vows and/or ceremony script',
      },
      {
        id: '1-9',
        task: 'Get your marriage license',
        detail: 'In California, you need to apply at your county clerk\'s office. Most licenses are valid for 90 days. Non-confidential licenses require a witness.',
      },
      {
        id: '1-10',
        task: 'Do a final venue walkthrough with your planner and coordinator',
        detail: 'Walk the exact ceremony path, cocktail hour flow, reception layout, and parking/shuttle drop-off zones. Catch any issues while there\'s still time to fix them.',
        winerySpecific: true,
      },
    ],
  },
  {
    id: '1wk',
    title: '1 Week Out',
    subtitle: 'Confirm, confirm, confirm',
    emoji: '📞',
    items: [
      {
        id: '1wk-1',
        task: 'Confirm all vendors: caterer, photographer, DJ/band, florist, shuttle, officiant',
        detail: 'Call or email every vendor with a final confirmation. Share the day-of timeline and venue address.',
      },
      {
        id: '1wk-2',
        task: 'Reconfirm shuttle schedule and pickup hotel list with guests',
        detail: 'Send a final reminder to guests about shuttle times and pickup locations. Rural wineries are easy to miss if guests are navigating themselves.',
        winerySpecific: true,
      },
      {
        id: '1wk-3',
        task: 'Check the weather forecast and activate contingency plan if needed',
        detail: 'Contact your tent rental company or venue coordinator immediately if rain is likely. Don\'t wait until the day before.',
        winerySpecific: true,
      },
      {
        id: '1wk-4',
        task: 'Prepare a wedding day emergency kit',
        detail: 'For outdoor vineyard weddings: sunscreen, bug spray, blister bandages, safety pins, a portable fan or misting spray in summer, and a lightweight wrap for cool evenings.',
        winerySpecific: true,
      },
      {
        id: '1wk-5',
        task: 'Confirm final wine delivery or pickup with winery event coordinator',
        winerySpecific: true,
      },
      {
        id: '1wk-6',
        task: 'Hold your rehearsal and rehearsal dinner',
      },
      {
        id: '1wk-7',
        task: 'Confirm parking attendants or signage if guests are self-driving',
        detail: 'Vineyard driveways and rural roads can be confusing at night. Clear signage or an attendant prevents guests from getting lost.',
        winerySpecific: true,
      },
    ],
  },
  {
    id: 'day',
    title: 'Wedding Day',
    subtitle: 'You\'ve planned everything — now enjoy it',
    emoji: '🥂',
    items: [
      {
        id: 'day-1',
        task: 'Have someone else hold your phone',
        detail: 'Designate your planner or a trusted person to handle vendor questions so you can be fully present.',
      },
      {
        id: 'day-2',
        task: 'Eat breakfast — seriously',
        detail: 'It will be hours before you eat at your own reception. Don\'t skip it.',
      },
      {
        id: 'day-3',
        task: 'Set aside 20 minutes for private portraits in the vineyard rows',
        detail: 'The most iconic winery wedding photos come from walking between vine rows at golden hour. Block this time specifically in your timeline.',
        winerySpecific: true,
      },
      {
        id: 'day-4',
        task: 'Do a first look at a scenic vineyard spot before the ceremony',
        detail: 'A first look buys you more portrait time later and lets you be present during cocktail hour.',
        winerySpecific: true,
      },
      {
        id: 'day-5',
        task: 'Confirm all vendors have arrived and are set up by start time',
      },
      {
        id: 'day-6',
        task: 'Have your coordinator manage the noise cutoff timeline',
        detail: 'Music must wind down 15 minutes before your ordinance cutoff. Have your coordinator give the DJ a clear signal.',
        winerySpecific: true,
      },
      {
        id: 'day-7',
        task: 'Enjoy a private wine toast with your partner during cocktail hour',
        detail: 'Ask your caterer to bring you a glass of estate wine while your guests mingle. You earned this.',
        winerySpecific: true,
      },
      {
        id: 'day-8',
        task: 'Confirm shuttle last run times with your driver',
        detail: 'Give guests a 30-minute warning before the last shuttle departs.',
        winerySpecific: true,
      },
    ],
  },
  {
    id: 'after',
    title: 'After the Wedding',
    subtitle: 'Wrap up and relive',
    emoji: '💌',
    items: [
      {
        id: 'after-1',
        task: 'Send thank-you notes within 2–3 weeks',
      },
      {
        id: 'after-2',
        task: 'Collect and preserve your bouquet and other keepsakes',
      },
      {
        id: 'after-3',
        task: 'Purchase a case of the estate wine you served',
        detail: 'Order a case of your signature wedding wine as a memento. Open a bottle on each anniversary.',
        winerySpecific: true,
      },
      {
        id: '   after-4',
        task: 'Submit your marriage license if not already done',
      },
      {
        id: 'after-5',
        task: 'Leave a review for the winery and every vendor who earned it',
        detail: 'Winery venues live and die by reviews. If your venue was wonderful, take 5 minutes to write a detailed review — it matters enormously to them.',
        winerySpecific: true,
      },
      {
        id: 'after-6',
        task: 'Change your name (if applicable)',
      },
      {
        id: 'after-7',
        task: 'Book your honeymoon wine country trip — or plan a first anniversary return',
        detail: 'Many California winery venues offer private dinners, cave tastings, and estate tours. Return to your venue for your 1-year anniversary.',
        winerySpecific: true,
      },
    ],
  },
];

const STORAGE_KEY = 'cww-wedding-checklist-v1';

function loadCheckedItems(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCheckedItems(items: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(items)));
  } catch {}
}

export default function WeddingChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expandedPhase, setExpandedPhase] = useState<string | null>('12mo');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filterWinery, setFilterWinery] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChecked(loadCheckedItems());
    setHydrated(true);
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveCheckedItems(next);
      return next;
    });
  }, []);

  const toggleItem = useCallback((id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const totalItems = CHECKLIST_PHASES.reduce((sum, p) => sum + p.items.length, 0);
  const totalChecked = checked.size;
  const progressPct = Math.round((totalChecked / totalItems) * 100);

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Header */}
      <div className="bg-[#2C1810] text-white">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href="/tools" className="text-[#D4A853] text-sm hover:underline mb-4 block">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
            📋 Winery Wedding Checklist
          </h1>
          <p className="text-lg text-[#F5ECD7] max-w-2xl">
            The complete month-by-month planning checklist for a California winery or vineyard wedding.
            Covers every task from booking your venue to the morning after — including the winery-specific
            details that generic checklists miss.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-[#E8DDD0] sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-[#6B3E2E] mb-1 font-medium">
                <span>{totalChecked} of {totalItems} tasks complete</span>
                <span>{progressPct}%</span>
              </div>
              <div className="w-full bg-[#F0E8DC] rounded-full h-2.5">
                <div
                  className="bg-[#7C3238] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => setFilterWinery(f => !f)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors whitespace-nowrap ${
                filterWinery
                  ? 'bg-[#7C3238] text-white border-[#7C3238]'
                  : 'bg-white text-[#7C3238] border-[#7C3238] hover:bg-[#F9F0E8]'
              }`}
            >
              🍇 Winery-Only Tasks
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">

        {/* Checklist Phases */}
        {CHECKLIST_PHASES.map(phase => {
          const phaseItems = filterWinery ? phase.items.filter(i => i.winerySpecific) : phase.items;
          if (filterWinery && phaseItems.length === 0) return null;

          const phaseChecked = phaseItems.filter(i => checked.has(i.id)).length;
          const isOpen = expandedPhase === phase.id;
          const allDone = phaseChecked === phaseItems.length;

          return (
            <div key={phase.id} className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedPhase(isOpen ? null : phase.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#FDFAF5] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{phase.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-[#2C1810] text-lg font-serif">
                        {phase.title}
                      </h2>
                      {allDone && hydrated && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          ✓ Done
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#8B6355]">{phase.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {hydrated && (
                    <span className="text-sm text-[#8B6355] font-medium">
                      {phaseChecked}/{phaseItems.length}
                    </span>
                  )}
                  <span className="text-[#8B6355] text-xl">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-[#F0E8DC]">
                  {phaseItems.map((item, idx) => {
                    const isChecked = checked.has(item.id);
                    const isExpanded = expandedItems.has(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`border-b border-[#F5EEE6] last:border-b-0 ${isChecked ? 'bg-[#F9F5EE]' : 'bg-white'}`}
                      >
                        <div className="flex items-start gap-3 px-5 py-3.5">
                          <button
                            onClick={() => toggleCheck(item.id)}
                            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? 'bg-[#7C3238] border-[#7C3238] text-white'
                                : 'border-[#C8A882] hover:border-[#7C3238]'
                            }`}
                            aria-label={isChecked ? 'Uncheck task' : 'Check task'}
                          >
                            {isChecked && (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-sm font-medium leading-snug ${isChecked ? 'line-through text-[#A89080]' : 'text-[#2C1810]'}`}>
                                {item.task}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {item.winerySpecific && (
                                  <span className="text-xs bg-[#FEF3E2] text-[#8B4513] border border-[#F0C97A] px-1.5 py-0.5 rounded font-medium">
                                    🍇 winery tip
                                  </span>
                                )}
                                {item.detail && (
                                  <button
                                    onClick={() => toggleItem(item.id)}
                                    className="text-[#C8A882] hover:text-[#7C3238] transition-colors text-sm"
                                    aria-label="Toggle details"
                                  >
                                    {isExpanded ? '▲' : 'ℹ️'}
                                  </button>
                                )}
                              </div>
                            </div>
                            {isExpanded && item.detail && (
                              <p className="mt-2 text-sm text-[#6B3E2E] bg-[#FEF9F3] border border-[#F0E8DC] rounded-lg px-3 py-2 leading-relaxed">
                                {item.detail}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* SEO Content Section — rich, indexable, genuinely useful */}
        <div className="bg-white rounded-xl border border-[#E8DDD0] p-6 shadow-sm space-y-6 mt-6">
          <h2 className="text-2xl font-bold font-serif text-[#2C1810]">
            How to Plan a Winery Wedding in California
          </h2>
          <p className="text-[#4A3020] leading-relaxed">
            Planning a winery wedding is one of the most rewarding — and logistically complex — wedding styles
            you can choose. California wine country venues offer breathtaking scenery, world-class wine, and
            an atmosphere that no ballroom can replicate. But they also come with unique planning challenges
            that generic wedding checklists don&apos;t address: wine minimums, harvest season blackouts, rural
            transportation, noise ordinances, and weather contingencies.
          </p>
          <p className="text-[#4A3020] leading-relaxed">
            This checklist was built specifically for couples planning a winery or vineyard wedding in
            California — covering Napa Valley, Sonoma County, Paso Robles, Santa Barbara wine country,
            Temecula Valley, Livermore Valley, and the Sierra Foothills.
          </p>

          <div>
            <h3 className="text-lg font-bold font-serif text-[#2C1810] mb-3">
              The Winery-Specific Tasks Most Couples Miss
            </h3>
            <div className="space-y-3 text-[#4A3020] text-sm leading-relaxed">
              <div className="flex gap-2">
                <span className="text-[#7C3238] font-bold shrink-0">Wine Minimum:</span>
                <span>Most California winery venues require couples to purchase a minimum dollar amount of estate wine — often $3,000–$15,000 or more. This is separate from the venue fee. Always ask upfront so it doesn&apos;t shock you at contract signing.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#7C3238] font-bold shrink-0">Corkage Fee:</span>
                <span>Some wineries allow you to bring outside wine for a per-bottle corkage fee, typically $15–$50/bottle. Others prohibit it entirely. Knowing this determines how you budget your bar program.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#7C3238] font-bold shrink-0">Harvest Blackouts:</span>
                <span>Winery harvest season runs roughly August through October, varying by region and grape variety. Some venues reduce event space or black out dates entirely during crush. Napa typically harvests September–October; Temecula can start as early as August.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#7C3238] font-bold shrink-0">Noise Ordinances:</span>
                <span>Rural wine country properties are often subject to strict county noise ordinances. In many Sonoma and Napa areas, amplified music must cease by 10pm. In some Paso Robles and Temecula areas, it&apos;s 9pm. This compresses your reception timeline significantly — plan your first dance, parent dances, and last dance accordingly.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#7C3238] font-bold shrink-0">Transportation:</span>
                <span>Winery venues are almost always rural, often on narrow vineyard roads not accessible by rideshare. Shuttle service from nearby hotels is essentially required for guests&apos; safety and convenience. Budget $800–$3,500 depending on guest count and distance.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#7C3238] font-bold shrink-0">Power Access:</span>
                <span>Many outdoor vineyard venues have limited electrical access. Your DJ, caterer, lighting vendor, and others may need a generator. Confirm who provides it and what capacity is needed before finalizing vendor contracts.</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold font-serif text-[#2C1810] mb-3">
              Best Months for a Winery Wedding in California
            </h3>
            <p className="text-[#4A3020] text-sm leading-relaxed mb-3">
              California wine country offers beautiful weather for outdoor weddings much of the year, but each season has trade-offs:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { season: 'Spring (March–May)', desc: 'Wildflowers, mild temps, green vines. Shoulder pricing. Rain possible in March–April, especially in Sonoma and Napa. Ideal for intimate, romantic aesthetics.' },
                { season: 'Summer (June–August)', desc: 'Warm and sunny. Peak booking season. Heat can be intense — midday ceremonies are brutal. Evening ceremonies with sunset portraits are magical. Book 12–18 months out.' },
                { season: 'Harvest (Sept–Oct)', desc: 'The most iconic time to marry in wine country. Grapes on the vine, golden light, stunning color. But: harvest activity at the winery, highest prices, least venue availability. Book 18–24 months out.' },
                { season: 'Off-Peak (Nov–Feb)', desc: 'Dramatic skies, bare vines (beautiful in their own way), 20–30% lower pricing. Some venues close or reduce availability. Indoor options more important.' },
              ].map(s => (
                <div key={s.season} className="bg-[#FEF9F3] border border-[#F0E8DC] rounded-lg p-3">
                  <p className="font-semibold text-[#2C1810] text-sm mb-1">{s.season}</p>
                  <p className="text-xs text-[#6B3E2E] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold font-serif text-[#2C1810] mb-2">
              How Far in Advance Should You Book a Winery Venue?
            </h3>
            <p className="text-[#4A3020] text-sm leading-relaxed">
              For peak-season (summer and harvest) Saturdays at top Napa or Sonoma wineries, <strong>18–24 months</strong> in
              advance is common. For shoulder season or less well-known regions like Paso Robles, Livermore, or
              Sierra Foothills, 12 months is often sufficient. Off-peak (November–February) bookings can sometimes
              be secured 6–9 months out. Don&apos;t assume availability — California winery venues are among the most
              in-demand wedding venues in the country.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold font-serif text-[#2C1810] mb-2">
              What Does a Winery Wedding Cost in California?
            </h3>
            <p className="text-[#4A3020] text-sm leading-relaxed">
              A complete winery wedding in California typically costs <strong>$35,000–$150,000+</strong> depending on
              region, guest count, season, and style. Napa Valley and Sonoma weddings skew toward the higher end;
              Temecula, Paso Robles, and Lodi offer excellent value at significantly lower price points. Use our{' '}
              <Link href="/tools/budget-estimator" className="text-[#7C3238] underline hover:text-[#5A2228]">
                Winery Wedding Budget Estimator
              </Link>{' '}
              for a personalized itemized breakdown.
            </p>
          </div>
        </div>

        {/* Related Tools */}
        <div className="bg-[#2C1810] rounded-xl p-6 text-white">
          <h3 className="font-bold font-serif text-lg mb-4 text-[#F5ECD7]">More Free Planning Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/tools/budget-estimator', emoji: '💰', label: 'Budget Estimator', desc: 'Itemized winery wedding costs' },
              { href: '/tools/wine-calculator', emoji: '🍇', label: 'Wine Calculator', desc: 'Exact bottle quantities' },
              { href: '/tools/shuttle-calculator', emoji: '🚐', label: 'Shuttle Calculator', desc: 'Guest transportation planning' },
              { href: '/tools/wedding-timeline', emoji: '🕐', label: 'Timeline Generator', desc: 'Day-of schedule builder' },
              { href: '/tools/vendor-tipping', emoji: '💌', label: 'Vendor Tipping Guide', desc: 'Who to tip and how much' },
              { href: '/tools/wine-pairing', emoji: '🍷', label: 'Wine Pairing Planner', desc: 'Course-by-course wine menu' },
            ].map(t => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-3 bg-[#3D1F12] hover:bg-[#4D2F22] rounded-lg px-4 py-3 transition-colors"
              >
                <span className="text-xl">{t.emoji}</span>
                <div>
                  <p className="font-semibold text-sm text-[#F5ECD7]">{t.label}</p>
                  <p className="text-xs text-[#C8A882]">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Browse Venues CTA */}
        <div className="bg-[#FEF9F3] border border-[#E8DDD0] rounded-xl p-6 text-center">
          <p className="text-[#2C1810] font-bold font-serif text-xl mb-2">
            Ready to find your winery?
          </p>
          <p className="text-[#6B3E2E] text-sm mb-4">
            Browse 435+ verified California winery and vineyard wedding venues — from Napa to Temecula.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#7C3238] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5A2228] transition-colors"
          >
            Browse All Venues →
          </Link>
        </div>

      </div>
    </div>
  );
}
