import { useState } from 'react';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-dark-azure px-4 md:px-6 py-4 z-50 relative w-full">
      <div className="flex justify-between items-center w-full">
        
        {/* Logo Section */}
        <div id="logo_section" className="flex items-center gap-3 md:gap-5">
          <img src="images/logo.png" width={50} alt="PAGASA LOGO" className="md:w-17.5 shrink-0" />
          <div className="text-white">
            <h3 className="font-extralight text-[10px] md:text-[12px] leading-tight max-w-40 md:max-w-60">
              Department of Science and Technology
            </h3>
            <h2 className="font-bold text-xl md:text-2xl leading-none">PAGASA</h2>
          </div>
        </div>

        {/* Hamburger Button (Mobile Only) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white md:hidden p-2 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>

        {/* Links Section */}
        <div id="links" className={`
          absolute md:static top-full left-0 w-full md:w-auto 
          bg-dark-azure md:bg-transparent transition-all duration-300 ease-in-out
          flex flex-col md:flex-row md:items-center gap-2 md:gap-0
          px-5 md:px-0 py-5 md:py-0
          ${isOpen ? 'block opacity-100' : 'hidden md:flex opacity-0 md:opacity-100'}
          text-white text-lg md:text-xl font-light
        `}>
          {['HOME', 'FORECAST', 'ASTRONOMY', 'ADVISORY', 'BULLETIN'].map((link) => (
            <a 
              key={link} 
              href="#" 
              className="py-3 md:px-3 md:py-1 hover:bg-white/10 md:hover:bg-transparent md:hover:opacity-80 border-b border-white/10 md:border-none"
              onClick={()=>setIsOpen(p=>!p)}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;