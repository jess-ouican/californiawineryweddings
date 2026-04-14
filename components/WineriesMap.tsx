'use client';

import { Winery } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';

interface WineriesMapProps {
  wineries: Winery[];
  height?: string;
}

export default function WineriesMap({ wineries, height = 'h-96' }: WineriesMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainer.current || mapLoaded) return;

    // Dynamically import leaflet only on client
    (async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        // Calculate bounds
        if (wineries.length === 0) return;

        const bounds = {
          minLat: Math.min(...wineries.map(w => w.location.lat)),
          maxLat: Math.max(...wineries.map(w => w.location.lat)),
          minLng: Math.min(...wineries.map(w => w.location.lng)),
          maxLng: Math.max(...wineries.map(w => w.location.lng)),
        };

        const centerLat = (bounds.minLat + bounds.maxLat) / 2;
        const centerLng = (bounds.minLng + bounds.maxLng) / 2;

        // Create map
        const map = L.map(mapContainer.current).setView([centerLat, centerLng], 6);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add markers
        wineries.forEach((winery) => {
          const marker = L.marker([winery.location.lat, winery.location.lng])
            .bindPopup(`<div style="font-family: sans-serif"><strong style="font-size: 14px; display: block; margin-bottom: 4px;">${winery.title}</strong><span style="font-size: 12px; color: #666;">${winery.city}</span></div>`)
            .addTo(map);
        });

        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading map:', error);
      }
    })();
  }, [isClient, mapLoaded, wineries]);

  const heightClass = height === 'h-screen' ? 'h-screen' : 'h-96';

  return (
    <div
      ref={mapContainer}
      className={`w-full ${heightClass} rounded-lg bg-gray-200`}
      style={{ minHeight: height === 'h-screen' ? '100vh' : '24rem' }}
    />
  );
}
