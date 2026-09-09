"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Layers, ShieldAlert, Satellite, Moon } from "lucide-react";

interface MapComponentProps {
  division: any;
  hotspots: any[];
  selectedHotspot: any | null;
  onSelectHotspot: (hotspot: any) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  division,
  hotspots,
  selectedHotspot,
  onSelectHotspot,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const officersLayerRef = useRef<L.LayerGroup | null>(null);

  // Basemap Mode: "satellite" (Esri photorealistic mountain imagery) or "dark" (Tactical GIS)
  const [basemapMode, setBasemapMode] = useState<"satellite" | "dark">("satellite");

  // Uttarakhand Bounding Box to strictly restrict panning/zooming outside the state
  // This prevents displaying disputed international borders from generic open-source maps
  const UTTARAKHAND_BOUNDS: L.LatLngBoundsLiteral = [
    [28.4, 77.2], // South-West
    [31.8, 81.3], // North-East
  ];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: division?.center || [29.3888, 79.4552],
        zoom: division?.default_zoom || 11,
        minZoom: 9, // Prevents zooming out to national/international borders
        maxZoom: 17,
        maxBounds: UTTARAKHAND_BOUNDS, // Locks viewport strictly to Uttarakhand
        maxBoundsViscosity: 1.0, // Hard bounce-back
        zoomControl: false,
      });

      // Default to Satellite Imagery: Zero political boundary conflict & shows actual forest canopy
      const initialTileUrl =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

      tileLayerRef.current = L.tileLayer(initialTileUrl, {
        attribution: "Esri World Imagery • Uttarakhand Forest Department",
        maxZoom: 17,
      }).addTo(map);

      // Top-right zoom control
      L.control.zoom({ position: "topright" }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      officersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Basemap Switcher
  const handleBasemapChange = (mode: "satellite" | "dark") => {
    setBasemapMode(mode);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      mode === "satellite"
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution:
        mode === "satellite"
          ? "Esri World Imagery • High-Res Forest Canopy"
          : '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 17,
      subdomains: "abcd",
    }).addTo(map);
  };

  // Update Center & GeoJSON Boundary when Division changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !division) return;

    map.flyTo(division.center, division.default_zoom, { duration: 1.2 });

    // Remove existing GeoJSON boundary
    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
    }

    if (division.geojson) {
      const geoLayer = L.geoJSON(division.geojson, {
        style: {
          color: division.id === "nainital" ? "#10b981" : "#38bdf8",
          weight: 3,
          opacity: 0.9,
          fillColor: division.id === "nainital" ? "#10b981" : "#38bdf8",
          fillOpacity: 0.12,
          dashArray: "6, 4",
        },
      }).addTo(map);

      geoLayer.bindTooltip(
        `<b>${division.name}</b><br/>Survey of India / Bhuvan Validated Division`,
        {
          permanent: false,
          direction: "center",
          className:
            "bg-slate-900 text-slate-100 border border-slate-700 rounded px-2.5 py-1 text-xs shadow-md",
        }
      );

      geojsonLayerRef.current = geoLayer;
    }
  }, [division]);

  // Render Beat Officers
  useEffect(() => {
    const officersLayer = officersLayerRef.current;
    if (!officersLayer || !division?.beat_officers) return;

    officersLayer.clearLayers();

    division.beat_officers.forEach((officer: any) => {
      if (!officer.location) return;

      const officerIcon = L.divIcon({
        className: "custom-officer-pin",
        html: `
          <div style="
            background: #064e3b; 
            border: 2px solid #34d399; 
            color: #34d399; 
            width: 26px; 
            height: 26px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 12px;
            box-shadow: 0 0 10px rgba(52, 211, 153, 0.6);
          ">
            🛡️
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker(officer.location, { icon: officerIcon });
      marker.bindPopup(`
        <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; padding: 3px;">
          <b style="color: #065f46;">${officer.name}</b><br/>
          <span>${officer.beat}</span><br/>
          <span>Status: <b style="color: #059669;">${officer.status}</b></span><br/>
          <span>Radio / Phone: ${officer.phone}</span>
        </div>
      `);
      officersLayer.addLayer(marker);
    });
  }, [division]);

  // Render Fire Hotspots & Spread Vectors
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    markersLayer.clearLayers();

    hotspots.forEach((spot) => {
      const isSelected = selectedHotspot?.id === spot.id;
      const isHighRisk = spot.confidence === "high" || spot.brightness_kelvin > 330;

      let colorClass = "bg-red-600";
      let pulseRing = isHighRisk ? "fire-pulse-high" : "";
      if (spot.status === "dispatched") colorClass = "bg-amber-500";
      if (spot.status === "contained") colorClass = "bg-sky-500";
      if (spot.status === "resolved") colorClass = "bg-emerald-500";

      const fireIcon = L.divIcon({
        className: "custom-fire-marker",
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="${colorClass} ${pulseRing} flex items-center justify-center text-white font-bold" style="
              width: ${isSelected ? "34px" : "28px"}; 
              height: ${isSelected ? "34px" : "28px"}; 
              border-radius: 50%; 
              border: 2px solid ${isSelected ? "#ffffff" : "rgba(255,255,255,0.8)"};
              box-shadow: 0 0 ${isSelected ? "22px" : "12px"} rgba(239, 68, 68, 0.9);
              transition: all 0.2s;
            ">
              <span style="font-size: ${isSelected ? "15px" : "13px"}">🔥</span>
            </div>
            ${
              spot.is_simulation
                ? `<span style="position: absolute; top: -16px; background: #ea580c; color: white; font-size: 9px; padding: 1px 5px; border-radius: 4px; font-weight: 800; white-space: nowrap; border: 1px solid rgba(255,255,255,0.4);">DRILL</span>`
                : ""
            }
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([spot.latitude, spot.longitude], { icon: fireIcon });
      marker.on("click", () => {
        onSelectHotspot(spot);
      });

      markersLayer.addLayer(marker);

      // Draw Spread Direction Vector Arrow
      if (spot.status === "active" && spot.wind_speed_kmh) {
        const deltaLat =
          0.015 *
          (spot.wind_direction.includes("North")
            ? 1
            : spot.wind_direction.includes("South")
            ? -1
            : 0);
        const deltaLon =
          0.015 *
          (spot.wind_direction.includes("East")
            ? 1
            : spot.wind_direction.includes("West")
            ? -1
            : 0);

        if (deltaLat !== 0 || deltaLon !== 0) {
          const spreadLine = L.polyline(
            [
              [spot.latitude, spot.longitude],
              [spot.latitude + deltaLat, spot.longitude + deltaLon],
            ],
            {
              color: "#f97316",
              weight: 2.5,
              dashArray: "4, 6",
              opacity: 0.9,
            }
          );
          markersLayer.addLayer(spreadLine);
        }
      }
    });
  }, [hotspots, selectedHotspot, onSelectHotspot]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Left: Official Survey of India (SOI) Compliance Watermark */}
      <div className="absolute top-3 left-3 z-20 bg-slate-950/90 backdrop-blur-md border border-emerald-500/30 rounded-lg px-2.5 py-1.5 shadow-lg flex items-center gap-2">
        <span className="text-sm">🇮🇳</span>
        <div>
          <span className="text-[10px] font-bold text-emerald-300 block leading-tight">
            Survey of India & Bhuvan Compliant
          </span>
          <span className="text-[9px] text-slate-400 block leading-tight">
            Viewport restricted to Uttarakhand State Territory
          </span>
        </div>
      </div>

      {/* Top Right (Below Zoom): Basemap Switcher */}
      <div className="absolute top-16 right-3 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-lg flex flex-col gap-1">
        <button
          onClick={() => handleBasemapChange("satellite")}
          title="Switch to High-Res Forest Satellite Canopy (Esri World Imagery)"
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
            basemapMode === "satellite"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Satellite className="w-3 h-3" />
          <span>Canopy</span>
        </button>
        <button
          onClick={() => handleBasemapChange("dark")}
          title="Switch to Dark Tactical GIS Cartography"
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
            basemapMode === "dark"
              ? "bg-slate-700 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Moon className="w-3 h-3" />
          <span>Tactical</span>
        </button>
      </div>

      {/* Bottom Left: Map Legend & GIS Layer Badge */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-[11px] shadow-lg pointer-events-auto max-w-xs">
        <div className="font-bold text-slate-200 mb-2 flex items-center justify-between border-b border-slate-800/80 pb-1">
          <span>GIS Sensor Layers</span>
          <span className="text-[10px] text-emerald-400">● LIVE</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span className="text-slate-300">Active Fire Hotspot (VIIRS 375m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-slate-300">Beat Guard Dispatched En Route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Extinguished / Fireline Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">🛡️</span>
            <span className="text-slate-300">Forest Guard Patrol Position</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 border-t-2 border-dashed border-orange-500 inline-block" />
            <span className="text-slate-300">Wind & Upslope Spread Vector</span>
          </div>
        </div>
      </div>
    </div>
  );
};
