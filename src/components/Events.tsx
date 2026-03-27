import React, { useState } from "react";

const weatherEvents: BulletinItem[] = [
    { id: 1, cat: "REGIONAL", tag: "HEAT", title: "Cagayan Valley Heat Surge", detail: "Daytime temperatures hitting 38°C in Tuguegarao. Health officials urge residents to stay hydrated and avoid prolonged sun exposure. Heat index advisory remains in effect until March 30.", date: "15", mo: "MAR", color: "bg-orange-500", live: true, img: "https://picsum.photos/seed/heat/400/300" },
    { id: 2, cat: "NATIONAL", tag: "MONSOON", title: "Northeast Monsoon (Amihan)", detail: "Light rains expected over Metro Manila and Eastern Luzon this week. Farmers advised to prepare for cooler temperatures and occasional gusty winds.", date: "15", mo: "MAR", color: "bg-blue-500", live: false, img: "https://picsum.photos/seed/rain/400/300" },
    { id: 3, cat: "CLIMATE", tag: "ENSO", title: "La Niña Episode Ends", detail: "PAGASA downgrades status to ENSO-Neutral. Climate patterns expected to normalize over the next 3-6 months.", date: "09", mo: "MAR", color: "bg-teal-500", live: false, img: "https://picsum.photos/seed/climate/400/300" },
    { id: 4, cat: "WARNING", tag: "DROUGHT", title: "Angat Rainfall Deficit", detail: "20-70mm below normal rainfall recorded in Central Luzon basin. Water authorities implementing conservation measures.", date: "14", mo: "MAR", color: "bg-red-500", live: true, img: "https://picsum.photos/seed/drought/400/300" }
];

const astroEvents: BulletinItem[] = [
    { id: 5, cat: "ASTRONOMY", tag: "ECLIPSE", title: "Total Lunar Eclipse Recap", detail: "Spectacular Blood Moon captured by Manila Observatory telescopes. Next total lunar eclipse visible in Philippines: October 2027.", date: "03", mo: "MAR", color: "bg-purple-500", live: false, img: "https://picsum.photos/seed/eclipse/400/300" },
    { id: 6, cat: "SPACE", tag: "METEOR", title: "γ-Normid Meteor Shower", detail: "Peak activity expected tonight with up to 6 meteors per hour. Best viewing from dark-sky areas away from city lights.", date: "15", mo: "MAR", color: "bg-indigo-500", live: true, img: "https://picsum.photos/seed/meteor/400/300" },
    { id: 7, cat: "EQUINOX", tag: "SEASON", title: "March Vernal Equinox", detail: "Equal day and night length across the Philippines on March 20, 2026 at 10:46 PM PHT. Signifies astronomical start of spring.", date: "20", mo: "MAR", color: "bg-green-500", live: false, img: "https://picsum.photos/seed/equinox/400/300" },
    { id: 8, cat: "PLANETARY", tag: "VENUS", title: "Moon-Venus Conjunction", detail: "Close approach visible low on western horizon shortly after sunset. Brilliant Venus shines at magnitude -4.1.", date: "20", mo: "MAR", color: "bg-yellow-500", live: false, img: "https://picsum.photos/seed/venus/400/300" }
];

const govNews: BulletinItem[] = [
    { id: 9, cat: "POLICY", tag: "GRANT", title: "New Climate Adaptation Grant", detail: "DOST announces PHP 500M fund for local government units to build resilient storm shelters and early warning systems.", date: "12", mo: "MAR", color: "bg-emerald-500", live: false, img: "https://picsum.photos/seed/policy/400/300" },
    { id: 10, cat: "INFRA", tag: "RADAR", title: "Radar Station #14 Launch", detail: "New Doppler radar in Catanduanes now operational. Improves typhoon tracking accuracy for Eastern seaboard by 40%.", date: "14", mo: "MAR", color: "bg-cyan-500", live: true, img: "https://picsum.photos/seed/radar/400/300" },
    { id: 11, cat: "AGENCY", tag: "EDU", title: "PAGASA-DEPED Partnership", detail: "Standardized weather safety curriculum to be integrated into K-12 Science modules by June 2026.", date: "10", mo: "MAR", color: "bg-blue-500", live: false, img: "https://picsum.photos/seed/education/400/300" },
    { id: 12, cat: "NOTICE", tag: "SUMMIT", title: "Annual Scientific Summit", detail: "Registration now open for 2026 National Meteorological Convention in Pasay City. Abstract submission deadline: April 15.", date: "05", mo: "MAR", color: "bg-violet-500", live: false, img: "https://picsum.photos/seed/summit/400/300" },
    { id: 13, cat: "HIRING", tag: "LICENSURE", title: "Meteorologist Licensure Exam", detail: "PRC announces March 2026 Board Exam results. National passing rate: 84%. Topnotcher: Juan dela Cruz, Manila.", date: "15", mo: "MAR", color: "bg-amber-500", live: true, img: "https://picsum.photos/seed/licensure/400/300" }
];

const agencyEvents: BulletinItem[] = [
    { id: 14, cat: "EVENT", tag: "OPEN DAY", title: "Manila Observatory Open Day", detail: "Free public tours of the Manila Observatory telescope facilities. Includes live solar viewing and climate exhibit. Pre-registration required.", date: "22", mo: "MAR", color: "bg-rose-500", live: true, img: "https://picsum.photos/seed/observatory/400/300" },
    { id: 15, cat: "WEBINAR", tag: "TRAINING", title: "Weather Station Workshop", detail: "Online training on operating and maintaining automated weather stations. For barangay disaster risk coordinators.", date: "28", mo: "MAR", color: "bg-sky-500", live: false, img: "https://picsum.photos/seed/workshop/400/300" },
    { id: 16, cat: "PUBLIC", tag: "FORUM", title: "Climate Forum 2026", detail: "Annual public forum on climate change impacts and adaptation strategies. Feature: Typhoon preparation guidelines update.", date: "05", mo: "APR", color: "bg-teal-500", live: false, img: "https://picsum.photos/seed/forum/400/300" },
    { id: 17, cat: "AWARD", tag: "RECOGNITION", title: "Outstanding Weather Observer", detail: "PAGASA recognizes top 10 volunteer weather observers nationwide. Ceremony at PAGASA Central Office, Quezon City.", date: "15", mo: "APR", color: "bg-yellow-500", live: false, img: "https://picsum.photos/seed/award/400/300" },
    { id: 18, cat: "PARTNER", tag: "DOST", title: "Science & Technology Week", detail: "PAGASA participation in DOST's annual S&T Week celebration. Weather simulation demos and educational games for kids.", date: "20", mo: "APR", color: "bg-blue-500", live: false, img: "https://picsum.photos/seed/dost/400/300" }
];

interface BulletinItem {
    id: number;
    cat: string;
    tag?: string;
    title: string;
    detail: string;
    date: string;
    mo: string;
    color: string;
    live: boolean;
    img: string;
}

const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: string) => {
    if (ref.current) {
        const move = direction === 'left' ? -432 : 432;
        ref.current.scrollBy({ left: move, behavior: 'smooth' });
    }
};

export default function Articles() {
    const scrollRef1 = React.useRef<HTMLDivElement | null>(null);
    const scrollRef2 = React.useRef<HTMLDivElement | null>(null);
    const scrollRef3 = React.useRef<HTMLDivElement | null>(null);
    const scrollRef4 = React.useRef<HTMLDivElement | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<BulletinItem | null>(null);

    return (
        <>
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { scrollbar-width: none; }`}</style>
            
            {selectedArticle && (
                <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
            )}
            
            <div className="space-y-12">
                <CarouselRow title="Weather & Climate Advisories" items={weatherEvents} rowRef={scrollRef1} onItemClick={setSelectedArticle} />
                <CarouselRow title="Astronomical Phenomena" items={astroEvents} rowRef={scrollRef2} onItemClick={setSelectedArticle} />
                <CarouselRow title="Government News" items={govNews} rowRef={scrollRef3} onItemClick={setSelectedArticle} />
                <CarouselRow title="Agency Events & Announcements" items={agencyEvents} rowRef={scrollRef4} onItemClick={setSelectedArticle} />
            </div>
        </>
    );
}

function ArticleModal({ article, onClose }: { article: BulletinItem; onClose: () => void }) {
    return (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div 
                className="relative bg-dark-azure border border-white/20 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative h-48 md:h-64 overflow-hidden rounded-t-xl">
                    <img 
                        src={article.img.replace('400/300', '800/500')} 
                        className="w-full h-full object-cover"
                        alt={article.title}
                    />
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`${article.color} text-white text-xs font-bold px-3 py-1 rounded`}>
                            {article.cat}
                        </span>
                        {article.tag && (
                            <span className="text-white/50 text-xs font-medium">
                                {article.tag}
                            </span>
                        )}
                        {article.live && (
                            <span className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                                <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
                                LIVE UPDATE
                            </span>
                        )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">{article.title}</h2>
                    
                    <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{article.mo} {article.date}, 2026</span>
                    </div>
                    
                    <p className="text-white/80 leading-relaxed text-base">{article.detail}</p>
                    <p className="text-white/60 leading-relaxed mt-4">
                        For more information, visit the official PAGASA website or contact your local weather station.
                    </p>
                    
                    <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
                        <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                            Share Article
                        </button>
                        <button 
                            onClick={onClose}
                            className="flex-1 bg-grey-azure hover:bg-grey-azure/80 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CarouselRow({ title, items, rowRef, onItemClick }: { title: string; items: BulletinItem[]; rowRef: React.RefObject<HTMLDivElement | null>; onItemClick: (item: BulletinItem) => void }) {
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        if (rowRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
            const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
            setScrollProgress(progress);
        }
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex items-end justify-between mb-6 px-1">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase leading-none">{title}</h3>
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-grey-azure transition-all duration-300 rounded-full" 
                            style={{ width: `${scrollProgress}%` }}
                        />
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <button 
                        onClick={() => scroll(rowRef, 'left')} 
                        className="w-8 h-8 flex items-center justify-center rounded bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button 
                        onClick={() => scroll(rowRef, 'right')} 
                        className="w-8 h-8 flex items-center justify-center rounded bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>

            <div 
                ref={rowRef} 
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 ms-1 -mx-6 px-6"
            >
                {items.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => onItemClick(item)}
                        className="flex-none w-[280px] md:w-[400px] snap-start bg-white/10 border border-white/10 rounded-lg overflow-hidden flex h-28 md:h-32 shadow-md hover:bg-white/15 hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className={`${item.color} w-[60px] md:w-[75px] flex flex-col items-center justify-center text-white flex-shrink-0`}>
                            <span className="text-[9px] font-bold opacity-70 uppercase">{item.mo}</span>
                            <span className="text-xl md:text-3xl font-black">{item.date}</span>
                        </div>
                        
                        <div className="w-[70px] md:w-[100px] flex-shrink-0 relative overflow-hidden bg-slate-800">
                            <img 
                                src={item.img} 
                                className="absolute inset-0 w-full h-full object-cover"
                                alt={item.title}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?grayscale';
                                }}
                            />
                        </div>

                        <div className="p-3 flex flex-col justify-center flex-grow min-w-0 bg-dark-azure/50">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded text-white ${item.color}`}>
                                    {item.cat}
                                </span>
                                {item.live && (
                                    <span className="flex items-center gap-1 text-[8px] text-rose-400 font-bold">
                                        <span className="w-1 h-1 bg-rose-400 rounded-full animate-pulse"></span>
                                        LIVE
                                    </span>
                                )}
                            </div>
                            <h4 className="text-xs md:text-sm font-semibold text-white leading-tight mb-0.5 truncate group-hover:text-blue-200 transition-colors">
                                {item.title}
                            </h4>
                            <p className="text-[9px] md:text-[10px] text-white/50 line-clamp-2 leading-tight">
                                {item.detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
