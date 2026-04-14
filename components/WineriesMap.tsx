'use client';

import { Winery } from '@/lib/types';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import L from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 flex items-center justify-center">Loading map...</div>
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), {
  ssr: false
});
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
  ssr: false
});
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false
});

interface WineriesMapProps {
  wineries: Winery[];
  height?: string;
}

export default function WineriesMap({ wineries, height = 'h-96' }: WineriesMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Import Leaflet CSS dynamically
    import('leaflet/dist/leaflet.css');
  }, []);

  if (!isClient) {
    return <div className={`w-full ${height} bg-gray-200 flex items-center justify-center`}>Loading map...</div>;
  }

  if (wineries.length === 0) {
    return <div className={`w-full ${height} bg-gray-200 flex items-center justify-center`}>No wineries to display</div>;
  }

  // Calculate bounds to center the map
  const bounds = {
    minLat: Math.min(...wineries.map(w => w.location.lat)),
    maxLat: Math.max(...wineries.map(w => w.location.lat)),
    minLng: Math.min(...wineries.map(w => w.location.lng)),
    maxLng: Math.max(...wineries.map(w => w.location.lng)),
  };

  const centerLat = (bounds.minLat + bounds.maxLat) / 2;
  const centerLng = (bounds.minLng + bounds.maxLng) / 2;

  return (
    <MapContainer
      center={[centerLat, centerLng] as L.LatLngExpression}
      zoom={6}
      className={`w-full ${height} rounded-lg`}
      style={{ height: height === 'h-96' ? '24rem' : 'auto' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {wineries.map((winery) => (
        <Marker
          key={winery.placeId}
          position={[winery.location.lat, winery.location.lng] as L.LatLngExpression}
        >
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-sm mb-1">{winery.title}</h3>
              <p className="text-xs text-gray-600">{winery.city}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
