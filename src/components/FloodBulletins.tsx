interface FloodBulletin {
  id: number;
  type: "imminent" | "warning" | "watch";
  basin: string;
  message: string;
  time: string;
}

export default function FloodBulletins() {
  const bulletins: FloodBulletin[] = [
    { id: 1, type: "imminent", basin: "Cagayan Basin", message: "FLASH FLOOD THREAT - Water levels rising rapidly. Evacuate low-lying areas immediately.", time: "2:45 PM" },
    { id: 2, type: "warning", basin: "Pasig-Marikina", message: "FLOODING LIKELY - Minor to moderate flooding in tributaries. Avoid flood-prone roads.", time: "1:30 PM" },
  ];

  return (
    <div className="space-y-3">
      {bulletins.map((bulletin) => (
        <div
          key={bulletin.id}
          className={`px-6 py-4 rounded-xl border-l-4 shadow-lg ${
            bulletin.type === "imminent" 
              ? "bg-red-50 border-l-red-600" 
              : "bg-amber-50 border-l-amber-500"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 p-1.5 rounded-full ${
              bulletin.type === "imminent" ? "bg-red-600" : "bg-amber-500"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                  bulletin.type === "imminent" 
                    ? "bg-red-600 text-white" 
                    : "bg-amber-500 text-white"
                }`}>
                  {bulletin.type === "imminent" ? "Imminent Flooding" : "Flood Warning"}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{bulletin.basin}</span>
                <span className="text-[9px] text-slate-300 ml-auto">{bulletin.time}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{bulletin.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
