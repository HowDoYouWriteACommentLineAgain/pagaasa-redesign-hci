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
    <div className="space-y-4">
      {bulletins.map((bulletin) => (
        <div
          key={bulletin.id}
          className={`px-5 py-4 rounded-lg border-l-4 border-r border-t border-b shadow-md transition-all hover:shadow-lg ${
            bulletin.type === "imminent" 
              ? "bg-red-50 border-l-red-600 border-red-200" 
              : "bg-amber-50 border-l-amber-500 border-amber-200"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg shadow-sm ${bulletin.type === "imminent" ? "bg-red-600" : "bg-amber-600"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded ${bulletin.type === "imminent" ? "bg-red-600 text-white" : "bg-amber-600 text-white"}`}>
                  {bulletin.type === "imminent" ? "Imminent Flooding" : "Flood Warning"}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase">{bulletin.basin}</span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${bulletin.type === "imminent" ? "bg-red-500" : "bg-amber-500"}`}></span>
                  {bulletin.time}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{bulletin.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
