const HeroToMapTransition = () => {
  return (
    <div className="relative w-full">
      {/* GRADIENT SCRIM 
          - Fades from transparent to the Map's background color (#1a1a1a or similar)
          - Use 'pointer-events-none' so it doesn't interfere with clicks
      */}
      <div 
        className="absolute bottom-0 left-0 w-full h-64 z-10 flex flex-col justify-end pb-12"
        style={{
          background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%)'
        }}
      >
        {/* NARRATIVE TEXT */}
        <div className="container mx-auto px-6 text-center animate-fade-in-up">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-900/30 border border-blue-500/30 rounded-full">
            Live Monitoring
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">
            Philippine Area of <span className="font-semibold text-blue-500">Responsibility</span>
          </h2>
          <p className="mt-2 text-gray-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Real-time satellite data and radar imagery across the archipelago. 
            Scroll to explore interactive layers.
          </p>
          
          {/* VISUAL INDICATOR (Optional) */}
          <div className="mt-6 flex justify-center">
            <div className="w-px h-12 bg-linear-to-b from-blue-500 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroToMapTransition;