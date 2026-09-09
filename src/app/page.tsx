"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { MetricsBar } from "@/components/MetricsBar";
import { IncidentDrawer } from "@/components/IncidentDrawer";
import { SimulationModal } from "@/components/SimulationModal";
import { HelpModal } from "@/components/HelpModal";
import forestData from "@/data/uttarakhand_forests.json";
import { 
  Flame, 
  MapPin, 
  Shield, 
  PhoneCall, 
  ChevronRight,
  FileText,
  Map as MapIcon,
  ListFilter
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
            Loading Cartography...
          </span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("all_uk");
  const [hotspots, setHotspots] = useState<any[]>(forestData.sample_satellite_hotspots);
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Clean Theme & Language states
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [lang, setLang] = useState<"en" | "hi">("en");
  
  // Mobile View Tab: "map" | "list"
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");

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

  // If "all_uk" is selected, show all hotspots across Uttarakhand; otherwise filter by division
  const divisionHotspots =
    selectedDivisionId === "all_uk"
      ? hotspots
      : hotspots.filter((h) => h.division_id === selectedDivisionId);

  const filteredHotspots = divisionHotspots.filter((h) => {
    if (filterStatus === "all") return true;
    return h.status === filterStatus;
  });

  // Sync with NASA FIRMS API
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/firms?division=${selectedDivisionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.hotspots && data.hotspots.length > 0) {
          setHotspots((prev) => {
            const simulations = prev.filter((p) => p.is_simulation);
            return [...data.hotspots, ...simulations];
          });
        }
      }
    } catch (e) {
      console.error("Refresh error", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: string,
    assignedGuard?: string
  ) => {
    setHotspots((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          return {
            ...h,
            status: newStatus,
            assigned_guard: assignedGuard || h.assigned_guard,
          };
        }
        return h;
      })
    );

    if (selectedHotspot && selectedHotspot.id === id) {
      setSelectedHotspot((prev: any) => ({
        ...prev,
        status: newStatus,
        assigned_guard: assignedGuard || prev.assigned_guard,
      }));
    }
  };

  const handleAddIncident = (newIncident: any) => {
    setHotspots((prev) => [newIncident, ...prev]);
    setSelectedHotspot(newIncident);
  };

  // Export Situation Report (SitRep)
  const handleExportSitRep = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Incident ID,Division,Range,Beat,Latitude,Longitude,Brightness(K),FRP(MW),Status,Assigned Officer"]
        .concat(
          divisionHotspots.map(
            (h) =>
              `"${h.id}","${h.division_id}","${h.range_name}","${h.nearest_beat}",${h.latitude},${h.longitude},${h.brightness_kelvin},${h.frp_mw},"${h.status}","${h.assigned_guard}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `SitRep_${selectedDivisionId}_${new Date().toISOString().slice(0, 10)}.csv`
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
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onToggleLang={toggleLang}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col">
        {/* Executive Metrics Bar */}
        <MetricsBar
          division={currentDivision}
          hotspots={divisionHotspots}
          lang={lang}
        />

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
            <span>{isHi ? "मानचित्र" : "Map View"}</span>
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
              {isHi ? "घटना सूची" : "Incident List"} ({divisionHotspots.length})
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
              hotspots={filteredHotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={(spot) => setSelectedHotspot(spot)}
              theme={theme}
              lang={lang}
            />
          </div>

          {/* Incident Feed & Action Sidebar */}
          <div
            className={`lg:col-span-4 flex flex-col gap-3 ${
              mobileTab === "map" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Division / State Command Contact Card */}
            <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
                  {selectedDivisionId === "all_uk"
                    ? (isHi ? "राज्य नोडल वनाग्नि कमान" : "State Nodal Wildfire Command")
                    : (isHi ? "प्रभागीय वनाधिकारी" : "Divisional Forest Officer")}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentDivision.dfo}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {currentDivision.name}
                </span>
              </div>
              <a
                href={`tel:${currentDivision.control_room_contact}`}
                className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition flex items-center gap-1.5 text-xs font-medium"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">{isHi ? "कंट्रोल रूम" : "Control"}</span>
              </a>
            </div>

            {/* Filter Tabs & Export SitRep Button */}
            <div className="flex items-center justify-between gap-1 bg-white dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-0.5 flex-1">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                    filterStatus === "all"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                  }`}
                >
                  {isHi ? "सभी" : "All"} ({divisionHotspots.length})
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                    filterStatus === "active"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                  }`}
                >
                  {isHi ? "सक्रिय" : "Active"}
                </button>
                <button
                  onClick={() => setFilterStatus("dispatched")}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                    filterStatus === "dispatched"
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                  }`}
                >
                  {isHi ? "रवाना" : "Dispatched"}
                </button>
              </div>

              {/* Export SitRep CSV */}
              <button
                onClick={handleExportSitRep}
                title={isHi ? "दैनिक स्थिति रिपोर्ट (CSV) डाउनलोड करें" : "Download Daily Situation Report"}
                className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 text-[11px]"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span className="hidden sm:inline font-mono">SitRep</span>
              </button>
            </div>

            {/* Hotspots Incident Feed */}
            <div className="flex-1 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 overflow-y-auto space-y-2 max-h-[500px] shadow-xs">
              {filteredHotspots.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center p-4">
                  <Shield className="w-7 h-7 text-emerald-600 dark:text-emerald-500 mb-1.5" />
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {isHi ? "इस श्रेणी में कोई घटना नहीं" : "No Incidents in This Category"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isHi
                      ? "परीक्षण हेतु ऊपर 'मॉक ड्रिल' पर क्लिक करें।"
                      : "Click 'Simulate Drill' above to run a training incident."}
                  </p>
                </div>
              ) : (
                filteredHotspots.map((spot) => {
                  const isSelected = selectedHotspot?.id === spot.id;
                  let statusColor = "bg-rose-600";
                  if (spot.status === "dispatched") statusColor = "bg-amber-600";
                  if (spot.status === "contained") statusColor = "bg-sky-600";
                  if (spot.status === "resolved") statusColor = "bg-emerald-600";

                  return (
                    <div
                      key={spot.id}
                      onClick={() => {
                        setSelectedHotspot(spot);
                      }}
                      className={`p-2.5 rounded-lg border transition cursor-pointer ${
                        isSelected
                          ? "bg-slate-50 dark:bg-slate-800 border-emerald-500 shadow-xs"
                          : "bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${statusColor}`} />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {spot.range_name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {spot.detected_at}
                        </span>
                      </div>

                      <div className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>
                          {isHi ? "बीट:" : "Beat:"}{" "}
                          <b className="text-slate-700 dark:text-slate-300 font-medium">
                            {spot.nearest_beat}
                          </b>
                        </span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {spot.brightness_kelvin} K
                        </span>
                      </div>

                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>
                          {isHi ? "गार्ड:" : "Guard:"}{" "}
                          <span className="text-slate-700 dark:text-slate-300">
                            {spot.assigned_guard?.split(" ")[0]}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {spot.elevation_meters}m
                        </span>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10.5px]">
                        <span className="font-medium text-rose-700 dark:text-rose-400 truncate max-w-[170px]">
                          {spot.spread_risk.split("-")[0]}
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center">
                          {isHi ? "विवरण देखें" : "View"} <ChevronRight className="w-3 h-3" />
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

      {/* Slide-out / Bottom-Sheet Incident Drawer */}
      {selectedHotspot && (
        <IncidentDrawer
          hotspot={selectedHotspot}
          division={currentDivision}
          onClose={() => setSelectedHotspot(null)}
          onUpdateStatus={handleUpdateStatus}
          lang={lang}
        />
      )}

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
