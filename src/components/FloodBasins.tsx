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
    {
      name: "Pasig-Marikina",
      region: "METRO",
      subtext: "NCR / Rizal",
      status: "Monitor",
      trend: "Rising",
      level: "14.2m",
    },
    {
      name: "Laguna de Bay",
      region: "METRO",
      subtext: "NCR / CALABARZON",
      status: "Non-Flood Watch",
      trend: "Steady",
      level: "10.5m",
    },
    {
      name: "Tullahan River",
      region: "METRO",
      subtext: "Valenzuela / QC",
      status: "Non-Flood Watch",
      trend: "Falling",
      level: "2.1m",
    },
    {
      name: "Pampanga Basin",
      region: "AGRI",
      subtext: "Central Luzon Rice Bowl",
      status: "Monitor",
      trend: "Rising",
      level: "4.8m",
    },
    {
      name: "Cagayan Basin",
      region: "AGRI",
      subtext: "Northern Agri-Hub",
      status: "Alert",
      trend: "Rising",
      level: "8.2m",
    },
    {
      name: "Agno River",
      region: "AGRI",
      subtext: "Pangasinan / Tarlac",
      status: "Non-Flood Watch",
      trend: "Steady",
      level: "3.5m",
    },
    {
      name: "Bicol River",
      region: "AGRI",
      subtext: "Camarines / Albay",
      status: "Non-Flood Watch",
      trend: "Steady",
      level: "2.9m",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Rising":
        return <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-rose-500"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg>;
      case "Falling":
        return <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500"><path d="M12 20l8-8h-5V4H9v8H4z"/></svg>;
      default:
        return <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400"><circle cx="12" cy="12" r="5"/></svg>;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "Alert": return "bg-rose-100 text-rose-700 border-rose-200";
      case "Monitor": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
      <div className="bg-grey-azure px-5 py-3.5 flex items-center justify-between">
        <h2 className="text-white font-bold uppercase tracking-wide text-xs flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Basin Hydrological Forecast
        </h2>
        <div className="flex items-center gap-2 text-[10px] text-white/90 font-medium">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          LIVE UPDATES
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                18 Major River Basins
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Current Level
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide text-right">
                Forecast Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {basins.map((basin, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-1 h-8 rounded-full ${basin.region === "METRO" ? "bg-grey-azure" : "bg-dark-azure"}`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 text-sm">
                          {basin.name}
                        </span>
                        {basin.region === "METRO" && (
                          <span className="text-[8px] bg-grey-azure/20 text-grey-azure px-2 py-0.5 font-bold rounded uppercase">
                            Metro
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {basin.subtext}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">
                      {basin.level}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-medium">
                      {getTrendIcon(basin.trend)}
                      <span className={
                        basin.trend === "Rising" ? "text-rose-500" :
                        basin.trend === "Falling" ? "text-emerald-500" : "text-slate-400"
                      }>
                        {basin.trend}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3.5 text-right">
                  <span className={`inline-block px-3 py-1 rounded text-[9px] font-bold uppercase border ${getStatusBg(basin.status)}`}>
                    {basin.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex gap-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-grey-azure rounded-full" />
          <span className="text-[10px] font-medium text-slate-600 uppercase">
            Metro Center
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-dark-azure rounded-full" />
          <span className="text-[10px] font-medium text-slate-600 uppercase">
            Agricultural Basin
          </span>
        </div>
      </div>
    </div>
  );
}
