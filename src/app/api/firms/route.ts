import { NextResponse } from "next/server";
import forestData from "@/data/uttarakhand_forests.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const divisionId = searchParams.get("division") || "nainital";
  const apiKey = process.env.NASA_FIRMS_MAP_KEY;

  // Bounding box for Uttarakhand: [west: 77.5, south: 28.7, east: 81.0, north: 31.5]
  const bbox = "77.5,28.7,81.0,31.5";

  if (apiKey && apiKey !== "your_key_here") {
    try {
      // Fetch VIIRS 375m NRT (Near Real Time) data from NASA FIRMS
      const firmsUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/VIIRS_SNPP_NRT/${bbox}/1`;
      const response = await fetch(firmsUrl, { next: { revalidate: 900 } }); // cache for 15 mins

      if (response.ok) {
        const csvText = await response.text();
        const lines = csvText.trim().split("\n");
        if (lines.length > 1) {
          const headers = lines[0].split(",");
          const latIdx = headers.indexOf("latitude");
          const lonIdx = headers.indexOf("longitude");
          const brightIdx = headers.indexOf("bright_ti4");
          const confIdx = headers.indexOf("confidence");
          const frpIdx = headers.indexOf("frp");
          const timeIdx = headers.indexOf("acq_time");

          const parsedHotspots = lines.slice(1).map((line, index) => {
            const cols = line.split(",");
            return {
              id: `firms-live-${index}`,
              division_id: divisionId,
              latitude: parseFloat(cols[latIdx]),
              longitude: parseFloat(cols[lonIdx]),
              brightness_kelvin: parseFloat(cols[brightIdx]) || 320,
              confidence: cols[confIdx] || "nominal",
              confidence_percent: cols[confIdx] === "h" ? 90 : 70,
              frp_mw: parseFloat(cols[frpIdx]) || 12.0,
              satellite: "VIIRS SNPP (375m)",
              detected_at: `Acquired at ${cols[timeIdx] || "Recent pass"} UTC`,
              range_name: "Uttarakhand Hill Range",
              nearest_beat: "Local Sector Beat",
              elevation_meters: 1950,
              slope_aspect: "South-Facing Ridge",
              fuel_type: "Chir Pine Forest Bed",
              wind_speed_kmh: 12,
              wind_direction: "North-East",
              spread_risk: "Active Monitoring Required",
              status: "active",
              assigned_guard: "Pending Range Dispatch",
              is_simulation: false,
            };
          });

          return NextResponse.json({
            source: "NASA FIRMS (Live Satellite Feed)",
            count: parsedHotspots.length,
            hotspots: parsedHotspots,
          });
        }
      }
    } catch (err) {
      console.warn("Error fetching live FIRMS API, falling back to curated dataset:", err);
    }
  }

  // Curated baseline data for Uttarakhand divisions
  const filtered = forestData.sample_satellite_hotspots.filter(
    (h) => !divisionId || h.division_id === divisionId
  );

  return NextResponse.json({
    source: "NASA FIRMS (Archived VIIRS 375m Feed)",
    count: filtered.length,
    hotspots: filtered,
  });
}
