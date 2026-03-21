import Events from './components/Events'
import FloodBasins from './components/FloodBasins'
import FloodBulletins from './components/FloodBulletins'
import Navigation from './components/Navigation'
import Panahon from './components/Panahon'
import WeatherHero from './components/WeatherHero'

function SectionHeading({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle?: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 rounded-xl bg-grey-azure shadow-lg">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-dark-azure tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-grey-azure/30 to-transparent ml-4" />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      <WeatherHero />
      
      {/* SECTION: Weather Map */}
      <section className="bg-grey-azure py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            }
            title="Live Weather Map"
            subtitle="Interactive data from PAGASA"
          />
          <Panahon />
        </div>
      </section>

      {/* SECTION: Flood Advisories */}
      <section className="bg-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            }
            title="Flood Advisories"
            subtitle="Real-time basin monitoring and flood warnings"
          />
          <FloodBulletins />
        </div>
      </section>

      {/* SECTION: Basin Forecast Table */}
      <section className="bg-slate-100 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FloodBasins />
        </div>
      </section>

      {/* SECTION: News & Events */}
      <section className="bg-dark-azure py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                <path d="M18 14h-8"></path>
                <path d="M15 18h-5"></path>
                <path d="M10 6h8v4h-8V6Z"></path>
              </svg>
            }
            title="News & Updates"
            subtitle="Weather alerts, astronomical events, and agency announcements"
          />
          <Events />
        </div>
      </section>
    </div>
  )
}

export default App
