"use client";

import React, { useState } from "react";
import { X, Flame, Play } from "lucide-react";

interface SimulationModalProps {
  isOpen: boolean;
  division: any;
  onClose: () => void;
  onAddIncident: (incident: any) => void;
  lang: "en" | "hi";
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  division,
  onClose,
  onAddIncident,
  lang,
}) => {
  const isHi = lang === "hi";
  const [selectedRange, setSelectedRange] = useState(division?.ranges?.[0]?.name || "Nainital Range");
  const [intensity, setIntensity] = useState<"high" | "nominal">("high");
  const [windSpeed, setWindSpeed] = useState("16");
  const [windDirection, setWindDirection] = useState("North-East");

  if (!isOpen) return null;

  const handleCreate = () => {
    const baseLat = division?.center?.[0] || 29.39;
    const baseLon = division?.center?.[1] || 79.45;
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lonOffset = (Math.random() - 0.5) * 0.05;

    const newSimIncident = {
      id: `DRILL-${Math.floor(1000 + Math.random() * 9000)}`,
      division_id: division.id,
      latitude: Number((baseLat + latOffset).toFixed(4)),
      longitude: Number((baseLon + lonOffset).toFixed(4)),
      brightness_kelvin: intensity === "high" ? 336.5 : 316.0,
      confidence: intensity,
      confidence_percent: intensity === "high" ? 92 : 74,
      frp_mw: intensity === "high" ? 28.4 : 12.0,
      satellite: "Simulated Test Drill (VIIRS 375m)",
      detected_at: isHi ? "अभी दर्ज (प्रशिक्षण)" : "Just Now (Training Drill)",
      range_name: selectedRange,
      nearest_beat: `${selectedRange} Sector Beat`,
      elevation_meters: 1960,
      slope_aspect: "South-Facing (28° slope)",
      fuel_type: "Chir Pine Needle Bed",
      wind_speed_kmh: Number(windSpeed),
      wind_direction: windDirection,
      spread_risk: isHi
        ? "मॉक ड्रिल - चीड़ वन में ऊपर की ओर फैलाव का अनुमान"
        : "TRAINING DRILL - Upslope ridge spread simulated",
      status: "active",
      assigned_guard: division?.beat_officers?.[0]?.name || "Duty Guard",
      is_simulation: true,
    };

    onAddIncident(newSimIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111723] border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                {isHi ? "वनाग्नि मॉक ड्रिल जोड़ें" : "Simulate Incident Drill"}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {isHi ? "त्वरित प्रतिक्रिया एवं परीक्षण हेतु" : "Test dispatch workflow without false alarms"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 text-[11px]">
              {isHi ? "लक्षित रेंज चुनें:" : "Select Target Range:"}
            </label>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-200 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              {division?.ranges?.map((range: any) => (
                <option key={range.id} value={range.name}>
                  {range.name} ({range.officer})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 text-[11px]">
                {isHi ? "आग की तीव्रता:" : "Thermal Intensity:"}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setIntensity("high")}
                  className={`p-1.5 rounded-md border text-center font-medium transition ${
                    intensity === "high"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {isHi ? "उच्च" : "High"}
                </button>
                <button
                  type="button"
                  onClick={() => setIntensity("nominal")}
                  className={`p-1.5 rounded-md border text-center font-medium transition ${
                    intensity === "nominal"
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {isHi ? "मध्यम" : "Moderate"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 text-[11px]">
                {isHi ? "हवा की गति (km/h):" : "Wind Speed (km/h):"}
              </label>
              <input
                type="number"
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-1.5 text-slate-900 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 text-[11px]">
              {isHi ? "हवा की दिशा:" : "Wind Direction:"}
            </label>
            <select
              value={windDirection}
              onChange={(e) => setWindDirection(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="North-East">North-East (उत्तर-पूर्व) — Upslope Ridge</option>
              <option value="North-West">North-West (उत्तर-पश्चिम) — Valley Ridge</option>
              <option value="South-East">South-East (दक्षिण-पूर्व) — Road Buffer</option>
              <option value="Calm">Calm (शांत) — Ground Litter</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCreate}
              className="w-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium p-2.5 rounded-md transition shadow-sm flex items-center justify-center gap-1.5 text-xs"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isHi ? "मानचित्र पर मॉक ड्रिल जोड़ें" : "Deploy Drill to Map"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
