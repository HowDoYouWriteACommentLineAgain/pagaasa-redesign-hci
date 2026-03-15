import React, { useState } from "react";

    const weatherEvents: BulletinItem[] = [
        { id: 1, cat: "REGIONAL", tag: "AMAYAN", title: "Cagayan Valley Heat Surge", detail: "Daytime temperatures hitting 38°C. Stay hydrated.", date: "15", mo: "MAR", color: "bg-orange-600", live: true, img: "https://images.unsplash.com/photo-1504333638930-c8787321eee0?auto=format&fit=crop&q=80&w=150" },
        { id: 2, cat: "NATIONAL", tag: "MONSOON", title: "Northeast Monsoon (Amihan)", detail: "Light rains over Metro Manila & Eastern Luzon.", date: "15", mo: "MAR", color: "bg-blue-600", live: false, img: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=150" },
        { id: 3, cat: "CLIMATE", tag: "ENS0", title: "La Niña Episode Ends", detail: "PAGASA lowers status to ENSO-Neutral levels.", date: "09", mo: "MAR", color: "bg-emerald-600", live: false, img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=150" },
        { id: 4, cat: "WARNING", tag: "DROUGHT", title: "Angat Rainfall Deficit", detail: "20-70mm drop expected in Central Luzon basin.", date: "14", mo: "MAR", color: "bg-rose-700", live: true, img: "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&q=80&w=150" }
    ];

    const astroEvents: BulletinItem[] = [
        { id: 5, cat: "ASTRONOMY", tag: "ECLIPSE", title: "Total Lunar Eclipse Recap", detail: "Last photos of the Blood Moon from Manila Observatory.", date: "03", mo: "MAR", color: "bg-purple-700", live: false, img: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=150" },
        { id: 6, cat: "SPACE", tag: "METEOR", title: "γ-Normid Meteor Shower", detail: "Peak activity visible tonight in dark-sky areas.", date: "15", mo: "MAR", color: "bg-indigo-600", live: true, img: "https://images.unsplash.com/photo-1538370965046-73c03673c163?auto=format&fit=crop&q=80&w=150" },
        { id: 7, cat: "EQUINOX", tag: "SEASON", title: "March Vernal Equinox", detail: "Equal day and night across PH on March 20, 10:46 PM.", date: "20", mo: "MAR", color: "bg-teal-600", live: false, img: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&q=80&w=150" },
        { id: 8, cat: "PLANETARY", tag: "VENUS", title: "Moon-Venus Conjunction", detail: "Visible low in western horizon shortly after sunset.", date: "20", mo: "MAR", color: "bg-pink-600", live: false, img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=150" }
    ];

    const govNews: BulletinItem[] = [
    { 
        id: 9, 
        cat: "POLICY", 
        title: "New Climate Adaptation Grant", 
        detail: "DOST announces PHP 500M fund for local government units to build resilient storm shelters.", 
        date: "12", 
        mo: "MAR", 
        color: "bg-slate-700", 
        live: false, 
        img: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=150" 
    },
    { 
        id: 10, 
        cat: "INFRA", 
        title: "Radar Station #14 Launch", 
        detail: "New Doppler radar in Catanduanes completed; increases tracking accuracy for Eastern seaboard.", 
        date: "14", 
        mo: "MAR", 
        color: "bg-cyan-700", 
        live: true, 
        img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=150" 
    },
    { 
        id: 11, 
        cat: "AGENCY", 
        title: "PAGASA-DEPED Partnership", 
        detail: "Standardized weather safety curriculum to be integrated into K-12 Science modules by June.", 
        date: "10", 
        mo: "MAR", 
        color: "bg-indigo-800", 
        live: false, 
        img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=150" 
    },
    { 
        id: 12, 
        cat: "NOTICE", 
        title: "Annual Scientific Summit", 
        detail: "Registration opens for the 2026 National Meteorological Convention in Pasay City.", 
        date: "05", 
        mo: "MAR", 
        color: "bg-emerald-800", 
        live: false, 
        img: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=150" 
    },
    { 
        id: 13, 
        cat: "HIRING", 
        title: "Meteorologist Licensure", 
        detail: "PRC announces top performers for the March 2026 Board Exam; 84% national passing rate.", 
        date: "15", 
        mo: "MAR", 
        color: "bg-slate-600", 
        live: true, 
        img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=150" 
    }
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

// Fixed the scroll function to match your desktop card width (420px + gap)
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

    // ... (your weatherEvents, astroEvents, and govNews data arrays)

    return (
        <section className="py-12 bg-slate-50 px-6">
            <div className="max-w-7xl mx-auto space-y-20">
                <CarouselRow title="Weather & Climate Advisories" items={weatherEvents} rowRef={scrollRef1} />
                <CarouselRow title="Astronomical Phenomena" items={astroEvents} rowRef={scrollRef2} />
                <CarouselRow title="Government News" items={govNews} rowRef={scrollRef3} />
            </div>
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { scrollbar-width: none; }`}</style>
        </section>
    );
}

function CarouselRow({ title, items, rowRef }: { title: string, items: BulletinItem[], rowRef: React.RefObject<HTMLDivElement | null> }) {
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
            {/* Row Header with Navigation */}
            <div className="flex items-end justify-between mb-6 px-1">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase leading-none">{title}</h3>
                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-600 transition-all duration-300" 
                            style={{ width: `${scrollProgress}%` }}
                        />
                    </div>
                </div>

                {/* THE PULSATING PILL (Desktop Only) */}
                <div className="hidden md:block relative">
                    <div className="absolute -inset-1 bg-blue-400/20 rounded-full animate-pulse blur-sm"></div>
                    <div className="relative flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
                        <button 
                            onClick={() => scroll(rowRef, 'left')} 
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-600 transition-colors active:scale-90"
                        >
                            <span className="font-bold text-lg">←</span>
                        </button>
                        <div className="w-[1px] h-5 bg-slate-200 mx-1"></div>
                        <button 
                            onClick={() => scroll(rowRef, 'right')} 
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-600 transition-colors active:scale-90"
                        >
                            <span className="font-bold text-lg">→</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Row */}
            <div 
                ref={rowRef} 
                onScroll={handleScroll}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 ms-1 -mx-6 px-6"
            >
                {items.map(item => (
                    <div 
                        key={item.id} 
                        className="flex-none w-[280px] md:w-[420px] snap-start bg-white rounded-2xl border border-slate-200 overflow-hidden flex h-28 md:h-32 shadow-sm"
                    >
                        {/* 1. DATE Block */}
                        <div className={`${item.color} w-[60px] md:w-[80px] flex flex-col items-center justify-center text-white flex-shrink-0`}>
                            <span className="text-[9px] font-bold opacity-80 uppercase leading-none">{item.mo}</span>
                            <span className="text-xl md:text-3xl font-black leading-tight">{item.date}</span>
                        </div>
                        
                        {/* 2. THUMBNAIL Block */}
                        <div className="w-[80px] md:w-[120px] flex-shrink-0 relative overflow-hidden border-r border-slate-50">
                            <img src={item.img} className="absolute inset-0 w-full h-full object-cover" alt="thumb" />
                        </div>

                        {/* 3. TEXT Block */}
                        <div className="p-3 flex flex-col justify-center flex-grow min-w-0 bg-white">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-sm inline-block w-fit text-white ${item.color} uppercase`}>
                                    {item.cat}
                                </span>
                                {item.live && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>}
                            </div>
                            <h4 className="text-[12px] md:text-sm font-bold text-slate-800 leading-tight mb-1 truncate">
                                {item.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 line-clamp-2 leading-snug">
                                {item.detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}