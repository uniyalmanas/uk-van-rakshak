"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Copy, Check, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";

interface SitRepModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeIncidents: any[];
  lang: "en" | "hi";
}

export const SitRepModal: React.FC<SitRepModalProps> = ({
  isOpen,
  onClose,
  activeIncidents,
  lang,
}) => {
  const isHi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [sitrep, setSitrep] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchSitrep = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/sitrep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeIncidents, lang }),
      });
      if (res.ok) {
        const data = await res.json();
        setSitrep(data.sitrep);
      }
    } catch (err) {
      console.error("Sitrep fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !sitrep) {
      fetchSitrep();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!sitrep) return;
    const textToCopy = `🚨 ${sitrep.sitrep_headline_en}\n----------------------------------\n${sitrep.executive_summary_en}\n\n⚠️ Priority Corridors: ${sitrep.high_priority_corridors?.join(", ")}\n🚜 Machinery Readiness: ${sitrep.machinery_readiness_pct}%\n\n📢 Public Advisory: ${sitrep.public_advisory_bulletin_en}\n\nIssued by: State Emergency Operation Centre (SEOC Dehradun) via Aapda-Sutra AI`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#101724] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-purple-50/70 dark:bg-purple-950/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isHi ? "दैनिक स्थिति रिपोर्ट (AI SitRep)" : "Executive Situation Report (AI SitRep)"}
              </h2>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                Google Gemini 2.5 Flash • Multi-Hazard Synthesis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3.5 text-xs">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2.5 text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-xs font-medium">
                {isHi ? "जेमिनी AI द्वारा राज्य आपदा डेटा का विश्लेषण जारी..." : "Synthesizing road, rain, and landslide data with Gemini AI..."}
              </span>
            </div>
          ) : sitrep ? (
            <>
              {/* Headline */}
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60">
                <h3 className="font-bold text-sm text-purple-900 dark:text-purple-200">
                  {isHi ? sitrep.sitrep_headline_hi || sitrep.sitrep_headline_en : sitrep.sitrep_headline_en}
                </h3>
                <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5">
                  State Emergency Operations Centre (SEOC), Dehradun
                </p>
              </div>

              {/* Executive Summary */}
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-[11.5px]">
                  {isHi ? "कार्यकारी सारांश:" : "Executive Overview:"}
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11.5px] bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {isHi ? sitrep.executive_summary_hi || sitrep.executive_summary_en : sitrep.executive_summary_en}
                </p>
              </div>

              {/* Priority Corridors & Machinery Status */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px] mb-1 font-medium">
                    {isHi ? "उच्च प्राथमिकता मार्ग:" : "Priority Focus Routes:"}
                  </span>
                  <div className="font-bold text-rose-600 dark:text-rose-400 space-y-0.5">
                    {sitrep.high_priority_corridors?.map((c: string, idx: number) => (
                      <div key={idx} className="truncate">• {c}</div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px] mb-1 font-medium">
                    {isHi ? "राहत मशीनरी तत्परता:" : "Machinery Readiness:"}
                  </span>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {sitrep.machinery_readiness_pct || 88}%
                  </div>
                  <span className="text-[10px] text-slate-400">JCBs & Crews Standby</span>
                </div>
              </div>

              {/* Public Advisory */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  {isHi ? "जनता व तीर्थयात्रियों हेतु दिशा-निर्देश:" : "Public & Pilgrim Safety Advisory:"}
                </span>
                <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                  {isHi ? sitrep.public_advisory_bulletin_hi || sitrep.public_advisory_bulletin_en : sitrep.public_advisory_bulletin_en}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={fetchSitrep}
                  className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isHi ? "पुनः विश्लेषण करें" : "Re-generate"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "बुलेटिन कॉपी करें" : "Copy SitRep Bulletin")}</span>
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
