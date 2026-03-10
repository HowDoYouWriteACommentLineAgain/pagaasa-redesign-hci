import { useState } from "react";

function Panahon(){
    const [isLocked, setIsLocked] = useState(true);
    return(
        <section className="relative">
            <div className="grid place-items-center h-screen w-full bg-grey-azure px-8 pt-4 sm:pe-24" onMouseLeave={()=> setIsLocked(true)}>
                { isLocked && (
                    <div 
                        onClick={()=> setIsLocked(false)}
                        className="absolute inset-0 z-10 flex flex-row items-center justify-center cursor-pointer group backdrop-blur-[1.5px]"
                    >                    
                    <p className="bg-gray-700/90 text-white text-3xl font-black px-6 py-3 rounded-full tracking-widest group-hover:scale-110 transition-transform">  Click to Unlock</p>
                    </div>
                )}
                <iframe 
                className={`w-full h-280 max-w-12xl rounded-2xl border-4 border-[#1a2e35] shadow-2xl bg-white ${isLocked ? 'pointer-events-none opacity-90' : 'pointer-events-auto opacity-100'}`}
                src="https://www.panahon.gov.ph/" 
                title="PAGASA Live Site"
                />
                
                <p className="text-md">
                    © 2026 European Centre for Medium-range Weather Forecasts (ECMWF). This service is based on data and products of the ECMWF.
                    © PAGASA National Hydro-Met Observing Network (PANaHON) <br />
                </p>
            </div>
        </section>
    )
}

export default Panahon;