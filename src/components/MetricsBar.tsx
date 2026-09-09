"use client";

import React from "react";
import { Flame, Users, Mountain, Satellite } from "lucide-react";

interface MetricsBarProps {
  division: any;
  hotspots: any[];
  lang: "en" | "hi";
  satelliteFeedInfo?: {
    source: string;
    isLive: boolean;
    apiConnected: boolean;
    liveCount: number;
    message?: string;
  };
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  division,
  hotspots,
  lang,
  satelliteFeedInfo,
}) => {
  const isHi = lang === "hi";
  const activeCount = hotspots.filter((h) => h.status === "active").length;
  const dispatchedCount = hotspots.filter((h) => h.status === "dispatched").length;
  const containedCount = hotspots.filter((h) => h.status === "contained" || h.status === "resolved").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
      {/* Metric 1: Active Detections */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg p-3 transition-colors">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-medium">
            {isHi ? "सक्रिय वनाग्नि बिंदु" : "Active Hotspots"}
          </span>
          <Flame className="w-4 h-4 text-rose-600 dark:text-rose-500" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {activeCount}
          </span>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            {activeCount > 0 ? (isHi ? "निगरानी जारी" : "Action Required") : (isHi ? "शून्य" : "Clear")}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {dispatchedCount} {isHi ? "दल रवाना" : "dispatched"} • {containedCount} {isHi ? "नियंत्रित" : "contained"}
        </div>
      </div>

      {/* Metric 2: Deployed Beat Staff */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg p-3 transition-colors">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-medium">
            {isHi ? "तैनात वन कर्मी" : "Field Guards on Duty"}
          </span>
          <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {division?.beat_officers?.length || 4}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {isHi ? "सक्रिय गश्त" : "On Patrol"}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {division?.headquarters || "Uttarakhand"}
        </div>
      </div>

      {/* Metric 3: Fuel Type & Elevation */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg p-3 transition-colors">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-medium">
            {isHi ? "ईंधन भार (पिरुल)" : "Fuel Hazard (Pine Litter)"}
          </span>
          <Mountain className="w-4 h-4 text-amber-600 dark:text-amber-500" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {isHi ? "चीड़ पिरुल (सूखा)" : "Chir Pine Needle Bed"}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {isHi ? "ढलान: 20°-35° दक्षिण" : "Slope: 20°-35° South Ridge"}
        </div>
      </div>

      {/* Metric 4: ISRO & NASA Satellite Constellation Telemetry */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg p-3 transition-colors">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-medium">
            {isHi ? "इसरो एवं नासा उपग्रह" : "ISRO & NASA Constellation"}
          </span>
          <Satellite className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            VIIRS 375m + CartoDEM
          </span>
        </div>
        <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="truncate">
            {satelliteFeedInfo?.isLive
              ? (isHi ? "नासा FIRMS सक्रिय (लाइव फ़ीड)" : "NASA FIRMS Live Connected")
              : (isHi ? "उपग्रह लिंक सक्रिय" : "Satellite Link Active")}
          </span>
        </div>
      </div>
    </div>
  );
};
