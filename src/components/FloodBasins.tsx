import { useState } from "react";

interface BasinData {
  name: string;
  region: "METRO" | "AGRI";
  subtext: string;
  status: "Non-Flood Watch" | "Monitor" | "Alert";
  trend: "Rising" | "Falling" | "Steady";
  level: string;
  maxLevel: string;
  mapQuery: string;
  description: string;
}

export default function BasinForecast() {
  const [selectedBasin, setSelectedBasin] = useState<BasinData | null>(null);

  const basins: BasinData[] = [
    {
      name: "Pasig-Marikina",
      region: "METRO",
      subtext: "NCR / Rizal",
      status: "Monitor",
      trend: "Rising",
      level: "14.2m",
      maxLevel: "15.5m",
      mapQuery: "Pasig+Marikina+River+Manila+Philippines",
      description: "The Pasig-Marikina River system flows through the heart of Metro Manila, draining a watershed of approximately 4,800 square kilometers. Critical for flood management in the NCR.",
    },
    {
      name: "Laguna de Bay",
      region: "METRO",
      subtext: "NCR / CALABARZON",
      status: "Non-Flood Watch",
      trend: "Steady",
      level: "10.5m",
      maxLevel: "12.8m",
      mapQuery: "Laguna+de+Bay+Philippines",
      description: "Laguna de Bay is the largest lake in the Philippines, serving as a natural reservoir for Metro Manila and surrounding provinces. The lake basin covers approximately 3,000 square kilometers.",
    },
    {
      name: "Tullahan River",
      region: "METRO",
      subtext: "Valenzuela / QC",
      status: "Non-Flood Watch",
      trend: "Falling",
      level: "2.1m",
      maxLevel: "3.5m",
      mapQuery: "Tullahan+River+Valenzuela+Philippines",
      description: "The Tullahan River is a major waterway in northern Metro Manila, flowing through Valenzuela City and Quezon City. It drains an urbanized watershed prone to flash floods.",
    },
    {
      name: "Pampanga Basin",
      region: "AGRI",
      subtext: "Central Luzon Rice Bowl",
      status: "Monitor",
      trend: "Rising",
      level: "4.8m",
      maxLevel: "6.0m",
      mapQuery: "Pampanga+River+Central+Luzon+Philippines",
      description: "The Pampanga River basin is the lifeblood of Central Luzon's agricultural sector, known as the Rice Bowl of the Philippines. It drains an area of approximately 10,000 square kilometers.",
    },
    {
      name: "Cagayan Basin",
      region: "AGRI",
      subtext: "Northern Agri-Hub",
      status: "Alert",
      trend: "Rising",
      level: "8.2m",
      maxLevel: "9.5m",
      mapQuery: "Cagayan+River+Isabela+Philippines",
      description: "The Cagayan River is the longest river in the Philippines, flowing through the agricultural heartland of Cagayan Valley. It drains a vast watershed of approximately 27,000 square kilometers.",
    },
    {
      name: "Agno River",
      region: "AGRI",
      subtext: "Pangasinan / Tarlac",
      status: "Non-Flood Watch",
      trend: "Steady",
      level: "3.5m",
      maxLevel: "5.2m",
      mapQuery: "Agno+River+Pangasinan+Philippines",
      description: "The Agno River flows through Pangasinan province, draining the eastern part of the Central Luzon basin. It is crucial for irrigation and hydroelectric power generation.",
    },
    {
      name: "Bicol River",
      region: "AGRI",
      subtext: "Camarines / Albay",
      status: "Non-Flood Watch",
      trend: "Steady",
      level: "2.9m",
      maxLevel: "4.5m",
      mapQuery: "Bicol+River+Camarines+Sur+Philippines",
      description: "The Bicol River basin covers the southeastern part of Luzon Island, including Bicol Peninsula. It supports extensive agricultural and fishing communities in the region.",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Rising":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-rose-500">
            <path d="M12 4l-8 8h5v8h6v-8h5z" />
          </svg>
        );
      case "Falling":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500">
            <path d="M12 20l8-8h-5V4H9v8H4z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400">
            <circle cx="12" cy="12" r="5" />
          </svg>
        );
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
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
      {/* Basin Modal */}
      {selectedBasin && (
        <BasinModal basin={selectedBasin} onClose={() => setSelectedBasin(null)} />
      )}

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
                  onClick={() => setSelectedBasin(basin)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
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
                        <span
                          className={
                            basin.trend === "Rising"
                              ? "text-rose-500"
                              : basin.trend === "Falling"
                              ? "text-emerald-500"
                              : "text-slate-400"
                          }
                        >
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
    </>
  );
}

function BasinModal({ basin, onClose }: { basin: BasinData; onClose: () => void }) {
  const mapUrl = `https://www.google.com/maps?q=${basin.mapQuery}&output=embed&z=10`;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-grey-azure">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{basin.name}</h2>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  basin.region === "METRO"
                    ? "bg-white/30 text-white"
                    : "bg-dark-azure/50 text-white"
                }`}
              >
                {basin.region}
              </span>
            </div>
            <p className="text-white/70 text-sm">{basin.subtext}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 h-full">
            {/* Map */}
            <div className="h-[300px] md:h-auto md:min-h-[400px]">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${basin.name} River Basin Map`}
                className="w-full h-full"
              />
            </div>

            {/* Details */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
                  About the Basin
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {basin.description}
                </p>
              </div>

              {/* Water Level */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                  Water Level
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Current Level</span>
                    <span className="font-bold text-slate-800">{basin.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Max Safe Level</span>
                    <span className="font-bold text-slate-800">{basin.maxLevel}</span>
                  </div>
                  <div className="mt-3">
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          parseFloat(basin.level) / parseFloat(basin.maxLevel) > 0.8
                            ? "bg-rose-500"
                            : parseFloat(basin.level) / parseFloat(basin.maxLevel) > 0.6
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (parseFloat(basin.level) / parseFloat(basin.maxLevel)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 text-right">
                      {(
                        (parseFloat(basin.level) / parseFloat(basin.maxLevel)) *
                        100
                      ).toFixed(0)}
                      % of max level
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                  Current Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase ${
                        basin.status === "Alert"
                          ? "bg-rose-100 text-rose-700"
                          : basin.status === "Monitor"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {basin.status}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Trend</p>
                    <div className="flex items-center gap-2">
                      {basin.trend === "Rising" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-rose-500"
                        >
                          <path d="M12 4l-8 8h5v8h6v-8h5z" />
                        </svg>
                      )}
                      {basin.trend === "Falling" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-emerald-500"
                        >
                          <path d="M12 20l8-8h-5V4H9v8H4z" />
                        </svg>
                      )}
                      {basin.trend === "Steady" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-slate-400"
                        >
                          <circle cx="12" cy="12" r="6" />
                        </svg>
                      )}
                      <span className="font-semibold text-slate-800">
                        {basin.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Open in Google Maps */}
              <a
                href={`https://www.google.com/maps/search/${basin.mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-grey-azure hover:bg-grey-azure/90 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                View on OpenStreetMap
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
