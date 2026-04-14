import { VenueDetails } from '@/lib/airtable';

interface Props {
  details: VenueDetails;
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="inline-block bg-[#F5EDE3] text-[#6B3E2E] text-xs font-semibold px-3 py-1 rounded-full border border-[#D4A574]">
      {label}
    </span>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl leading-none mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-gray-800 text-sm mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function VenueInfoSection({ details }: Props) {
  const hasPricing = details.CeremonyFeeMin || details.CeremonyFeeMax || details.PackagePriceMin || details.PackagePriceMax;
  const hasCapacity =
    details.MinGuests || details.MaxGuests ||
    details.IndoorCeremonyCapacity || details.OutdoorCeremonyCapacity ||
    details.IndoorReceptionCapacity || details.OutdoorReceptionCapacity;
  const styleTags = details.StyleTags ? details.StyleTags.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const viewTags = details.ViewTags ? details.ViewTags.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const eventTypes = details.EventTypes ? details.EventTypes.split(',').map((s) => s.trim()).filter(Boolean) : [];
  
  // Determine if data is owner-verified or community-enriched
  // If GrapevineNote exists but pricing/capacity is minimal, it's enriched data
  const hasOwnerClaimed = hasPricing || (hasCapacity && !details.GrapevineNote);
  const isEnrichedData = details.GrapevineNote && !hasOwnerClaimed;

  let photos: string[] = [];
  if (details.PhotoUrls) {
    try {
      const parsed = JSON.parse(details.PhotoUrls);
      photos = (Array.isArray(parsed) ? parsed.filter(Boolean) : []).slice(0, 5);
    } catch {
      photos = [];
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#6B3E2E]">Venue Information</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEnrichedData ? (
              <>
                Insights from Bay Area couples
              </>
            ) : (
              <>
                Details provided by the verified owner
                <span className="inline-flex items-center gap-1 ml-2 text-green-600 text-xs font-semibold">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Owner
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Description */}
      {details.Description && (
        <div className="mb-6 p-4 bg-[#FDF8F3] rounded-lg border border-[#E8D5C0]">
          <p className="text-gray-700 text-sm leading-relaxed italic">&ldquo;{details.Description}&rdquo;</p>
        </div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((url, i) => (
              <div key={i} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Venue photo ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style + View Tags */}
      {(styleTags.length > 0 || viewTags.length > 0) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {styleTags.map((tag) => <InfoPill key={tag} label={tag} />)}
          {viewTags.map((tag) => <InfoPill key={tag} label={`🏔 ${tag}`} />)}
        </div>
      )}

      {/* Core Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {hasPricing && (
          <InfoRow
            icon="💰"
            label="Pricing"
            value={[
              details.CeremonyFeeMin && details.CeremonyFeeMax
                ? `Ceremony fee: $${details.CeremonyFeeMin.toLocaleString()}–$${details.CeremonyFeeMax.toLocaleString()}`
                : null,
              details.PackagePriceMin && details.PackagePriceMax
                ? `Packages from $${details.PackagePriceMin.toLocaleString()}–$${details.PackagePriceMax.toLocaleString()}`
                : null,
              details.ServiceChargePercent ? `${details.ServiceChargePercent}% service charge` : null,
            ].filter(Boolean).join(' · ')}
          />
        )}

        {hasCapacity && (
          <div className="flex items-start gap-3 sm:col-span-2">
            <span className="text-xl leading-none mt-0.5">👥</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Capacity</p>
              {(details.MinGuests || details.MaxGuests) && (
                <p className="text-gray-800 text-sm mb-2">
                  {details.MinGuests && details.MaxGuests
                    ? `${details.MinGuests}–${details.MaxGuests} guests`
                    : `Up to ${details.MaxGuests} guests`}
                </p>
              )}
              {(details.IndoorCeremonyCapacity || details.OutdoorCeremonyCapacity ||
                details.IndoorReceptionCapacity || details.OutdoorReceptionCapacity) && (
                <table className="text-sm w-full max-w-xs">
                  <thead>
                    <tr>
                      <th className="text-left text-xs text-gray-400 font-normal pb-1 pr-4"></th>
                      <th className="text-right text-xs text-gray-400 font-normal pb-1 pr-4">Ceremony</th>
                      <th className="text-right text-xs text-gray-400 font-normal pb-1">Reception</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(details.IndoorCeremonyCapacity || details.IndoorReceptionCapacity) && (
                      <tr>
                        <td className="text-gray-600 pr-4 py-0.5">Indoors</td>
                        <td className="text-right text-gray-800 font-medium pr-4 py-0.5">
                          {details.IndoorCeremonyCapacity ?? '—'}
                        </td>
                        <td className="text-right text-gray-800 font-medium py-0.5">
                          {details.IndoorReceptionCapacity ?? '—'}
                        </td>
                      </tr>
                    )}
                    {(details.OutdoorCeremonyCapacity || details.OutdoorReceptionCapacity) && (
                      <tr>
                        <td className="text-gray-600 pr-4 py-0.5">Outdoors</td>
                        <td className="text-right text-gray-800 font-medium pr-4 py-0.5">
                          {details.OutdoorCeremonyCapacity ?? '—'}
                        </td>
                        <td className="text-right text-gray-800 font-medium py-0.5">
                          {details.OutdoorReceptionCapacity ?? '—'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {details.Catering && (
          <InfoRow icon="🍽️" label="Catering" value={details.Catering} />
        )}

        {details.Alcohol && (
          <InfoRow icon="🍷" label="Bar & Alcohol" value={details.Alcohol} />
        )}

        {details.AmplifiedMusic && (
          <InfoRow icon="🎵" label="Music" value={details.AmplifiedMusic} />
        )}

        {details.WheelchairAccessible !== undefined && (
          <InfoRow
            icon="♿"
            label="Accessibility"
            value={details.WheelchairAccessible ? 'Wheelchair accessible' : 'Not fully wheelchair accessible'}
          />
        )}

        {details.Availability && (
          <InfoRow
            icon="📅"
            label="Availability"
            value={details.Availability === 'Seasonal' && details.SeasonDetails
              ? `Seasonal — ${details.SeasonDetails}`
              : details.Availability}
          />
        )}
      </div>

      {/* Package Includes */}
      {details.PackageIncludes && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Packages Include</p>
          <p className="text-gray-700 text-sm">{details.PackageIncludes}</p>
        </div>
      )}

      {/* Grapevine Note - Community Insights */}
      {details.GrapevineNote && (
        <div className="mb-6 p-4 bg-[#FFF9F5] rounded-lg border border-[#FDDDC4] border-l-4 border-l-[#D4A574]">
          <p className="text-xs font-semibold text-[#8B5A2B] uppercase tracking-wide mb-2">🍇 Heard through the grapevine</p>
          <p className="text-gray-700 text-sm leading-relaxed">{details.GrapevineNote}</p>
        </div>
      )}

      {/* Event Types */}
      {eventTypes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Also Available For</p>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((et) => (
              <span key={et} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {et}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
