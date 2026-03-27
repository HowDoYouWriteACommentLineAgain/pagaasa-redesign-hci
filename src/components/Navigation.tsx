import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  ['HOME', 'home'],
  ['FORECAST', 'forecast'],
  ['ASTROLOGY', 'astrology'],
  ['ADVISORY', 'advisory'],
  ['BULLETIN', 'bulletin'],
] as const;

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      try {
        window.history.pushState(null, '', `#${id}`);
      } catch {
        /* file:// or restricted contexts can throw */
      }
    }
  };

  return (
    <nav className={`sticky top-0 z-50 w-full bg-dark-azure px-4 md:px-6 shadow-md shadow-black/20 relative transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="flex justify-between items-center w-full">
        
        {/* Logo Section */}
        <a
          href="#home"
          id="logo_section"
          className="flex items-center gap-2 md:gap-5 shrink-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition-all duration-300"
          onClick={(e) => scrollToSection(e, 'home')}
        >
          <img 
            src="images/logo.png" 
            alt="PAGASA LOGO" 
            className={`shrink-0 transition-all duration-300 ${isScrolled ? 'w-8 md:w-12' : 'w-12 md:w-[50px]'}`} 
          />
          <div className="text-white text-left transition-all duration-300">
            <h3 className={`font-extralight text-white/80 transition-all duration-300 leading-tight ${isScrolled ? 'hidden' : 'text-[10px] md:text-[12px] max-w-40 md:max-w-60'}`}>
              Department of Science and Technology
            </h3>
            <h2 className={`font-bold text-white transition-all duration-300 ${isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
              PAGASA
            </h2>
          </div>
        </a>

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
          {NAV_ITEMS.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="py-3 md:px-3 md:py-1 hover:bg-white/10 md:hover:bg-transparent md:hover:underline md:underline-offset-4 border-b border-white/10 md:border-none text-white/95 hover:text-white"
              onClick={(e) => scrollToSection(e, id)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;