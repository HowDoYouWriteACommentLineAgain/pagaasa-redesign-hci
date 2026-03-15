import React from "react";

interface BasinData {
  name: string;
  region: "METRO" | "AGRI";
  subtext: string;
  status: "Non-Flood Watch" | "Monitor" | "Alert";
  trend: "Rising" | "Falling" | "Steady";
  level: string;
}

export default function BasinForecast() {
  const basins: BasinData[] = [
    // METRO MANILA PRIORITY
    { name: "Pasig-Marikina", region: "METRO", subtext: "NCR / Rizal", status: "Monitor", trend: "Rising", level: "14.2m" },
    { name: "Laguna de Bay", region: "METRO", subtext: "NCR / CALABARZON", status: "Non-Flood Watch", trend: "Steady", level: "10.5m" },
    { name: "Tullahan River", region: "METRO", subtext: "Valenzuela / QC", status: "Non-Flood Watch", trend: "Falling", level: "2.1m" },
    
    // AGRICULTURAL IMPORTANCE
    { name: "Pampanga Basin", region: "AGRI", subtext: "Central Luzon Rice Bowl", status: "Monitor", trend: "Rising", level: "4.8m" },
    { name: "Cagayan Basin", region: "AGRI", subtext: "Northern Agri-Hub", status: "Alert", trend: "Rising", level: "8.2m" },
    { name: "Agno River", region: "AGRI", subtext: "Pangasinan / Tarlac", status: "Non-Flood Watch", trend: "Steady", level: "3.5m" },
    { name: "Bicol River", region: "AGRI", subtext: "Camarines / Albay", status: "Non-Flood Watch", trend: "Steady", level: "2.9m" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm container md:mx-auto">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <h2 className="text-white font-black uppercase tracking-widest text-sm">Basin Hydrological Forecast</h2>
        <span className="text-[10px] text-blue-100 font-bold bg-blue-700 px-2 py-1 rounded">LIVE UPDATES</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-tighter w-1/3">18 Major River Basins</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Level</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-tighter text-right">Forecast Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {basins.map((basin, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Region Indicator */}
                    <div className={`w-1 h-8 rounded-full ${basin.region === 'METRO' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{basin.name}</span>
                        {basin.region === 'METRO' && (
                          <span className="text-[8px] bg-blue-100 text-blue-600 px-1 font-black rounded uppercase">Metro</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium italic">{basin.subtext}</p>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-700">{basin.level}</span>
                    <span className={`text-[9px] font-bold flex items-center gap-1 ${
                      basin.trend === 'Rising' ? 'text-rose-500' : basin.trend === 'Falling' ? 'text-emerald-500' : 'text-slate-400'
                    }`}>
                      {basin.trend === 'Rising' ? '▲' : basin.trend === 'Falling' ? '▼' : '●'} {basin.trend}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] mx-auto text-nowrap font-black uppercase tracking-tight shadow-sm border ${
                    basin.status === 'Alert' ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-rose-100' :
                    basin.status === 'Monitor' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                    'bg-blue-50 border-blue-100 text-blue-600'
                  }`}>
                    {basin.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend / Footer */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-[9px] font-bold text-slate-500 uppercase">Metro Center</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-[9px] font-bold text-slate-500 uppercase">Agricultural Basin</span>
        </div>
      </div>
    </div>
  );
}