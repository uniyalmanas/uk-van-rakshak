"use client";

import React from "react";
import { Trees, Sun, Moon, RefreshCw, Plus, Globe, HelpCircle } from "lucide-react";

interface NavbarProps {
  selectedDivisionId: string;
  onSelectDivision: (id: string) => void;
  onOpenSimulation: () => void;
  onOpenHelp: () => void;
  onOpenReportModal?: () => void;
  onOpenSOSModal?: () => void;
  isOfficerMode?: boolean;
  onToggleOfficerMode?: () => void;
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
  onOpenHelp,
  onOpenReportModal,
  onOpenSOSModal,
  isOfficerMode = false,
  onToggleOfficerMode,
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
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shrink-0 shadow-sm">
            <span className="text-lg">🏔️</span>
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {isHi ? "आपदा-सूत्र उत्तराखंड" : "Aapda-Sutra Uttarakhand"}
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                {isOfficerMode
                  ? (isHi ? "🛡️ आपदा नियंत्रण कक्ष" : "🛡️ Officer Command Console")
                  : (isHi ? "👥 नागरिक व तीर्थयात्री पोर्टल" : "👥 Citizen & Pilgrim Portal")}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              {isHi
                ? "चारधाम मार्ग निकासी, भूस्खलन व बहु-आपदा त्वरित प्रतिक्रिया प्रणाली"
                : "Char Dham Clearance, Landslide & Multi-Hazard Unified Command"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Emergency SOS Button */}
          {onOpenSOSModal && (
            <button
              onClick={onOpenSOSModal}
              title={isHi ? "आपातकालीन संकट संदेश (SOS)" : "Emergency SOS Distress Beacon"}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition flex items-center gap-1.5 shadow-md shadow-rose-600/30 animate-pulse"
            >
              <span className="h-2 w-2 rounded-full bg-white animate-ping" />
              <span>{isHi ? "आपात SOS" : "SOS"}</span>
            </button>
          )}

          {/* Citizen Report Hazard Button (Gemini AI Vision) */}
          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              title={isHi ? "सड़क अवरोध या भूस्खलन की फोटो रिपोर्ट करें" : "Report Hazard with Gemini AI Vision"}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition flex items-center gap-1.5 shadow-xs"
            >
              <span>📸</span>
              <span className="hidden sm:inline">
                {isHi ? "आपदा रिपोर्ट" : "Report Hazard"}
              </span>
            </button>
          )}

          {/* Persona Switcher Toggle (Citizen vs Officer) */}
          {onToggleOfficerMode && (
            <button
              onClick={onToggleOfficerMode}
              title={
                isOfficerMode
                  ? (isHi ? "नागरिक दृश्य में बदलें" : "Switch to Citizen View")
                  : (isHi ? "अधिकारी / नियंत्रण कक्ष मोड में बदलें" : "Switch to Officer Console")
              }
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                isOfficerMode
                  ? "bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <span>{isOfficerMode ? "🛡️" : "👥"}</span>
              <span className="hidden lg:inline">
                {isOfficerMode ? (isHi ? "अधिकारी मोड" : "Officer") : (isHi ? "नागरिक मोड" : "Citizen")}
              </span>
            </button>
          )}

          {/* Division Selector */}
          <select
            value={selectedDivisionId}
            onChange={(e) => onSelectDivision(e.target.value)}
            className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md px-2 sm:px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer max-w-[130px] sm:max-w-[200px] truncate"
          >
            <option value="all_uk">
              {isHi ? "🌐 संपूर्ण उत्तराखंड (समस्त चारधाम)" : "🌐 All Uttarakhand (All Corridors)"}
            </option>
            <option value="nainital">
              {isHi ? "नैनीताल / कुमाऊं प्रभाग" : "Nainital / Kumaon"}
            </option>
            <option value="almora">
              {isHi ? "अल्मोड़ा / पिथौरागढ़ प्रभाग" : "Almora / Pithoragarh"}
            </option>
            <option value="dehradun">
              {isHi ? "देहरादून / ऋषिकेश गेटवे" : "Dehradun / Rishikesh"}
            </option>
            <option value="pauri">
              {isHi ? "पौड़ी / श्रीनगर गढ़वाल" : "Pauri / Srinagar Garhwal"}
            </option>
            <option value="corbett">
              {isHi ? "रुद्रप्रयाग / चमोली (केदार-बद्री)" : "Rudraprayag / Chamoli"}
            </option>
          </select>

          {/* Sync Satellite Feed */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title={isHi ? "उपग्रह डेटा रिफ्रेश करें" : "Sync Satellite Data"}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600 dark:text-emerald-400" : ""}`}
            />
            <span className="hidden xl:inline">
              {isHi ? "रिफ्रेश" : "Sync"}
            </span>
          </button>

          {/* Help & SOP Guide Button */}
          <button
            onClick={onOpenHelp}
            title={isHi ? "उपयोगकर्ता मार्गदर्शिका एवं SOP" : "User Manual & Field Guide"}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">{isHi ? "SOP" : "Help"}</span>
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
        </div>
      </div>
    </header>
  );
};
