import { useState } from "react";
import BasinMap from "./BasinMap";
import geoJsonData from "../data/data.json";

interface BasinFeature {
  RiverBasin: string;
  REGION: string;
  name: string;
  Area: string;
  invest: string;
  water_: number;
  wetland_: number;
  drrm_: number;
  crosscut_: number;
}

const basinList: BasinFeature[] = geoJsonData.features.map((f) => ({
  RiverBasin: f.properties.RiverBasin,
  REGION: f.properties.REGION,
  name: f.properties.name,
  Area: f.properties.Area,
  invest: f.properties.invest,
  water_: f.properties.water_,
  wetland_: f.properties.wetland_,
  drrm_: f.properties.drrm_,
  crosscut_: f.properties.crosscut_,
}));

export default function FloodBasins() {
  const [selectedBasin, setSelectedBasin] = useState<BasinFeature | null>(null);
  const [status, setStatus] = useState<"Non-Flood Watch" | "Monitor" | "Alert">("Non-Flood Watch");

  const getStatusBg = (s: string) => {
    switch (s) {
      case "Alert":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Monitor":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <>
      {selectedBasin && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={() => setSelectedBasin(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-grey-azure">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedBasin.name}</h2>
                <p className="text-white/70 text-sm">{selectedBasin.REGION}</p>
              </div>
              <button
                onClick={() => setSelectedBasin(null)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid md:grid-cols-2 h-full">
                <div className="h-[300px] md:h-auto md:min-h-[400px]">
                  <BasinMap basinName={selectedBasin.RiverBasin} status={status} />
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">About the Basin</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {selectedBasin.name} covers approximately {Number(selectedBasin.Area.replace(/,/g, '')).toLocaleString()} km² 
                      in the {selectedBasin.REGION} region. This river basin plays a critical role in local water management 
                      and flood risk mitigation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Basin Statistics</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500">Area</p>
                        <p className="font-bold text-slate-800">{Number(selectedBasin.Area.replace(/,/g, '')).toLocaleString()} km²</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500">Region</p>
                        <p className="font-bold text-slate-800 text-xs">{selectedBasin.REGION}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500">Investment</p>
                        <p className="font-bold text-slate-800">₱{Number(selectedBasin.invest.replace(/,/g, '')).toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500">DRRM Budget</p>
                        <p className="font-bold text-slate-800">₱{Number(selectedBasin.drrm_).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Current Status</h3>
                    <div className="space-y-2">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as typeof status)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      >
                        <option value="Non-Flood Watch">Non-Flood Watch</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Alert">Alert</option>
                      </select>
                      <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase ${getStatusBg(status)}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
        <div className="bg-grey-azure px-5 py-3.5 flex items-center justify-between">
          <h2 className="text-white font-bold uppercase tracking-wide text-xs flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Major River Basins of the Philippines
          </h2>
          <div className="flex items-center gap-2 text-[10px] text-white/90 font-medium">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            {basinList.length} BASINS
          </div>
        </div>

        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">River Basin</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Region</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide text-right">Area (km²)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {basinList.map((basin, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedBasin(basin)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 rounded-full bg-grey-azure" />
                      <span className="font-semibold text-slate-800 text-sm">{basin.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-slate-500 font-medium">{basin.REGION}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-bold text-slate-700">
                      {Number(basin.Area.replace(/,/g, '')).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200">
          <p className="text-[10px] text-slate-500 text-center">
            Click a basin to view detailed map and information
          </p>
        </div>
      </div>
    </>
  );
}
