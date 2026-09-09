"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { MetricsBar } from "@/components/MetricsBar";
import { IncidentDrawer } from "@/components/IncidentDrawer";
import { SimulationModal } from "@/components/SimulationModal";
import forestData from "@/data/uttarakhand_forests.json";
import { 
  Flame, 
  MapPin, 
  Shield, 
  Clock, 
  Filter, 
  PhoneCall, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";

// Dynamically import MapComponent to disable SSR for Leaflet
const MapComponent = dynamic(
  () => import("@/components/MapComponent").then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400 font-mono">
            Initializing Uttarakhand PostGIS Cartography...
          </span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("nainital");
  const [hotspots, setHotspots] = useState<any[]>(forestData.sample_satellite_hotspots);
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const currentDivision =
    forestData.divisions.find((d) => d.id === selectedDivisionId) ||
    forestData.divisions[0];

  // Filter hotspots for current division and status
  const divisionHotspots = hotspots.filter(
    (h) => h.division_id === selectedDivisionId
  );

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
          // Merge preserving existing simulation drills
          setHotspots((prev) => {
            const simulations = prev.filter((p) => p.is_simulation);
            return [...data.hotspots, ...simulations];
          });
        }
      }
    } catch (e) {
      console.error("Refresh error", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Update Status of an Incident
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

  // Add simulated incident
  const handleAddIncident = (newIncident: any) => {
    setHotspots((prev) => [newIncident, ...prev]);
    setSelectedHotspot(newIncident);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100">
      {/* Top Navbar */}
      <Navbar
        selectedDivisionId={selectedDivisionId}
        onSelectDivision={(id) => {
          setSelectedDivisionId(id);
          setSelectedHotspot(null);
        }}
        onOpenSimulation={() => setIsSimulationOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        totalHotspots={divisionHotspots.length}
      />

      {/* Main Command Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Top Operational Metrics */}
        <MetricsBar
          division={currentDivision}
          hotspots={divisionHotspots}
        />

        {/* GIS Map & Tactical Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[620px]">
          {/* Main Leaflet GIS Map (8 Columns) */}
          <div className="lg:col-span-8 h-[520px] lg:h-auto min-h-[500px]">
            <MapComponent
              division={currentDivision}
              hotspots={filteredHotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={(spot) => setSelectedHotspot(spot)}
            />
          </div>

          {/* Incident Feed & Division Dispatch Console (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Division DFO Contact Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Division Command In-Charge
                </span>
                <span className="text-xs font-bold text-white">
                  {currentDivision.dfo}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {currentDivision.name}
                </span>
              </div>
              <a
                href={`tel:${currentDivision.control_room_contact}`}
                className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition flex items-center gap-1.5 text-xs font-medium"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">HQ Radio</span>
              </a>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilterStatus("all")}
                className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                  filterStatus === "all"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All ({divisionHotspots.length})
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                  filterStatus === "active"
                    ? "bg-red-500/20 text-red-300 border border-red-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus("dispatched")}
                className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                  filterStatus === "dispatched"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Dispatched
              </button>
              <button
                onClick={() => setFilterStatus("contained")}
                className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                  filterStatus === "contained"
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Contained
              </button>
            </div>

            {/* Hotspots Incident List */}
            <div className="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-3 overflow-y-auto space-y-2.5 max-h-[500px]">
              {filteredHotspots.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                  <Shield className="w-8 h-8 text-emerald-400/60 mb-2" />
                  <p className="text-xs font-semibold text-slate-300">
                    No Hotspots Under This Filter
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Select another filter or click &quot;Simulate Incident&quot; to test.
                  </p>
                </div>
              ) : (
                filteredHotspots.map((spot) => {
                  const isSelected = selectedHotspot?.id === spot.id;
                  return (
                    <div
                      key={spot.id}
                      onClick={() => setSelectedHotspot(spot)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? "bg-slate-800/90 border-amber-500/80 shadow-md shadow-amber-500/10"
                          : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              spot.status === "active"
                                ? "bg-red-500 animate-pulse"
                                : spot.status === "dispatched"
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-200">
                            {spot.range_name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {spot.detected_at}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Beat: <b className="text-slate-200">{spot.nearest_beat}</b></span>
                        <span className="font-mono text-amber-400 font-semibold">{spot.brightness_kelvin} K</span>
                      </div>

                      <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Guard: <span className="text-slate-300">{spot.assigned_guard?.split(" ")[0]}</span></span>
                        <span className="text-[10px] text-sky-400">{spot.elevation_meters}m</span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {spot.spread_risk.split("-")[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5 group-hover:text-white">
                          Dispatch Action <ChevronRight className="w-3 h-3" />
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

      {/* Slide-in Incident Inspection & Dispatch Drawer */}
      {selectedHotspot && (
        <IncidentDrawer
          hotspot={selectedHotspot}
          division={currentDivision}
          onClose={() => setSelectedHotspot(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Drill Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationOpen}
        division={currentDivision}
        onClose={() => setIsSimulationOpen(false)}
        onAddIncident={handleAddIncident}
      />
    </div>
  );
}
