'use client';

import { useEffect, useRef, useState } from 'react';
import { Winery } from '@/lib/types';

export default function WineriesMap({ wineries }: { wineries: Winery[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(true);

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

    // Create map - center on California, disable scroll zoom initially
    const mapInstance = L.map(mapContainer.current, {
      scrollWheelZoom: false,
    }).setView([36.7783, -119.4179], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 4,
    }).addTo(mapInstance);

    // Track Ctrl/Cmd key state
    let ctrlPressed = false;

    // Listen for Ctrl/Cmd key down
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        ctrlPressed = true;
        mapInstance.scrollWheelZoom.enable();
      }
    };

    // Listen for Ctrl/Cmd key up
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        ctrlPressed = false;
        mapInstance.scrollWheelZoom.disable();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

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
          <div style="padding: 12px; min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #6B3E2E; font-family: 'Crimson Text', serif;">${winery.title}</h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #666; line-height: 1.4;">${winery.city}, ${winery.county}</p>
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
              <span style="color: #FCD34D; font-size: 16px;">★</span>
              <span style="font-size: 14px; font-weight: 600; color: #333;">${winery.totalScore.toFixed(1)}</span>
              <span style="font-size: 12px; color: #999;">(${winery.reviewsCount})</span>
            </div>
            <a href="/wineries/${winery.slug}" style="display: inline-block; background-color: #6B3E2E; color: white; padding: 8px 16px; border-radius: 4px; font-size: 13px; font-weight: 600; text-decoration: none; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#4A2618'" onmouseout="this.style.backgroundColor='#6B3E2E'">
              View Details
            </a>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 320,
          maxHeight: 300,
        });
        marker.addTo(mapInstance);
      }
    });

    map.current = mapInstance;
    setIsLoading(false);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A3C] mx-auto mb-4"></div>
            <p className="text-[#6B3E2E] font-medium">Loading map...</p>
          </div>
        </div>
      )}

      {/* Ctrl+Scroll Hint */}
      {showHint && !isLoading && (
        <div className="absolute top-4 left-4 z-20 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 max-w-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> Use <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono border border-gray-300">Ctrl</kbd> + <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono border border-gray-300">Scroll</kbd> to zoom
            </p>
            <button
              onClick={() => setShowHint(false)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '500px' }} />
    </div>
  );
}
