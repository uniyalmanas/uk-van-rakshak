"use client";

import React from "react";
import { Trees, Sun, Moon, RefreshCw, Plus, Globe } from "lucide-react";

interface NavbarProps {
  selectedDivisionId: string;
  onSelectDivision: (id: string) => void;
  onOpenSimulation: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  lang: "en" | "hi";
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedDivisionId,
  onSelectDivision,
  onOpenSimulation,
  onRefresh,
  isRefreshing,
  theme,
  onToggleTheme,
  lang,
  onToggleLang,
}) => {
  const isHi = lang === "hi";

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0d131d]/95 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* State Department Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Trees className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-900 dark:text-white truncate">
                {isHi ? "उत्तराखंड वन विभाग" : "Uttarakhand Forest Department"}
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                {isHi ? "वनाग्नि नियंत्रण कक्ष" : "Fire Dispatch Cell"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              {isHi
                ? "प्रभाग-स्तरीय वास्तविक समय निगरानी एवं त्वरित गश्ती प्रबंधन"
                : "Division-Level Satellite Monitoring & Field Patrol Management"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Division Selector */}
          <select
            value={selectedDivisionId}
            onChange={(e) => onSelectDivision(e.target.value)}
            className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md px-2 sm:px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer max-w-[130px] sm:max-w-[200px] truncate"
          >
            <option value="nainital">
              {isHi ? "नैनीताल वन प्रभाग" : "Nainital Division"}
            </option>
            <option value="almora">
              {isHi ? "अल्मोड़ा वन प्रभाग" : "Almora Division"}
            </option>
          </select>

          {/* Sync Satellite Feed */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title={isHi ? "उपग्रह डेटा रिफ्रेश करें" : "Sync Satellite Data"}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600 dark:text-emerald-400" : ""}`}
            />
            <span className="hidden lg:inline">
              {isHi ? "रिफ्रेश" : "Sync Feed"}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            title={isHi ? "Switch to English" : "हिन्दी में देखें"}
            className="px-2 py-1.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{isHi ? "EN" : "हिन्दी"}</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-1.5 rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>

          {/* Run Drill Button */}
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-md transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isHi ? "मॉक ड्रिल जोड़ें" : "Simulate Incident"}
            </span>
            <span className="sm:hidden">{isHi ? "ड्रिल" : "Drill"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
