"use client";

import React, { useState } from "react";
import { 
  X, 
  BookOpen, 
  Satellite, 
  ShieldCheck, 
  Wind, 
  Play, 
  PhoneCall, 
  MapPin, 
  Layers,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "hi";
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, lang }) => {
  const isHi = lang === "hi";
  const [activeTab, setActiveTab] = useState<"guide" | "satellites" | "dispatch" | "contacts">("guide");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#101622] border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isHi ? "वनाग्नि कमांड पोर्टल — उपयोगकर्ता मार्गदर्शिका" : "Van-Rakshak Command — User Manual & SOP"}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {isHi
                  ? "उत्तराखंड वन विभाग फील्ड अधिकारियों एवं प्रभाग प्रभारियों हेतु मानक संचालन प्रक्रिया"
                  : "Field Operations & Satellite Dispatch Guide for Uttarakhand Forest Divisions"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-3 sm:px-4 shrink-0 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("guide")}
            className={`py-2 px-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition ${
              activeTab === "guide"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {isHi ? "1. पोर्टल का उपयोग कैसे करें" : "1. How to Use Portal"}
          </button>
          <button
            onClick={() => setActiveTab("satellites")}
            className={`py-2 px-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition ${
              activeTab === "satellites"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {isHi ? "2. उपग्रह सटीकता (375m)" : "2. Satellite Precision (375m)"}
          </button>
          <button
            onClick={() => setActiveTab("dispatch")}
            className={`py-2 px-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition ${
              activeTab === "dispatch"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {isHi ? "3. गश्ती दल प्रेषण (Closed-Loop)" : "3. Field Dispatch Workflow"}
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`py-2 px-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition ${
              activeTab === "contacts"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {isHi ? "4. आपातकालीन नंबर व SOP" : "4. Emergency Numbers & SOP"}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Tab 1: How to Use */}
          {activeTab === "guide" && (
            <div className="space-y-3.5">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 p-3 rounded-lg">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {isHi ? "त्वरित शुरुआत (3 आसान चरण)" : "Quick Start in 3 Easy Steps"}
                </h3>
                <p className="text-[11.5px] text-emerald-900 dark:text-emerald-200">
                  {isHi
                    ? "यह पोर्टल राज्य मुख्यालय से लेकर वन बीट स्तर तक वास्तविक समय में वनाग्नि की पहचान, पहाड़ी प्रसार का पूर्वानुमान और गश्ती दल को जीपीएस नेविगेशन भेजने हेतु तैयार किया गया है।"
                    : "This command portal enables division officials to monitor thermal anomalies in real-time, predict mountain upslope spread, and dispatch beat guards with direct GPS links."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                    {isHi ? "चरण 1: प्रभाग चुनें" : "Step 1: Select Division"}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {isHi
                      ? "शीर्ष ड्रॉपडाउन से 'नैनीताल', 'अल्मोड़ा', 'देहरादून', 'पौड़ी', 'कॉर्बेट' या 'संपूर्ण उत्तराखंड' चुनें। मानचित्र स्वतः उस प्रभाग पर केंद्रित हो जाएगा।"
                      : "Use the top dropdown to switch between Nainital, Almora, Dehradun, Pauri, Corbett, or statewide view. Map centers instantly."}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="text-amber-600 dark:text-amber-400 font-bold mb-1">
                    {isHi ? "चरण 2: घटना पर क्लिक करें" : "Step 2: Inspect Hotspot"}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {isHi
                      ? "मानचित्र पर लाल बिंदु (सक्रिय आग) या सूची में से किसी बिंदु पर क्लिक करें। दाईं ओर/नीचे पूरा टेलीमेट्री विवरण खुल जाएगा।"
                      : "Click any red pulsing dot on the map or from the list. The incident drawer reveals elevation, slope, fuel, and wind spread."}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="text-sky-600 dark:text-sky-400 font-bold mb-1">
                    {isHi ? "चरण 3: दल को अलर्ट भेजें" : "Step 3: Dispatch Guard"}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {isHi
                      ? "निकटतम बीट गार्ड चुनें और 'त्वरित मोबाइल अलर्ट प्रेषित करें' पर क्लिक करें। अधिकारी के फोन पर गूगल मैप्स नेविगेशन लिंक पहुंच जाएगा।"
                      : "Select the nearest beat guard and tap 'Send Instant Mobile Alert'. The guard receives coordinates and one-tap Google Maps directions."}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {isHi ? "मानचित्र परतें बदलें:" : "Switch Map Basemaps:"}
                </span>{" "}
                {isHi
                  ? "मानचित्र के ऊपर दाईं ओर 'उपग्रह' (कैनोपी) या 'मानचित्र' (वेक्टर जीआईएस) बटन दबाकर दृश्य बदल सकते हैं।"
                  : "Toggle between 'Satellite' (high-resolution forest canopy) and 'Map' (clean vector GIS) at the top-right corner of the map."}
              </div>
            </div>
          )}

          {/* Tab 2: Satellite Precision */}
          {activeTab === "satellites" && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40">
                <Satellite className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sky-900 dark:text-sky-200 text-xs">
                    {isHi ? "नासा VIIRS (375 मीटर) उपग्रह डेटा की सटीकता" : "NASA VIIRS (375-Meter) Precision Explained"}
                  </h3>
                  <p className="text-[11px] text-sky-800 dark:text-sky-300 mt-0.5">
                    {isHi
                      ? "सुओमी-एनपीपी (Suomi-NPP) और एनओएए-20 (NOAA-20) उपग्रहों पर लगे VIIRS सेंसर प्रतिदिन 2 से 4 बार उत्तराखंड के ऊपर से गुजरते हैं।"
                      : "VIIRS sensors aboard Suomi-NPP and NOAA-20 pass over Uttarakhand 2–4 times daily, delivering 375m spatial resolution."}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-[11.5px]">
                <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <b className="text-slate-900 dark:text-white">{isHi ? "375 मीटर का धरातल पर क्या अर्थ है?" : "What does 375-meter resolution mean on the ground?"}</b>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {isHi
                      ? "375 मीटर का अर्थ है कि आग किस पहाड़ी रिज, नाले या कम्पार्टमेंट में स्थित है (लगभग 2-3 फुटबॉल मैदान के बराबर क्षेत्र)। यह किसी एक विशिष्ट पेड़ को नहीं दर्शाता, अपितु पूरे इलाके की सटीक पहचान कराता है।"
                      : "375m pinpoints the exact mountain ridge, ravine, or forest compartment (~2-3 football fields). It locates the wildfire zone accurately enough for beat guards to navigate straight to the ridge."}
                  </p>
                </div>

                <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <b className="text-slate-900 dark:text-white">{isHi ? "FRP (फायर रेडिएटिव पावर) क्या है?" : "What is Fire Radiative Power (FRP) in Megawatts?"}</b>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {isHi
                      ? "FRP आग द्वारा उत्सर्जित ऊष्मा ऊर्जा को दर्शाता है। 10 MW से कम: सतही पत्तियां/घास। 20 MW से अधिक: तीव्र चीड़ पिरुल या क्राउन फायर।"
                      : "FRP measures radiant heat output in MW. Below 10 MW: surface litter smoldering. Above 20 MW: intense crown or dry pine needle conflagration requiring immediate water backpack/counter-firing."}
                  </p>
                </div>

                <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <b className="text-slate-900 dark:text-white">{isHi ? "पहाड़ी प्रसार सदिश (Spread Vector Arrow):" : "Mountain Upslope Spread Vector Arrow:"}</b>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {isHi
                      ? "मानचित्र पर आग के आगे दिखने वाला नारंगी तीर हवा की गति और पहाड़ी ढलान को मिलाकर यह दर्शाता है कि अगले 1-2 घंटों में आग किस दिशा में ऊपर चढ़ेगी।"
                      : "The dashed orange arrow models combined wind velocity and slope gradient, pointing to the exact ridge or settlement threatened in the next 1–2 hours."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Dispatch Workflow */}
          {activeTab === "dispatch" && (
            <div className="space-y-3.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                {isHi ? "क्लोज्ड-लूप गश्ती प्रबंधन (Closed-Loop Operational Workflow)" : "Closed-Loop Patrol & Extinction Verification"}
              </h3>
              <p className="text-[11.5px] text-slate-600 dark:text-slate-400">
                {isHi
                  ? "पारंपरिक सरकारी प्रणालियों में केवल एसएमएस भेजा जाता है, किंतु अधिकारी को यह ज्ञात नहीं होता कि गार्ड मौके पर पहुंचा या नहीं। हमारा पोर्टल संपूर्ण चक्र ट्रैक करता है:"
                  : "National tools only broadcast passive alerts without loop closure. Our portal tracks the operational lifecycle from detection to extinguishment:"}
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                  <span className="h-5 w-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <b className="text-rose-900 dark:text-rose-200 text-xs">{isHi ? "सक्रिय वनाग्नि दर्ज (Active Threat)" : "Active Detection"}</b>
                    <p className="text-[11px] text-rose-800 dark:text-rose-300">
                      {isHi ? "उपग्रह द्वारा तापमान विसंगति चिन्हित होते ही नियंत्रण कक्ष को स्वतः अलर्ट प्राप्त होता है।" : "Thermal anomaly registered by VIIRS sensor, appearing on the division map within seconds."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                  <span className="h-5 w-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <b className="text-amber-900 dark:text-amber-200 text-xs">{isHi ? "गश्ती दल रवाना (Guard En Route)" : "Guard Dispatched"}</b>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300">
                      {isHi ? "रेंज अधिकारी संबंधित बीट गार्ड को जीपीएस लिंक भेजता है और स्थिति 'En Route' अपडेट करता है।" : "Range Officer assigns beat guard. Instant mobile notification with Google Maps link is sent."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40">
                  <span className="h-5 w-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <b className="text-sky-900 dark:text-sky-200 text-xs">{isHi ? "फायरलाइन सुरक्षित (Contained)" : "Fireline Secured / Contained"}</b>
                    <p className="text-[11px] text-sky-800 dark:text-sky-300">
                      {isHi ? "गार्ड मौके पर पहुंचकर काउंटर-फायरिंग या फायरलाइन बनाकर आग का घेराव करता है।" : "Ground crew creates counter-firebreak preventing spread to neighboring beats."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                  <div>
                    <b className="text-emerald-900 dark:text-emerald-200 text-xs">{isHi ? "पूर्णतः बुझाई गई (Extinguished)" : "Extinguished & Verified"}</b>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      {isHi ? "आग पूरी तरह शांत होने पर रिपोर्ट दर्ज होती है, जिसे दैनिक सिटरिप (SitRep) में डाउनलोड किया जा सकता है।" : "Incident marked resolved, archiving the event into the downloadable SitRep CSV for senior officers."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Contacts & SOP */}
          {activeTab === "contacts" && (
            <div className="space-y-3.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                {isHi ? "उत्तराखंड वनाग्नि नियंत्रण कक्ष एवं आपातकालीन दूरभाष" : "Forest Department Control Rooms & Emergency Contacts"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11.5px]">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                    {isHi ? "राज्य वन मुख्यालय नियंत्रण कक्ष" : "State Forest Fire Control Room"}
                  </span>
                  <b className="text-slate-900 dark:text-white">अरण्य भवन, देहरादून (Aranya Bhavan)</b>
                  <div className="text-emerald-700 dark:text-emerald-400 font-mono mt-1 font-semibold">
                    📞 +91-135-2744158
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                    {isHi ? "राज्य आपदा प्रबंधन नियंत्रण कक्ष (USDMA)" : "State Disaster Management (USDMA)"}
                  </span>
                  <b className="text-slate-900 dark:text-white">सचिवालय, देहरादून (Secretariat)</b>
                  <div className="text-emerald-700 dark:text-emerald-400 font-mono mt-1 font-semibold">
                    📞 1070 / 1077 (Toll-Free)
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                    {isHi ? "नैनीताल वन प्रभाग नियंत्रण कक्ष" : "Nainital Division Control Room"}
                  </span>
                  <b className="text-slate-900 dark:text-white">डीएफओ कार्यालय, मल्लीताल</b>
                  <div className="text-slate-700 dark:text-slate-300 font-mono mt-1">
                    📞 +91-5942-235841
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                    {isHi ? "अल्मोड़ा वन प्रभाग नियंत्रण कक्ष" : "Almora Division Control Room"}
                  </span>
                  <b className="text-slate-900 dark:text-white">डीएफओ कार्यालय, धारानौला</b>
                  <div className="text-slate-700 dark:text-slate-300 font-mono mt-1">
                    📞 +91-5962-230240
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
                <b>{isHi ? "फील्ड एसओपी (मानक प्रोटोकॉल):" : "Standard Operating Protocol (SOP):"}</b>{" "}
                {isHi
                  ? "चीड़ पिरुल वनों में दोपहर 12 बजे से 4 बजे के मध्य गश्त दोगुनी करें। क्राउन फायर की स्थिति में तुरंत निकटवर्ती रेंज को वायरलेस संदेश प्रसारित करें।"
                  : "Double patrols between 12:00 PM and 4:00 PM during dry heat hours. Never attempt counter-firing against uphill winds without back-up radio contact."}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-slate-800 text-white dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-xs font-medium transition"
          >
            {isHi ? "समझ गया / बंद करें" : "Close Guide"}
          </button>
        </div>
      </div>
    </div>
  );
};
