"use client";

import React from "react";
import { Flame, Radio, Shield, Bell, PlusCircle, RefreshCw } from "lucide-react";

interface NavbarProps {
  selectedDivisionId: string;
  onSelectDivision: (id: string) => void;
  onOpenSimulation: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalHotspots: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedDivisionId,
  onSelectDivision,
  onOpenSimulation,
  onRefresh,
  isRefreshing,
  totalHotspots,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0c1222]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Division Info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Flame className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                UK Van-Rakshak
                <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
                  GIS COMMAND
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Uttarakhand Forest Department • Hyper-Local Division Dispatch
            </p>
          </div>
        </div>

        {/* Division Selector & Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedDivisionId}
              onChange={(e) => onSelectDivision(e.target.value)}
              className="bg-slate-900 text-sm font-medium text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:border-slate-600 transition cursor-pointer"
            >
              <option value="nainital">Nainital Forest Division (Kumaon)</option>
              <option value="almora">Almora Forest Division (Kumaon)</option>
            </select>
          </div>

          {/* Refresh NASA Feed Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Satellite Hotspots"
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 transition flex items-center gap-1 text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
            <span className="hidden md:inline">Sync Satellite</span>
          </button>

          {/* Simulate Fire Drill Button */}
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md shadow-red-900/30 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simulate Incident</span>
          </button>
        </div>
      </div>
    </header>
  );
};
