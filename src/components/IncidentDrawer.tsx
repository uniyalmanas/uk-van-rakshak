"use client";

import React, { useState } from "react";
import { 
  X, 
  Send, 
  MapPin, 
  Wind, 
  Flame, 
  Shield, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  AlertTriangle,
  Radio,
  Check,
  Phone
} from "lucide-react";

interface IncidentDrawerProps {
  hotspot: any | null;
  division: any;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: string, assignedGuard?: string) => void;
}

export const IncidentDrawer: React.FC<IncidentDrawerProps> = ({
  hotspot,
  division,
  onClose,
  onUpdateStatus,
}) => {
  const [selectedGuard, setSelectedGuard] = useState<string>(
    hotspot?.assigned_guard || division?.beat_officers?.[0]?.name || ""
  );
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [alertSuccessMessage, setAlertSuccessMessage] = useState<string | null>(null);

  if (!hotspot) return null;

  const handleDispatchTelegram = async () => {
    setIsSendingAlert(true);
    setAlertSuccessMessage(null);
    try {
      const guardObj = division?.beat_officers?.find((g: any) => g.name === selectedGuard);
      const res = await fetch("/api/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotspot,
          guardName: selectedGuard,
          guardPhone: guardObj?.phone || "+91 98371 29482",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertSuccessMessage(
          data.delivered
            ? "Live Telegram alert delivered to officer phone!"
            : "Simulated dispatch alert sent to field guard!"
        );
        onUpdateStatus(hotspot.id, "dispatched", selectedGuard);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingAlert(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 animate-pulse" /> Active Fire</span>;
      case "dispatched":
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Guard Dispatched</span>;
      case "contained":
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Under Control</span>;
      case "resolved":
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Extinguished</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0d1424] border-l border-slate-800 shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-in-out">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-none">
              Incident {hotspot.id}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">
              Detected: {hotspot.detected_at}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(hotspot.status)}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Satellite Telemetry Card */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            Satellite Sensor Telemetry
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Brightness Temp</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {hotspot.brightness_kelvin} K
              </span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Fire Radiative Power</span>
              <span className="font-mono font-bold text-red-400 text-sm">
                {hotspot.frp_mw} MW
              </span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Confidence Level</span>
              <span className="font-bold text-emerald-400 text-xs capitalize">
                {hotspot.confidence} ({hotspot.confidence_percent}%)
              </span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Sensor Platform</span>
              <span className="font-medium text-slate-300 text-xs">
                {hotspot.satellite}
              </span>
            </div>
          </div>
        </div>

        {/* Mountain Terrain & Spread Hazard */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-amber-400" />
            Mountain Terrain & Spread Hazard
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Elevation & Slope:</span>
              <span className="font-medium text-slate-200">
                {hotspot.elevation_meters}m • {hotspot.slope_aspect}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Forest Fuel Bed:</span>
              <span className="font-medium text-amber-300">
                {hotspot.fuel_type}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Wind Direction & Speed:</span>
              <span className="font-medium text-sky-300">
                {hotspot.wind_speed_kmh} km/h • {hotspot.wind_direction}
              </span>
            </div>
            <div className="p-2 rounded bg-red-950/40 border border-red-900/40 text-red-300 text-[11px] font-medium flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{hotspot.spread_risk}</span>
            </div>
          </div>
        </div>

        {/* Closed-Loop Beat Officer Dispatch */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Field Officer Assignment & Dispatch
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Assign Nearest Beat Guard / Van Karmi:
              </label>
              <select
                value={selectedGuard}
                onChange={(e) => setSelectedGuard(e.target.value)}
                className="w-full bg-slate-950 text-xs font-medium text-slate-200 border border-slate-700 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                {division?.beat_officers?.map((officer: any) => (
                  <option key={officer.id} value={officer.name}>
                    {officer.name} ({officer.beat} • {officer.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Google Maps Direct Navigation Link */}
            <a
              href={`https://www.google.com/maps?q=${hotspot.latitude},${hotspot.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 text-xs text-sky-400 bg-sky-950/40 border border-sky-800/50 hover:bg-sky-900/40 p-2 rounded-lg transition"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open Exact Coordinates in Google Maps ({hotspot.latitude.toFixed(4)}, {hotspot.longitude.toFixed(4)})</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>

            {/* Instant Push Alert Trigger Button */}
            <button
              onClick={handleDispatchTelegram}
              disabled={isSendingAlert}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-lg shadow-emerald-950/40 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingAlert ? "Dispatching Alert..." : "Dispatch Instant Mobile Alert"}</span>
            </button>

            {alertSuccessMessage && (
              <div className="p-2 rounded bg-emerald-900/30 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{alertSuccessMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Incident Life-Cycle Status Progression */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Operational Lifecycle Status
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateStatus(hotspot.id, "active")}
              className={`text-xs font-semibold p-2 rounded-lg border transition ${
                hotspot.status === "active"
                  ? "bg-red-500/20 text-red-300 border-red-500/50"
                  : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              🔥 Active Threat
            </button>
            <button
              onClick={() => onUpdateStatus(hotspot.id, "dispatched", selectedGuard)}
              className={`text-xs font-semibold p-2 rounded-lg border transition ${
                hotspot.status === "dispatched"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              ⏳ Guard En Route
            </button>
            <button
              onClick={() => onUpdateStatus(hotspot.id, "contained")}
              className={`text-xs font-semibold p-2 rounded-lg border transition ${
                hotspot.status === "contained"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                  : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              🛡️ Fireline Created
            </button>
            <button
              onClick={() => onUpdateStatus(hotspot.id, "resolved")}
              className={`text-xs font-semibold p-2 rounded-lg border transition ${
                hotspot.status === "resolved"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                  : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              ✅ Extinguished
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
