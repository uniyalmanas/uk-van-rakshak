"use client";

import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";

interface CorridorStatusBarProps {
  corridors: any[];
  selectedCorridorId: string;
  onSelectCorridor: (id: string) => void;
  onOpenSitrepModal: () => void;
  lang: "en" | "hi";
}

export const CorridorStatusBar: React.FC<CorridorStatusBarProps> = ({
  corridors,
  selectedCorridorId,
  onSelectCorridor,
  onOpenSitrepModal,
  lang,
}) => {
  const isHi = lang === "hi";

  return (
    <div className="mb-4 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>🛣️</span>
            {isHi ? "चारधाम राजमार्ग लाइव स्थिति" : "Char Dham Highway Corridor Status"}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-semibold">
            Live 24x7
          </span>
        </div>

        <button
          onClick={onOpenSitrepModal}
          className="self-start sm:self-auto text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 px-2.5 py-1 rounded-lg hover:bg-purple-100 transition flex items-center gap-1.5 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>{isHi ? "जेमिनी AI दैनिक स्थिति रिपोर्ट (SitRep)" : "Gemini AI Daily SitRep"}</span>
        </button>
      </div>

      {/* Corridor Segment Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {corridors.map((c) => {
          const isSelected = selectedCorridorId === c.id;
          const isBlocked = c.status === "blocked";
          const isCaution = c.status === "caution";

          return (
            <button
              key={c.id}
              onClick={() => onSelectCorridor(c.id)}
              className={`p-2.5 rounded-xl border text-left transition relative ${
                isSelected
                  ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/60 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {c.id.toUpperCase()}
                </span>
                {isBlocked ? (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                ) : isCaution ? (
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </div>

              <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                {c.pilgrimage.split(" ")[0]} Route
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    isBlocked
                      ? "text-rose-600 dark:text-rose-400"
                      : isCaution
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {isBlocked
                    ? isHi ? "मार्ग बंद" : "Blocked"
                    : isCaution
                    ? isHi ? "सावधानी" : "Single-Lane"
                    : isHi ? "सुचारू" : "Clear / Open"}
                </span>

                <span className="text-[10px] text-slate-400 font-mono">
                  {c.active_blockages > 0 ? `${c.active_blockages} slide` : "0 block"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
