"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Satellite, Moon, Sun, Layers } from "lucide-react";

interface MapComponentProps {
  division: any;
  hotspots: any[];
  selectedHotspot: any | null;
  onSelectHotspot: (hotspot: any) => void;
  theme: "light" | "dark";
  lang: "en" | "hi";
}

export const MapComponent: React.FC<MapComponentProps> = ({
  division,
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  theme,
  lang,
}) => {
  const isHi = lang === "hi";
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const officersLayerRef = useRef<L.LayerGroup | null>(null);

  // Basemap Mode: "canopy" (Satellite imagery) or "vector" (clean street/topo GIS)
  const [basemapMode, setBasemapMode] = useState<"canopy" | "vector">("canopy");

  // Bounding box restricted to Uttarakhand
  const UTTARAKHAND_BOUNDS: L.LatLngBoundsLiteral = [
    [28.4, 77.2],
    [31.8, 81.3],
  ];

  const getTileUrl = (mode: "canopy" | "vector", currentTheme: "light" | "dark") => {
    if (mode === "canopy") {
      return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    }
    return currentTheme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: division?.center || [29.3888, 79.4552],
        zoom: division?.default_zoom || 11,
        minZoom: 9,
        maxZoom: 17,
        maxBounds: UTTARAKHAND_BOUNDS,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
      });

      const initialUrl = getTileUrl("canopy", theme);
      tileLayerRef.current = L.tileLayer(initialUrl, {
        attribution: "Esri World Imagery • Uttarakhand Forest Dept",
        maxZoom: 17,
        subdomains: "abcd",
      }).addTo(map);

      // Clean zoom control at top-right
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

  // Update tile layer when basemapMode or theme changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const url = getTileUrl(basemapMode, theme);
    tileLayerRef.current = L.tileLayer(url, {
      attribution:
        basemapMode === "canopy"
          ? "Esri World Imagery"
          : "&copy; OpenStreetMap contributors &copy; CARTO",
      maxZoom: 17,
      subdomains: "abcd",
    }).addTo(map);
  }, [basemapMode, theme]);

  // Update Center & GeoJSON Boundary when Division changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !division) return;

    map.flyTo(division.center, division.default_zoom, { duration: 1.0 });

    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
    }

    if (division.geojson) {
      const isNainital = division.id === "nainital";
      const geoLayer = L.geoJSON(division.geojson, {
        style: {
          color: isNainital ? "#059669" : "#0284c7",
          weight: 2.5,
          opacity: 0.9,
          fillColor: isNainital ? "#059669" : "#0284c7",
          fillOpacity: 0.08,
          dashArray: "5, 5",
        },
      }).addTo(map);

      geoLayer.bindTooltip(
        `<b>${division.name}</b><br/>${isHi ? "वैध प्रभाग सीमा" : "Official Division Boundary"}`,
        {
          permanent: false,
          direction: "center",
          className:
            "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs shadow-sm",
        }
      );

      geojsonLayerRef.current = geoLayer;
    }
  }, [division, isHi]);

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
            background: #047857; 
            border: 2px solid #ffffff; 
            color: #ffffff; 
            width: 22px; 
            height: 22px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 11px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          ">
            🛡️
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker(officer.location, { icon: officerIcon });
      marker.bindPopup(`
        <div style="font-family: -apple-system, sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
          <b style="color: #047857;">${officer.name}</b><br/>
          <span style="color: #64748b;">${officer.beat}</span><br/>
          <span>${isHi ? "स्थिति" : "Status"}: <b>${officer.status}</b></span><br/>
          <span style="color: #64748b;">${officer.phone}</span>
        </div>
      `);
      officersLayer.addLayer(marker);
    });
  }, [division, isHi]);

  // Render Fire Hotspots
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    markersLayer.clearLayers();

    hotspots.forEach((spot) => {
      const isSelected = selectedHotspot?.id === spot.id;
      const isHighRisk = spot.confidence === "high" || spot.brightness_kelvin > 330;

      // Color coding: Red for active, Amber for dispatched, Blue for contained, Green for resolved
      let bgColor = "#e11d48"; // rose-600
      if (spot.status === "dispatched") bgColor = "#d97706"; // amber-600
      if (spot.status === "contained") bgColor = "#0284c7"; // sky-600
      if (spot.status === "resolved") bgColor = "#059669"; // emerald-600

      const pulseClass = isHighRisk && spot.status === "active" ? "marker-pulse" : "";

      const fireIcon = L.divIcon({
        className: "custom-clean-fire-marker",
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="${pulseClass}" style="
              width: ${isSelected ? "26px" : "20px"}; 
              height: ${isSelected ? "26px" : "20px"}; 
              border-radius: 50%; 
              background-color: ${bgColor};
              border: 2px solid #ffffff;
              box-shadow: 0 1px 6px rgba(0,0,0,0.35);
              transition: all 0.15s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
            </div>
            ${
              spot.is_simulation
                ? `<span style="position: absolute; top: -14px; background: #ea580c; color: white; font-size: 8px; padding: 1px 4px; border-radius: 3px; font-weight: 700; white-space: nowrap;">DRILL</span>`
                : ""
            }
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([spot.latitude, spot.longitude], { icon: fireIcon });
      marker.on("click", () => {
        onSelectHotspot(spot);
      });

      markersLayer.addLayer(marker);

      // Subtle directional spread vector
      if (spot.status === "active" && spot.wind_speed_kmh) {
        const deltaLat =
          0.012 *
          (spot.wind_direction.includes("North")
            ? 1
            : spot.wind_direction.includes("South")
            ? -1
            : 0);
        const deltaLon =
          0.012 *
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
              weight: 2,
              dashArray: "3, 5",
              opacity: 0.85,
            }
          );
          markersLayer.addLayer(spreadLine);
        }
      }
    });
  }, [hotspots, selectedHotspot, onSelectHotspot]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Left: Compliance Badge */}
      <div className="absolute top-3 left-3 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 shadow-sm flex items-center gap-1.5 pointer-events-auto">
        <span className="text-xs">🇮🇳</span>
        <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
          {isHi
            ? "भारतीय सर्वेक्षण विभाग (SOI) मानक संरेखित"
            : "Survey of India (SOI) Aligned"}
        </span>
      </div>

      {/* Top Right: Basemap Switcher */}
      <div className="absolute top-16 right-3 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-sm flex flex-col gap-1 pointer-events-auto">
        <button
          onClick={() => setBasemapMode("canopy")}
          className={`px-2 py-1 rounded text-[10px] font-medium transition flex items-center gap-1 ${
            basemapMode === "canopy"
              ? "bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Satellite className="w-3 h-3" />
          <span>{isHi ? "उपग्रह" : "Satellite"}</span>
        </button>
        <button
          onClick={() => setBasemapMode("vector")}
          className={`px-2 py-1 rounded text-[10px] font-medium transition flex items-center gap-1 ${
            basemapMode === "vector"
              ? "bg-slate-800 dark:bg-slate-700 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>{isHi ? "मानचित्र" : "Map"}</span>
        </button>
      </div>

      {/* Bottom Left: Clean Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-[11px] shadow-sm max-w-[210px] pointer-events-auto">
        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          {isHi ? "संकेत विवरण" : "Legend"}
        </div>
        <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[10.5px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-600 shrink-0" />
            <span>{isHi ? "सक्रिय वनाग्नि" : "Active Hotspot"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-600 shrink-0" />
            <span>{isHi ? "गश्ती दल रवाना" : "Guard Dispatched"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
            <span>{isHi ? "नियंत्रित / शांत" : "Contained"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] leading-none">🛡️</span>
            <span>{isHi ? "वन कर्मी गश्ती बिंदु" : "Field Guard Patrol"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
