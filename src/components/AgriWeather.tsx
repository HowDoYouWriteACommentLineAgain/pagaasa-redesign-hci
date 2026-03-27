import { useState } from "react";

interface CropRegion {
  name: string;
  crops: string;
  soilMoisture: "Low" | "Optimal" | "Saturated";
  rainfall24h: string;
  status: "Critical" | "Caution" | "Normal";
}

interface Advisory {
  type: "pest" | "irrigation" | "planting" | "harvest";
  region: string;
  message: string;
  severity: "high" | "medium" | "low";
}

function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute z-[100] px-2.5 py-1.5 bg-dark-azure text-white text-[10px] rounded-lg shadow-xl whitespace-nowrap" style={{ bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" }}>
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-dark-azure" />
        </div>
      )}
    </div>
  );
}

export default function AgriWeather() {
  const cropRegions: CropRegion[] = [
    { name: "Central Luzon", crops: "Rice, Corn", soilMoisture: "Optimal", rainfall24h: "12mm", status: "Normal" },
    { name: "Ilocos Region", crops: "Onion, Garlic", soilMoisture: "Low", rainfall24h: "2mm", status: "Critical" },
    { name: "Cagayan Valley", crops: "Rice, Tobacco", soilMoisture: "Saturated", rainfall24h: "48mm", status: "Caution" },
    { name: "Western Visayas", crops: "Sugarcane", soilMoisture: "Optimal", rainfall24h: "8mm", status: "Normal" },
    { name: "Davao Region", crops: "Banana, Coconut", soilMoisture: "Low", rainfall24h: "5mm", status: "Caution" },
    { name: "Mimaropa", crops: "Rice, Mango", soilMoisture: "Optimal", rainfall24h: "15mm", status: "Normal" },
  ];

  const advisories: Advisory[] = [
    { type: "pest", region: "Central Luzon", message: "Brown planthopper monitoring advised. Check traps weekly.", severity: "medium" },
    { type: "irrigation", region: "Ilocos Region", message: "Immediate irrigation needed. Apply 20mm if no rainfall in 48hrs.", severity: "high" },
    { type: "planting", region: "Nationwide", message: "Optimal window for rice transplanting in most regions.", severity: "low" },
    { type: "harvest", region: "Western Visayas", message: "Sugarcane harvest recommended given dry forecast.", severity: "low" },
  ];

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Critical":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      case "Caution":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
    }
  };

  const getMoistureIcon = (moisture: string) => {
    const color = moisture === "Low" ? "text-amber-500" : moisture === "Saturated" ? "text-blue-500" : "text-cyan-600";
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className={color}>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    );
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "Critical": return "bg-red-100 text-red-700 border-red-200";
      case "Caution": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const getAdvisoryIcon = (type: string) => {
    switch (type) {
      case "pest": return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      );
      case "irrigation": return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      );
      case "planting": return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V8"></path>
          <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
          <path d="M8 8a4 4 0 1 1 8 0"></path>
        </svg>
      );
      default: return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="M18 17V9"></path>
          <path d="M13 17V5"></path>
          <path d="M8 17v-3"></path>
        </svg>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Soil & Rainfall Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
        <div className="bg-dark-azure px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-white font-bold uppercase tracking-wide text-xs flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Crop Region Status
          </h3>
          <span className="text-[10px] text-white/70 font-medium">24hr Rainfall</span>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Region</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide hidden md:table-cell">Crops</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Soil</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Rain</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cropRegions.map((region, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-800 text-sm">{region.name}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-slate-500">{region.crops}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Tooltip content={`Soil moisture at 10cm: ${region.soilMoisture}`}>
                      <div className="flex items-center gap-1.5 cursor-help">
                        {getMoistureIcon(region.soilMoisture)}
                        <span className={`text-xs font-medium ${
                          region.soilMoisture === "Low" ? "text-amber-600" :
                          region.soilMoisture === "Saturated" ? "text-blue-600" : "text-slate-700"
                        }`}>
                          {region.soilMoisture}
                        </span>
                      </div>
                    </Tooltip>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      <span className="text-sm font-medium text-slate-600">{region.rainfall24h}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Tooltip content={`Farming conditions: ${region.status}`}>
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[9px] font-bold uppercase border ${getStatusBg(region.status)}`}>
                        {getStatusIcon(region.status)}
                        {region.status}
                      </div>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200">
          <p className="text-[9px] text-slate-500 text-center font-medium">
            <span className="font-bold">Status:</span> Normal = Good conditions • Caution = Monitor • Critical = Action needed
          </p>
        </div>
      </div>

      {/* Right Column: Technical Advisories */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
        <div className="bg-grey-azure px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-white font-bold uppercase tracking-wide text-xs flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Technical Advisories
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-white/80 font-medium">Live</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {advisories.map((advisory, idx) => (
            <div 
              key={idx} 
              className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border ${getSeverityBg(advisory.severity)}`}>
                  {getAdvisoryIcon(advisory.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${getSeverityBg(advisory.severity)}`}>
                      {advisory.type}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">{advisory.region}</span>
                    {advisory.severity === "high" && (
                      <span className="flex items-center gap-1 text-[8px] font-bold text-red-600">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-snug group-hover:text-slate-800 transition-colors">{advisory.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200">
          <button className="w-full text-center text-xs font-bold text-grey-azure hover:text-dark-azure transition-colors uppercase tracking-wide">
            View All Advisories →
          </button>
        </div>
      </div>
    </div>
  );
}
