"use client";

import React, { useState } from "react";
import { X, Camera, AlertTriangle, Sparkles, CheckCircle2, Loader2, MapPin } from "lucide-react";

interface ReportHazardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: any) => void;
  lang: "en" | "hi";
}

export const ReportHazardModal: React.FC<ReportHazardModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  lang,
}) => {
  const isHi = lang === "hi";

  const [hazardType, setHazardType] = useState("landslide");
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCorridor, setSelectedCorridor] = useState("nh-58");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");

  if (!isOpen) return null;

  // Handle image upload and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        triggerAiAnalysis(base64, description, locationName);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Gemini AI multimodal analysis
  const triggerAiAnalysis = async (base64: string, desc: string, loc: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze-hazard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          description: desc || "Mountain road obstruction observed on highway",
          locationName: loc || "Uttarakhand Highway",
          coordinates: { latitude: 30.252, longitude: 78.914 },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnalysisResult(data.analysis);
      }
    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newHazard = {
      id: `CITIZEN-${Date.now().toString().slice(-6)}`,
      type: hazardType,
      title:
        aiAnalysisResult?.hazard_type ||
        (hazardType === "landslide" ? "Landslide & Boulder Blockage" : "Cloudburst Flash Flood"),
      title_hi:
        aiAnalysisResult?.hindi_summary?.slice(0, 40) ||
        (hazardType === "landslide" ? "भूस्खलन एवं सड़क अवरोध" : "अत्यधिक वर्षा व जलभराव"),
      location_name: locationName || "Highway Sector Report",
      location_name_hi: locationName || "राजमार्ग स्थल",
      corridor_id: selectedCorridor,
      district: "Reported Live by Citizen",
      latitude: 30.25 + (Math.random() - 0.5) * 0.1,
      longitude: 78.91 + (Math.random() - 0.5) * 0.1,
      elevation_m: 1250,
      severity: aiAnalysisResult?.severity_level || "HIGH",
      severity_score: aiAnalysisResult?.severity_score || 4,
      status: "reported",
      reported_at: "Just Now",
      reported_by: `${reporterName || "Citizen"} (${reporterPhone || "Public"})`,
      road_status: aiAnalysisResult?.road_status || "Single-Lane Caution",
      road_status_hi: isHi ? "सावधानीपूर्वक एकतरफा" : "Single-Lane Caution",
      ai_analysis: aiAnalysisResult || {
        confidence: 90,
        machinery_deployed: ["Inspection Team"],
        description: description || "Citizen reported road obstruction.",
      },
      assigned_unit: "Pending PWD / SDRF Verification",
      assigned_phone: "1070",
      clearance_progress: 10,
      photos: imagePreview ? [imagePreview] : [],
    };

    onSubmitReport(newHazard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#101724] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isHi ? "आपदा या सड़क अवरोध रिपोर्ट करें" : "Report Landslide or Hazard"}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isHi ? "गूगल जेमिनी AI द्वारा तत्काल विश्लेषण" : "Instant triage powered by Google Gemini AI"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Hazard Type Selector */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11.5px]">
              {isHi ? "आपदा का प्रकार चुनें:" : "Hazard Category:"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: "landslide", label: "Landslide", label_hi: "भूस्खलन", icon: "🪨" },
                { id: "cloudburst", label: "Flood/Rain", label_hi: "बाढ़ / जलभराव", icon: "🌧️" },
                { id: "broken_road", label: "Road Sunk", label_hi: "सड़क धंसाव", icon: "🚧" },
                { id: "wildfire", label: "Forest Fire", label_hi: "वनाग्नि", icon: "🔥" },
              ].map((h) => (
                <button
                  type="button"
                  key={h.id}
                  onClick={() => setHazardType(h.id)}
                  className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                    hazardType === h.id
                      ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-base">{h.icon}</span>
                  <span className="text-[10px] leading-tight">{isHi ? h.label_hi : h.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload with AI Triage Trigger */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11.5px] flex items-center justify-between">
              <span>{isHi ? "स्थल का फोटो अपलोड करें:" : "Upload Hazard Photo:"}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini AI Triage
              </span>
            </label>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="relative inline-block max-h-36 overflow-hidden rounded-lg">
                  <img src={imagePreview} alt="Preview" className="max-h-36 rounded-lg object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                    Tap to change
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-2">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {isHi ? "कैमरा से फोटो लें या गैलरी से चुनें" : "Take Photo or Upload from Gallery"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isHi ? "AI फोटो देखकर मलबे का आकार व खतरा आंकेगा" : "AI estimates debris volume & blockage automatically"}
                  </span>
                </div>
              )}
            </div>

            {/* AI Analysis Card */}
            {isAnalyzing && (
              <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isHi ? "गूगल जेमिनी AI द्वारा फोटो का भूवैज्ञानिक विश्लेषण जारी..." : "Google Gemini AI analyzing mountain terrain & debris..."}</span>
              </div>
            )}

            {aiAnalysisResult && (
              <div className="mt-2.5 p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {isHi ? "AI विश्लेषण परिणाम" : "Gemini AI Triage Assessment"}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-200/70 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                    {aiAnalysisResult.severity_level} (Score: {aiAnalysisResult.severity_score}/5)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {isHi ? aiAnalysisResult.hindi_summary : aiAnalysisResult.english_summary}
                </p>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 flex flex-wrap gap-2 pt-1 border-t border-emerald-200 dark:border-emerald-800/50">
                  <span>🚜 {isHi ? "अनुशंसित मशीन:" : "Machinery:"} <b>{aiAnalysisResult.machinery_needed?.[0]}</b></span>
                  <span>⏱️ {isHi ? "संभावित निकासी समय:" : "Est. Clearance:"} <b>{aiAnalysisResult.estimated_clearance_hours} hrs</b></span>
                </div>
              </div>
            )}
          </div>

          {/* Highway Corridor & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">
                {isHi ? "राजमार्ग / मार्ग:" : "Highway Corridor:"}
              </label>
              <select
                value={selectedCorridor}
                onChange={(e) => setSelectedCorridor(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="nh-58">NH-58 (Rishikesh - Badrinath)</option>
                <option value="nh-107">NH-107 (Rudraprayag - Kedarnath)</option>
                <option value="nh-34">NH-34 (Uttarkashi - Gangotri)</option>
                <option value="nh-134">NH-134 (Barkot - Yamunotri)</option>
                <option value="kumaon-state">Kumaon State Highway (Nainital/Almora)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">
                {isHi ? "समीपस्थ स्थान / मील का पत्थर:" : "Nearest Landmark / Km Post:"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={isHi ? "उदा. सिरोबगड़ से 2 किमी आगे" : "e.g. 5km after Devprayag"}
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 pr-7 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-[11px]">
              {isHi ? "स्थिति का विवरण:" : "Incident Details:"}
            </label>
            <textarea
              rows={2}
              placeholder={isHi ? "सड़क पर क्या गिरा है? क्या गाड़ियाँ फंसी हैं?" : "Are vehicles stranded? Is any power line or bridge damaged?"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Contact (Optional) */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={isHi ? "आपका नाम (वैकल्पिक)" : "Your Name (Optional)"}
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200"
            />
            <input
              type="tel"
              placeholder={isHi ? "मोबाइल नंबर" : "Mobile Number"}
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isHi ? "रद्द करें" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isHi ? "आपदा रिपोर्ट भेजें" : "Submit Hazard Report"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
