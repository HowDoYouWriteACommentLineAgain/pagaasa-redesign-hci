import { useState } from 'react';
import { sampleDays, locationList, baseBulletin, baseAdvisory } from '../data/weatherData';

/** Set to true to enable location dropdown, false to hide it */
const ENABLE_LOCATION_DROPDOWN = true;

function WeatherIcon({ type, className = '' }: { type: string; className?: string }) {
  switch (type) {
    case 'sun':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    case 'cloud-sun':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.947 12.65a4 4 0 10-5.925-4.128" />
          <path d="M13 22H7a5 5 0 1010 0" />
        </svg>
      );
    case 'cloud':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M17.5 19H9a7 7 0 116.71-9h1.79a4.5 4.5 0 110 9z" />
        </svg>
      );
    case 'cloud-rain':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M4 14.899A7 7 0 1116.89 8H18a5 5 0 010 10H6" />
          <path d="M8 19v2M12 19v2M16 19v2" />
        </svg>
      );
    case 'cloud-bolt':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M6 16.326A7 7 0 1117.73 8H20a5 5 0 01.5 9.917" />
          <path d="M13 12l-3 5h4l-3 5" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" />
        </svg>
      );
  }
}

function WeatherHero() {
  const [selectedLocation, setSelectedLocation] = useState('luneta');
  const [selectedDayIndex] = useState(0);
  const [showLocations, setShowLocations] = useState(false);

  const currentDay = sampleDays[selectedDayIndex];
  const locationData = currentDay.locations[selectedLocation];
  const condition = locationData.current.condition;

  const localHero = `${import.meta.env.BASE_URL}images/Manila_skyline_day.jpg`;
  const HERO_FALLBACK = 'https://images.unsplash.com/photo-1519501025268-2ba15a9b7e9a?auto=format&fit=crop&q=80&w=1920';

  return (
    <section 
      id="home"
      className="relative w-full h-auto md:h-[650px] flex items-center overflow-hidden scroll-mt-[4.5rem]"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.45) 55%, rgba(15,23,42,0.2) 100%), url(${localHero}), url(${HERO_FALLBACK})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-900/70 md:bg-linear-to-r md:from-slate-950/90 md:via-slate-900/40 md:to-transparent z-10" />

      <div className="relative z-20 w-full max-w-2xl px-5 py-10 md:py-0 md:ms-20 flex flex-col gap-2 md:gap-3">
        
        {/* 1. LOCATION & DROPDOWN */}
        <div className="relative">
          <article className="flex items-center justify-between bg-dark-azure-translucent rounded-xl px-4 py-2 text-white border border-white/10">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <h2 className="text-base md:text-2xl font-bold tracking-tight">
                {ENABLE_LOCATION_DROPDOWN ? (
                  <>
                    {locationData.name}, {locationData.region}
                  </>
                ) : (
                  'Luneta, Metro Manila'
                )}
              </h2>
            </div>
            {ENABLE_LOCATION_DROPDOWN && (
              <button 
                onClick={() => setShowLocations(!showLocations)}
                className="p-1 hover:bg-white/10 rounded transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
            )}
          </article>

          {ENABLE_LOCATION_DROPDOWN && showLocations && (
            <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-white/10 rounded-lg shadow-2xl z-50">
              {locationList.map((loc) => (
                <button 
                  key={loc.key}
                  className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-dark-azure border-b border-white/5 last:border-0"
                  onClick={() => { setSelectedLocation(loc.key); setShowLocations(false); }}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. MAIN WEATHER */}
        <article className="bg-grey-azure-translucent rounded-xl px-4 py-3 md:py-5 text-white border border-white/5">
          <div className="flex items-center gap-3">
            <WeatherIcon type={condition.icon} className="w-8 h-8 md:w-12 md:h-12 text-yellow-300" />
            <div>
              <p className="text-xl md:text-3xl font-black leading-tight">{condition.condition}</p>
              <p className="text-2xl md:text-4xl font-black mt-0.5">{locationData.current.temp}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-lg opacity-90 font-medium mt-2">
            <span>H: {locationData.current.high}°C / L: {locationData.current.low}°C</span>
            <span className="opacity-30">•</span>
            <span className="font-normal">{currentDay.dayName}, {currentDay.date}</span>
          </div>
        </article>

        {/* 3. BULLETIN */}
        <article className="bg-gray-500/50 rounded-lg px-4 py-1.5 text-white border border-white/5">
          <p className="text-[10px] md:text-sm leading-tight">
            <b className="opacity-70 uppercase text-[9px] mr-1">Bulletin:</b> 
            {baseBulletin}
          </p>
        </article>

        {/* 4. ADVISORY */}
        <article className="bg-red-600/80 rounded-xl px-4 py-3 md:py-4 text-white shadow-xl">
          <p className="text-sm md:text-2xl leading-snug font-bold">
            <span className="font-black uppercase tracking-tighter bg-black/20 px-1.5 py-0.5 rounded mr-2 text-[9px] md:text-sm">Advisory</span> 
            {baseAdvisory}
          </p>
        </article>

      </div>
    </section>
  );
}

export default WeatherHero;
