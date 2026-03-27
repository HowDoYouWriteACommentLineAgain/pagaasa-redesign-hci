import { useEffect } from "react";
import AgriWeather from "./components/AgriWeather";
import Astronomy from "./components/Astronomy";
import Events from "./components/Events";
import FloodBasins from "./components/FloodBasins";
import FloodBulletins from "./components/FloodBulletins";
import Navigation from "./components/Navigation";
import Panahon from "./components/Panahon";
import WeatherHero from "./components/WeatherHero";

function SectionHeading({
  icon,
  title,
  subtitle,
  dark = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div
        className={`p-2.5 rounded-lg shadow-md ${dark ? "bg-white/10" : "bg-dark-azure"}`}
      >
        {icon}
      </div>
      <div>
        <h2
          className={`text-xl md:text-2xl font-bold ${dark ? "text-white" : "text-dark-azure"}`}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={`text-xs ${dark ? "text-white/50" : "text-slate-400"}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw) return;
    const id = raw === "astrology" ? "astronomy" : raw;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      <WeatherHero />

      {/* SECTION: Forecast — Live Weather Map */}
      <section
        id="forecast"
        className="bg-grey-azure py-12 md:py-16 scroll-mt-[4.5rem]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            }
            title="Forecast"
            subtitle="Live weather map — interactive data from PAGASA"
            dark={true}
          />
          <Panahon />
        </div>
      </section>

      {/* SECTION: Astronomy (nav: ASTRONOMY) — astronomical diary */}
      <section
        id="astronomy"
        className="bg-slate-900 py-12 md:py-16 scroll-mt-[4.5rem] border-y border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading
            dark
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l5 5 2 7 5-5 7-2-5-5-5-5z"/>
              </svg>
            }
            title="Astronomy & Sky Diary"
            subtitle="Today's celestial events and upcoming astronomical phenomena"
          />
          <Astronomy />
        </div>
      </section>

      {/* SECTION: Advisory — basin monitoring (nav: ADVISORY) */}
      <section id="advisory" className="bg-white py-12 md:py-16 scroll-mt-[4.5rem] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            }
            title="Advisory"
            subtitle="River basin levels and flood-watch status for planning and response"
          />
          <FloodBasins />
        </div>
      </section>

      {/* SECTION: Bulletin — flood bulletins (nav: BULLETIN) */}
      <section
        id="bulletin"
        className="bg-amber-50/60 py-12 md:py-16 scroll-mt-[4.5rem] border-y border-amber-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            }
            title="Bulletin"
            subtitle="Issued flood bulletins and imminent-threat notices by basin"
          />
          <FloodBulletins />
        </div>
      </section>

      {/* SECTION: Agri Weather */}
      <section className="bg-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22V8"></path>
                <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
                <path d="M8 8a4 4 0 1 1 8 0"></path>
              </svg>
            }
            title="Agri Weather"
            subtitle="Helping farmers and agricultural centers make informed decisions"
          />
          <AgriWeather />
        </div>
      </section>

      {/* SECTION: News & Events */}
      <section className="bg-dark-azure py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading
            dark
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
  );
}

export default App;
