'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Winery } from '@/lib/types';

export default function WineriesMap({ wineries }: { wineries: Winery[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Leaflet CSS dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    // Import Leaflet dynamically since it's loaded via script tag
    const L = (window as any).L;

    // Create map - center on California
    const mapInstance = L.map(mapContainer.current).setView([36.7783, -119.4179], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 4,
    }).addTo(mapInstance);

    // Add markers for each winery
    wineries.forEach((winery) => {
      if (winery.location && winery.location.lat && winery.location.lng) {
        const marker = L.circleMarker([winery.location.lat, winery.location.lng], {
          radius: 6,
          fillColor: '#8B5A3C',
          color: '#6B3E2E',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.7,
        });

        // Create popup content with link
        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <h3 class="font-serif font-bold text-[#6B3E2E] mb-1">${winery.title}</h3>
            <p class="text-xs text-gray-600 mb-2">${winery.city}, ${winery.county}</p>
            <div class="flex items-center gap-1 mb-3">
              <span class="text-yellow-500">★</span>
              <span class="text-sm font-medium">${winery.totalScore.toFixed(1)}</span>
              <span class="text-xs text-gray-500">(${winery.reviewsCount})</span>
            </div>
            <a href="/wineries/${winery.city.toLowerCase().replace(/\s+/g, '-')}" class="inline-block bg-[#8B5A3C] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#6B3E2E] transition">
              View Details
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(mapInstance);
      }
    });

    map.current = mapInstance;
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-screen flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A3C] mx-auto mb-4"></div>
            <p className="text-[#6B3E2E] font-medium">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '500px' }} />
    </div>
  );
}
