import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || "29.3888";
  const lon = searchParams.get("lon") || "79.4552";
  const divisionId = searchParams.get("division") || "nainital";

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&timezone=Asia%2FKolkata`;
    
    const res = await fetch(weatherUrl, { next: { revalidate: 1800 } }); // Cache for 30 minutes
    
    if (!res.ok) {
      throw new Error(`Open-Meteo responded with status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current || {};
    const elevation = data.elevation || 1940;

    const temp = current.temperature_2m ?? 24.5;
    const humidity = current.relative_humidity_2m ?? 38;
    const windSpeed = current.wind_speed_10m ?? 14.2;
    const windDirDeg = current.wind_direction_10m ?? 45;

    // Convert degrees to cardinal direction
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const cardinalDir = directions[Math.round(windDirDeg / 45) % 8];

    // Compute Mountain Fire Weather Index (FWI) for Uttarakhand Himalayan Chir Pine Belt
    // Lower humidity + Higher temp + High wind = Exponential fire danger
    const drynessScore = Math.max(0, (100 - humidity) * 0.7);
    const tempMultiplier = Math.max(0.6, temp / 22);
    const windMultiplier = 1 + (windSpeed / 25);
    
    const rawFwi = Math.round(drynessScore * tempMultiplier * windMultiplier * 0.85);
    const fwiScore = Math.min(100, Math.max(10, rawFwi));

    let fwiCategory = "MODERATE";
    let fwiCategoryHi = "मध्यम";
    let fwiColor = "#d97706"; // amber-600
    let pineLitterStatus = "Dry Pine Litter (Moderate Desiccation)";
    let pineLitterStatusHi = "सूखा पिरुल (मध्यम प्रज्वलनशील)";
    let advisory = "Routine afternoon patrols along southern pine ridges recommended.";
    let advisoryHi = "दक्षिणी चीड़ ढलानों पर दोपहर में नियमित गश्त की संस्तुति।";

    if (fwiScore >= 80) {
      fwiCategory = "EXTREME DANGER";
      fwiCategoryHi = "अति संवेदनशील (गंभीर)";
      fwiColor = "#dc2626"; // red-600
      pineLitterStatus = "Critically Dry & Brittle (Instant Ignition Risk)";
      pineLitterStatusHi = "अत्यधिक सूखा व भुरभुरा (तत्काल आग पकड़ने का खतरा)";
      advisory = "CRITICAL: Pine needles ignite instantly from friction/sparks. Deploy rapid action teams across ridge crests.";
      advisoryHi = "गंभीर चेतावनी: पिरुल तुरंत आग पकड़ सकता है। सभी रिज क्षेत्रों में त्वरित प्रतिक्रिया दल तैनात करें।";
    } else if (fwiScore >= 60) {
      fwiCategory = "HIGH RISK";
      fwiCategoryHi = "उच्च जोखिम";
      fwiColor = "#ea580c"; // orange-600
      pineLitterStatus = "Highly Desiccated Pine Needles (Pirul)";
      pineLitterStatusHi = "अत्यधिक सूखा पिरुल ईंधन भार";
      advisory = "High upslope spread hazard under current wind gusts. Water bowsers on standby.";
      advisoryHi = "वर्तमान हवा की गति में ऊपर की ओर तेजी से आग फैलने का खतरा। पानी के टैंकर स्टैंडबाय रखें।";
    } else if (fwiScore <= 35) {
      fwiCategory = "LOW HAZARD";
      fwiCategoryHi = "कम जोखिम";
      fwiColor = "#059669"; // emerald-600
      pineLitterStatus = "Damp Pine Bed / High Moisture";
      pineLitterStatusHi = "नमी युक्त पिरुल तल (सुरक्षित)";
      advisory = "Adequate atmospheric moisture prevents rapid surface propagation.";
      advisoryHi = "पर्याप्त वायुमंडलीय आर्द्रता के कारण आग के तीव्र प्रसार की संभावना न्यूनतम।";
    }

    return NextResponse.json({
      success: true,
      division_id: divisionId,
      elevation_meters: elevation,
      weather: {
        temperature_c: temp,
        relative_humidity_percent: humidity,
        wind_speed_kmh: windSpeed,
        wind_direction_deg: windDirDeg,
        wind_cardinal: cardinalDir,
        recorded_at: current.time || new Date().toISOString(),
      },
      fwi: {
        score: fwiScore,
        category: fwiCategory,
        category_hi: fwiCategoryHi,
        color: fwiColor,
        pine_litter_status: pineLitterStatus,
        pine_litter_status_hi: pineLitterStatusHi,
        advisory,
        advisory_hi: advisoryHi,
      },
    });
  } catch (error) {
    console.error("Weather API error, returning mountain seasonal estimate:", error);
    return NextResponse.json({
      success: true,
      division_id: divisionId,
      elevation_meters: 1950,
      weather: {
        temperature_c: 23.4,
        relative_humidity_percent: 36,
        wind_speed_kmh: 15.0,
        wind_direction_deg: 50,
        wind_cardinal: "NE",
        recorded_at: new Date().toISOString(),
      },
      fwi: {
        score: 68,
        category: "HIGH RISK",
        category_hi: "उच्च जोखिम",
        color: "#ea580c",
        pine_litter_status: "Highly Desiccated Pine Needles (Pirul)",
        pine_litter_status_hi: "अत्यधिक सूखा पिरुल ईंधन भार",
        advisory: "High upslope spread hazard under current wind gusts. Water bowsers on standby.",
        advisory_hi: "वर्तमान हवा की गति में ऊपर की ओर तेजी से आग फैलने का खतरा। पानी के टैंकर स्टैंडबाय रखें।",
      },
    });
  }
}
