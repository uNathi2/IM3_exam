import React, { useEffect } from 'react';
import { WeatherAtmosphere } from '../types';
import { WEATHER_PRESETS } from '../services/weatherService';
import { X, RefreshCw, Sliders, MapPin, Wind, Thermometer, CloudRain, Info } from 'lucide-react';

interface AtmosphereSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  atmosphere: WeatherAtmosphere;
  onApplyAtmosphere: (updated: WeatherAtmosphere) => void;
  onResetToLive: () => void;
  isLoadingLive: boolean;
}

export const AtmosphereSimulatorModal: React.FC<AtmosphereSimulatorModalProps> = ({
  isOpen,
  onClose,
  atmosphere,
  onApplyAtmosphere,
  onResetToLive,
  isLoadingLive,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePresetClick = (preset: typeof WEATHER_PRESETS[0]) => {
    onApplyAtmosphere({
      ...atmosphere,
      ...preset.data,
      isSimulated: true,
      lastUpdated: 'Simulated Preset',
    } as WeatherAtmosphere);
  };

  const handleSliderChange = (key: keyof WeatherAtmosphere, val: number) => {
    const updated = { ...atmosphere, [key]: val, isSimulated: true };
    if (key === 'temperature') {
      if (val < 14) updated.accentColor = '#38bdf8';
      else if (val < 22) updated.accentColor = '#c084fc';
      else if (val < 28) updated.accentColor = '#fbbf24';
      else updated.accentColor = '#f97316';
    }
    if (key === 'windSpeed') {
      updated.particleDriftSpeed = Math.min(Math.max(val / 10, 0.3), 3.5);
    }
    onApplyAtmosphere(updated);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45"
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-zinc-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-[#fafafa]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-700" />
            <h2 className="text-sm sm:text-base font-mono-custom font-semibold text-black tracking-wider uppercase">
              Atmospheric Controls · Open-Meteo
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close atmospheric controls"
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-mono-custom">
          {/* Current Status Banner */}
          <div className="p-4 bg-[#fafafa] border border-zinc-200 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-600">
                <MapPin className="w-3.5 h-3.5 text-purple-700" />
                <span className="font-semibold text-black">Johannesburg, South Africa</span>
                <span className="text-zinc-500">(-26.2041, 28.0473)</span>
              </div>
              <div className="text-zinc-600">
                Status:{' '}
                {atmosphere.isSimulated ? (
                  <span className="text-amber-700 font-semibold">Simulated Mood</span>
                ) : atmosphere.isCached ? (
                  <span className="text-blue-700 font-semibold">Live (15m Cache)</span>
                ) : (
                  <span className="text-emerald-700 font-semibold">Live Feed</span>
                )}
                {' · '}Updated: {atmosphere.lastUpdated}
              </div>
            </div>

            <button
              type="button"
              onClick={onResetToLive}
              disabled={isLoadingLive}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 text-white hover:bg-purple-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
              <span>Fetch Live Open-Meteo</span>
            </button>
          </div>

          {/* Info Note */}
          <div className="p-3 bg-[#fafafa] border border-zinc-200 flex items-start gap-2 text-zinc-600">
            <Info className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Live Open-Meteo weather parameters dynamically modulate the magazine cover: wind speed dictates 3D particle drift, precipitation adds falling noise, and temperature shifts chromatic tint.
            </p>
          </div>

          {/* Atmospheric Presets */}
          <div>
            <div className="text-zinc-600 uppercase tracking-wider mb-2">
              Simulation Presets
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WEATHER_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="p-3 text-left bg-white border border-zinc-200 hover:border-black hover:bg-[#fafafa] transition-all group cursor-pointer"
                >
                  <div className="font-semibold text-black group-hover:text-purple-700 flex items-center justify-between">
                    <span>{preset.name}</span>
                    <span className="text-[10px] text-zinc-500 tabular-nums">
                      {preset.data.temperature}°C
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-1 leading-normal font-sans">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Parametric Sliders */}
          <div className="space-y-4 pt-2 border-t border-zinc-200">
            <div className="text-zinc-600 uppercase tracking-wider">
              Parametric Overrides
            </div>

            <div>
              <div className="flex justify-between text-zinc-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-700" />
                  <span>Temperature (chromatic tint)</span>
                </span>
                <span className="tabular-nums font-semibold text-purple-700">
                  {atmosphere.temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="38"
                step="0.5"
                value={atmosphere.temperature}
                onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 accent-purple-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-zinc-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-blue-700" />
                  <span>Wind Velocity (point-cloud shear)</span>
                </span>
                <span className="tabular-nums font-semibold text-purple-700">
                  {atmosphere.windSpeed} km/h
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={atmosphere.windSpeed}
                onChange={(e) => handleSliderChange('windSpeed', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 accent-purple-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-zinc-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Precipitation Noise</span>
                </span>
                <span className="tabular-nums font-semibold text-purple-700">
                  {Math.round(atmosphere.rainIntensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={atmosphere.rainIntensity}
                onChange={(e) => handleSliderChange('rainIntensity', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 accent-purple-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#fafafa] border-t border-zinc-200 flex items-center justify-between text-xs font-mono-custom text-zinc-600">
          <div>
            Active Tint:{' '}
            <span
              className="inline-block w-3 h-3 rounded-full ml-1 align-middle border border-zinc-400"
              style={{ backgroundColor: atmosphere.accentColor }}
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-black text-white font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
