import { useState, useRef } from "react";

function Panahon() {
  const [isLocked, setIsLocked] = useState(true);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const handleUnlock = () => {
    setIsLocked(false);
    
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden">
      {!isLocked && (
        <button 
          onClick={() => setIsLocked(true)}
          className="fixed bottom-6 right-6 z-[100] bg-red-600 text-white px-5 py-3 rounded-lg shadow-xl font-bold flex items-center gap-2 md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Finish Exploring
        </button>
      )}

      <div 
        className="flex flex-col items-center w-full" 
        onMouseLeave={() => setIsLocked(true)}
      >
          <div 
            ref={mapSectionRef} 
            className="relative w-full md:scroll-mt-28 scroll-mt-10"
          >
          {isLocked && (
            <div 
              onClick={handleUnlock}
              className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer bg-slate-900/30 backdrop-blur-[2px]"
            >
              <div className="bg-dark-azure text-white px-8 py-4 rounded-lg shadow-xl border border-white/10 text-center">
                <p className="text-lg font-bold uppercase tracking-wide">Tap to Unlock Map</p>
                <p className="text-xs opacity-60 mt-1">Interaction mode will be enabled</p>
              </div>
            </div>
          )}

          <iframe 
            className={`w-full h-[450px] md:h-[600px] rounded-lg shadow-xl transition-all duration-500 ${
              isLocked 
                ? 'border-4 border-slate-700 pointer-events-none opacity-80 grayscale-[15%] grayscale' 
                : 'border-4 border-slate-600 pointer-events-auto opacity-100'
            }`}
            src="https://www.panahon.gov.ph/" 
            title="PAGASA Live Site"
          />
        </div>

        <div className="mt-6 text-center pb-4">
          <p className="text-[10px] text-white/30 font-medium">
            © 2026 ECMWF Data | © PANaHON PAGASA
          </p>
        </div>
      </div>
    </div>
  );
}

export default Panahon;
