import { type CSSProperties } from "react";
import bg from '/images/Manila_skyline_day.jpg'

// interface style{
//   backgroundImages:String,
//   backgroundSize:String,
//   height:String,
//   position:String,
// }
function WeatherHero(){
  const bgInfo:CSSProperties = {
    backgroundImage:`url(${bg})`
  };

  return(
    <div className="relative flex flex-row items-center pb-10">
      <div style={bgInfo} className="absolute inset-0 bg-cover bg-center blur-[0.5px] z-0" />
      <div id="text_overlay_wrapper"  className="ps-8 pe-4 flex-6 pt-8 z-20 max-w-2xl">
        <div id="weather" className="flex flex-row items-center justify-between bg-dark-azure-translucent rounded-2xl px-6 py-2 text-2xl font-bold text-white">
          <h2>🌧 Luneta, Metro Manila</h2>
          <details className="dropdown">
            <summary className="btn btn-light bg-gray-200 font-light m-1">Set location</summary>
            <ul className="menu dropdown-content bg-dark-azure rounded-s-box z-1 w-52 p-2 shadow-sm">
              <li className="bg-dark-azure"><a>Luneta</a></li>
              <li className="bg-dark-azure"><a>Kamuning</a></li>
            </ul>
          </details>
        </div>
        <div className="bg-grey-azure-translucent rounded-2xl mt-2 px-6 py-2 text-lg font-semibold text-white">
          <p>🌧 <b>Occasional Rains</b></p>
          <p>High: 31°C | Low: 31°C</p>
          <p><b>Sat</b>, Feb 14</p>
        </div>
        <div className="bg-gray-500/90 rounded-lg mt-2 ps-6 py-2 text-2xl font-semibold text-white">
          <p className="text-sm font-">Bulletin: No Active Tropical Cyclone within the Philippine Area of Responsibility</p>
        </div>
        <div className="bg-red-400/80 rounded-2xl mt-2 px-6 py-2 text-2xl font-semibold text-white">
          <p className="uppercase"><b>Advisory</b> General Flood Warning is in effect</p>
        </div>
      </div>
      <div className="md:flex-3 sm:flex-2" />
  </div>
  )
}

export default WeatherHero;

