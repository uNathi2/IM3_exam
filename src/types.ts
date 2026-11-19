export type MagazinePage = 'cover' | 'feature' | 'issues' | 'creators';

export type WeatherCondition =
  | 'clear'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'thunderstorm'
  | 'snow';

export interface WeatherAtmosphere {
  temperature: number; // in Celsius
  weatherCode: number;
  condition: WeatherCondition;
  conditionLabel: string;
  windSpeed: number; // km/h
  isDay: boolean;
  isCached: boolean;
  isOffline: boolean;
  isSimulated: boolean;
  lastUpdated: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  accentColor: string; // Dynamic hex based on temperature
  particleDriftSpeed: number; // Normalized drift factor
  rainIntensity: number; // 0 to 1
}

export interface TouchDesignerStudy {
  id: string;
  title: string;
  code: string;
  tag: string;
  category: string;
  date: string;
  description: string;
  operatorChain: string[];
  parameters: {
    resolution: string;
    particleCount: string;
    feedbackGain: string;
    noisePeriod: string;
    seed: string;
    renderTime: string;
  };
  svgVisualType: 'monochrome_signal' | 'composite_quad' | 'amber_field' | 'thermal_mask';
  src?: string;
  videoSrc?: string;
  lightGround?: boolean;
  accentRgb: [number, number, number];
}

export interface CreatorProfile {
  id: string;
  name: string;
  location: string;
  discipline: string;
  bio: string;
  featuredProject: string;
  issue: string;
  tools: string[];
}
