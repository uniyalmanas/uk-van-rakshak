import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hotspot, guardName, guardPhone, messageType } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const mapsUrl = `https://www.google.com/maps?q=${hotspot.latitude},${hotspot.longitude}`;
    const alertMessage = 
`🚨 *UTTARAKHAND FOREST FIRE ALERT* 🚨
--------------------------------------
📍 *Division:* ${hotspot.division_id.toUpperCase()}
🌲 *Range:* ${hotspot.range_name}
🛡️ *Beat:* ${hotspot.nearest_beat}
🛰️ *Satellite:* ${hotspot.satellite}
🔥 *Brightness:* ${hotspot.brightness_kelvin} K (FRP: ${hotspot.frp_mw} MW)
💨 *Wind Spread:* ${hotspot.wind_speed_kmh} km/h ${hotspot.wind_direction}
⛰️ *Elevation:* ${hotspot.elevation_meters}m (${hotspot.slope_aspect})
⚠️ *Risk Level:* ${hotspot.spread_risk}

👤 *Assigned Officer:* ${guardName || hotspot.assigned_guard} (${guardPhone || "Field Unit"})
🧭 *GPS Navigation:* [Open in Google Maps](${mapsUrl})
--------------------------------------
*Time:* ${new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST`;

    let delivered = false;

    if (botToken && chatId) {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: alertMessage,
          parse_mode: "Markdown",
        }),
      });
      delivered = tgRes.ok;
    }

    return NextResponse.json({
      success: true,
      delivered,
      mode: botToken && chatId ? "LIVE_TELEGRAM_DISPATCH" : "SIMULATED_DISPATCH",
      recipient: guardName || hotspot.assigned_guard,
      phone: guardPhone,
      preview: alertMessage,
      mapsUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to dispatch alert" },
      { status: 500 }
    );
  }
}
