"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Clock,
  PhoneCall,
  ExternalLink,
  Truck,
  Sparkles,
  CheckCircle2,
  Navigation,
  Send,
} from "lucide-react";

interface DisasterDrawerProps {
  incident: any | null;
  onClose: () => void;
  onUpdateStatus?: (id: string, newStatus: string, progress: number) => void;
  lang: "en" | "hi";
  isOfficerMode?: boolean;
}

export const DisasterDrawer: React.FC<DisasterDrawerProps> = ({
  incident,
  onClose,
  onUpdateStatus,
  lang,
  isOfficerMode = false,
}) => {
  const isHi = lang === "hi";
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  if (!incident) return null;

  const mapsUrl = `https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`;

  const handleStatusChange = (status: string, progress: number) => {
    if (onUpdateStatus) {
      onUpdateStatus(incident.id, status, progress);
    }
  };

  const handleBroadcastAlert = async () => {
    setDispatchStatus("sending");
    try {
      const res = await fetch("/api/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotspot: {
            id: incident.id,
            division_id: incident.corridor_id || "uttarakhand",
            range_name: incident.location_name,
            nearest_beat: incident.road_status,
            satellite: "Aapda-Sutra Multi-Hazard Grid (Gemini AI)",
            brightness_kelvin: 320,
            frp_mw: incident.severity_score * 10,
            wind_speed_kmh: 15,
            wind_direction: "Mountain Ridge",
            elevation_meters: incident.elevation_m || 1500,
            slope_aspect: incident.severity,
            spread_risk: incident.title,
            latitude: incident.latitude,
            longitude: incident.longitude,
            assigned_guard: incident.assigned_unit || "SDRF Fast Response",
          },
          guardName: incident.assigned_unit,
          guardPhone: incident.assigned_phone,
        }),
      });

      if (res.ok) {
        setDispatchStatus("sent");
        setTimeout(() => setDispatchStatus(null), 3000);
      }
    } catch {
      setDispatchStatus("error");
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:max-w-md max-h-[88vh] sm:max-h-full bg-white dark:bg-[#0f1522] border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[100] flex flex-col rounded-t-2xl sm:rounded-none transition-transform duration-200 ease-out">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 rounded-t-2xl sm:rounded-none">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider ${
                incident.severity === "CRITICAL"
                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
                  : incident.severity === "HIGH"
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60"
                  : "bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400"
              }`}
            >
              {incident.severity}
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {incident.id}
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug truncate">
            {isHi ? incident.title_hi || incident.title : incident.title}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
            <span className="truncate">{isHi ? incident.location_name_hi || incident.location_name : incident.location_name}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {/* Road & Clearance Status Card */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              {isHi ? "सड़क की वर्तमान स्थिति:" : "Current Route Status:"}
            </span>
            <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              {isHi ? incident.road_status_hi || incident.road_status : incident.road_status}
            </span>
          </div>

          {/* Clearance Progress Bar */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 text-slate-500">
              <span>{isHi ? "मलबा निस्तारण प्रगति:" : "Debris Clearance Progress:"}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {incident.clearance_progress || 40}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${incident.clearance_progress || 40}%` }}
              />
            </div>
          </div>
        </div>

        {/* Gemini AI Triage Card */}
        {incident.ai_analysis && (
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11.5px] text-emerald-900 dark:text-emerald-200 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {isHi ? "गूगल जेमिनी AI विश्लेषण" : "Google Gemini AI Assessment"}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200/70 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                Confidence: {incident.ai_analysis.confidence || 95}%
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
              {incident.ai_analysis.description}
            </p>
            {incident.ai_analysis.machinery_deployed && (
              <div className="pt-1.5 border-t border-emerald-200 dark:border-emerald-800/40 text-[10.5px] text-emerald-700 dark:text-emerald-400">
                <span>🚜 {isHi ? "तैनात मशीनरी:" : "Machinery:"} </span>
                <b>{incident.ai_analysis.machinery_deployed.join(", ")}</b>
              </div>
            )}
          </div>
        )}

        {/* Deployed Rescue / Machinery Unit */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 space-y-2">
          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              {isHi ? "तैनात राहत बल / जेसीबी दल" : "Assigned Relief Unit / Machinery"}
            </span>
            <Clock className="w-3 h-3 text-slate-400" />
          </div>
          <div className="text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100">
              {incident.assigned_unit || "PWD Fast Response Squad"}
            </div>
            <div className="flex items-center justify-between pt-1">
              <a
                href={`tel:${incident.assigned_phone || "1070"}`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-semibold text-[11px] hover:bg-emerald-100 transition"
              >
                <PhoneCall className="w-3 h-3" />
                <span>{incident.assigned_phone || "Call Control Room"}</span>
              </a>
              <span className="text-[10.5px] text-slate-400">
                {incident.reported_at}
              </span>
            </div>
          </div>
        </div>

        {/* Google Maps Turn-by-Turn GPS Route */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">
              {isHi ? "गूगल मैप्स नेविगेशन:" : "Google Maps Navigation:"}
            </span>
            <span className="font-mono text-[10.5px] text-slate-700 dark:text-slate-300">
              {incident.latitude}° N, {incident.longitude}° E
            </span>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{isHi ? "गूगल मैप्स में रास्ता देखें (GPS Route)" : "Open in Google Maps (Turn-by-Turn)"}</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>

        {/* Officer Action Panel (Only if Officer Mode is enabled) */}
        {isOfficerMode && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2.5 border border-slate-700">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              {isHi ? "अधिकारी नियंत्रण पैनल (SDRF / PWD)" : "Command Triage Panel (SDRF / PWD)"}
            </span>

            <div className="grid grid-cols-3 gap-1.5 text-[10.5px]">
              <button
                type="button"
                onClick={() => handleStatusChange("dispatched", 30)}
                className="py-1.5 px-2 rounded-lg bg-amber-600 hover:bg-amber-700 font-medium text-center"
              >
                Dispatch JCB
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("single_lane", 70)}
                className="py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-700 font-medium text-center"
              >
                Single Lane
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("cleared", 100)}
                className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-medium text-center"
              >
                Fully Open
              </button>
            </div>

            <button
              type="button"
              onClick={handleBroadcastAlert}
              disabled={dispatchStatus === "sending"}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Send className="w-3 h-3 text-emerald-400" />
              <span>
                {dispatchStatus === "sending"
                  ? "Broadcasting Telegram..."
                  : dispatchStatus === "sent"
                  ? "Alert Broadcasted Successfully!"
                  : "Push Telegram Alert to Relief Squad"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
