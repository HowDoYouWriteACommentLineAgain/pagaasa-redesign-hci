import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geoJsonData from '../data/data.json';

interface BasinOverviewMapProps {
  onBasinSelect?: (basinName: string) => void;
  selectedBasin?: string;
  hidden?: boolean;
}

const getStatusColor = (status: 'Normal' | 'Below Normal' | 'Critical Low'): string => {
  switch (status) {
    case 'Critical Low':
      return '#ef4444';
    case 'Below Normal':
      return '#f59e0b';
    default:
      return '#10b981';
  }
};

const getStatusFillColor = (status: 'Normal' | 'Below Normal' | 'Critical Low'): string => {
  switch (status) {
    case 'Critical Low':
      return 'rgba(239, 68, 68, 0.3)';
    case 'Below Normal':
      return 'rgba(245, 158, 11, 0.3)';
    default:
      return 'rgba(16, 185, 129, 0.3)';
  }
};

export default function BasinOverviewMap({ onBasinSelect, selectedBasin, hidden }: BasinOverviewMapProps) {
  if (hidden) return null;
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [12.0, 122.0],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
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

    const statusOptions: Array<'Normal' | 'Below Normal' | 'Critical Low'> = ['Normal', 'Below Normal', 'Critical Low'];
    const trendOptions: Array<'Stable' | 'Decreasing' | 'Low'> = ['Stable', 'Decreasing', 'Low'];

    geoJsonLayerRef.current = L.geoJSON(geoJsonData as GeoJSON.FeatureCollection, {
      style: (feature) => {
        const name = feature?.properties?.name || '';
        const seed = name.charCodeAt(0) + name.length;
        const status = statusOptions[seed % 3];
        
        const isSelected = selectedBasin && name.toLowerCase() === selectedBasin.toLowerCase();
        
        return {
          color: isSelected ? '#3b82f6' : getStatusColor(status),
          fillColor: isSelected ? 'rgba(59, 130, 246, 0.5)' : getStatusFillColor(status),
          fillOpacity: isSelected ? 0.7 : 0.4,
          weight: isSelected ? 3 : 1.5,
          opacity: 0.8,
        };
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        const name = props?.name || props?.RiverBasin || 'Unknown';
        const region = props?.REGION || '';
        const area = props?.Area || '';
        
        const seed = name.charCodeAt(0) + name.length;
        const status = statusOptions[seed % 3];
        const trend = trendOptions[seed % 3];

        const tooltipContent = `
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="font-size: 12px;">${name}</strong><br/>
            <span style="font-size: 10px; color: #666;">${region}</span><br/>
            <span style="font-size: 10px;">Area: ${Number(area.replace(/,/g, '')).toLocaleString()} km²</span><br/>
            <span style="font-size: 10px; color: ${getStatusColor(status)};">Status: ${status}</span><br/>
            <span style="font-size: 10px;">Trend: ${trend}</span>
          </div>
        `;

        layer.bindTooltip(tooltipContent, {
          permanent: false,
          direction: 'top',
          className: 'basin-tooltip'
        });

        layer.on({
          click: () => {
            if (onBasinSelect) {
              onBasinSelect(name);
            }
          },
          mouseover: (e: L.LeafletMouseEvent) => {
            const layer = e.target;
            layer.setStyle({
              weight: 3,
              fillOpacity: 0.6,
            });
          },
          mouseout: (e: L.LeafletMouseEvent) => {
            geoJsonLayerRef.current?.resetStyle(e.target);
          }
        });

      },
    }).addTo(mapInstanceRef.current);

  }, [selectedBasin, onBasinSelect]);

  return (
    <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden">
      {/* Subtle scroll overlay hint */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-100/80 to-transparent z-[500] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-100/80 to-transparent z-[500] pointer-events-none" />
      
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-[600] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border border-emerald-500 bg-emerald-500/30" />
            <span className="text-slate-600">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border border-amber-500 bg-amber-500/30" />
            <span className="text-slate-600">Below Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border border-red-500 bg-red-500/30" />
            <span className="text-slate-600">Critical</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-[600]">
        <p className="text-[10px] text-slate-500">
          Hover for details • Click to select
        </p>
      </div>
    </div>
  );
}
