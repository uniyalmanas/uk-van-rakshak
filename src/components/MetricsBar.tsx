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
  corridors?: any[];
  machineryCount?: number;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  division,
  hotspots,
  lang,
  satelliteFeedInfo,
  corridors = [],
  machineryCount = 6,
}) => {
  const isHi = lang === "hi";
  
  // Multi-hazard breakdown
  const activeCount = hotspots.filter((h) => h.status === "active" || h.status === "in_progress").length;
  const landslideCount = hotspots.filter((h) => h.type === "landslide").length;
  const floodCount = hotspots.filter((h) => h.type === "cloudburst").length;
  const blockedCorridorsCount = corridors.filter((c) => c.status === "blocked").length;
  const cautionCorridorsCount = corridors.filter((c) => c.status === "caution").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
      {/* Metric 1: Active Multi-Hazard Incidents */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 transition-colors shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {isHi ? "सक्रिय आपदाएं" : "Active Incidents"}
          </span>
          <span className="text-sm">⚠️</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {activeCount}
          </span>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
            {activeCount > 0 ? (isHi ? "राहत कार्य जारी" : "Action In Progress") : (isHi ? "शांत" : "Normal")}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
          🪨 {landslideCount} {isHi ? "भूस्खलन" : "landslide"} • 🌧️ {floodCount} {isHi ? "अतिवृष्टि" : "flood"}
        </div>
      </div>

      {/* Metric 2: Char Dham Corridor Blockages */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 transition-colors shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {isHi ? "चारधाम राजमार्ग स्थिति" : "Char Dham Corridors"}
          </span>
          <span className="text-sm">🛣️</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className={`text-xl sm:text-2xl font-bold ${blockedCorridorsCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
            {blockedCorridorsCount > 0 ? `${blockedCorridorsCount} Blocked` : "All Clear"}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {cautionCorridorsCount} {isHi ? "सावधानी मार्ग" : "caution"} • NH-58, NH-107, NH-34
        </div>
      </div>

      {/* Metric 3: Heavy Machinery & PWD/BRO Response */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 transition-colors shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {isHi ? "राहत मशीनरी (JCB)" : "Deployed Machinery"}
          </span>
          <span className="text-sm">🚜</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {machineryCount}
          </span>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            {isHi ? "PWD / BRO तैनात" : "Excavators Active"}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {isHi ? "मलबा निकासी व सड़क मरम्मत" : "Clearing debris & rock falls"}
        </div>
      </div>

      {/* Metric 4: Google Gemini AI & NASA VIIRS Telemetry */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 transition-colors shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {isHi ? "गूगल AI एवं उपग्रह" : "Gemini AI & Telemetry"}
          </span>
          <span className="text-sm">✨</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Gemini 2.5 Flash + VIIRS
          </span>
        </div>
        <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="truncate">
            {isHi ? "स्वचालित फोटो छंटनी व SitRep" : "Vision Triage & Live SitRep"}
          </span>
        </div>
      </div>
    </div>
  );
};
