"use client";

import React, { useState } from "react";
import { X, Flame, Wind, Mountain, Send, Play } from "lucide-react";

interface SimulationModalProps {
  isOpen: boolean;
  division: any;
  onClose: () => void;
  onAddIncident: (incident: any) => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  division,
  onClose,
  onAddIncident,
}) => {
  const [selectedRange, setSelectedRange] = useState(division?.ranges?.[0]?.name || "Nainital Range");
  const [intensity, setIntensity] = useState<"high" | "nominal">("high");
  const [windSpeed, setWindSpeed] = useState("18");
  const [windDirection, setWindDirection] = useState("North-East (45°)");

  if (!isOpen) return null;

  const handleCreate = () => {
    // Generate a point within the division bounding box
    const baseLat = division?.center?.[0] || 29.39;
    const baseLon = division?.center?.[1] || 79.45;
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lonOffset = (Math.random() - 0.5) * 0.05;

    const newSimIncident = {
      id: `SIM-DRILL-${Math.floor(1000 + Math.random() * 9000)}`,
      division_id: division.id,
      latitude: Number((baseLat + latOffset).toFixed(4)),
      longitude: Number((baseLon + lonOffset).toFixed(4)),
      brightness_kelvin: intensity === "high" ? 342.5 : 318.0,
      confidence: intensity,
      confidence_percent: intensity === "high" ? 95 : 78,
      frp_mw: intensity === "high" ? 32.4 : 14.2,
      satellite: "SIMULATED DRILL (VIIRS 375m Equivalent)",
      detected_at: "Just Now (Live Drill)",
      range_name: selectedRange,
      nearest_beat: `${selectedRange} Sector 2`,
      elevation_meters: 1980,
      slope_aspect: "South-Facing (31° slope)",
      fuel_type: "Dry Pine Litter & Oak Understory",
      wind_speed_kmh: Number(windSpeed),
      wind_direction: windDirection,
      spread_risk: "DRILL SIMULATION - Rapid upslope propagation modeled",
      status: "active",
      assigned_guard: division?.beat_officers?.[0]?.name || "Field Officer",
      is_simulation: true,
    };

    onAddIncident(newSimIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Play className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Simulate Forest Fire Drill
              </h2>
              <p className="text-[11px] text-slate-400">
                Test early detection, terrain vectors & dispatch without false alarms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Target Division & Range:
            </label>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-medium flex justify-between items-center mb-2">
              <span>{division?.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Polygon Locked
              </span>
            </div>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 font-medium focus:ring-1 focus:ring-orange-500 focus:outline-none"
            >
              {division?.ranges?.map((range: any) => (
                <option key={range.id} value={range.name}>
                  {range.name} ({range.officer})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Thermal Intensity:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIntensity("high")}
                  className={`p-2 rounded-lg border text-center font-bold transition ${
                    intensity === "high"
                      ? "bg-red-500/20 text-red-400 border-red-500/50"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  🔥 Critical
                </button>
                <button
                  type="button"
                  onClick={() => setIntensity("nominal")}
                  className={`p-2 rounded-lg border text-center font-bold transition ${
                    intensity === "nominal"
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  ⚡ Moderate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Simulated Wind Speed:
              </label>
              <input
                type="number"
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 font-medium focus:ring-1 focus:ring-orange-500 focus:outline-none"
                placeholder="km/h"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Wind Vector & Spread Axis:
            </label>
            <select
              value={windDirection}
              onChange={(e) => setWindDirection(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 font-medium focus:ring-1 focus:ring-orange-500 focus:outline-none"
            >
              <option value="North-East (45°)">North-East (45°) — Spreading upslope toward ridge</option>
              <option value="North-West (315°)">North-West (315°) — Spreading toward village buffer</option>
              <option value="South-East (135°)">South-East (135°) — Descending valley ravine</option>
              <option value="Calm (0°)">Calm — Localized ground smolder</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold p-3 rounded-xl shadow-lg shadow-orange-950/40 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Flame className="w-4 h-4" />
              <span>Deploy Incident to Live GIS Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
