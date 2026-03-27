export interface WeatherCondition {
  condition: string;
  icon: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'cloud-bolt' | 'wind';
  bgClass: string;
  unsplashQuery: string;
}

export interface LocationWeather {
  name: string;
  station: string;
  region: string;
  coordinates: [number, number];
  current: {
    temp: number;
    feelsLike: number;
    condition: WeatherCondition;
    high: number;
    low: number;
    humidity: number;
    wind: number;
    windDirection: string;
    rainChance: number;
    visibility: number;
    pressure: number;
    uvIndex: number;
  };
  bulletin: string;
  advisory: string;
}

export interface DayForecast {
  date: string;
  dayName: string;
  locations: Record<string, Omit<LocationWeather, 'bulletin' | 'advisory'>>;
}

// Current date: March 27, 2026
const conditions = {
  sunny: {
    condition: 'Sunny',
    icon: 'sun' as const,
    bgClass: 'from-sky-600/80 to-blue-400/60',
    unsplashQuery: 'manila-skyline-sunny-blue',
  },
  partlyCloudy: {
    condition: 'Partly Cloudy',
    icon: 'cloud-sun' as const,
    bgClass: 'from-slate-500/80 to-sky-400/60',
    unsplashQuery: 'manila-skyline-clouds',
  },
  cloudy: {
    condition: 'Cloudy',
    icon: 'cloud' as const,
    bgClass: 'from-gray-600/80 to-slate-400/60',
    unsplashQuery: 'manila-overcast-clouds',
  },
  rain: {
    condition: 'Rainy',
    icon: 'cloud-rain' as const,
    bgClass: 'from-slate-700/90 to-gray-500/70',
    unsplashQuery: 'manila-rainy-weather',
  },
  thunderstorm: {
    condition: 'Thunderstorm',
    icon: 'cloud-bolt' as const,
    bgClass: 'from-slate-900/95 to-gray-700/80',
    unsplashQuery: 'manila-thunderstorm-lightning',
  },
};

export const baseBulletin = 'Dry Season conditions prevail across the country';

export const baseAdvisory = 'HEAT INDEX WARNING: Dangerous heat levels expected in multiple areas';

export const locations: Record<string, Omit<LocationWeather, 'bulletin' | 'advisory'>> = {
  luneta: {
    name: 'Luneta',
    station: 'Luneta Observatory',
    region: 'Metro Manila',
    coordinates: [14.5794, 121.0027],
    current: {
      temp: 36,
      feelsLike: 42,
      condition: conditions.sunny,
      high: 37,
      low: 27,
      humidity: 65,
      wind: 12,
      windDirection: 'E',
      rainChance: 5,
      visibility: 15,
      pressure: 1011,
      uvIndex: 13,
    },
  },
  kamuning: {
    name: 'Kamuning',
    station: 'Kamuning Weather Station',
    region: 'Quezon City',
    coordinates: [14.6392, 121.0596],
    current: {
      temp: 35,
      feelsLike: 41,
      condition: conditions.sunny,
      high: 36,
      low: 26,
      humidity: 68,
      wind: 10,
      windDirection: 'E',
      rainChance: 5,
      visibility: 12,
      pressure: 1010,
      uvIndex: 12,
    },
  },
  naia: {
    name: 'NAIA',
    station: 'NAIA Aviation Weather',
    region: 'Pasay City',
    coordinates: [14.5086, 121.0194],
    current: {
      temp: 37,
      feelsLike: 43,
      condition: conditions.sunny,
      high: 38,
      low: 28,
      humidity: 62,
      wind: 15,
      windDirection: 'ENE',
      rainChance: 3,
      visibility: 18,
      pressure: 1012,
      uvIndex: 14,
    },
  },
  clark: {
    name: 'Clark',
    station: 'Clark International Airport',
    region: 'Pampanga',
    coordinates: [15.1852, 120.5605],
    current: {
      temp: 39,
      feelsLike: 46,
      condition: conditions.sunny,
      high: 40,
      low: 25,
      humidity: 45,
      wind: 18,
      windDirection: 'NW',
      rainChance: 2,
      visibility: 20,
      pressure: 1008,
      uvIndex: 15,
    },
  },
  baguio: {
    name: 'Baguio',
    station: 'Baguio SYNOP',
    region: 'Benguet',
    coordinates: [16.4164, 120.5933],
    current: {
      temp: 26,
      feelsLike: 28,
      condition: conditions.partlyCloudy,
      high: 28,
      low: 15,
      humidity: 70,
      wind: 6,
      windDirection: 'SW',
      rainChance: 15,
      visibility: 12,
      pressure: 1014,
      uvIndex: 7,
    },
  },
  tuguegarao: {
    name: 'Tuguegarao',
    station: 'Tuguegarao Airport',
    region: 'Cagayan Valley',
    coordinates: [17.6157, 121.7265],
    current: {
      temp: 41,
      feelsLike: 48,
      condition: conditions.sunny,
      high: 42,
      low: 26,
      humidity: 40,
      wind: 8,
      windDirection: 'N',
      rainChance: 2,
      visibility: 20,
      pressure: 1007,
      uvIndex: 16,
    },
  },
  infanta: {
    name: 'Infanta',
    station: 'Infanta Radar Station',
    region: 'Quezon Province',
    coordinates: [14.7478, 121.6947],
    current: {
      temp: 34,
      feelsLike: 39,
      condition: conditions.cloudy,
      high: 35,
      low: 26,
      humidity: 75,
      wind: 15,
      windDirection: 'SE',
      rainChance: 20,
      visibility: 10,
      pressure: 1010,
      uvIndex: 8,
    },
  },
  sanfernando: {
    name: 'San Fernando',
    station: 'DOST-PAGASA Station',
    region: 'La Union',
    coordinates: [16.6189, 120.3217],
    current: {
      temp: 36,
      feelsLike: 42,
      condition: conditions.sunny,
      high: 37,
      low: 26,
      humidity: 62,
      wind: 12,
      windDirection: 'NE',
      rainChance: 5,
      visibility: 15,
      pressure: 1011,
      uvIndex: 13,
    },
  },
};

// Sample days with varying weather (summer/dry season conditions)
export const sampleDays: DayForecast[] = [
  {
    date: '2026-03-27',
    dayName: 'Friday',
    locations: {
      luneta: locations.luneta,
      kamuning: locations.kamuning,
      naia: locations.naia,
      clark: locations.clark,
      baguio: locations.baguio,
      tuguegarao: locations.tuguegarao,
      infanta: locations.infanta,
      sanfernando: locations.sanfernando,
    },
  },
  {
    date: '2026-03-28',
    dayName: 'Saturday',
    locations: {
      luneta: {
        ...locations.luneta,
        current: { ...locations.luneta.current, temp: 37, high: 38, low: 28, condition: conditions.sunny, rainChance: 3, uvIndex: 14 },
      },
      kamuning: {
        ...locations.kamuning,
        current: { ...locations.kamuning.current, temp: 36, high: 37, low: 27, condition: conditions.sunny, rainChance: 5 },
      },
      naia: {
        ...locations.naia,
        current: { ...locations.naia.current, temp: 38, high: 39, low: 28, condition: conditions.sunny, rainChance: 2, uvIndex: 15 },
      },
      clark: {
        ...locations.clark,
        current: { ...locations.clark.current, temp: 41, high: 42, low: 26, condition: conditions.sunny, rainChance: 1, uvIndex: 16 },
      },
      baguio: {
        ...locations.baguio,
        current: { ...locations.baguio.current, temp: 27, high: 29, low: 16, condition: conditions.sunny, rainChance: 10 },
      },
      tuguegarao: {
        ...locations.tuguegarao,
        current: { ...locations.tuguegarao.current, temp: 42, high: 43, low: 27, condition: conditions.sunny, rainChance: 1, uvIndex: 17 },
      },
      infanta: {
        ...locations.infanta,
        current: { ...locations.infanta.current, temp: 35, high: 36, low: 26, condition: conditions.cloudy, rainChance: 15 },
      },
      sanfernando: {
        ...locations.sanfernando,
        current: { ...locations.sanfernando.current, temp: 37, high: 38, low: 27, condition: conditions.sunny, rainChance: 3 },
      },
    },
  },
  {
    date: '2026-03-29',
    dayName: 'Sunday',
    locations: {
      luneta: {
        ...locations.luneta,
        current: { ...locations.luneta.current, temp: 35, high: 36, low: 27, condition: conditions.partlyCloudy, rainChance: 10 },
      },
      kamuning: {
        ...locations.kamuning,
        current: { ...locations.kamuning.current, temp: 34, high: 35, low: 26, condition: conditions.partlyCloudy, rainChance: 15 },
      },
      naia: {
        ...locations.naia,
        current: { ...locations.naia.current, temp: 36, high: 37, low: 27, condition: conditions.cloudy, rainChance: 10 },
      },
      clark: {
        ...locations.clark,
        current: { ...locations.clark.current, temp: 38, high: 39, low: 25, condition: conditions.sunny, rainChance: 3 },
      },
      baguio: {
        ...locations.baguio,
        current: { ...locations.baguio.current, temp: 25, high: 27, low: 15, condition: conditions.cloudy, rainChance: 20 },
      },
      tuguegarao: {
        ...locations.tuguegarao,
        current: { ...locations.tuguegarao.current, temp: 40, high: 41, low: 26, condition: conditions.sunny, rainChance: 2 },
      },
      infanta: {
        ...locations.infanta,
        current: { ...locations.infanta.current, temp: 33, high: 34, low: 25, condition: conditions.partlyCloudy, rainChance: 25 },
      },
      sanfernando: {
        ...locations.sanfernando,
        current: { ...locations.sanfernando.current, temp: 35, high: 36, low: 26, condition: conditions.partlyCloudy, rainChance: 10 },
      },
    },
  },
  {
    date: '2026-03-30',
    dayName: 'Monday',
    locations: {
      luneta: locations.luneta,
      kamuning: locations.kamuning,
      naia: locations.naia,
      clark: locations.clark,
      baguio: locations.baguio,
      tuguegarao: locations.tuguegarao,
      infanta: locations.infanta,
      sanfernando: locations.sanfernando,
    },
  },
];

export const locationList = [
  { key: 'luneta', label: 'Luneta, Manila' },
  { key: 'kamuning', label: 'Kamuning, QC' },
  { key: 'naia', label: 'NAIA, Pasay' },
  { key: 'clark', label: 'Clark, Pampanga' },
  { key: 'baguio', label: 'Baguio City' },
  { key: 'tuguegarao', label: 'Tuguegarao' },
  { key: 'infanta', label: 'Infanta, Quezon' },
  { key: 'sanfernando', label: 'San Fernando, La Union' },
];
