import { useState } from 'react';

/** Put `public/images/Manila_skyline_day.jpg` in your project for a local hero; otherwise this URL loads. */
const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1519501025268-2ba15a9b7e9a?auto=format&fit=crop&q=80&w=1920';

function WeatherHero() {
  const [showLocations, setShowLocations] = useState(false);
  const localHero = `${import.meta.env.BASE_URL}images/Manila_skyline_day.jpg`;

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

      {/* MOBILE: py-10 makes the BG wrap tightly around the blocks.
          DESKTOP: md:ms-20 keeps the original side-aligned look.
      */}
      <div className="relative z-20 w-full max-w-2xl px-5 py-10 md:py-0 md:ms-20 flex flex-col gap-2 md:gap-3">
        
        {/* 1. LOCATION & DROPDOWN */}
        <div className="relative">
          <article className="flex items-center justify-between bg-dark-azure-translucent rounded-xl px-4 py-2 text-white border border-white/10">
            <div className="flex items-center gap-2">
              {/* Proper Map Pin Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <h2 className="text-base md:text-2xl font-bold tracking-tight">Luneta, Metro Manila</h2>
            </div>
            <button 
              onClick={() => setShowLocations(!showLocations)}
              className="p-1 hover:bg-white/10 rounded transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </article>

          {showLocations && (
            <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-white/10 rounded-lg shadow-2xl z-50">
              {['Luneta', 'Kamuning', 'Quezon City'].map((loc) => (
                <button 
                  key={loc}
                  className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-dark-azure border-b border-white/5 last:border-0"
                  onClick={() => setShowLocations(false)}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. MAIN WEATHER */}
        <article className="bg-grey-azure-translucent rounded-xl px-4 py-3 md:py-5 text-white border border-white/5">
          <p className="text-xl md:text-3xl font-black leading-tight">Occasional Rains</p>
          <div className="flex items-center gap-2 text-xs md:text-lg opacity-90 font-medium mt-1">
            <span>H: 31°C / L: 26°C</span>
            <span className="opacity-30">•</span>
            <span className="font-normal">Sat, Feb 14</span>
          </div>
        </article>

        {/* 3. BULLETIN */}
        <article className="bg-gray-500/50 rounded-lg px-4 py-1.5 text-white border border-white/5">
          <p className="text-[10px] md:text-sm leading-tight">
            <b className="opacity-70 uppercase text-[9px] mr-1">Bulletin:</b> 
            No Active Tropical Cyclone within the PAR
          </p>
        </article>

        {/* 4. ADVISORY */}
        <article className="bg-red-600/80 rounded-xl px-4 py-3 md:py-4 text-white shadow-xl">
          <p className="text-sm md:text-2xl leading-snug font-bold">
            <span className="font-black uppercase tracking-tighter bg-black/20 px-1.5 py-0.5 rounded mr-2 text-[9px] md:text-sm">Advisory</span> 
            GENERAL FLOOD WARNING IS IN EFFECT
          </p>
        </article>

      </div>
    </section>
  );
}

export default WeatherHero;