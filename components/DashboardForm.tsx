'use client';

import { useState } from 'react';
import { VenueDetails } from '@/lib/airtable';

interface Props {
  slug: string;
  placeId: string;
  initialData: VenueDetails | null;
}

const STYLE_TAGS = ['Vineyard', 'Garden', 'Barn', 'Ballroom', 'Terrace', 'Cave', 'Estate', 'Rustic', 'Modern', 'Luxury'];
const VIEW_TAGS = ['Mountains', 'Valley', 'Ocean', 'Lake', 'Vineyard rows', 'Forest', 'City'];
const EVENT_TYPES = ['Elopements', 'Rehearsal Dinners', 'Corporate Events', 'Bridal Showers', 'Engagement Parties', 'Anniversary Celebrations', 'Vow Renewals', 'Micro Weddings'];

function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <span className="text-2xl">{emoji}</span>
      <div>
        <h2 className="font-serif text-xl font-bold text-[#6B3E2E]">{title}</h2>
        {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, placeholder }: {
  label: string; value: string | number | undefined; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        min="0"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3E2E] focus:border-transparent"
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options }: {
  label: string; value: string | undefined; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3E2E] focus:border-transparent bg-white"
      >
        <option value="">— Select —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function CheckboxGroup({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selected.includes(opt)
                ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]'
                : 'bg-white text-gray-600 border-gray-300 hover:border-[#6B3E2E]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DashboardForm({ slug, placeId, initialData }: Props) {
  const d = initialData;

  // Pricing
  const [ceremonyFeeMin, setCeremonyFeeMin] = useState(d?.CeremonyFeeMin?.toString() ?? '');
  const [ceremonyFeeMax, setCeremonyFeeMax] = useState(d?.CeremonyFeeMax?.toString() ?? '');
  const [packagePriceMin, setPackagePriceMin] = useState(d?.PackagePriceMin?.toString() ?? '');
  const [packagePriceMax, setPackagePriceMax] = useState(d?.PackagePriceMax?.toString() ?? '');
  const [packageIncludes, setPackageIncludes] = useState(d?.PackageIncludes ?? '');
  const [serviceCharge, setServiceCharge] = useState(d?.ServiceChargePercent?.toString() ?? '');

  // Capacity
  const [minGuests, setMinGuests] = useState(d?.MinGuests?.toString() ?? '');
  const [maxGuests, setMaxGuests] = useState(d?.MaxGuests?.toString() ?? '');
  const [indoorCeremony, setIndoorCeremony] = useState(d?.IndoorCeremonyCapacity?.toString() ?? '');
  const [outdoorCeremony, setOutdoorCeremony] = useState(d?.OutdoorCeremonyCapacity?.toString() ?? '');
  const [indoorReception, setIndoorReception] = useState(d?.IndoorReceptionCapacity?.toString() ?? '');
  const [outdoorReception, setOutdoorReceptionCapacity] = useState(d?.OutdoorReceptionCapacity?.toString() ?? '');

  // Venue Details
  const [catering, setCatering] = useState(d?.Catering ?? '');
  const [alcohol, setAlcohol] = useState(d?.Alcohol ?? '');
  const [amplifiedMusic, setAmplifiedMusic] = useState(d?.AmplifiedMusic ?? '');
  const [wheelchair, setWheelchair] = useState<boolean | undefined>(d?.WheelchairAccessible);
  const [availability, setAvailability] = useState(d?.Availability ?? '');
  const [seasonDetails, setSeasonDetails] = useState(d?.SeasonDetails ?? '');
  const [eventTypes, setEventTypes] = useState<string[]>(
    d?.EventTypes ? d.EventTypes.split(',').map((s) => s.trim()).filter(Boolean) : []
  );

  // Tags
  const [styleTags, setStyleTags] = useState<string[]>(
    d?.StyleTags ? d.StyleTags.split(',').map((s) => s.trim()).filter(Boolean) : []
  );
  const [viewTags, setViewTags] = useState<string[]>(
    d?.ViewTags ? d.ViewTags.split(',').map((s) => s.trim()).filter(Boolean) : []
  );

  // Description
  const [description, setDescription] = useState(d?.Description ?? '');

  // Photos
  const [photos, setPhotos] = useState<string[]>(() => {
    if (!d?.PhotoUrls) return ['', '', '', '', ''];
    try {
      const parsed = JSON.parse(d.PhotoUrls);
      const arr = Array.isArray(parsed) ? parsed : [];
      while (arr.length < 5) arr.push('');
      return arr.slice(0, 5);
    } catch {
      return ['', '', '', '', ''];
    }
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setSaveStatus('saving');
    setSaveMessage('');

    const payload = {
      slug,
      PlaceId: placeId,
      CeremonyFeeMin: ceremonyFeeMin ? parseInt(ceremonyFeeMin) : undefined,
      CeremonyFeeMax: ceremonyFeeMax ? parseInt(ceremonyFeeMax) : undefined,
      PackagePriceMin: packagePriceMin ? parseInt(packagePriceMin) : undefined,
      PackagePriceMax: packagePriceMax ? parseInt(packagePriceMax) : undefined,
      PackageIncludes: packageIncludes || undefined,
      ServiceChargePercent: serviceCharge ? parseFloat(serviceCharge) : undefined,
      MinGuests: minGuests ? parseInt(minGuests) : undefined,
      MaxGuests: maxGuests ? parseInt(maxGuests) : undefined,
      IndoorCeremonyCapacity: indoorCeremony ? parseInt(indoorCeremony) : undefined,
      OutdoorCeremonyCapacity: outdoorCeremony ? parseInt(outdoorCeremony) : undefined,
      IndoorReceptionCapacity: indoorReception ? parseInt(indoorReception) : undefined,
      OutdoorReceptionCapacity: outdoorReception ? parseInt(outdoorReception) : undefined,
      Catering: catering || undefined,
      Alcohol: alcohol || undefined,
      AmplifiedMusic: amplifiedMusic || undefined,
      WheelchairAccessible: wheelchair,
      Availability: availability || undefined,
      SeasonDetails: seasonDetails || undefined,
      EventTypes: eventTypes.length > 0 ? eventTypes.join(', ') : undefined,
      StyleTags: styleTags.length > 0 ? styleTags.join(', ') : undefined,
      ViewTags: viewTags.length > 0 ? viewTags.join(', ') : undefined,
      Description: description || undefined,
      PhotoUrls: JSON.stringify(photos.filter(Boolean)),
    };

    try {
      const res = await fetch('/api/dashboard/venue-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSaveStatus('saved');
        setSaveMessage('All changes saved successfully!');
        setTimeout(() => setSaveStatus('idle'), 4000);
      } else {
        setSaveStatus('error');
        setSaveMessage(data.message || 'Failed to save. Please try again.');
      }
    } catch {
      setSaveStatus('error');
      setSaveMessage('Network error. Please try again.');
    }
  };

  const cardClass = 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8';
  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3E2E] focus:border-transparent';

  return (
    <div className="space-y-6">
      {/* 1. PRICING */}
      <div className={cardClass}>
        <SectionHeader
          emoji="💰"
          title="Pricing"
          subtitle="Let couples know what to budget. Ranges are fine."
        />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <NumberInput label="Ceremony Fee Min ($)" value={ceremonyFeeMin} onChange={setCeremonyFeeMin} placeholder="500" />
          <NumberInput label="Ceremony Fee Max ($)" value={ceremonyFeeMax} onChange={setCeremonyFeeMax} placeholder="2500" />
          <NumberInput label="Package Price Min ($)" value={packagePriceMin} onChange={setPackagePriceMin} placeholder="5000" />
          <NumberInput label="Package Price Max ($)" value={packagePriceMax} onChange={setPackagePriceMax} placeholder="20000" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What&apos;s included in packages
          </label>
          <textarea
            value={packageIncludes}
            onChange={(e) => setPackageIncludes(e.target.value)}
            placeholder="e.g. Tables, chairs, linens, day-of coordinator, wine service for cocktail hour..."
            rows={3}
            className={inputClass}
          />
        </div>
        <NumberInput
          label="Service Charge (%)"
          value={serviceCharge}
          onChange={setServiceCharge}
          placeholder="20"
        />
      </div>

      {/* 2. CAPACITY */}
      <div className={cardClass}>
        <SectionHeader emoji="👥" title="Capacity" subtitle="How many guests can you accommodate?" />
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="Minimum Guests" value={minGuests} onChange={setMinGuests} placeholder="20" />
          <NumberInput label="Maximum Guests" value={maxGuests} onChange={setMaxGuests} placeholder="200" />
          <NumberInput label="Indoor Ceremony" value={indoorCeremony} onChange={setIndoorCeremony} placeholder="100" />
          <NumberInput label="Outdoor Ceremony" value={outdoorCeremony} onChange={setOutdoorCeremony} placeholder="150" />
          <NumberInput label="Indoor Reception" value={indoorReception} onChange={setIndoorReception} placeholder="120" />
          <NumberInput label="Outdoor Reception" value={outdoorReception} onChange={setOutdoorReceptionCapacity} placeholder="200" />
        </div>
      </div>

      {/* 3. VENUE DETAILS */}
      <div className={cardClass}>
        <SectionHeader emoji="🏛️" title="Venue Details" subtitle="Policies and logistics couples need to know." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <SelectInput
            label="Catering"
            value={catering}
            onChange={setCatering}
            options={[
              { value: 'In-house only', label: 'In-house only' },
              { value: 'Outside caterers allowed', label: 'Outside caterers allowed' },
              { value: 'Both options available', label: 'Both options available' },
            ]}
          />
          <SelectInput
            label="Alcohol"
            value={alcohol}
            onChange={setAlcohol}
            options={[
              { value: 'In-house bar only', label: 'In-house bar only' },
              { value: 'BYOB allowed', label: 'BYOB allowed' },
              { value: 'Both options available', label: 'Both options available' },
            ]}
          />
          <SelectInput
            label="Amplified Music"
            value={amplifiedMusic}
            onChange={setAmplifiedMusic}
            options={[
              { value: 'Indoors only', label: 'Indoors only' },
              { value: 'Outdoors only', label: 'Outdoors only' },
              { value: 'Both indoors and outdoors', label: 'Both indoors and outdoors' },
              { value: 'Restrictions apply', label: 'Restrictions apply' },
            ]}
          />
          <SelectInput
            label="Availability"
            value={availability}
            onChange={setAvailability}
            options={[
              { value: 'Year-round', label: 'Year-round' },
              { value: 'Seasonal', label: 'Seasonal' },
            ]}
          />
        </div>

        {/* Seasonal details */}
        {availability === 'Seasonal' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Season Details</label>
            <input
              type="text"
              value={seasonDetails}
              onChange={(e) => setSeasonDetails(e.target.value)}
              placeholder="e.g. April through October only"
              className={inputClass}
            />
          </div>
        )}

        {/* Wheelchair accessible */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Wheelchair Accessible</label>
          <div className="flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setWheelchair(val)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  wheelchair === val
                    ? 'bg-[#6B3E2E] text-white border-[#6B3E2E]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#6B3E2E]'
                }`}
              >
                {val ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>

        {/* Event Types */}
        <CheckboxGroup
          label="Event Types"
          options={EVENT_TYPES}
          selected={eventTypes}
          onChange={setEventTypes}
        />
      </div>

      {/* 4. STYLE TAGS */}
      <div className={cardClass}>
        <SectionHeader emoji="✨" title="Venue Style" subtitle="Pick all that describe your venue's aesthetic." />
        <CheckboxGroup
          label=""
          options={STYLE_TAGS}
          selected={styleTags}
          onChange={setStyleTags}
        />
      </div>

      {/* 5. VIEW TAGS */}
      <div className={cardClass}>
        <SectionHeader emoji="🌅" title="Views" subtitle="What will couples see on their big day?" />
        <CheckboxGroup
          label=""
          options={VIEW_TAGS}
          selected={viewTags}
          onChange={setViewTags}
        />
      </div>

      {/* 6. DESCRIPTION */}
      <div className={cardClass}>
        <SectionHeader emoji="💬" title="Why Couples Love Us" subtitle="Write up to 500 characters. Be personal and specific." />
        <textarea
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= 500) setDescription(e.target.value);
          }}
          placeholder="e.g. Nestled in the rolling hills of Napa Valley, our estate winery offers couples an intimate ceremony experience surrounded by barrel caves and vine-draped terraces..."
          rows={5}
          className={inputClass}
        />
        <p className={`text-xs mt-1 text-right ${description.length > 450 ? 'text-orange-600' : 'text-gray-400'}`}>
          {description.length}/500
        </p>
      </div>

      {/* 7. PHOTOS */}
      <div className={cardClass}>
        <SectionHeader emoji="📸" title="Photos" subtitle="Paste up to 5 image URLs from your website or Instagram." />
        <div className="space-y-3">
          {photos.map((url, i) => (
            <div key={i}>
              <label className="block text-xs font-medium text-gray-500 mb-1">Photo {i + 1}</label>
              <div className="flex gap-3 items-center">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const newPhotos = [...photos];
                    newPhotos[i] = e.target.value;
                    setPhotos(newPhotos);
                  }}
                  placeholder="https://yourwinery.com/images/ceremony.jpg"
                  className={`flex-1 ${inputClass}`}
                />
                {url && (
                  // Preview thumbnail
                  <div className="w-16 h-12 rounded overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Photo ${i + 1} preview`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Images must be publicly accessible URLs (not Instagram app links).
        </p>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-6 z-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center justify-between gap-4">
          {saveStatus === 'saved' && (
            <p className="text-green-600 font-semibold text-sm flex items-center gap-2">
              <span>✓</span> {saveMessage}
            </p>
          )}
          {saveStatus === 'error' && (
            <p className="text-red-600 text-sm">{saveMessage}</p>
          )}
          {(saveStatus === 'idle' || saveStatus === 'saving') && (
            <p className="text-gray-500 text-sm">Changes are not saved automatically.</p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="ml-auto bg-[#6B3E2E] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5A3321] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saveStatus === 'saving' ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              '✓ Saved!'
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
