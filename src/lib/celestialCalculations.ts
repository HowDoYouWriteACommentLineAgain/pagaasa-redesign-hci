export const MANILA = {
  lat: 14.5833,
  lon: 121.0,
  tz: 8
};

export interface CelestialEvent {
  time: string;
  label: string;
  type: 'sunrise' | 'sunset' | 'twilight' | 'moonrise' | 'moonset' | 'meteor' | 'conjunction' | 'special';
  icon: string;
  color: string;
}

export interface DailyEphemeris {
  body: string;
  rise: string;
  transit: string;
  set: string;
  altitude: number;
  magnitude: number;
  color: string;
}

export interface TidalData {
  time: string;
  height: number;
  type: 'high' | 'low';
}

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

function toDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function getJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + date.getUTCHours() / 24;
  
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  
  return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
}

export function getSunPosition(date: Date, lat: number, lon: number): { altitude: number; azimuth: number; declination: number; rightAscension: number } {
  const jd = getJulianDay(date);
  const t = (jd - 2451545.0) / 36525;
  
  const l0 = mod(280.46646 + 36000.76983 * t, 360);
  const m = mod(357.52911 + 35999.05029 * t, 360);
  
  const c = (1.914602 - 0.004817 * t) * Math.sin(toRad(m)) + (0.019993 - 0.000101 * t) * Math.sin(toRad(2 * m));
  const sunLon = l0 + c;
  
  const epsilon = 23.439291 - 0.0130042 * t;
  const alpha = toDeg(Math.atan2(
    Math.cos(epsilon) * Math.sin(toRad(sunLon)),
    Math.cos(toRad(sunLon))
  ));
  const delta = toDeg(Math.asin(
    Math.sin(epsilon) * Math.sin(toRad(sunLon))
  ));
  
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0);
  const lst = mod(gmst + lon, 360);
  const ha = lst - alpha;
  
  const alt = toDeg(Math.asin(
    Math.sin(toRad(lat)) * Math.sin(toRad(delta)) +
    Math.cos(toRad(lat)) * Math.cos(toRad(delta)) * Math.cos(toRad(ha))
  ));
  
  const az = toDeg(Math.atan2(
    -Math.sin(toRad(ha)),
    Math.tan(toRad(delta)) * Math.cos(toRad(lat)) - Math.sin(toRad(lat)) * Math.cos(toRad(ha))
  )) + 180;
  
  return { altitude: alt, azimuth: mod(az, 360), declination: delta, rightAscension: alpha };
}

export function getSunTimes(date: Date, lat: number, lon: number, timezone: number): {
  sunrise: string;
  sunset: string;
  solarNoon: string;
  civilTwilightStart: string;
  civilTwilightEnd: string;
  nauticalTwilightStart: string;
  nauticalTwilightEnd: string;
  astronomicalTwilightStart: string;
  astronomicalTwilightEnd: string;
  goldenHourMorningStart: string;
  goldenHourMorningEnd: string;
  goldenHourEveningStart: string;
  goldenHourEveningEnd: string;
} {
  const times: any = {};
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  
  const sunTimes = [
    { name: 'sunrise', angle: -0.833 },
    { name: 'sunset', angle: -0.833 },
    { name: 'civilTwilightStart', angle: -6 },
    { name: 'civilTwilightEnd', angle: -6 },
    { name: 'nauticalTwilightStart', angle: -12 },
    { name: 'nauticalTwilightEnd', angle: -12 },
    { name: 'astronomicalTwilightStart', angle: -18 },
    { name: 'astronomicalTwilightEnd', angle: -18 },
  ];
  
  for (const st of sunTimes) {
    const time = getTimeForAltitude(date, lat, lon, st.angle, st.name.includes('End') || st.name === 'sunset' || st.name === 'nauticalTwilightEnd' || st.name === 'astronomicalTwilightEnd');
    times[st.name] = formatTime(time, timezone);
  }
  
  times.solarNoon = formatTime(getSolarNoon(date, lon, timezone), timezone);
  
  if (times.sunrise) {
    const sunriseTime = parseTime(times.sunrise, timezone);
    const goldenEnd = new Date(sunriseTime.getTime() + 60 * 60 * 1000);
    times.goldenHourMorningStart = times.sunrise;
    times.goldenHourMorningEnd = formatTime(goldenEnd, timezone);
  }
  
  if (times.sunset) {
    const sunsetTime = parseTime(times.sunset, timezone);
    const goldenStart = new Date(sunsetTime.getTime() - 60 * 60 * 1000);
    times.goldenHourEveningStart = formatTime(goldenStart, timezone);
    times.goldenHourEveningEnd = times.sunset;
  }
  
  return times;
}

function getTimeForAltitude(date: Date, lat: number, lon: number, altitude: number, afterNoon: boolean): Date {
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  
  const startHour = afterNoon ? 11 : 4;
  const endHour = afterNoon ? 21 : 13;
  
  let prevAlt = getSunPosition(new Date(baseDate.getTime() + (startHour - 0.5) * 60 * 60 * 1000), lat, lon).altitude;
  
  for (let min = startHour * 60; min <= endHour * 60; min += 15) {
    const hour = min / 60;
    const testDate = new Date(baseDate.getTime() + hour * 60 * 60 * 1000);
    const alt = getSunPosition(testDate, lat, lon).altitude;
    
    if (afterNoon) {
      if (prevAlt > altitude && alt <= altitude) {
        const frac = (prevAlt - altitude) / (prevAlt - alt);
        return new Date(testDate.getTime() - (1 - frac) * 15 * 60 * 1000);
      }
    } else {
      if (prevAlt < altitude && alt >= altitude) {
        const frac = (altitude - prevAlt) / (alt - prevAlt);
        return new Date(testDate.getTime() - (1 - frac) * 15 * 60 * 1000);
      }
    }
    prevAlt = alt;
  }
  
  const fallbackHour = afterNoon ? 18 : 6;
  return new Date(baseDate.getTime() + fallbackHour * 60 * 60 * 1000);
}

function getSolarNoon(date: Date, lon: number, timezone: number): Date {
  const baseDate = new Date(date);
  baseDate.setHours(12, 0, 0, 0);
  const noonOffset = (timezone * 15 - lon) / 15 * 60;
  return new Date(baseDate.getTime() + noonOffset * 60 * 1000);
}

export function getMoonPosition(date: Date, lat: number, lon: number): { altitude: number; azimuth: number } {
  const jd = getJulianDay(date);
  const t = (jd - 2451545.0) / 36525;
  
  const L0 = 218.3164477 + 481267.88123421 * t;
  const l = mod(134.9633964 + 477198.8675055 * t, 360);
  const F = mod(93.272095 + 483202.0175233 * t, 360);
  
  const dlon = 6.289 * Math.sin(toRad(l));
  const latMoon = 5.128 * Math.sin(toRad(F));
  
  const lambda = L0 + dlon;
  const beta = latMoon;
  
  const epsilon = 23.439291;
  const alpha = toDeg(Math.atan2(
    Math.cos(toRad(epsilon)) * Math.sin(toRad(lambda)) - Math.tan(toRad(beta)) * Math.sin(toRad(epsilon)),
    Math.cos(toRad(lambda))
  ));
  const delta = toDeg(Math.asin(
    Math.sin(toRad(beta)) * Math.cos(toRad(epsilon)) +
    Math.cos(toRad(beta)) * Math.sin(toRad(epsilon)) * Math.sin(toRad(lambda))
  ));
  
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0);
  const lst = mod(gmst + lon, 360);
  const ha = lst - alpha;
  
  const alt = toDeg(Math.asin(
    Math.sin(toRad(lat)) * Math.sin(toRad(delta)) +
    Math.cos(toRad(lat)) * Math.cos(toRad(delta)) * Math.cos(toRad(ha))
  ));
  
  const az = toDeg(Math.atan2(
    -Math.sin(toRad(ha)),
    Math.tan(toRad(delta)) * Math.cos(toRad(lat)) - Math.sin(toRad(lat)) * Math.cos(toRad(ha))
  )) + 180;
  
  return { altitude: alt, azimuth: mod(az, 360) };
}

export function getMoonPhase(date: Date): { name: string; illumination: number; age: number; isWaxing: boolean } {
  const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  
  const jd = getJulianDay(date);
  const age = mod(jd - 2451550.1, 29.530588853) / 29.530588853 * 29.53;
  const illumination = (1 - Math.cos(toRad(age / 29.53 * 360))) / 2 * 100;
  const isWaxing = age < 14.765;
  
  const phaseIndex = Math.floor(((age / 29.53) * 8 + 0.5) % 8);
  
  return {
    name: phases[phaseIndex],
    illumination: Math.round(illumination * 100) / 100,
    age: Math.round(age * 100) / 100,
    isWaxing
  };
}

export function getMoonTimes(date: Date, lat: number, lon: number, timezone: number): {
  moonrise: string;
  moonset: string;
  transit: string;
  transitAlt: number;
} {
  const times: any = {};
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  
  const jd = getJulianDay(date);
  const lunarAge = mod(jd - 2451550.1, 29.530588853) / 29.530588853 * 29.53;
  const riseDelay = (lunarAge / 29.53) * 24.8;
  
  let prevAlt = getMoonPosition(baseDate, lat, lon).altitude;
  let moonrise: Date | null = null;
  let moonset: Date | null = null;
  let maxAlt = -90;
  let transitTime: Date | null = null;
  
  for (let hour = 0; hour <= 24; hour += 0.1) {
    const testDate = new Date(baseDate.getTime() + hour * 60 * 60 * 1000);
    const alt = getMoonPosition(testDate, lat, lon).altitude;
    
    if (hour > 0.1 && hour < 24) {
      if (prevAlt < 0 && alt >= 0 && !moonrise) {
        moonrise = testDate;
      }
      if (prevAlt > 0 && alt < 0 && !moonset) {
        moonset = testDate;
      }
    }
    
    if (alt > maxAlt) {
      maxAlt = alt;
      transitTime = testDate;
    }
    
    prevAlt = alt;
  }
  
  if (!moonrise) {
    const fallbackRise = new Date(baseDate.getTime() + (12 + riseDelay) * 60 * 60 * 1000);
    moonrise = fallbackRise;
  }
  if (!moonset) {
    const fallbackSet = new Date(moonrise.getTime() + 12 * 60 * 60 * 1000);
    moonset = fallbackSet;
  }
  if (!transitTime) {
    transitTime = new Date(moonrise.getTime() + 6 * 60 * 60 * 1000);
  }
  
  times.moonrise = formatTime(moonrise, timezone);
  times.moonset = formatTime(moonset, timezone);
  times.transit = formatTime(transitTime, timezone);
  times.transitAlt = Math.round(maxAlt);
  
  return times;
}

export function calculateTides(date: Date, timezone: number): TidalData[] {
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  
  const moonPhase = getMoonPhase(date);
  const jd = getJulianDay(date);
  const t = (jd - 2451545.0) / 36525;
  const l = mod(134.9633964 + 477198.8675055 * t, 360);
  
  const lunarPhaseOffset = (l / 360) * 12.42;
  
  const isSpringTide = moonPhase.illumination > 80 || moonPhase.illumination < 20;
  const isNeapTide = moonPhase.illumination > 40 && moonPhase.illumination < 60;
  
  const baseHigh = isSpringTide ? 1.6 : isNeapTide ? 1.1 : 1.3;
  const baseLow = isSpringTide ? -0.1 : isNeapTide ? 0.4 : 0.2;
  
  const amplitudeMultiplier = isSpringTide ? 1.3 : isNeapTide ? 0.7 : 1.0;
  
  const highTide1 = new Date(baseDate.getTime() + (4 + (lunarPhaseOffset % 2)) * 60 * 60 * 1000);
  const lowTide1 = new Date(highTide1.getTime() + 6.25 * 60 * 60 * 1000);
  const highTide2 = new Date(lowTide1.getTime() + 6.25 * 60 * 60 * 1000);
  const lowTide2 = new Date(highTide2.getTime() + 6.25 * 60 * 60 * 1000);
  
  const variance1 = Math.sin(lunarPhaseOffset * Math.PI) * 0.15;
  const variance2 = Math.cos(lunarPhaseOffset * Math.PI) * 0.15;
  
  return [
    { time: formatTime(highTide1, timezone), height: baseHigh + variance1, type: 'high' },
    { time: formatTime(lowTide1, timezone), height: baseLow - variance1 * amplitudeMultiplier, type: 'low' },
    { time: formatTime(highTide2, timezone), height: baseHigh + variance2, type: 'high' },
    { time: formatTime(lowTide2, timezone), height: baseLow - variance2 * amplitudeMultiplier, type: 'low' },
  ];
}

interface PlanetData {
  name: string;
  magnitude: number;
  orbitalElements: {
    L: number;
    a: number;
    e: number;
    i: number;
    omega: number;
    Omega: number;
  };
  constellation: (ra: number) => string;
}

const PLANET_DATA: PlanetData[] = [
  {
    name: 'Mercury',
    magnitude: 0.5,
    orbitalElements: { L: 252.2509, a: 0.387, e: 0.2056, i: 7.005, omega: 77.456, Omega: 48.331 },
    constellation: (ra) => getConstellationFromRA(ra, ['Aries', 'Pisces', 'Aquarius'])
  },
  {
    name: 'Venus',
    magnitude: -4.5,
    orbitalElements: { L: 181.9798, a: 0.723, e: 0.0068, i: 3.395, omega: 131.764, Omega: 76.680 },
    constellation: (ra) => getConstellationFromRA(ra, ['Pisces', 'Aries', 'Taurus'])
  },
  {
    name: 'Mars',
    magnitude: 1.2,
    orbitalElements: { L: 355.4330, a: 1.524, e: 0.0934, i: 1.850, omega: 336.041, Omega: 49.558 },
    constellation: (ra) => getConstellationFromRA(ra, ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo'])
  },
  {
    name: 'Jupiter',
    magnitude: -2.3,
    orbitalElements: { L: 34.3964, a: 5.203, e: 0.0489, i: 1.303, omega: 14.728, Omega: 100.464 },
    constellation: (ra) => getConstellationFromRA(ra, ['Taurus', 'Aries', 'Pisces'])
  },
  {
    name: 'Saturn',
    magnitude: 0.8,
    orbitalElements: { L: 50.0774, a: 9.537, e: 0.0565, i: 2.489, omega: 93.057, Omega: 113.666 },
    constellation: (ra) => getConstellationFromRA(ra, ['Aries', 'Pisces', 'Aquarius'])
  }
];

function getConstellationFromRA(ra: number, possible: string[]): string {
  const constellationIndex = Math.floor((mod(ra, 360) / 30) % possible.length);
  return possible[constellationIndex];
}

function calculatePlanetPosition(date: Date, planet: PlanetData): { ra: number; dec: number; dist: number } {
  const jd = getJulianDay(date);
  const t = (jd - 2451545.0) / 36525;
  
  const { L, a, e, i, omega, Omega } = planet.orbitalElements;
  
  const n = 357.5291 + 35999.0503 * t;
  const M = mod(L - omega + n, 360);
  
  const E0 = mod(L + 180 / Math.PI * e * Math.sin(toRad(M)) * (1 + e * Math.cos(toRad(M))), 360);
  let E = E0;
  for (let iter = 0; iter < 10; iter++) {
    E = mod(E0 + (180 / Math.PI) * e * Math.sin(toRad(E)), 360);
  }
  
  const xv = a * (Math.cos(toRad(E)) - e);
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(toRad(E));
  const dist = Math.sqrt(xv * xv + yv * yv);
  
  const v = toDeg(Math.atan2(yv, xv));
  const r = dist;
  
  const xh = r * (Math.cos(toRad(Omega)) * Math.cos(toRad(v + omega)) - Math.sin(toRad(Omega)) * Math.sin(toRad(v + omega)) * Math.cos(toRad(i)));
  const yh = r * (Math.sin(toRad(Omega)) * Math.cos(toRad(v + omega)) + Math.cos(toRad(Omega)) * Math.sin(toRad(v + omega)) * Math.cos(toRad(i)));
  const zh = r * Math.sin(toRad(v + omega)) * Math.sin(toRad(i));
  
  const ra = toDeg(Math.atan2(yh, xh));
  const dec = toDeg(Math.asin(zh / r));
  
  return { ra: mod(ra, 360), dec, dist };
}

function getPlanetRiseTransitSet(date: Date, lat: number, timezone: number, planet: PlanetData): { rise: string; transit: string; set: string } {
  const { ra, dec } = calculatePlanetPosition(date, planet);
  const jd = getJulianDay(date);
  
  const gmst0 = 280.46061837 + 360.98564736629 * (jd - 2451545.0);
  
  const cosH0 = (Math.sin(toRad(-0.5667)) - Math.sin(toRad(lat)) * Math.sin(toRad(dec))) /
    (Math.cos(toRad(lat)) * Math.cos(toRad(dec)));
  
  let H0 = 90;
  if (cosH0 >= -1 && cosH0 <= 1) {
    H0 = toDeg(Math.acos(cosH0));
  }
  
  const transitLST = mod(ra, 360);
  const transitGMT = (transitLST - mod(gmst0, 360)) / 360 * 24;
  const transitHours = mod(transitGMT + timezone, 24);
  
  const riseGMT = (transitGMT - H0 / 15);
  const riseHours = mod(riseGMT + timezone, 24);
  
  const setGMT = (transitGMT + H0 / 15);
  const setHours = mod(setGMT + timezone, 24);
  
  return {
    rise: `${String(Math.floor(riseHours)).padStart(2, '0')}:${String(Math.round((riseHours % 1) * 60)).padStart(2, '0')}`,
    transit: `${String(Math.floor(transitHours)).padStart(2, '0')}:${String(Math.round((transitHours % 1) * 60)).padStart(2, '0')}`,
    set: `${String(Math.floor(setHours)).padStart(2, '0')}:${String(Math.round((setHours % 1) * 60)).padStart(2, '0')}`
  };
}

export function getVisiblePlanets(date: Date, lat: number, lon: number): Array<{ name: string; altitude: number; magnitude: number; constellation: string; rise: string; transit: string; set: string }> {
  const jd = getJulianDay(date);
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0);
  const lst = mod(gmst + lon, 360);
  
  return PLANET_DATA.map(planet => {
    const { ra, dec } = calculatePlanetPosition(date, planet);
    const ha = lst - ra;
    const alt = toDeg(Math.asin(
      Math.sin(toRad(lat)) * Math.sin(toRad(dec)) +
      Math.cos(toRad(lat)) * Math.cos(toRad(dec)) * Math.cos(toRad(ha))
    ));
    
    const times = getPlanetRiseTransitSet(date, lat, 8, planet);
    
    return {
      name: planet.name,
      altitude: Math.round(alt * 10) / 10,
      magnitude: planet.magnitude,
      constellation: planet.constellation(ra),
      rise: times.rise,
      transit: times.transit,
      set: times.set
    };
  }).filter(p => p.altitude > 0);
}

export function getAllPlanetEphemeris(date: Date, lat: number, lon: number, timezone: number): Array<{ name: string; altitude: number; magnitude: number; constellation: string; rise: string; transit: string; set: string }> {
  return PLANET_DATA.map(planet => {
    const { ra, dec } = calculatePlanetPosition(date, planet);
    const jd = getJulianDay(date);
    const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0);
    const lst = mod(gmst + lon, 360);
    const ha = lst - ra;
    const alt = toDeg(Math.asin(
      Math.sin(toRad(lat)) * Math.sin(toRad(dec)) +
      Math.cos(toRad(lat)) * Math.cos(toRad(dec)) * Math.cos(toRad(ha))
    ));
    
    const times = getPlanetRiseTransitSet(date, lat, timezone, planet);
    
    return {
      name: planet.name,
      altitude: Math.round(alt * 10) / 10,
      magnitude: planet.magnitude,
      constellation: planet.constellation(ra),
      rise: times.rise || '--:--',
      transit: times.transit || '--:--',
      set: times.set || '--:--'
    };
  });
}

export function getUpcomingEvents(date: Date, timezone: number): CelestialEvent[] {
  const events: CelestialEvent[] = [];
  const sunTimes = getSunTimes(date, MANILA.lat, MANILA.lon, timezone);
  const moonTimes = getMoonTimes(date, MANILA.lat, MANILA.lon, timezone);
  const moonPhase = getMoonPhase(date);
  
  if (sunTimes.civilTwilightStart) {
    events.push({
      time: sunTimes.civilTwilightStart,
      label: 'Civil Twilight Begins',
      type: 'twilight',
      icon: '🌅',
      color: 'text-orange-400'
    });
  }
  
  if (sunTimes.sunrise) {
    events.push({
      time: sunTimes.sunrise,
      label: 'Sunrise',
      type: 'sunrise',
      icon: '🌄',
      color: 'text-yellow-500'
    });
  }
  
  if (sunTimes.solarNoon) {
    events.push({
      time: sunTimes.solarNoon,
      label: 'Solar Noon',
      type: 'special',
      icon: '☀️',
      color: 'text-yellow-300'
    });
  }
  
  if (moonTimes.moonrise) {
    events.push({
      time: moonTimes.moonrise,
      label: 'Moonrise',
      type: 'moonrise',
      icon: '🌙',
      color: 'text-slate-300'
    });
  }
  
  if (sunTimes.sunset) {
    events.push({
      time: sunTimes.sunset,
      label: 'Sunset',
      type: 'sunset',
      icon: '🌇',
      color: 'text-orange-500'
    });
  }
  
  if (moonPhase.illumination > 90) {
    events.push({
      time: 'All Night',
      label: 'Full Moon Night',
      type: 'special',
      icon: '🌕',
      color: 'text-yellow-200'
    });
  }
  
  events.sort((a, b) => {
    if (a.time === 'All Night') return -1;
    if (b.time === 'All Night') return 1;
    return a.time.localeCompare(b.time);
  });
  
  return events.slice(0, 6);
}

export function getDailyEphemeris(date: Date, lat: number, lon: number, timezone: number): DailyEphemeris[] {
  const sunTimes = getSunTimes(date, lat, lon, timezone);
  const moonTimes = getMoonTimes(date, lat, lon, timezone);
  const sunPos = getSunPosition(date, lat, lon);
  const moonPhase = getMoonPhase(date);
  
  const ephemeris: DailyEphemeris[] = [
    {
      body: 'Sun',
      rise: sunTimes.sunrise || '--:--',
      transit: sunTimes.solarNoon || '--:--',
      set: sunTimes.sunset || '--:--',
      altitude: Math.round(sunPos.altitude),
      magnitude: -26.7,
      color: 'text-yellow-400'
    },
    {
      body: 'Moon',
      rise: moonTimes.moonrise || '--:--',
      transit: moonTimes.transit || '--:--',
      set: moonTimes.moonset || '--:--',
      altitude: Math.round(getMoonPosition(date, lat, lon).altitude),
      magnitude: moonPhase.illumination > 50 ? -12 + (moonPhase.illumination / 100) * 1 : -2,
      color: 'text-slate-300'
    }
  ];
  
  const visiblePlanets = getVisiblePlanets(date, lat, lon);
  for (const planet of visiblePlanets.slice(0, 3)) {
    ephemeris.push({
      body: planet.name,
      rise: planet.rise || '--:--',
      transit: planet.transit || '--:--',
      set: planet.set || '--:--',
      altitude: Math.round(planet.altitude),
      magnitude: planet.magnitude,
      color: 'text-cyan-400'
    });
  }
  
  return ephemeris;
}

export function generateTimelineData(date: Date, lat: number, lon: number, _timezone: number) {
  const points = [];
  
  for (let hour = 0; hour <= 24; hour += 0.25) {
    const testDate = new Date(date);
    testDate.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    
    const sunPos = getSunPosition(testDate, lat, lon);
    const moonPos = getMoonPosition(testDate, lat, lon);
    
    const jd = getJulianDay(testDate);
    const t = (jd - 2451545.0) / 36525;
    const l = mod(134.9633964 + 477198.8675055 * t, 360);
    
    const tideBase = Math.sin(hour * (Math.PI / 6.2)) * 1.5;
    const tideLunar = Math.sin(hour * (Math.PI / 6.5) + toRad(l)) * 0.5;
    const tide = tideBase + tideLunar;
    
    points.push({
      hour,
      sunAlt: sunPos.altitude,
      moonAlt: moonPos.altitude,
      tide: tide,
      isDay: sunPos.altitude > 0,
      isTwilight: sunPos.altitude > -6 && sunPos.altitude <= 0,
      isGoldenHour: sunPos.altitude > 0 && sunPos.altitude < 6,
      isBlueHour: sunPos.altitude > -6 && sunPos.altitude < 0
    });
  }
  
  return points;
}

export function getConstellationsForDate(date: Date): string[] {
  const month = date.getMonth();
  
  const seasonalConstellations: Record<number, string[]> = {
    0: ['Orion', 'Gemini', 'Canis Major', 'Taurus', 'Auriga'],
    1: ['Orion', 'Gemini', 'Canis Major', 'Leo', 'Cancer'],
    2: ['Leo', 'Virgo', 'Cancer', 'Ursa Major', 'Canis Minor'],
    3: ['Leo', 'Virgo', 'Corvus', 'Ursa Major', 'Boötes'],
    4: ['Virgo', 'Libra', 'Scorpius', 'Boötes', 'Serpens'],
    5: ['Scorpius', 'Sagittarius', 'Ophiuchus', 'Libra', 'Scorpius'],
    6: ['Scorpius', 'Sagittarius', 'Ophiuchus', 'Aquila', 'Scutum'],
    7: ['Sagittarius', 'Capricornus', 'Aquarius', 'Pegasus', 'Andromeda'],
    8: ['Pegasus', 'Andromeda', 'Aquarius', 'Pisces', 'Cassiopeia'],
    9: ['Perseus', 'Andromeda', 'Pisces', 'Triangulum', 'Cassiopeia'],
    10: ['Perseus', 'Taurus', 'Andromeda', 'Aries', 'Cassiopeia'],
    11: ['Orion', 'Taurus', 'Perseus', 'Auriga', 'Andromeda']
  };
  
  return seasonalConstellations[month] || seasonalConstellations[0];
}

function formatTime(date: Date, _timezone: number): string {
  const localHour = date.getHours();
  const localMinute = date.getMinutes();
  return `${String(localHour).padStart(2, '0')}:${String(localMinute).padStart(2, '0')}`;
}

function parseTime(timeStr: string, _timezone: number): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function getNextTide(date: Date, timezone: number): { nextHigh: TidalData; nextLow: TidalData } {
  const tides = calculateTides(date, timezone);
  const now = date.getHours() * 60 + date.getMinutes();
  
  let nextHigh: TidalData = tides.find(t => t.type === 'high') || tides[0];
  let nextLow: TidalData = tides.find(t => t.type === 'low') || tides[1];
  
  for (const tide of tides) {
    const [h, m] = tide.time.split(':').map(Number);
    const tideMinutes = h * 60 + m;
    
    if (tideMinutes > now) {
      if (tide.type === 'high') nextHigh = tide;
      if (tide.type === 'low') nextLow = tide;
    }
  }
  
  return { nextHigh, nextLow };
}

export function getInsight(date: Date): string {
  const moonPhase = getMoonPhase(date);
  
  let insight = '';
  
  if (moonPhase.illumination > 80) {
    insight = `Full Moon period with ${moonPhase.illumination.toFixed(0)}% illumination. Lunar gravitational effects are at peak, creating higher high tides and lower low tides (Spring Tides). Stargazing conditions are reduced due to moonlight.`;
  } else if (moonPhase.illumination < 20) {
    insight = `New Moon period - excellent for deep sky observation! With minimal lunar interference, fainter celestial objects become visible. This is the optimal time for meteor watching and observing distant galaxies.`;
  } else if (moonPhase.name.includes('Quarter')) {
    insight = `${moonPhase.name} Moon - good balance between nighttime darkness and moonlight. Moderate tides expected. Excellent time for planetary observation as major planets are well positioned.`;
  } else {
    insight = `The Moon is in ${moonPhase.name} phase at ${moonPhase.illumination.toFixed(0)}% illumination. Partially favorable for stargazing with some moonlight interference. Normal tidal patterns expected.`;
  }
  
  return insight;
}
