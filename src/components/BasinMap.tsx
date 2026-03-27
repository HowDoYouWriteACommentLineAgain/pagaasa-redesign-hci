import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { basinGeoData } from '../data/basinGeoData';

interface BasinMapProps {
  basinName: string;
  status: 'Non-Flood Watch' | 'Monitor' | 'Alert';
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Alert':
      return '#ef4444';
    case 'Monitor':
      return '#f59e0b';
    default:
      return '#10b981';
  }
};

const getStatusFillColor = (status: string): string => {
  switch (status) {
    case 'Alert':
      return 'rgba(239, 68, 68, 0.3)';
    case 'Monitor':
      return 'rgba(245, 158, 11, 0.3)';
    default:
      return 'rgba(16, 185, 129, 0.3)';
  }
};

export default function BasinMap({ basinName, status }: BasinMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const geoData = basinGeoData[basinName];
    if (!geoData) return;

    const map = L.map(mapRef.current, {
      center: geoData.center as L.LatLngExpression,
      zoom: geoData.zoom,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    const polygon = L.polygon(geoData.coordinates as L.LatLngExpression[], {
      color: getStatusColor(status),
      fillColor: getStatusFillColor(status),
      fillOpacity: 0.5,
      weight: 3,
    }).addTo(map);

    polygon.bindPopup(`
      <div style="font-family: sans-serif; padding: 8px;">
        <strong>${geoData.name}</strong><br/>
        Status: <span style="color: ${getStatusColor(status)}; font-weight: bold;">${status}</span>
      </div>
    `);

    map.fitBounds(polygon.getBounds(), { padding: [20, 20] });

    mapInstanceRef.current = map;
    polygonRef.current = polygon;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (polygonRef.current) {
      const geoData = basinGeoData[basinName];
      if (geoData) {
        polygonRef.current.setLatLngs(geoData.coordinates as L.LatLngExpression[]);
        polygonRef.current.setStyle({
          color: getStatusColor(status),
          fillColor: getStatusFillColor(status),
        });
        mapInstanceRef.current?.fitBounds(polygonRef.current.getBounds(), { padding: [20, 20] });
        polygonRef.current.setPopupContent(`
          <div style="font-family: sans-serif; padding: 8px;">
            <strong>${geoData.name}</strong><br/>
            Status: <span style="color: ${getStatusColor(status)}; font-weight: bold;">${status}</span>
          </div>
        `);
      }
    }
  }, [basinName, status]);

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] bg-slate-200 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-[1000]">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded border-2"
            style={{
              backgroundColor: getStatusFillColor(status),
              borderColor: getStatusColor(status),
            }}
          />
          <span className="text-xs font-medium text-slate-700">{basinName} Basin</span>
        </div>
      </div>
    </div>
  );
}
