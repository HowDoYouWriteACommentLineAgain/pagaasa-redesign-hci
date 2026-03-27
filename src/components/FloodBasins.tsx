import { useState, useRef } from "react";
import BasinMap from "./BasinMap";
import BasinOverviewMap from "./BasinOverviewMap";
import geoJsonData from "../data/data.json";

interface BasinData {
  RiverBasin: string;
  layer: string;
  REGION: string;
  name: string;
  Area: string;
  invest: string;
  water_: number;
  wetland_: number;
  drrm_: number;
  crosscut_: number;
  status: "Normal" | "Below Normal" | "Critical Low";
  trend: "Stable" | "Decreasing" | "Low";
  level: string;
  maxLevel: string;
}

const basinList: BasinData[] = geoJsonData.features.map((f) => {
  const statusOptions: Array<"Normal" | "Below Normal" | "Critical Low"> = ["Normal", "Below Normal", "Critical Low"];
  const trendOptions: Array<"Stable" | "Decreasing" | "Low"> = ["Stable", "Decreasing", "Low"];
  
  const seed = f.properties.name.charCodeAt(0) + f.properties.name.length;
  
  return {
    RiverBasin: f.properties.RiverBasin,
    layer: f.properties.layer,
    REGION: f.properties.REGION,
    name: f.properties.name,
    Area: f.properties.Area,
    invest: f.properties.invest,
    water_: f.properties.water_,
    wetland_: f.properties.wetland_,
    drrm_: f.properties.drrm_,
    crosscut_: f.properties.crosscut_,
    status: statusOptions[seed % 3],
    trend: trendOptions[seed % 3],
    level: `${(seed % 3 + 1)}.${seed % 10}m`,
    maxLevel: `${(seed % 3 + 4)}.${(seed + 5) % 10}m`,
  };
});

export default function FloodBasins() {
  const [selectedBasin, setSelectedBasin] = useState<BasinData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const handleBasinSelectFromMap = (basinName: string) => {
    const basin = basinList.find(b => b.name.toLowerCase() === basinName.toLowerCase());
    if (basin) {
      setSelectedBasin(basin);
      setIsModalOpen(true);
    }
  };

  const getStatusBg = (s: string) => {
    switch (s) {
      case "Critical Low":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Below Normal":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const getStatusDot = (s: string) => {
    switch (s) {
      case "Critical Low":
        return "bg-rose-500";
      case "Below Normal":
        return "bg-amber-500";
      default:
        return "bg-emerald-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Decreasing":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-rose-500">
            <path d="M12 20l8-8h-5V4H9v8H4z" />
          </svg>
        );
      case "Low":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500">
            <path d="M12 20l-4-4h3V8h2v8h3l-4 4z" />
            <rect x="6" y="18" width="12" height="2" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400">
            <circle cx="12" cy="12" r="5" />
          </svg>
        );
    }
  };

  const getLevelPercent = (level: string, maxLevel: string) => {
    const l = parseFloat(level);
    const m = parseFloat(maxLevel);
    return Math.min(Math.round((l / m) * 100), 100);
  };

  const handleRowClick = (basin: BasinData) => {
    setSelectedBasin(basin);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBasin(null), 200);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
        <div className="bg-grey-azure px-5 py-3.5 flex items-center justify-between">
          <h2 className="text-white font-bold uppercase tracking-wide text-xs flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Major River Basins - Dry Season Conditions
          </h2>
          <div className="flex items-center gap-2 text-[10px] text-white/90 font-medium">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            {basinList.length} BASINS
          </div>
        </div>

        {/* Interactive Map */}
        <div className="relative z-0 h-[250px] md:h-[300px] px-4 pt-4">
          <BasinOverviewMap 
            onBasinSelect={handleBasinSelectFromMap}
            selectedBasin={selectedBasin?.name}
            hidden={isModalOpen}
          />
        </div>

        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">River Basin</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Region</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide text-right">Area</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide text-right">Water Lvl</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide hidden md:table-cell">Trend</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide hidden md:table-cell">Status</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {basinList.map((basin, idx) => (
                <tr
                  key={idx}
                  ref={(el) => { rowRefs.current[idx] = el; }}
                  onClick={() => handleRowClick(basin)}
                  className="group hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1 h-9 rounded-full bg-grey-azure group-hover:bg-dark-azure transition-colors" />
                      <span className="font-semibold text-slate-800 text-xs">{basin.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-500">{basin.REGION}</span>
                      <span className={`inline-flex items-center gap-1 w-fit text-[9px] font-semibold ${getStatusBg(basin.status)} px-1.5 py-0.5 rounded md:hidden`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(basin.status)}`}></span>
                        {basin.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-medium text-slate-600">
                      {Number(basin.Area.replace(/,/g, '')).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">km²</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs font-bold text-slate-700">{basin.level}</span>
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            getLevelPercent(basin.level, basin.maxLevel) > 80
                              ? "bg-rose-500"
                              : getLevelPercent(basin.level, basin.maxLevel) > 60
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${getLevelPercent(basin.level, basin.maxLevel)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      {getTrendIcon(basin.trend)}
                      <span className={`text-[11px] font-medium ${
                        basin.trend === 'Decreasing' ? 'text-rose-600' :
                        basin.trend === 'Low' ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {basin.trend}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(basin.status)}`}></span>
                      <span className={`text-[10px] font-semibold ${getStatusBg(basin.status)} px-2 py-0.5 rounded`}>
                        {basin.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-slate-500">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-[10px] text-slate-500">Below Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-[10px] text-slate-500">Critical Low</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedBasin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div 
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-grey-azure">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{selectedBasin.name}</h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBg(selectedBasin.status)}`}>
                    {selectedBasin.status}
                  </span>
                </div>
                <p className="text-white/70 text-sm">{selectedBasin.REGION}</p>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid md:grid-cols-2">
                <div className="h-[300px] md:h-[400px]">
                  <BasinMap basinName={selectedBasin.RiverBasin} status={selectedBasin.status === 'Critical Low' ? 'Alert' : selectedBasin.status === 'Below Normal' ? 'Monitor' : 'Non-Flood Watch'} />
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Hydrological Data</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-[10px] text-slate-500 uppercase">Current Level</p>
                        <p className="font-bold text-slate-800 text-lg">{selectedBasin.level}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-[10px] text-slate-500 uppercase">Max Level</p>
                        <p className="font-bold text-slate-800 text-lg">{selectedBasin.maxLevel}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-[10px] text-slate-500 uppercase">Status</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`w-2 h-2 rounded-full ${getStatusDot(selectedBasin.status)}`}></span>
                          <span className={`text-xs font-semibold ${getStatusBg(selectedBasin.status)} px-2 py-0.5 rounded`}>
                            {selectedBasin.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-xs text-slate-500 mb-1">Water Level Gauge</div>
                        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                              getLevelPercent(selectedBasin.level, selectedBasin.maxLevel) > 80
                                ? "bg-rose-500"
                                : getLevelPercent(selectedBasin.level, selectedBasin.maxLevel) > 60
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${getLevelPercent(selectedBasin.level, selectedBasin.maxLevel)}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white drop-shadow-sm">
                              {getLevelPercent(selectedBasin.level, selectedBasin.maxLevel)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Trend</h3>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                      {getTrendIcon(selectedBasin.trend)}
                      <span className={`font-semibold ${
                        selectedBasin.trend === 'Decreasing' ? 'text-rose-600' :
                        selectedBasin.trend === 'Low' ? 'text-amber-600' : 'text-slate-600'
                      }`}>
                        {selectedBasin.trend}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Basin Statistics</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Area</span>
                        <span className="font-medium">{Number(selectedBasin.Area.replace(/,/g, '')).toLocaleString()} km²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Investment</span>
                        <span className="font-medium">₱{Number(selectedBasin.invest.replace(/,/g, '')).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">DRRM</span>
                        <span className="font-medium">₱{Number(selectedBasin.drrm_).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Water</span>
                        <span className="font-medium">₱{Number(selectedBasin.water_).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
