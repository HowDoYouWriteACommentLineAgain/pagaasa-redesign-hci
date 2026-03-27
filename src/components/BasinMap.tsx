import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geoJsonData from '../data/data.json';

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

const getCenter = (layer: string): [number, number] => {
  const centers: Record<string, [number, number]> = {
    'apayao-abulug': [17.8, 121.0],
    'abra': [17.1, 120.7],
    'agno': [16.0, 120.4],
    'Agusan': [8.2, 125.7],
    'bicol': [13.2, 123.4],
    'Buayan-Malungon': [6.3, 125.2],
    'Cagayan': [17.5, 121.5],
    'cdo': [8.3, 124.6],
    'davao': [7.0, 125.4],
    'ilog-hilabangan': [10.2, 122.8],
    'jalaur': [10.8, 122.6],
    'mindanao': [7.5, 124.8],
    'pampanga': [15.0, 120.6],
    'panay': [11.1, 122.3],
    'plrb': [14.3, 121.1],
    'ranao': [7.9, 124.3],
    'tagoloan': [8.4, 124.8],
    'tlrb': [7.5, 125.7],
  };
  return centers[layer] || [12.0, 122.0];
};

export default function BasinMap({ basinName, status }: BasinMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [12.0, 122.0],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
    }

    const selectedFeature = geoJsonData.features.find(
      (f) => f.properties.RiverBasin?.toLowerCase() === basinName.toLowerCase()
    );

    if (!selectedFeature) return;

    const layer = selectedFeature.properties.layer;
    const center = getCenter(layer);

    mapInstanceRef.current.setView(center, 8);

    geoJsonLayerRef.current = L.geoJSON(geoJsonData as GeoJSON.FeatureCollection, {
      filter: (feature) => {
        return feature?.properties.RiverBasin?.toLowerCase() === basinName.toLowerCase();
      },
      style: {
        color: getStatusColor(status),
        fillColor: getStatusFillColor(status),
        fillOpacity: 0.5,
        weight: 3,
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        const popupContent = `
          <div style="font-family: sans-serif; padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${props.name || props.RiverBasin}</h3>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Region:</strong> ${props.REGION}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Area:</strong> ${props.Area} km²</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Status:</strong> <span style="color: ${getStatusColor(status)}; font-weight: bold;">${status}</span></p>
            <hr style="margin: 8px 0; border: 0.5px solid #ddd;"/>
            <p style="margin: 4px 0; font-size: 11px;"><strong>Water:</strong> ₱${Number(props.water_).toLocaleString()}</p>
            <p style="margin: 4px 0; font-size: 11px;"><strong>Wetland:</strong> ₱${Number(props.wetland_).toLocaleString()}</p>
            <p style="margin: 4px 0; font-size: 11px;"><strong>DRRM:</strong> ₱${Number(props.drrm_).toLocaleString()}</p>
          </div>
        `;
        layer.bindPopup(popupContent);
      },
    }).addTo(mapInstanceRef.current);

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
