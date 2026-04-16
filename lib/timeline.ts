// ─── Shared timeline logic for Wedding Day Timeline Generator ──────────────
// Imported by both the main page and the embed page.

export const SUNSET_DATA: Record<string, number[]> = {
  napa:          [17.3, 17.9, 18.5, 19.2, 19.8, 20.3, 20.3, 19.9, 19.1, 18.2, 17.4, 17.1],
  sonoma:        [17.3, 17.9, 18.5, 19.2, 19.8, 20.3, 20.3, 19.9, 19.1, 18.2, 17.4, 17.1],
  paso:          [17.5, 18.1, 18.6, 19.3, 19.9, 20.4, 20.3, 20.0, 19.2, 18.4, 17.6, 17.3],
  santabarbara:  [17.7, 18.2, 18.7, 19.4, 20.0, 20.5, 20.4, 20.1, 19.4, 18.6, 17.8, 17.5],
  temecula:      [17.6, 18.1, 18.7, 19.3, 19.9, 20.4, 20.4, 20.0, 19.3, 18.5, 17.7, 17.4],
  livermore:     [17.2, 17.8, 18.5, 19.2, 19.8, 20.3, 20.2, 19.8, 19.0, 18.1, 17.3, 17.0],
  'santa-cruz':  [17.3, 17.9, 18.5, 19.2, 19.8, 20.3, 20.3, 19.9, 19.1, 18.2, 17.4, 17.1],
  lodi:          [17.2, 17.9, 18.5, 19.3, 20.0, 20.5, 20.4, 19.9, 19.1, 18.2, 17.3, 17.0],
};

export const NOISE_ORDINANCE: Record<string, { cutoff: number; note: string }> = {
  napa:         { cutoff: 22.0, note: 'Napa County: amplified music must end by 10:00 PM in most areas.' },
  sonoma:       { cutoff: 22.0, note: 'Sonoma County: most venues enforce a 10:00 PM music cutoff.' },
  paso:         { cutoff: 22.5, note: 'San Luis Obispo County: typically 10:00–10:30 PM cutoff.' },
  santabarbara: { cutoff: 22.0, note: 'Santa Barbara County: 10:00 PM amplified music cutoff.' },
  temecula:     { cutoff: 23.0, note: 'Riverside County (Temecula): often 11:00 PM — confirm with venue.' },
  livermore:    { cutoff: 22.0, note: 'Alameda County (Livermore): typically 10:00 PM cutoff.' },
  'santa-cruz': { cutoff: 22.0, note: 'Santa Cruz County: 10:00 PM cutoff in most areas.' },
  lodi:         { cutoff: 22.5, note: 'San Joaquin County (Lodi): typically 10:00–10:30 PM — confirm with venue.' },
};

export const HARVEST_MONTHS = [7, 8, 9]; // Aug, Sep, Oct (0-indexed)

export const REGIONS = [
  { id: 'napa',         label: 'Napa Valley',          desc: 'Most prestigious, highest demand' },
  { id: 'sonoma',       label: 'Sonoma County',         desc: 'Upscale, diverse landscapes' },
  { id: 'paso',         label: 'Paso Robles',           desc: 'Stunning scenery, excellent value' },
  { id: 'santabarbara', label: 'Santa Barbara',         desc: 'Coastal charm + wine country elegance' },
  { id: 'temecula',     label: 'Temecula Valley',       desc: 'Southern CA, best value for LA couples' },
  { id: 'livermore',    label: 'Livermore / East Bay',  desc: 'Close to Bay Area, great value' },
  { id: 'santa-cruz',   label: 'Santa Cruz Mountains',  desc: 'Boutique, intimate estates' },
  { id: 'lodi',         label: 'Lodi / Central Valley', desc: 'Most budget-friendly' },
];

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export interface TimelineEvent {
  time: number;
  label: string;
  duration: number;
  icon: string;
  tip?: string;
  isHighlight?: boolean;
  isWarning?: boolean;
  isNudge?: boolean;   // amber — opportunity, not a problem
}

export interface TimelineParams {
  region: string;
  month: number;
  ceremonyTime: number;
  ceremonyLength: number;
  bridalParty: number;
  hasFirstLook: boolean;
  receptionStyle: 'plated' | 'buffet';
  hasLiveband: boolean;
}

export const DEFAULT_PARAMS: TimelineParams = {
  region: 'napa',
  month: 8,
  ceremonyTime: 16.5,
  ceremonyLength: 30,
  bridalParty: 5,
  hasFirstLook: true,
  receptionStyle: 'plated',
  hasLiveband: false,
};

export function getGettingReadyDuration(size: number): number {
  if (size <= 2) return 2;
  if (size <= 4) return 2.5;
  if (size <= 6) return 3;
  if (size <= 8) return 3.5;
  return 4;
}

export function formatTime(decimalHour: number): string {
  const totalMinutes = Math.round(decimalHour * 60);
  let h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const ampm = h < 12 ? 'AM' : 'PM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function buildTimeline(p: TimelineParams): TimelineEvent[] {
  const sunset = SUNSET_DATA[p.region][p.month];
  const goldenHourStart = sunset - 1.0;
  const goldenHourEnd = sunset - 0.1;
  const noiseOrdinance = NOISE_ORDINANCE[p.region].cutoff;
  const gettingReadyDuration = getGettingReadyDuration(p.bridalParty);
  const ceremonyEnd = p.ceremonyTime + p.ceremonyLength / 60;
  const cocktailDuration = p.hasFirstLook ? 1.0 : 1.5;
  const cocktailEnd = ceremonyEnd + cocktailDuration;

  const events: TimelineEvent[] = [];

  // Getting ready
  const gettingReadyStart = p.ceremonyTime - (p.hasFirstLook ? gettingReadyDuration + 2.0 : gettingReadyDuration + 1.5);
  events.push({
    time: gettingReadyStart,
    label: 'Getting Ready Begins',
    duration: gettingReadyDuration,
    icon: '💄',
    tip: `Hair & makeup for a party of ${p.bridalParty} takes about ${formatDuration(gettingReadyDuration)}. Start earlier to avoid rushing.`,
  });

  // First look
  if (p.hasFirstLook) {
    const firstLookTime = p.ceremonyTime - 1.75;
    events.push({
      time: firstLookTime,
      label: 'First Look + Couple Portraits',
      duration: 1.0,
      icon: '📸',
      tip: 'First look gives you a private moment and frees up the cocktail hour for guests.',
      isHighlight: true,
    });
    events.push({
      time: firstLookTime + 1.0,
      label: 'Wedding Party Portraits',
      duration: 0.5,
      icon: '👰',
      tip: `${p.bridalParty * 2} person party — allow 30–45 minutes for group shots.`,
    });
  }

  // Guests arrive
  events.push({
    time: p.ceremonyTime - 0.5,
    label: 'Guests Begin Arriving',
    duration: 0.5,
    icon: '🚐',
    tip: 'If using shuttles, first run should arrive 30 min before ceremony. Assign a greeter.',
  });

  // Ceremony
  events.push({
    time: p.ceremonyTime,
    label: 'Ceremony Begins',
    duration: p.ceremonyLength / 60,
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
  if (!p.hasFirstLook) {
    events.push({
      time: ceremonyEnd + 0.5,
      label: 'Couple Greets Guests',
      duration: 0.25,
      icon: '🤝',
    });
  }

  // Cocktail hour portraits + golden hour logic
  // Portrait block always happens at cocktail hour (standard flow)
  events.push({
    time: ceremonyEnd + 0.5,
    label: 'Cocktail Hour',
    duration: cocktailDuration - 0.5,
    icon: '🥂',
    tip: p.hasFirstLook
      ? 'Since you did a first look, you can enjoy cocktail hour with your guests!'
      : 'Couple is finishing portraits during cocktail hour — guests enjoy wine and appetizers.',
  });

  const portraitTime = cocktailEnd - 0.5;
  const portraitEnd = portraitTime + 0.5;
  const overlapsGoldenHour =
    portraitEnd >= goldenHourStart - 0.25 && portraitTime <= goldenHourEnd + 0.25;
  const beforeGoldenHour = portraitEnd < goldenHourStart - 0.25;
  const afterGoldenHour = portraitTime > goldenHourEnd + 0.25;

  if (overlapsGoldenHour) {
    // Best case — portraits coincide with golden hour, celebrate it
    events.push({
      time: portraitTime,
      label: 'Vineyard Portraits (Golden Hour ✨)',
      duration: 0.5,
      icon: '🌅',
      tip: `Perfect timing! Golden hour starts around ${formatTime(goldenHourStart)} — your portraits will be beautifully lit.`,
      isHighlight: true,
    });
  } else if (beforeGoldenHour) {
    // Portraits happen at cocktail hour, but golden hour is later during dancing
    // — schedule a separate golden hour break
    events.push({
      time: portraitTime,
      label: 'Couple Portraits',
      duration: 0.5,
      icon: '📸',
      tip: `Portraits during cocktail hour. Golden hour isn't until ${formatTime(goldenHourStart)} — you'll step out again then.`,
    });
  } else {
    // afterGoldenHour — portraits are after golden hour ended, warn
    events.push({
      time: portraitTime,
      label: 'Couple Portraits',
      duration: 0.5,
      icon: '📸',
      tip: `Golden hour ends around ${formatTime(goldenHourEnd)} — portraits are scheduled after the best light. Consider an earlier ceremony time.`,
      isWarning: true,
    });
  }

  // Reception
  events.push({ time: cocktailEnd,        label: 'Grand Entrance & Reception Begins', duration: 0.25, icon: '🎉', isHighlight: true });
  events.push({ time: cocktailEnd + 0.25, label: 'First Dance',                       duration: 0.1,  icon: '💃' });
  events.push({ time: cocktailEnd + 0.4,  label: 'Welcome Toast & Blessing',          duration: 0.25, icon: '🥂' });

  // Dinner
  const dinnerStart = cocktailEnd + 0.65;
  const dinnerDuration = p.receptionStyle === 'plated' ? 1.25 : 1.0;
  events.push({
    time: dinnerStart,
    label: p.receptionStyle === 'plated' ? 'Plated Dinner Service' : 'Buffet Dinner Opens',
    duration: dinnerDuration,
    icon: '🍽️',
    tip: p.receptionStyle === 'plated'
      ? 'Plated service moves in waves — allow 75–90 minutes for full dinner.'
      : 'Buffet typically completes in 60–75 minutes; guests eat at their own pace.',
  });

  const afterDinner = dinnerStart + dinnerDuration;
  events.push({ time: afterDinner,        label: 'Parent Dances', duration: 0.25, icon: '💛' });
  events.push({ time: afterDinner + 0.25, label: 'Cake Cutting',  duration: 0.2,  icon: '🎂' });

  // Dancing
  const danceStart = afterDinner + 0.45;
  const receptionEnd = Math.min(noiseOrdinance, danceStart + 2.5);
  const danceDuration = receptionEnd - danceStart - 0.25;
  events.push({
    time: danceStart,
    label: 'Open Dancing Begins',
    duration: Math.max(danceDuration, 0.5),
    icon: p.hasLiveband ? '🎸' : '🎵',
    tip: p.hasLiveband
      ? 'Live bands need a break every 45–60 min. Factor this into dance floor energy.'
      : 'DJ sets allow continuous music — no breaks needed.',
  });

  // Golden hour break — injected during dancing if golden hour falls after portraits
  if (beforeGoldenHour && goldenHourStart < receptionEnd - 0.5) {
    events.push({
      time: goldenHourStart,
      label: 'Golden Hour Break — Step Outside 🌅',
      duration: 0.33,
      icon: '🌅',
      tip: `Slip away from the dance floor for ~20 minutes. The vineyard light is at its best right now — your photographer will thank you.`,
      isNudge: true,
    });
  }

  events.push({ time: receptionEnd - 0.25, label: 'Bouquet Toss & Last Dance', duration: 0.2, icon: '💐' });
  events.push({ time: receptionEnd,         label: 'Grand Exit',                duration: 0.25, icon: '✨', isHighlight: true });

  // Noise ordinance marker
  if (receptionEnd >= noiseOrdinance - 0.25) {
    events.push({
      time: noiseOrdinance - 0.25,
      label: `⚠️ Music Must End by ${formatTime(noiseOrdinance)}`,
      duration: 0,
      icon: '🔇',
      tip: NOISE_ORDINANCE[p.region].note,
      isWarning: true,
    });
  }

  return events.sort((a, b) => a.time - b.time);
}

// ─── URL param encoding / decoding ─────────────────────────────────────────

export function paramsToSearch(p: TimelineParams): string {
  const s = new URLSearchParams({
    r:  p.region,
    m:  String(p.month),
    ct: String(Math.round(p.ceremonyTime * 100)),
    cl: String(p.ceremonyLength),
    bp: String(p.bridalParty),
    fl: p.hasFirstLook ? '1' : '0',
    rs: p.receptionStyle,
    lb: p.hasLiveband ? '1' : '0',
  });
  return s.toString();
}

export function searchToParams(search: string): TimelineParams {
  const s = new URLSearchParams(search);
  const p: TimelineParams = { ...DEFAULT_PARAMS };
  if (s.has('r')  && REGIONS.find(r => r.id === s.get('r'))) p.region = s.get('r')!;
  if (s.has('m'))  { const v = parseInt(s.get('m')!); if (v >= 0 && v <= 11) p.month = v; }
  if (s.has('ct')) { const v = parseInt(s.get('ct')!) / 100; if (v >= 11 && v <= 18) p.ceremonyTime = v; }
  if (s.has('cl')) { const v = parseInt(s.get('cl')!); if (v >= 15 && v <= 75) p.ceremonyLength = v; }
  if (s.has('bp')) { const v = parseInt(s.get('bp')!); if (v >= 1 && v <= 12) p.bridalParty = v; }
  if (s.has('fl')) p.hasFirstLook = s.get('fl') === '1';
  if (s.has('rs')) p.receptionStyle = s.get('rs') === 'buffet' ? 'buffet' : 'plated';
  if (s.has('lb')) p.hasLiveband = s.get('lb') === '1';
  return p;
}
