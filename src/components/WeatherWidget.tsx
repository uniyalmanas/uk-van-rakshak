"use client";

import React, { useEffect, useState } from "react";
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  RefreshCw,
  Compass,
  Mountain
} from "lucide-react";

interface WeatherWidgetProps {
  division: any;
  lang: "en" | "hi";
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ division, lang }) => {
  const isHi = lang === "hi";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const lat = division?.center?.[0] || 29.3888;
      const lon = division?.center?.[1] || 79.4552;
      const res = await fetch(`/api/weather?division=${division?.id}&lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load weather widget:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [division?.id]);

  const fwi = data?.fwi;
  const weather = data?.weather;

  return (
    <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 mb-4 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center shrink-0">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {isHi ? "लाइव पहाड़ी मौसम एवं वनाग्नि सूचकांक (FWI)" : "Live Mountain Weather & Fire Weather Index (FWI)"}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                Open-Meteo • {division?.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isHi
                ? "चीड़ वनों हेतु सूक्ष्म-जलवायु एवं पिरुल प्रज्वलनशीलता पूर्वानुमान"
                : "Micro-climate telemetry & Chir Pine fuel desiccation telemetry"}
            </p>
          </div>
        </div>

        {/* FWI Category Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {loading ? (
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
          ) : (
            <span
              style={{
                backgroundColor: `${fwi?.color}15`,
                borderColor: `${fwi?.color}40`,
                color: fwi?.color,
              }}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isHi ? fwi?.category_hi : fwi?.category} (FWI: {fwi?.score}/100)</span>
            </span>
          )}

          <button
            onClick={fetchWeather}
            title={isHi ? "मौसम डेटा रिफ्रेश करें" : "Refresh Weather"}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Weather Metrics & Advisory Grid */}
      <div className="pt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Metric 1: Temperature */}
        <div className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-rose-500" />
            {isHi ? "तापमान" : "Air Temperature"}
          </span>
          <div className="mt-1 font-bold text-sm text-slate-900 dark:text-white">
            {loading ? "..." : `${weather?.temperature_c}°C`}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {isHi ? "ऊंचाई:" : "Elevation:"} {data?.elevation_meters || 1940}m
          </div>
        </div>

        {/* Metric 2: Relative Humidity */}
        <div className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Droplets className="w-3 h-3 text-sky-500" />
            {isHi ? "सापेक्ष आर्द्रता" : "Relative Humidity"}
          </span>
          <div className="mt-1 font-bold text-sm text-slate-900 dark:text-white">
            {loading ? "..." : `${weather?.relative_humidity_percent}%`}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            {weather?.relative_humidity_percent < 30
              ? (isHi ? "अत्यंत शुष्क (संवेदनशील)" : "Critically Dry")
              : (isHi ? "सामान्य आर्द्रता" : "Normal Moisture")}
          </div>
        </div>

        {/* Metric 3: Wind Velocity & Direction */}
        <div className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Wind className="w-3 h-3 text-amber-500" />
            {isHi ? "हवा की गति" : "Wind Velocity"}
          </span>
          <div className="mt-1 font-bold text-sm text-slate-900 dark:text-white">
            {loading ? "..." : `${weather?.wind_speed_kmh} km/h`}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Compass className="w-2.5 h-2.5 text-slate-400" />
            <span>{weather?.wind_cardinal} ({weather?.wind_direction_deg}°)</span>
          </div>
        </div>

        {/* Metric 4: Pine Fuel Desiccation */}
        <div className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Mountain className="w-3 h-3 text-emerald-500" />
            {isHi ? "पिरुल ईंधन स्थिति" : "Pine Litter Hazard"}
          </span>
          <div className="mt-1 font-semibold text-xs text-amber-700 dark:text-amber-400 truncate">
            {loading ? "..." : (isHi ? fwi?.pine_litter_status_hi : fwi?.pine_litter_status)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {isHi ? "चीड़ ढलान खतरा" : "Ridge Upslope Spread"}
          </div>
        </div>
      </div>

      {/* Advisory Bar */}
      {!loading && fwi?.advisory && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0">
            {isHi ? "वन प्रबंधन परामर्श:" : "Field Advisory:"}
          </span>
          <span className="truncate sm:whitespace-normal">
            {isHi ? fwi.advisory_hi : fwi.advisory}
          </span>
        </div>
      )}
    </div>
  );
};
