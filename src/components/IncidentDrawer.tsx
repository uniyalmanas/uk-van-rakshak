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
  Check
} from "lucide-react";

interface IncidentDrawerProps {
  hotspot: any | null;
  division: any;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: string, assignedGuard?: string) => void;
  lang: "en" | "hi";
}

export const IncidentDrawer: React.FC<IncidentDrawerProps> = ({
  hotspot,
  division,
  onClose,
  onUpdateStatus,
  lang,
}) => {
  const isHi = lang === "hi";
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
            ? (isHi ? "टेलीग्राम संदेश गश्ती अधिकारी को भेज दिया गया!" : "Live Telegram alert sent to officer's phone!")
            : (isHi ? "गश्ती दल को आपातकालीन संदेश प्रेषित (सिमुलेशन)" : "Field alert dispatched to beat officer (Simulated)")
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
        return (
          <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {isHi ? "सक्रिय" : "Active"}
          </span>
        );
      case "dispatched":
        return (
          <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {isHi ? "दल रवाना" : "Dispatched"}
          </span>
        );
      case "contained":
        return (
          <span className="bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-900/60 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <Shield className="w-3 h-3" />
            {isHi ? "नियंत्रित" : "Contained"}
          </span>
        );
      case "resolved":
        return (
          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {isHi ? "शांत / बुझाई गई" : "Extinguished"}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:max-w-md max-h-[85vh] sm:max-h-full bg-white dark:bg-[#0f1521] border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[100] flex flex-col rounded-t-2xl sm:rounded-none transition-transform duration-200 ease-out">
      {/* Drawer Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 rounded-t-2xl sm:rounded-none">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              {isHi ? "वनाग्नि घटना विवरण" : "Incident Details"}
            </h2>
            {getStatusBadge(hotspot.status)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            {hotspot.id} • {hotspot.detected_at}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 text-xs">
        {/* Geographic Location & Telemetry Card */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-lg p-3">
          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {isHi ? "भौगोलिक एवं उपग्रह माप" : "Location & Sensor Telemetry"}
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11.5px]">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                {isHi ? "प्रभाग / रेंज" : "Division / Range"}
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {hotspot.range_name}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                {isHi ? "समीपस्थ बीट" : "Assigned Beat"}
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {hotspot.nearest_beat}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                {isHi ? "ऊंचाई / ढलान" : "Elevation & Slope"}
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {hotspot.elevation_meters}m • {hotspot.slope_aspect.split("(")[0]}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                {isHi ? "सेंसर तापमान" : "Brightness (FRP)"}
              </span>
              <span className="font-medium text-rose-600 dark:text-rose-400">
                {hotspot.brightness_kelvin} K ({hotspot.frp_mw} MW)
              </span>
            </div>
          </div>
        </div>

        {/* Spread Hazard & Fuel Card */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-lg p-3">
          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
            <span>{isHi ? "पहाड़ी प्रसार जोखिम विश्लेषण" : "Terrain & Spread Vector"}</span>
            <Wind className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1.5 text-[11.5px]">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">{isHi ? "ईंधन का प्रकार:" : "Fuel Type:"}</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{hotspot.fuel_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">{isHi ? "हवा की गति:" : "Wind Velocity:"}</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {hotspot.wind_speed_kmh} km/h ({hotspot.wind_direction})
              </span>
            </div>
            <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-[11px]">
              {hotspot.spread_risk}
            </div>
          </div>
        </div>

        {/* Field Guard Dispatch */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-lg p-3">
          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {isHi ? "गश्ती दल प्रेषण" : "Field Guard Dispatch"}
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                {isHi ? "उत्तरदायी वन रक्षक चुनें:" : "Select Duty Guard:"}
              </label>
              <select
                value={selectedGuard}
                onChange={(e) => setSelectedGuard(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                {division?.beat_officers?.map((officer: any) => (
                  <option key={officer.id} value={officer.name}>
                    {officer.name} ({officer.beat})
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Google Maps Link */}
            <a
              href={`https://www.google.com/maps?q=${hotspot.latitude},${hotspot.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 text-xs text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 p-2 rounded-md hover:bg-sky-100 dark:hover:bg-sky-900/30 transition"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {isHi ? "गूगल मैप्स नेविगेशन खोलें" : "Navigate via Google Maps"} ({hotspot.latitude.toFixed(3)}, {hotspot.longitude.toFixed(3)})
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Alert Dispatch Button */}
            <button
              onClick={handleDispatchTelegram}
              disabled={isSendingAlert}
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium py-2 px-3 rounded-md transition shadow-xs text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isSendingAlert
                  ? (isHi ? "संदेश भेजा जा रहा है..." : "Sending Alert...")
                  : (isHi ? "त्वरित मोबाइल अलर्ट प्रेषित करें" : "Send Instant Mobile Alert")}
              </span>
            </button>

            {alertSuccessMessage && (
              <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{alertSuccessMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Life-Cycle Status Buttons */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-lg p-3">
          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {isHi ? "घटना की अद्यतन स्थिति" : "Update Incident Status"}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateStatus(hotspot.id, "active")}
              className={`p-1.5 rounded text-[11px] font-medium border transition ${
                hotspot.status === "active"
                  ? "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                  : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              }`}
            >
              {isHi ? "सक्रिय" : "Active Threat"}
            </button>
            <button
              onClick={() => onUpdateStatus(hotspot.id, "dispatched", selectedGuard)}
              className={`p-1.5 rounded text-[11px] font-medium border transition ${
                hotspot.status === "dispatched"
                  ? "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                  : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              }`}
            >
              {isHi ? "गश्ती दल रवाना" : "En Route"}
            </button>
            <button
              onClick={() => onUpdateStatus(hotspot.id, "contained")}
              className={`p-1.5 rounded text-[11px] font-medium border transition ${
                hotspot.status === "contained"
                  ? "bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800"
                  : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              }`}
            >
              {isHi ? "फायरलाइन सुरक्षित" : "Contained"}
            </button>
            <button
              onClick={() => onUpdateStatus(hotspot.id, "resolved")}
              className={`p-1.5 rounded text-[11px] font-medium border transition ${
                hotspot.status === "resolved"
                  ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                  : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              }`}
            >
              {isHi ? "पूर्णतः शांत" : "Extinguished"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
