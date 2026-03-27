import { useState, useMemo } from 'react';
import {
  Sun,
  Moon,
  Waves,
  Star,
  Clock,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Eye,
  Telescope
} from 'lucide-react';
import {
  MANILA,
  getMoonPhase,
  getSunTimes,
  getMoonTimes,
  generateTimelineData,
  getUpcomingEvents,
  getVisiblePlanets,
  getDailyEphemeris,
  getConstellationsForDate,
  getNextTide,
  getInsight,
  TidalData
} from '../lib/celestialCalculations';

export default function Astronomy() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const timezone = MANILA.tz;

  const moonPhaseData = useMemo(() => getMoonPhase(selectedDate), [selectedDate]);
  const sunTimes = useMemo(() => getSunTimes(selectedDate, MANILA.lat, MANILA.lon, timezone), [selectedDate, timezone]);
  const moonTimes = useMemo(() => getMoonTimes(selectedDate, MANILA.lat, MANILA.lon, timezone), [selectedDate, timezone]);
  const timelineData = useMemo(() => generateTimelineData(selectedDate, MANILA.lat, MANILA.lon, timezone), [selectedDate, timezone]);
  const events = useMemo(() => getUpcomingEvents(selectedDate, timezone), [selectedDate, timezone]);
  const visiblePlanets = useMemo(() => getVisiblePlanets(selectedDate, MANILA.lat, MANILA.lon), [selectedDate]);
  const ephemeris = useMemo(() => getDailyEphemeris(selectedDate, MANILA.lat, MANILA.lon, timezone), [selectedDate, timezone]);
  const constellations = useMemo(() => getConstellationsForDate(selectedDate), [selectedDate]);
  const nextTide = useMemo(() => getNextTide(selectedDate, timezone), [selectedDate, timezone]);
  const insight = useMemo(() => getInsight(selectedDate), [selectedDate]);

  const formatTime = (hour: number): string => {
    const h = Math.floor(hour);
    const m = Math.round((hour % 1) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const getTimeFromHour = (hour: number): string => {
    const h = Math.floor(hour);
    const m = Math.round((hour % 1) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const tides: TidalData[] = useMemo(() => {
    const base = timelineData.map(p => ({ time: getTimeFromHour(p.hour), height: 1.2 + p.tide * 0.3, type: 'mid' as const }));
    return base;
  }, [timelineData]);

  const getSkyColor = (hour: number): string => {
    if (hour >= 6 && hour < 8) return 'bg-gradient-to-b from-orange-400/30 to-blue-900/50';
    if (hour >= 8 && hour < 18) return 'bg-gradient-to-b from-blue-500/20 to-slate-800/50';
    if (hour >= 18 && hour < 19) return 'bg-gradient-to-b from-orange-500/30 to-purple-900/50';
    return 'bg-gradient-to-b from-slate-950 to-slate-900';
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-slate-950 to-slate-900/30">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-xl flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2v20M2 12h20"/>
            </svg>
            Astronomy & Sky Diary
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm hidden sm:block">
              {selectedDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </span>
            <div className="flex items-center bg-white/10 rounded-lg border border-white/20">
              <button onClick={() => navigateDate(-1)} className="p-1.5 hover:bg-white/10 rounded-l-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-white/70" />
              </button>
              <button onClick={() => setSelectedDate(new Date())} className="px-2 py-1 text-xs text-white/70 hover:text-white font-medium">
                Today
              </button>
              <button onClick={() => navigateDate(1)} className="p-1.5 hover:bg-white/10 rounded-r-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <h3 className="text-sm font-bold text-white/60 mb-4 flex items-center gap-2">
                <Moon className="w-4 h-4" /> Lunar Cycle
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{moonPhaseData.name}</p>
                  <p className="text-white/50 text-sm">Illumination: {moonPhaseData.illumination.toFixed(0)}%</p>
                  <p className="text-white/40 text-xs mt-1">Age: {moonPhaseData.age.toFixed(1)} days</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-700 to-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center">
                  <Moon className="w-8 h-8 text-slate-300" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <h3 className="text-sm font-bold text-white/60 mb-4 flex items-center gap-2">
                <Waves className="w-4 h-4" /> Tidal Forecast
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-white/50 text-sm">Next High Tide</span>
                  <span className="text-xl font-bold text-white">
                    {nextTide.nextHigh ? nextTide.nextHigh.time : '--:--'}
                    <span className="text-xs text-blue-400 ml-1">
                      {nextTide.nextHigh ? `+${(nextTide.nextHigh.height).toFixed(1)}m` : ''}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-white/50 text-sm">Next Low Tide</span>
                  <span className="text-xl font-bold text-white">
                    {nextTide.nextLow ? nextTide.nextLow.time : '--:--'}
                    <span className="text-xs text-red-400 ml-1">
                      {nextTide.nextLow ? `-${(Math.abs(nextTide.nextLow.height)).toFixed(1)}m` : ''}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <h3 className="text-sm font-bold text-white/60 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4" /> Upcoming Events
              </h3>
              <div className="space-y-3">
                {events.slice(0, 5).map((e, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded-lg transition-all cursor-default">
                    <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center text-lg">
                      {e.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{e.label}</p>
                      <p className="text-xs text-white/50">{e.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  24-Hour Celestial Altitude & Tides
                </h3>
                <button className="text-white/40 hover:text-white transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="h-64 relative border-b border-white/10 mb-10">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {timelineData.map((p, i) => {
                    const x = (p.hour / 24) * 100;
                    const next = timelineData[i + 1];
                    if (!next) return null;
                    const nextX = (next.hour / 24) * 100;
                    
                    let fillColor = 'transparent';
                    if (p.isGoldenHour) fillColor = 'rgba(251, 146, 60, 0.15)';
                    else if (p.isBlueHour) fillColor = 'rgba(59, 130, 246, 0.15)';
                    else if (p.isDay) fillColor = 'rgba(250, 204, 21, 0.05)';
                    
                    if (fillColor !== 'transparent' && next && fillColor !== timelineData[i - 1]?.fillColor) {
                      return <rect key={i} x={x} y="0" width={nextX - x} height="100" fill={fillColor} />;
                    }
                    return null;
                  })}

                  <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1,1" />

                  <path
                    d={`M ${timelineData.map(p => `${(p.hour / 24) * 100},${50 - (p.sunAlt / 1.5)}`).join(' L ')}`}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1"
                    className="drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                  />

                  <path
                    d={`M ${timelineData.map(p => `${(p.hour / 24) * 100},${50 - (p.moonAlt / 1.5)}`).join(' L ')}`}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="0.7"
                    strokeDasharray="2,1"
                  />

                  <path
                    d={`M ${timelineData.map(p => `${(p.hour / 24) * 100},${85 - (p.tide * 3)}`).join(' L ')} L 100,100 L 0,100 Z`}
                    fill="url(#tideGradient)"
                    className="opacity-40"
                  />

                  <defs>
                    <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>

                  <rect
                    x="0" y="0" width="100" height="100"
                    fill="transparent"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 24;
                      setHoverTime(x);
                    }}
                    onMouseLeave={() => setHoverTime(null)}
                  />

                  {hoverTime !== null && (
                    <line
                      x1={(hoverTime / 24) * 100} y1="0"
                      x2={(hoverTime / 24) * 100} y2="100"
                      stroke="#ffffff" strokeWidth="0.15"
                    />
                  )}
                </svg>

                <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[9px] text-white/40 uppercase tracking-tighter px-0.5">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>24:00</span>
                </div>

                {hoverTime !== null && (
                  <div
                    className="absolute bg-slate-700 border border-white/20 p-2 rounded-lg shadow-xl text-xs pointer-events-none z-10"
                    style={{ left: `${(hoverTime / 24) * 100}%`, top: '-45px', transform: 'translateX(-50%)' }}
                  >
                    <p className="font-bold border-b border-white/20 pb-1 mb-1 text-white">{getTimeFromHour(hoverTime)}</p>
                    <p className="text-yellow-400">Sun: {Math.round(timelineData[Math.floor(hoverTime * 4)]?.sunAlt || 0)}°</p>
                    <p className="text-slate-300">Moon: {Math.round(timelineData[Math.floor(hoverTime * 4)]?.moonAlt || 0)}°</p>
                    <p className="text-blue-400">Tide: {((timelineData[Math.floor(hoverTime * 4)]?.tide || 0) + 1.2).toFixed(2)}m</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <div className="w-3 h-0.5 bg-yellow-400"></div> Sun Altitude
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <div className="w-3 h-0.5 border-dashed" style={{ borderTop: '1px dashed #94a3b8' }}></div> Moon Altitude
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <div className="w-3 h-2 bg-blue-500/30"></div> Tidal Range
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <div className="w-3 h-2 bg-orange-400/30"></div> Golden Hour
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <div className="w-3 h-2 bg-blue-400/30"></div> Blue Hour
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
                <h3 className="text-sm font-bold text-white/60 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Sky Insight
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">{insight}</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
                <h3 className="text-sm font-bold text-white/60 mb-3 flex items-center gap-2">
                  <Telescope className="w-4 h-4" /> Best Observation Window
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {moonPhaseData.illumination < 30
                    ? `Optimal stargazing between 21:00 and 04:00. The Moon will be below the horizon, providing excellent dark sky conditions for deep-sky objects.`
                    : `Moon at ${moonPhaseData.illumination.toFixed(0)}% illumination may affect visibility of fainter objects. Best viewing during moonset (${moonTimes.moonset || 'N/A'}).`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
            <h3 className="text-sm font-bold text-white/60 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" /> Currently Visible
            </h3>
            <div className="space-y-2">
              {visiblePlanets.length > 0 ? visiblePlanets.slice(0, 5).map((body) => (
                <div key={body.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                    <div>
                      <p className="text-sm font-semibold text-white">{body.name}</p>
                      <p className="text-xs text-white/50">{body.constellation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{body.altitude}°</p>
                    <p className="text-xs text-white/50">Mag: {body.magnitude.toFixed(1)}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-white/50 text-sm">
                  No planets visible at this time
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
            <h3 className="text-sm font-bold text-white/60 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" /> Constellations Tonight
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {constellations.slice(0, 6).map((constel) => (
                <span key={constel} className="px-3 py-1 bg-slate-700/40 text-xs text-white/80 rounded-full border border-white/10">
                  {constel}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-2">
              Best viewing: 21:00 - 03:00 • From Manila ({MANILA.lat}°N, {MANILA.lon}°E)
            </p>
          </div>
        </div>

        <div className="mt-6 bg-slate-800/50 rounded-xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white/60 mb-4">Daily Ephemeris for Manila</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 px-3 text-white/60 font-medium">Body</th>
                  <th className="py-2 px-3 text-white/60 font-medium">Rise</th>
                  <th className="py-2 px-3 text-white/60 font-medium">Transit</th>
                  <th className="py-2 px-3 text-white/60 font-medium">Set</th>
                  <th className="py-2 px-3 text-white/60 font-medium">Alt</th>
                  <th className="py-2 px-3 text-white/60 font-medium">Mag</th>
                </tr>
              </thead>
              <tbody>
                {ephemeris.map((row) => (
                  <tr key={row.body} className="border-b border-white/5">
                    <td className={`py-2 px-3 font-medium ${row.color}`}>{row.body}</td>
                    <td className="py-2 px-3 text-white/70">{row.rise}</td>
                    <td className="py-2 px-3 text-white/70">{row.transit}</td>
                    <td className="py-2 px-3 text-white/70">{row.set}</td>
                    <td className="py-2 px-3 text-white/70">{row.altitude > 0 ? `${row.altitude}°` : '—'}</td>
                    <td className="py-2 px-3 text-white/70">{row.magnitude}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-white/40 mt-3">
            Times in PST (UTC+8) • Altitudes at transit • Ephemeris computed for Manila ({MANILA.lat}°N, {MANILA.lon}°E)
          </p>
        </div>

        <div className="mt-4 bg-slate-800/30 rounded-lg p-4 border border-white/5">
          <div className="flex flex-wrap gap-6 text-xs text-white/50">
            <div>
              <span className="text-white/70 font-medium">Sunrise:</span> {sunTimes.sunrise || '--:--'}
            </div>
            <div>
              <span className="text-white/70 font-medium">Sunset:</span> {sunTimes.sunset || '--:--'}
            </div>
            <div>
              <span className="text-white/70 font-medium">Moonrise:</span> {moonTimes.moonrise || '--:--'}
            </div>
            <div>
              <span className="text-white/70 font-medium">Moonset:</span> {moonTimes.moonset || '--:--'}
            </div>
            <div>
              <span className="text-white/70 font-medium">Civil Twilight:</span> {sunTimes.civilTwilightStart || '--:--'} - {sunTimes.civilTwilightEnd || '--:--'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
