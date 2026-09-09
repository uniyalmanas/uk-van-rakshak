"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldAlert, PhoneCall, MapPin, Send, CheckCircle2, Battery, Users, HeartPulse } from "lucide-react";
import disasterData from "@/data/uttarakhand_disasters.json";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSOS: (sosData: any) => void;
  lang: "en" | "hi";
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  onTriggerSOS,
  lang,
}) => {
  const isHi = lang === "hi";

  const [emergencyType, setEmergencyType] = useState("stranded_landslide");
  const [peopleCount, setPeopleCount] = useState("4");
  const [medicalUrgency, setMedicalUrgency] = useState(false);
  const [locationText, setLocationText] = useState("Badrinath Highway corridor");
  const [phone, setPhone] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 30.252, lng: 78.914 });

  // Get live GPS on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          });
        },
        (err) => console.warn("GPS unavailable, using default Himalayan point:", err),
        { timeout: 5000 }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendSOS = (e: React.FormEvent) => {
    e.preventDefault();

    const sosIncident = {
      id: `SOS-LIVE-${Date.now().toString().slice(-4)}`,
      type: "sos",
      title: medicalUrgency
        ? "CRITICAL SOS: Medical Emergency & Stranded Vehicles"
        : "EMERGENCY SOS: Stranded Travelers on Mountain Route",
      title_hi: medicalUrgency
        ? "अति-गंभीर आपातकाल: चिकित्सा सहायता व फंसे हुए यात्री"
        : "आपातकालीन सहायता: मार्ग में फंसे हुए यात्री",
      location_name: locationText || "Mountain Highway Point",
      location_name_hi: locationText || "पहाड़ी मार्ग स्थल",
      corridor_id: "nh-58",
      district: "Emergency SOS Beacon",
      latitude: coords.lat,
      longitude: coords.lng,
      elevation_m: 1680,
      severity: "CRITICAL",
      severity_score: 5,
      status: "in_progress",
      reported_at: "Just Now (Live Beacon)",
      reported_by: `SOS Caller (${phone || "Emergency Line"})`,
      road_status: "SDRF & Ambulance Dispatched",
      road_status_hi: "एसडीआरएफ व एम्बुलेंस रवाना",
      ai_analysis: {
        confidence: 99,
        people_stranded: Number(peopleCount),
        medical_urgency: medicalUrgency ? "YES - Immediate medical aid required" : "NO",
        machinery_deployed: ["SDRF Mountain Rescue Team", "108 4x4 Ambulance"],
        description: `Emergency distress beacon activated at [${coords.lat}, ${coords.lng}]. ${peopleCount} travelers stranded. Medical urgency: ${medicalUrgency ? "HIGH" : "NORMAL"}.`,
      },
      assigned_unit: "State Emergency Operations Centre (SEOC Dehradun)",
      assigned_phone: "1070",
      clearance_progress: 30,
      photos: [],
    };

    onTriggerSOS(sosIncident);
    setIsSent(true);
  };

  // Compressed 2G SMS Payload
  const smsPayload = `SOS UTTARAKHAND! PPL:${peopleCount} MED:${medicalUrgency ? "YES" : "NO"} LOC:${coords.lat},${coords.lng} PH:${phone || "NA"}`;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111622] border border-rose-500/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
        {/* Header with Pulsing Alert */}
        <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight">
                {isHi ? "आपदा आपातकालीन संकट संकेत (SOS)" : "Emergency Distress Lifeline (SOS)"}
              </h2>
              <p className="text-[11px] text-rose-100">
                {isHi ? "राज्य आपदा प्रबंधन (SDRF व 112) से सीधा संपर्क" : "Direct beacon to SDRF, 112 & District Control Rooms"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="p-6 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isHi ? "संकट संकेत (SOS) सफलतापूर्वक दर्ज!" : "Distress Beacon Transmitted!"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {isHi
                  ? "आपकी जीपीएस लोकेशन राज्य नियंत्रण कक्ष व एसडीआरएफ दल को भेज दी गई है। निकटतम दल आपसे संपर्क कर रहा है।"
                  : "Your GPS coordinates and headcount have been registered at the State Emergency Operations Centre (SEOC). Nearest relief squad alerted."}
              </p>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-left text-xs space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Live GPS:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {coords.lat}° N, {coords.lng}° E
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">State Helpline:</span>
                <a href="tel:1070" className="text-rose-600 font-bold flex items-center gap-1">
                  <PhoneCall className="w-3 h-3" /> 1070 (Toll-Free)
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold text-xs hover:bg-slate-800"
            >
              {isHi ? "डैशबोर्ड पर वापस जाएं" : "Return to Disaster Grid"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendSOS} className="p-4 sm:p-5 space-y-4 text-xs">
            {/* Live GPS Strip */}
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    {isHi ? "आपकी वर्तमान जीपीएस लोकेशन" : "Captured Mountain GPS"}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {coords.lat}° N, {coords.lng}° E
                  </span>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Emergency Nature */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11.5px]">
                {isHi ? "संकट का मुख्य कारण:" : "Nature of Emergency:"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "stranded_landslide", label: "Stuck in Landslide", label_hi: "भूस्खलन में फंसे हैं", icon: "🪨" },
                  { id: "medical_injury", label: "Medical Crisis", label_hi: "गंभीर बीमारी / चोट", icon: "🏥" },
                  { id: "flood_flash", label: "River Flash Flood", label_hi: "बाढ़ / जलस्तर वृद्धि", icon: "🌊" },
                  { id: "vehicle_breakdown", label: "Lost / Vehicle Trapped", label_hi: "वाहन खराब / रास्ता बंद", icon: "🚙" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setEmergencyType(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      emergencyType === item.id
                        ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200 font-bold"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-[11px] leading-tight">{isHi ? item.label_hi : item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* People Count & Medical Urgency */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px] flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-500" />
                  {isHi ? "फंसे हुए व्यक्तियों की संख्या:" : "People Stranded:"}
                </label>
                <select
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="1">1 Person (Solo)</option>
                  <option value="2-4">2 to 4 People (Family/Car)</option>
                  <option value="5-10">5 to 10 People (Van/Tempo)</option>
                  <option value="20+">20+ People (Bus / Group)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px] flex items-center gap-1">
                  <HeartPulse className="w-3 h-3 text-rose-500" />
                  {isHi ? "तत्काल चिकित्सा की आवश्यकता?" : "Immediate Medical Need?"}
                </label>
                <button
                  type="button"
                  onClick={() => setMedicalUrgency(!medicalUrgency)}
                  className={`w-full p-2 rounded-lg border text-xs font-semibold transition ${
                    medicalUrgency
                      ? "bg-rose-600 text-white border-rose-700"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {medicalUrgency
                    ? (isHi ? "⚠️ हाँ - तत्काल दवा/डॉक्टर चाहिए" : "⚠️ YES - Urgent Medical Need")
                    : (isHi ? "नहीं - सामान्य राहत चाहिए" : "No - Safe but Stranded")}
                </button>
              </div>
            </div>

            {/* Landmark & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">
                  {isHi ? "नजदीकी मील का पत्थर / कस्बा:" : "Approx Location / Road:"}
                </label>
                <input
                  type="text"
                  placeholder={isHi ? "उदा. श्रीनगर व रुद्रप्रयाग के बीच" : "e.g. Between Srinagar & Rudraprayag"}
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">
                  {isHi ? "सम्पर्क मोबाइल नंबर:" : "Your Mobile Number:"}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Offline 2G Fallback Button */}
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 flex items-center justify-between text-[11px]">
              <div>
                <span className="font-semibold text-amber-900 dark:text-amber-200 block">
                  {isHi ? "इंटरनेट नहीं चल रहा? (2G SMS बैकअप)" : "No Internet? (Offline 2G SMS Beacon)"}
                </span>
                <span className="text-amber-700 dark:text-amber-400 text-[10px]">
                  {isHi ? "बिना डेटा के 112 या 1070 पर सीधा एसएमएस भेजें" : "Direct compressed SMS packet to SDRF"}
                </span>
              </div>
              <a
                href={`sms:112?body=${encodeURIComponent(smsPayload)}`}
                className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10.5px] shrink-0"
              >
                Send SMS
              </a>
            </div>

            {/* Submit Big Red SOS Beacon Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>{isHi ? "🚨 आपातकालीन संकट संकेत भेजें (SOS)" : "🚨 BROADCAST EMERGENCY SOS BEACON"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
