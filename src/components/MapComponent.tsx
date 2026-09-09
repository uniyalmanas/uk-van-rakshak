"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";

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
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const officersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: division?.center || [29.3888, 79.4552],
        zoom: division?.default_zoom || 11,
        zoomControl: false,
      });

      // Sleek Dark Matter GIS Tile Layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>',
        maxZoom: 18,
        subdomains: "abcd",
      }).addTo(map);

      // Top-right zoom control
      L.control.zoom({ position: "topright" }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      officersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Clean up map instance on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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
          weight: 2.5,
          opacity: 0.85,
          fillColor: division.id === "nainital" ? "#10b981" : "#38bdf8",
          fillOpacity: 0.08,
          dashArray: "4, 4",
        },
      }).addTo(map);

      geoLayer.bindTooltip(`<b>${division.name}</b><br/>Status: Protected Forest Boundary`, {
        permanent: false,
        direction: "center",
        className: "bg-slate-900 text-slate-100 border border-slate-700 rounded px-2 py-1 text-xs",
      });

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
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 11px;
            box-shadow: 0 0 8px rgba(52, 211, 153, 0.4);
          ">
            🛡️
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(officer.location, { icon: officerIcon });
      marker.bindPopup(`
        <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; padding: 2px;">
          <b style="color: #065f46;">${officer.name}</b><br/>
          <span>${officer.beat}</span><br/>
          <span>Status: <b style="color: #059669;">${officer.status}</b></span><br/>
          <span>Phone: ${officer.phone}</span>
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

      // Determine marker color by status
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
              width: ${isSelected ? "32px" : "26px"}; 
              height: ${isSelected ? "32px" : "26px"}; 
              border-radius: 50%; 
              border: 2px solid ${isSelected ? "#ffffff" : "rgba(255,255,255,0.7)"};
              box-shadow: 0 0 ${isSelected ? "20px" : "10px"} rgba(239, 68, 68, 0.8);
              transition: all 0.2s;
            ">
              <span style="font-size: ${isSelected ? "14px" : "12px"}">🔥</span>
            </div>
            ${
              spot.is_simulation
                ? `<span style="position: absolute; top: -14px; background: #ea580c; color: white; font-size: 9px; padding: 1px 4px; border-radius: 4px; font-weight: bold; white-space: nowrap;">DRILL</span>`
                : ""
            }
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([spot.latitude, spot.longitude], { icon: fireIcon });
      marker.on("click", () => {
        onSelectHotspot(spot);
      });

      markersLayer.addLayer(marker);

      // Draw Spread Direction Vector Arrow if fire is active
      if (spot.status === "active" && spot.wind_speed_kmh) {
        // Calculate spread line based on wind direction
        const deltaLat = 0.015 * (spot.wind_direction.includes("North") ? 1 : spot.wind_direction.includes("South") ? -1 : 0);
        const deltaLon = 0.015 * (spot.wind_direction.includes("East") ? 1 : spot.wind_direction.includes("West") ? -1 : 0);

        if (deltaLat !== 0 || deltaLon !== 0) {
          const spreadLine = L.polyline(
            [
              [spot.latitude, spot.longitude],
              [spot.latitude + deltaLat, spot.longitude + deltaLon],
            ],
            {
              color: "#f97316",
              weight: 2,
              dashArray: "3, 6",
              opacity: 0.8,
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

      {/* Map Legend & Layer Badge */}
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
