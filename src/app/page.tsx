"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { MetricsBar } from "@/components/MetricsBar";
import { DisasterDrawer } from "@/components/DisasterDrawer";
import { SimulationModal } from "@/components/SimulationModal";
import { HelpModal } from "@/components/HelpModal";
import { WeatherWidget } from "@/components/WeatherWidget";
import { CorridorStatusBar } from "@/components/CorridorStatusBar";
import { ReportHazardModal } from "@/components/ReportHazardModal";
import { SOSModal } from "@/components/SOSModal";
import { SitRepModal } from "@/components/SitRepModal";
import forestData from "@/data/uttarakhand_forests.json";
import disasterData from "@/data/uttarakhand_disasters.json";
import { 
  Flame, 
  MapPin, 
  Shield, 
  PhoneCall, 
  ChevronRight,
  FileText,
  Map as MapIcon,
  ListFilter,
  AlertTriangle,
  Truck,
  Sparkles,
  LifeBuoy,
  CheckCircle2,
  Navigation
} from "lucide-react";

// Dynamically import MapComponent to disable SSR for Leaflet
const MapComponent = dynamic(
  () => import("@/components/MapComponent").then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Loading Aapda-Sutra GIS Cartography...
          </span>
        </div>
      </div>
    ),
  }
);

// Normalize initial incidents from disaster dataset + forest hotspots
const initialIncidents = [
  ...disasterData.incidents,
  ...forestData.sample_satellite_hotspots.map((h) => ({
    id: h.id,
    type: "wildfire",
    title: `Forest Fire Hotspot: ${h.range_name}`,
    highway: `${h.division_id.toUpperCase()} Division Sector`,
    corridor_id: "statewide",
    location_name: `${h.range_name} (${h.nearest_beat})`,
    latitude: h.latitude,
    longitude: h.longitude,
    status: h.status === "active" ? "in_progress" : h.status,
    road_status: "caution",
    clearance_progress_percent: h.status === "resolved" ? 100 : h.status === "contained" ? 80 : h.status === "dispatched" ? 45 : 15,
    severity: h.status === "active" ? "HIGH" : "MEDIUM",
    severity_score: h.frp_mw > 40 ? 4 : 3,
    reported_at: h.detected_at,
    estimated_clearance_hours: 4.0,
    brightness_kelvin: h.brightness_kelvin,
    frp_mw: h.frp_mw,
    machinery_deployed: [],
    lead_officer: {
      name: h.assigned_guard || "Range Forest Officer",
      rank: "Field Patrol Lead",
      phone: "+91-135-2740001",
    },
    gemini_ai_assessment: `NASA VIIRS 375m hotspot detected at ${h.brightness_kelvin}K brightness with ${h.frp_mw}MW radiative power. Pine needle duff fuels risk rapid up-slope propagation.`,
    citizen_reports_count: 3,
  })),
];

export default function Home() {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("all_uk");
  const [corridors, setCorridors] = useState<any[]>(disasterData.corridors);
  const [shelters] = useState<any[]>(disasterData.safe_havens_and_shelters);
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>("all");
  const [activeHazardFilter, setActiveHazardFilter] = useState<string>("all");
  const [hotspots, setHotspots] = useState<any[]>(initialIncidents);
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);

  // Modals & Panels
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [isSitrepModalOpen, setIsSitrepModalOpen] = useState<boolean>(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Dual Persona Mode: Citizen/Pilgrim View vs Officer/Command Console View
  const [isOfficerMode, setIsOfficerMode] = useState<boolean>(false);
  
  // Clean Theme & Language states
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [lang, setLang] = useState<"en" | "hi">("en");
  
  // Mobile View Tab: "map" | "list"
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");

  // Live NASA FIRMS Satellite Feed Status
  const [satelliteFeedInfo, setSatelliteFeedInfo] = useState<{
    source: string;
    isLive: boolean;
    apiConnected: boolean;
    liveCount: number;
    message?: string;
  }>({
    source: "Google Maps Platform & NASA FIRMS",
    isLive: true,
    apiConnected: true,
    liveCount: 5,
    message: "Live Multi-Hazard & VIIRS Telemetry Active",
  });

  // Sync theme with HTML document class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  const isHi = lang === "hi";

  const currentDivision =
    forestData.divisions.find((d) => d.id === selectedDivisionId) ||
    forestData.divisions[0];

  // Filter incidents based on active corridor and hazard type
  const filteredIncidents = hotspots.filter((item) => {
    // Corridor filter
    if (selectedCorridorId !== "all") {
      if (item.corridor_id && item.corridor_id !== selectedCorridorId) {
        return false;
      }
    }
    // Hazard type filter
    if (activeHazardFilter !== "all") {
      if (item.type !== activeHazardFilter) {
        return false;
      }
    }
    return true;
  });

  // Sync with NASA FIRMS Live Satellite API
  const syncSatelliteFeed = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/firms?division=all_uk&days=3`);
      if (res.ok) {
        const data = await res.json();
        setSatelliteFeedInfo({
          source: data.source || "Google Maps & NASA FIRMS",
          isLive: Boolean(data.is_live),
          apiConnected: Boolean(data.api_connected),
          liveCount: data.live_count ?? filteredIncidents.length,
          message: data.message || "Live GIS & Satellite telemetry synchronized",
        });
      }
    } catch (e) {
      console.error("Satellite feed sync error:", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Add hazard report from Citizen AI Vision Reporter
  const handleAddHazardReport = (newHazard: any) => {
    setHotspots((prev) => [newHazard, ...prev]);
    setSelectedHotspot(newHazard);
    if (newHazard.corridor_id && newHazard.road_status === "blocked") {
      setCorridors((prev) =>
        prev.map((c) =>
          c.id === newHazard.corridor_id
            ? { ...c, status: "blocked", active_blockages: c.active_blockages + 1 }
            : c
        )
      );
    }
  };

  // Add SOS Emergency Beacon
  const handleAddSOS = (sosData: any) => {
    const sosIncident = {
      id: `SOS-${Date.now().toString().slice(-4)}`,
      type: "sos",
      title: `EMERGENCY SOS: ${sosData.urgency.toUpperCase()} (${sosData.headcount} People)`,
      highway: "Char Dham Route Sector",
      corridor_id: "nh-58-badrinath",
      location_name: `GPS: ${sosData.lat.toFixed(4)}, ${sosData.lon.toFixed(4)}`,
      latitude: sosData.lat,
      longitude: sosData.lon,
      status: "active",
      road_status: "blocked",
      clearance_progress_percent: 15,
      severity: "CRITICAL",
      severity_score: 5,
      reported_at: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST",
      estimated_clearance_hours: 1.5,
      gemini_ai_assessment: `High-priority distress beacon registered directly with SDRF quick reaction team. Headcount: ${sosData.headcount}. Medical requirement: ${sosData.medicalNeeded ? "IMMEDIATE FIRST-AID NEEDED" : "None"}. Notes: ${sosData.notes || "Stranded pilgrims"}.`,
      lead_officer: {
        name: "SDRF Quick Reaction Force (QRF)",
        rank: "Commandant Emergency Relief",
        phone: "+91-135-2710334",
      },
      citizen_reports_count: 1,
    };
    setHotspots((prev) => [sosIncident, ...prev]);
    setSelectedHotspot(sosIncident);
  };

  // Update disaster status & clearance progress from Drawer
  const handleUpdateDisasterStatus = (id: string, newStatus: string, progress: number) => {
    setHotspots((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const updatedRoad = progress >= 100 ? "clear" : progress >= 50 ? "caution" : "blocked";
          return {
            ...h,
            status: newStatus,
            clearance_progress_percent: progress,
            road_status: updatedRoad,
          };
        }
        return h;
      })
    );

    if (selectedHotspot && selectedHotspot.id === id) {
      setSelectedHotspot((prev: any) => ({
        ...prev,
        status: newStatus,
        clearance_progress_percent: progress,
        road_status: progress >= 100 ? "clear" : progress >= 50 ? "caution" : "blocked",
      }));
    }
  };

  // Add Drill Incident
  const handleAddIncident = (newIncident: any) => {
    setHotspots((prev) => [newIncident, ...prev]);
    setSelectedHotspot(newIncident);
  };

  // Export Situation Report (SitRep) CSV
  const handleExportSitRep = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Incident ID,Type,Highway/Location,Latitude,Longitude,Road Status,Clearance Progress,Severity,Reported At,Lead Officer"]
        .concat(
          filteredIncidents.map(
            (h) =>
              `"${h.id}","${h.type}","${h.highway || h.location_name}",${h.latitude},${h.longitude},"${h.road_status}","${h.clearance_progress_percent || 0}%","${h.severity}","${h.reported_at}","${h.lead_officer?.name || h.assigned_guard || 'PWD/SDRF'}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `AapdaSutra_SitRep_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        selectedDivisionId={selectedDivisionId}
        onSelectDivision={(id) => {
          setSelectedDivisionId(id);
          setSelectedHotspot(null);
        }}
        onOpenSimulation={() => setIsSimulationOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSOSModal={() => setIsSOSModalOpen(true)}
        isOfficerMode={isOfficerMode}
        onToggleOfficerMode={() => setIsOfficerMode(!isOfficerMode)}
        onRefresh={syncSatelliteFeed}
        isRefreshing={isRefreshing}
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onToggleLang={toggleLang}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col">
        {/* Char Dham Highway Corridor Real-Time Status Bar */}
        <CorridorStatusBar
          corridors={corridors}
          selectedCorridorId={selectedCorridorId}
          onSelectCorridor={(id) => {
            setSelectedCorridorId(selectedCorridorId === id ? "all" : id);
          }}
          onOpenSitrepModal={() => setIsSitrepModalOpen(true)}
          lang={lang}
        />

        {/* Live Satellite & Disaster Command Telemetry Banner */}
        <div className="mb-3 px-3 py-2 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2 border bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="font-bold text-slate-900 dark:text-white">
              {isHi ? "आपदा-सूत्र एकीकृत ग्रिड:" : "Aapda-Sutra Unified Grid:"}
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {satelliteFeedInfo.message}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold">
              Google Maps Platform
            </span>
            <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-semibold">
              Gemini 2.5 Flash
            </span>
          </div>
        </div>

        {/* Executive Multi-Hazard Metrics Bar */}
        <MetricsBar
          division={currentDivision}
          hotspots={filteredIncidents}
          corridors={corridors}
          lang={lang}
          satelliteFeedInfo={satelliteFeedInfo}
        />

        {/* Live Mountain Weather & Hazard Propensity (Open-Meteo) */}
        <WeatherWidget
          division={currentDivision}
          lang={lang}
        />

        {/* Multi-Hazard Filter Pills */}
        <div className="flex items-center justify-between gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
              {isHi ? "आपदा प्रकार:" : "Hazard Type:"}
            </span>

            <button
              onClick={() => setActiveHazardFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeHazardFilter === "all"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs font-semibold"
                  : "bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              <span>🌐</span>
              <span>{isHi ? "समस्त आपदाएं" : "All Hazards"} ({hotspots.length})</span>
            </button>

            <button
              onClick={() => setActiveHazardFilter("landslide")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeHazardFilter === "landslide"
                  ? "bg-amber-600 text-white shadow-2xs font-semibold"
                  : "bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              <span>🪨</span>
              <span>{isHi ? "भूस्खलन" : "Landslides"}</span>
            </button>

            <button
              onClick={() => setActiveHazardFilter("cloudburst")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeHazardFilter === "cloudburst"
                  ? "bg-sky-600 text-white shadow-2xs font-semibold"
                  : "bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              <span>🌧️</span>
              <span>{isHi ? "बाढ़ / अतिवृष्टि" : "Cloudbursts"}</span>
            </button>

            <button
              onClick={() => setActiveHazardFilter("broken_road")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeHazardFilter === "broken_road"
                  ? "bg-purple-600 text-white shadow-2xs font-semibold"
                  : "bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              <span>🚧</span>
              <span>{isHi ? "सड़क धंसाव" : "Road Sinks"}</span>
            </button>

            <button
              onClick={() => setActiveHazardFilter("wildfire")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeHazardFilter === "wildfire"
                  ? "bg-rose-600 text-white shadow-2xs font-semibold"
                  : "bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              <span>🔥</span>
              <span>{isHi ? "वनाग्नि" : "Wildfires"}</span>
            </button>

            <button
              onClick={() => setActiveHazardFilter("sos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeHazardFilter === "sos"
                  ? "bg-red-600 text-white shadow-2xs font-semibold animate-pulse"
                  : "bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              <span>🆘</span>
              <span>{isHi ? "संकट संदेश" : "SOS Beacons"}</span>
            </button>
          </div>

          {/* SitRep & CSV Action */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsSitrepModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">SitRep AI</span>
            </button>

            <button
              onClick={handleExportSitRep}
              title={isHi ? "डेटा CSV डाउनलोड करें" : "Download Incidents CSV"}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 text-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-mono">CSV</span>
            </button>
          </div>
        </div>

        {/* Mobile Segmented Switcher (Visible only on < lg screens) */}
        <div className="flex lg:hidden mb-3 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setMobileTab("map")}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition ${
              mobileTab === "map"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{isHi ? "मानचित्र दृश्य" : "Map View"}</span>
          </button>
          <button
            onClick={() => setMobileTab("list")}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition ${
              mobileTab === "list"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>
              {isHi ? "आपदा सूची" : "Incident Grid"} ({filteredIncidents.length})
            </span>
          </button>
        </div>

        {/* GIS Map & Dispatch Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[560px]">
          {/* Main Leaflet Map: full on desktop, conditionally displayed on mobile */}
          <div
            className={`lg:col-span-8 h-[480px] lg:h-auto min-h-[460px] ${
              mobileTab === "list" ? "hidden lg:block" : "block"
            }`}
          >
            <MapComponent
              division={currentDivision}
              hotspots={filteredIncidents}
              corridors={corridors}
              shelters={shelters}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={(spot) => setSelectedHotspot(spot)}
              theme={theme}
              lang={lang}
              activeHazardFilter={activeHazardFilter}
            />
          </div>

          {/* Incident Feed & Action Sidebar */}
          <div
            className={`lg:col-span-4 flex flex-col gap-3 ${
              mobileTab === "map" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Quick Action Banner for Citizens & Officers */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 border border-slate-700/60 rounded-xl p-3 text-white shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    {isOfficerMode ? "SDRF / PWD COMMAND" : "CITIZEN LIFELINE"}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5">
                    {isOfficerMode
                      ? (isHi ? "त्वरित राहत एवं जेसीबी प्रेषण कक्ष" : "Clearance Dispatch & Excavators")
                      : (isHi ? "चारधाम तीर्थयात्री सहायता केंद्र" : "Pilgrim Highway Helpline 112 / 1070")}
                  </h4>
                </div>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition flex items-center gap-1 shadow-xs shrink-0"
                >
                  <span>📸</span>
                  <span>{isHi ? "रिपोर्ट" : "Report"}</span>
                </button>
              </div>
            </div>

            {/* Incident Feed List Header */}
            <div className="flex items-center justify-between text-xs font-semibold px-1 text-slate-600 dark:text-slate-400">
              <span>{isHi ? "सक्रिय बाधाएं एवं निकासी प्रगति" : "Active Hazards & Clearance"} ({filteredIncidents.length})</span>
              <span className="text-[10.5px] text-slate-500 font-mono">
                {selectedCorridorId === "all" ? "All Corridors" : selectedCorridorId.toUpperCase()}
              </span>
            </div>

            {/* Incidents Feed */}
            <div className="flex-1 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 overflow-y-auto space-y-2.5 max-h-[540px] shadow-xs">
              {filteredIncidents.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                  <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-500 mb-2" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isHi ? "इस श्रेणी या मार्ग पर कोई सक्रिय बाधा नहीं" : "No Blockages on Selected Route"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {isHi
                      ? "चारधाम मार्ग सुचारू रूप से खुला है।"
                      : "Route is reported clear by PWD and Border Roads Organisation (BRO)."}
                  </p>
                </div>
              ) : (
                filteredIncidents.map((spot) => {
                  const isSelected = selectedHotspot?.id === spot.id;
                  const isBlocked = spot.road_status === "blocked";
                  const isCaution = spot.road_status === "caution";
                  const progress = spot.clearance_progress_percent || 0;

                  // Hazard Icon
                  let hazardEmoji = "🪨";
                  if (spot.type === "cloudburst") hazardEmoji = "🌧️";
                  if (spot.type === "broken_road") hazardEmoji = "🚧";
                  if (spot.type === "wildfire") hazardEmoji = "🔥";
                  if (spot.type === "sos") hazardEmoji = "🆘";

                  return (
                    <div
                      key={spot.id}
                      onClick={() => setSelectedHotspot(spot)}
                      className={`p-3 rounded-xl border transition cursor-pointer relative ${
                        isSelected
                          ? "bg-slate-50 dark:bg-slate-800/80 border-emerald-500 shadow-md ring-1 ring-emerald-500/20"
                          : "bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {/* Top Row: Type, Title & Road Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="text-base shrink-0 leading-none mt-0.5">{hazardEmoji}</span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {spot.title || spot.location_name}
                            </h4>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{spot.highway || spot.location_name}</span>
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                            isBlocked
                              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                              : isCaution
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                              : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          }`}
                        >
                          {spot.road_status}
                        </span>
                      </div>

                      {/* Progress Bar (Clearance Timeline) */}
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">
                            {isHi ? "मार्ग निकासी प्रगति:" : "Clearance Progress:"}
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              progress >= 100
                                ? "bg-emerald-500"
                                : progress >= 50
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Machinery & Officer Footnote */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10.5px]">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          {spot.machinery_deployed && spot.machinery_deployed.length > 0 ? (
                            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                              <Truck className="w-3 h-3 text-amber-600" />
                              <span>{spot.machinery_deployed.length} JCB/Breaker</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-500">
                              <Shield className="w-3 h-3 text-emerald-600" />
                              <span>{spot.lead_officer?.name?.split(" ")[0] || "Patrol Team"}</span>
                            </span>
                          )}
                        </div>

                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                          {isHi ? "विस्तृत विवरण" : "View Details"}
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Slide-out Disaster & Road Clearance Drawer */}
      {selectedHotspot && (
        <DisasterDrawer
          incident={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
          onUpdateStatus={handleUpdateDisasterStatus}
          lang={lang}
          isOfficerMode={isOfficerMode}
        />
      )}

      {/* Citizen Hazard Report Modal (Google Gemini AI Vision) */}
      <ReportHazardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleAddHazardReport}
        lang={lang}
      />

      {/* Emergency SOS Beacon Modal (2G SMS Offline Fallback) */}
      <SOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        onTriggerSOS={handleAddSOS}
        lang={lang}
      />

      {/* Situation Report (SitRep) Modal (Google Gemini AI Synthesis) */}
      <SitRepModal
        isOpen={isSitrepModalOpen}
        onClose={() => setIsSitrepModalOpen(false)}
        activeIncidents={filteredIncidents}
        lang={lang}
      />

      {/* Drill Simulation Dialog */}
      <SimulationModal
        isOpen={isSimulationOpen}
        division={currentDivision}
        onClose={() => setIsSimulationOpen(false)}
        onAddIncident={handleAddIncident}
        lang={lang}
      />

      {/* Help & SOP Guide Dialog */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        lang={lang}
      />
    </div>
  );
}
