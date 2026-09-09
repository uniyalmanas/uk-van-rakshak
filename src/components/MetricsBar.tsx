"use client";

import React from "react";
import { Flame, ShieldCheck, Wind, Satellite, Mountain } from "lucide-react";

interface MetricsBarProps {
  division: any;
  hotspots: any[];
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ division, hotspots }) => {
  const activeCount = hotspots.filter((h) => h.status === "active").length;
  const dispatchedCount = hotspots.filter((h) => h.status === "dispatched").length;
  const containedCount = hotspots.filter((h) => h.status === "contained" || h.status === "resolved").length;
  const highRiskCount = hotspots.filter((h) => h.confidence === "high" || h.frp_mw > 20).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {/* Active Hotspots Metric */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Active Division Hotspots</span>
          <Flame className="w-4 h-4 text-red-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{activeCount}</span>
          <span className="text-xs text-red-400 font-medium">{highRiskCount} High Risk</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          {dispatchedCount} Dispatched • {containedCount} Contained
        </div>
      </div>

      {/* Field Guards Patrol Metric */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Beat Staff Deployed</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{division?.beat_officers?.length || 4}</span>
          <span className="text-xs text-emerald-400 font-medium">100% Ready</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 truncate">
          HQ: {division?.headquarters || "Uttarakhand"}
        </div>
      </div>

      {/* Pine Needle (Pirul) Hazard & Fuel Load */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Dominant Fuel Load</span>
          <Mountain className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-sm font-bold text-amber-300 truncate">Chir Pine (Pirul)</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          Slope Hazard: 25°-35° Ridge
        </div>
      </div>

      {/* Satellite Telemetry Pass */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Satellite Sensor Layer</span>
          <Satellite className="w-4 h-4 text-sky-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-sm font-bold text-sky-300">VIIRS 375m / MODIS</span>
        </div>
        <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          NRT Feed Connected
        </div>
      </div>
    </div>
  );
};
