import { WeatherAtmosphere, WeatherCondition } from '../types';

const JHB_LAT = -26.2041;
const JHB_LNG = 28.0473;
const CACHE_KEY = 'aetherside_weather_cache_v1';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes as per PRD

// Standard WMO weather interpretation codes
function interpretWmoCode(code: number): { condition: WeatherCondition; label: string } {
  if (code === 0) return { condition: 'clear', label: 'Clear Sky' };
  if (code === 1 || code === 2) return { condition: 'clear', label: 'Partly Cloudy' };
  if (code === 3) return { condition: 'cloudy', label: 'Overcast' };
  if (code >= 45 && code <= 48) return { condition: 'fog', label: 'Highveld Mist' };
  if (code >= 51 && code <= 57) return { condition: 'drizzle', label: 'Soft Drizzle' };
  if (code >= 61 && code <= 67) return { condition: 'rain', label: 'Passing Rain' };
  if (code >= 71 && code <= 77) return { condition: 'snow', label: 'Hail / Sleet' };
  if (code >= 80 && code <= 82) return { condition: 'rain', label: 'Heavy Downpour' };
  if (code >= 95 && code <= 99) return { condition: 'thunderstorm', label: 'Highveld Thunderstorm' };
  return { condition: 'cloudy', label: 'Diffuse Atmosphere' };
}

// Compute accent color based on temperature (cool cyan/blue for cold, warm amber/terracotta for hot)
function calculateAccentColor(tempC: number, isDay: boolean): string {
  if (tempC < 12) return '#38bdf8'; // Crisp sky blue
  if (tempC < 18) return '#818cf8'; // Cool indigo
  if (tempC < 24) return isDay ? '#c084fc' : '#a855f7'; // Signature purple/lavender
  if (tempC < 29) return '#fbbf24'; // Warm amber
  return '#f97316'; // Deep warm orange / terracotta
}

// Fallback neutral atmosphere when offline or error
export const DEFAULT_NEUTRAL_ATMOSPHERE: WeatherAtmosphere = {
  temperature: 22.4,
  weatherCode: 1,
  condition: 'clear',
  conditionLabel: 'Clear Sky (Offline Fallback)',
  windSpeed: 11.2,
  isDay: true,
  isCached: false,
  isOffline: true,
  isSimulated: false,
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  city: 'Johannesburg, ZA',
  coordinates: { lat: JHB_LAT, lng: JHB_LNG },
  accentColor: '#c084fc',
  particleDriftSpeed: 1.0,
  rainIntensity: 0,
};

export async function fetchJohannesburgWeather(): Promise<WeatherAtmosphere> {
  // Check cached version first
  try {
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      const isFresh = Date.now() - cached.timestamp < CACHE_TTL_MS;
      if (isFresh && cached.data) {
        return {
          ...cached.data,
          isCached: true,
          isOffline: false,
        };
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  try {
    const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${JHB_LAT}&longitude=${JHB_LNG}&current=temperature_2m,weather_code,wind_speed_10m,is_day`;
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}`);
    }

    const json = await response.json();
    const current = json.current;
    if (!current) {
      throw new Error('Malformed Open-Meteo payload');
    }

    const temp = Math.round((current.temperature_2m ?? 21) * 10) / 10;
    const weatherCode = current.weather_code ?? 0;
    const wind = Math.round((current.wind_speed_10m ?? 8) * 10) / 10;
    const isDay = current.is_day === 1;

    const { condition, label } = interpretWmoCode(weatherCode);

    // Rain intensity 0 - 1
    const rainIntensity =
      condition === 'thunderstorm'
        ? 1.0
        : condition === 'rain'
        ? 0.65
        : condition === 'drizzle'
        ? 0.25
        : 0;

    // Particle drift proportional to wind (clamped between 0.4 and 3.0)
    const particleDriftSpeed = Math.min(Math.max(wind / 10, 0.4), 3.0);

    const atmosphere: WeatherAtmosphere = {
      temperature: temp,
      weatherCode,
      condition,
      conditionLabel: label,
      windSpeed: wind,
      isDay,
      isCached: false,
      isOffline: false,
      isSimulated: false,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      city: 'Johannesburg, ZA',
      coordinates: { lat: JHB_LAT, lng: JHB_LNG },
      accentColor: calculateAccentColor(temp, isDay),
      particleDriftSpeed,
      rainIntensity,
    };

    // Save to cache
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data: atmosphere })
      );
    } catch {
      // Storage quota or sandboxing
    }

    return atmosphere;
  } catch (err) {
    console.warn('Using cached or default weather due to network limit:', err);
    // Try to return stale cache if available
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached.data) {
          return {
            ...cached.data,
            isCached: true,
            isOffline: true,
            conditionLabel: `${cached.data.conditionLabel} (Cached)`,
          };
        }
      }
    } catch {
      // fallback
    }

    return DEFAULT_NEUTRAL_ATMOSPHERE;
  }
}

export const WEATHER_PRESETS: { id: string; name: string; description: string; data: Partial<WeatherAtmosphere> }[] = [
  {
    id: 'thunderstorm',
    name: 'Highveld Summer Storm',
    description: 'Electric atmospheric noise with rapid wind drift and rain disturbance.',
    data: {
      temperature: 19.8,
      weatherCode: 95,
      condition: 'thunderstorm',
      conditionLabel: 'Highveld Thunderstorm',
      windSpeed: 28.4,
      isDay: false,
      accentColor: '#e879f9',
      particleDriftSpeed: 2.8,
      rainIntensity: 0.9,
      isSimulated: true,
    },
  },
  {
    id: 'heatwave',
    name: 'Dry Midday Heatwave',
    description: 'Scorching 31°C solar glow with slow, heavy particle convection.',
    data: {
      temperature: 31.5,
      weatherCode: 0,
      condition: 'clear',
      conditionLabel: 'High Solar Irradiance',
      windSpeed: 6.2,
      isDay: true,
      accentColor: '#f97316',
      particleDriftSpeed: 0.65,
      rainIntensity: 0,
      isSimulated: true,
    },
  },
  {
    id: 'gale_wind',
    name: 'Ridge Wind Drift',
    description: 'Gusting 36 km/h westerly winds driving horizontal point-cloud shear.',
    data: {
      temperature: 17.2,
      weatherCode: 2,
      condition: 'clear',
      conditionLabel: 'High Wind Velocity',
      windSpeed: 36.0,
      isDay: true,
      accentColor: '#38bdf8',
      particleDriftSpeed: 3.4,
      rainIntensity: 0.1,
      isSimulated: true,
    },
  },
  {
    id: 'midnight_calm',
    name: 'Stark Midnight Inversion',
    description: 'Sub-zero calm atmosphere with crystalline, motionless monochrome signal.',
    data: {
      temperature: 8.5,
      weatherCode: 0,
      condition: 'clear',
      conditionLabel: 'Clear Winter Night',
      windSpeed: 3.5,
      isDay: false,
      accentColor: '#818cf8',
      particleDriftSpeed: 0.35,
      rainIntensity: 0,
      isSimulated: true,
    },
  },
];
