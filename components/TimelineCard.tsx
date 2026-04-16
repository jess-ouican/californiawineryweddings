'use client';

import React from 'react';
import {
  TimelineEvent,
  TimelineParams,
  REGIONS,
  MONTHS,
  SUNSET_DATA,
  NOISE_ORDINANCE,
  formatTime,
  formatDuration,
} from '@/lib/timeline';

interface TimelineCardProps {
  params: TimelineParams;
  timeline: TimelineEvent[];
  /** If true, renders in compact export-friendly mode (no sticky, no truncation) */
  exportMode?: boolean;
  /** If true, shows the branded CWW footer (always shown in embed/export) */
  branded?: boolean;
}

const TimelineCard = React.forwardRef<HTMLDivElement, TimelineCardProps>(
  ({ params, timeline, exportMode = false, branded = false }, ref) => {
    const { region, month, ceremonyTime, ceremonyLength } = params;
    const sunset = SUNSET_DATA[region][month];
    const goldenHourStart = sunset - 1.0;
    const noiseOrdinance = NOISE_ORDINANCE[region].cutoff;
    const regionLabel = REGIONS.find(r => r.id === region)?.label ?? region;

    return (
      <div
        ref={ref}
        className="bg-white rounded-xl overflow-hidden"
        style={exportMode ? { width: 520, fontFamily: 'Georgia, serif' } : undefined}
      >
        {/* Header */}
        <div className="bg-[#6B3E2E] px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-white font-bold text-lg leading-tight">
                {regionLabel} · {MONTHS[month]}
              </div>
              <div className="text-[#F5E6D3] text-sm mt-0.5">
                Ceremony at {formatTime(ceremonyTime)} · {ceremonyLength} min
              </div>
            </div>
            <div className="text-right text-xs text-[#C8A882] leading-relaxed flex-shrink-0">
              <div>🌅 Golden Hour {formatTime(goldenHourStart)}</div>
              <div>🔇 Music off {formatTime(noiseOrdinance)}</div>
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="divide-y divide-gray-100">
          {timeline.map((event, i) => (
            <div
              key={i}
              className={`px-5 py-3 ${
                event.isHighlight
                  ? 'bg-[#FAF8F3] border-l-4 border-[#6B3E2E]'
                  : event.isWarning
                  ? 'bg-red-50 border-l-4 border-red-400'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-lg flex-shrink-0 mt-0.5">{event.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`font-semibold text-sm ${
                        event.isWarning ? 'text-red-700' : 'text-gray-800'
                      }`}
                    >
                      {event.label}
                    </div>
                    <div
                      className={`text-sm font-bold flex-shrink-0 ${
                        event.isHighlight
                          ? 'text-[#6B3E2E]'
                          : event.isWarning
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {formatTime(event.time)}
                    </div>
                  </div>
                  {event.duration > 0 && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      {formatDuration(event.duration)}
                    </div>
                  )}
                  {event.tip && !exportMode && (
                    <div
                      className={`text-xs mt-1 leading-relaxed ${
                        event.isWarning ? 'text-red-600' : 'text-gray-500'
                      }`}
                    >
                      💡 {event.tip}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-[#F5E6D3] px-5 py-3 text-xs text-gray-600 leading-relaxed">
          Suggested framework — confirm with your venue coordinator and photographer.
        </div>

        {/* CWW Branding (always shown in export/embed, optional otherwise) */}
        {branded && (
          <div className="bg-[#6B3E2E] px-5 py-3 flex items-center justify-between">
            <div className="text-white text-xs font-semibold">
              🍷 CaliforniaWineryWeddings.com
            </div>
            <div className="text-[#C8A882] text-xs">
              Free wedding planning tools
            </div>
          </div>
        )}
      </div>
    );
  }
);

TimelineCard.displayName = 'TimelineCard';
export default TimelineCard;
