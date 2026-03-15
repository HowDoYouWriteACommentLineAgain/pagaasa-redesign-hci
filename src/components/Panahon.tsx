import { useState, useRef } from "react";

function Panahon() {
  const [isLocked, setIsLocked] = useState(true);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const handleUnlock = () => {
    setIsLocked(false);
    
    // This snaps the screen to the map container
    // 'nearest' or 'center' ensures the button isn't obscured
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  };

  return (
    <section className="relative w-full bg-grey-azure overflow-x-hidden">
      {/* MOBILE RE-LOCK BUTTON */}
      {!isLocked && (
        <button 
          onClick={() => setIsLocked(true)}
          className="fixed bottom-6 right-6 z-[100] bg-red-600 text-white px-5 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 border-2 border-white/20 active:scale-95 transition-transform md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Finish Exploring
        </button>
      )}

      <div 
        className="flex flex-col items-center w-full px-4 py-8 md:px-8" 
        onMouseLeave={() => setIsLocked(true)}
      >
        {/* Added ref and scroll-margin-top for the snap behavior */}
        <div 
          ref={mapSectionRef} 
          className="relative w-full max-w-7xl scroll-mt-10"
        >
          {/* THE OVERLAY */}
          {isLocked && (
            <div 
              onClick={handleUnlock}
              className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer backdrop-blur-[2px] bg-slate-900/10"
            >
              <div className="bg-gray-800/95 text-white px-8 py-4 rounded-full shadow-2xl border border-white/20 text-center animate-in fade-in zoom-in duration-300">
                <p className="text-xl font-black tracking-widest uppercase">Tap to Unlock Map</p>
                <p className="text-xs opacity-60 mt-1">Interaction mode will be enabled</p>
              </div>
            </div>
          )}

          {/* IFRAME */}
          <iframe 
            className={`w-full h-[500px] md:h-[640px] rounded-2xl border-4 border-[#1a2e35] shadow-2xl bg-white transition-all duration-500 ${
              isLocked ? 'pointer-events-none opacity-80 grayscale-[20%]' : 'pointer-events-auto opacity-100 grayscale-0'
            }`}
            src="https://www.panahon.gov.ph/" 
            title="PAGASA Live Site"
          />
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-6 text-center pb-10">
          <p className="text-xs md:text-sm text-slate-400">
            © 2026 ECMWF Data | © PANaHON PAGASA
          </p>
        </div>
      </div>
    </section>
  );
}

export default Panahon;