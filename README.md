# 🔥 UK Van-Rakshak | Hyper-Local Forest Fire Command Platform

> **A real-time, GIS-based forest fire detection, mountain spread prediction, and closed-loop dispatch command system built specifically for Uttarakhand Forest Department divisions.**

[![Live Production](https://img.shields.io/badge/Live%20Portal-uk--van--rakshak.vercel.app-emerald?style=flat-square&logo=vercel)](https://uk-van-rakshak.vercel.app)
[![Satellite Detection](https://img.shields.io/badge/Detection-NASA%20VIIRS%20375m%20NRT-orange?style=flat-square&logo=nasa)](https://firms.modaps.eosdis.nasa.gov/)
[![Topography](https://img.shields.io/badge/Terrain-ISRO%20CartoDEM%2030m-blue?style=flat-square)](https://bhuvan.nrsc.gov.in/)
[![SOI Compliant](https://img.shields.io/badge/GIS-Survey%20of%20India%20Compliant-green?style=flat-square)](https://surveyofindia.gov.in/)
[![Zero Cost Stack](https://img.shields.io/badge/Budget-%E2%82%B90%20Zero%20Cost%20Stack-success?style=flat-square)](https://github.com/uniyalmanas/uk-van-rakshak)

**Live Production Site:** [https://uk-van-rakshak.vercel.app](https://uk-van-rakshak.vercel.app)

---

## 🌟 Why This Beats Generic National Portals (FSI Van Agni / Bhuvan)

National and state-level portals often send delayed, raw coordinates that overwhelm field staff. **UK Van-Rakshak** is built from the ground up as a division-level command tool:

1. **Hyper-Local Focus (Zero Clutter):** Clamped strictly to Uttarakhand boundaries (`28.4°N, 77.2°E` to `31.8°N, 81.3°E`). Pre-configured for:
   - 🌐 **Entire Uttarakhand (Statewide Command)**
   - 🌲 **Nainital Forest Division (Kumaon)**
   - 🌲 **Almora Forest Division (Kumaon)**
   - 🌲 **Dehradun Forest Division (Garhwal)**
   - 🌲 **Pauri Garhwal Forest Division**
   - 🐅 **Corbett Tiger Reserve Buffer Division**
2. **Hybrid Satellite Architecture (NASA VIIRS + ISRO CartoDEM):**
   - **Detection**: Real-time thermal anomaly ingestion from NASA VIIRS S-NPP (375m resolution).
   - **Terrain Intelligence**: Mountain slope gradients and aspects calculated using ISRO's 30-meter CartoDEM.
   - **Administrative GIS**: Official boundary shapefiles aligned with Survey of India (SOI) and ISRO Bhuvan standards.
3. **Live Mountain Weather & Fire Weather Index (FWI):**
   - Live elevation-adjusted meteorological feed (temperature, humidity, wind velocity & compass direction) via Open-Meteo.
   - Automated flammability & Chir pine needle (*Pirul* / पिरुल) desiccation risk index.
4. **Closed-Loop Dispatch Tracking:**
   - Unlike one-way SMS alerts, tracks operational lifecycle from start to finish:
     - 🔴 **Active Threat** ➔ 🟡 **Guard Dispatched** ➔ 🔵 **Perimeter Contained** ➔ 🟢 **Extinguished**
5. **One-Tap GPS Field Navigation:**
   - Generates instant Google Maps turn-by-turn walking and driving routes straight to the ridge coordinates for beat officers on mobile.
6. **Bilingual & Responsive Command UI:**
   - Instant English ⇄ Hindi (हिन्दी) toggle.
   - High-contrast Dark / Light themes, Fullscreen map mode, and Esri Canopy / Vector GIS basemaps.
7. **Simulate Drill Mode (मॉक ड्रिल):**
   - Built-in disaster drill engine to test alerts, demonstrate response workflows, and conduct training even during the off-season.
8. **Automated SitRep (Situation Report) Export:**
   - One-click CSV export formatted for DFO morning briefing and official departmental logs.

---

## 🛰️ Satellite Architecture Explained

| Component | Provider / Satellite | Role in Platform |
| :--- | :---: | :--- |
| **Micro-Hotspot Detection** | 🇺🇸 **NASA VIIRS (375m NRT)** | Near-Real-Time thermal scans. Capable of detecting early-stage fires at 375m spatial resolution. |
| **Mountain Slope & Aspect** | 🇮🇳 **ISRO CartoDEM (30m)** | 30-meter stereoscopic elevation model used to project upslope flame-front climb vectors. |
| **Administrative GIS** | 🇮🇳 **ISRO Bhuvan / SOI** | Division and circle polygon boundaries compliant with Survey of India legal mapping norms. |
| **Mountain Weather & Wind** | 🌐 **Open-Meteo Mountain API** | Real-time elevation-adjusted temperature, relative humidity, and wind vector modeling. |

---

## 📅 The Uttarakhand Wildfire Cycle & Drill Mode

* **Peak Wildfire Season (High Risk)**: **Mid-February to mid-June** (Dry heat, temperatures >38°C, relative humidity <20%, heavy Chir pine needle carpet).
* **Off-Season / Monsoonal Extinguishment (Zero Risk)**: **July to October** (Monsoon rains soak the Himalayas; satellite passes naturally report 0 active wildfires).
* **Using "Simulate Drill" in Off-Season**:
  Click the **`Simulate Drill / मॉक ड्रिल`** button to spawn realistic training incidents across any division, test Telegram alerts, assign guards, and verify Google Maps routing without waiting for real summer fires.

---

## 🚀 Quickstart (Running Locally at ₹0 Cost)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/uniyalmanas/uk-van-rakshak.git
cd uk-van-rakshak
npm install
```

### 2. Configure Environment (Optional)
The application includes built-in fallbacks and works out of the box. To customize your own NASA or Telegram keys, copy the template:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# NASA FIRMS API Key (Free instant key from https://firms.modaps.eosdis.nasa.gov/api/map_key/)
NASA_FIRMS_MAP_KEY=ec1d195941eba4f152042bb19e8d9090

# Optional: Instant Telegram Bot Dispatch Alerts
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Setting Up Instant Telegram Phone Alerts (Free)

1. Open Telegram, search for `@BotFather`, and type `/newbot` to generate a bot token.
2. Search for `@userinfobot` to get your numerical `chat_id`.
3. Add them to `.env.local` (or your Vercel Project Environment Variables):
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdef...
   TELEGRAM_CHAT_ID=987654321
   ```
4. Clicking **"Dispatch Guard / दल रवाना करें"** on any active hotspot will immediately ping your phone with the division name, range, beat, fire intensity, and a **clickable Google Maps turn-by-turn GPS link**!

---

## 🗄️ Optional: PostgreSQL / PostGIS Spatial Database (Supabase)

For persistent cloud storage and spatial indexing:
1. Create a free database at [supabase.com](https://supabase.com).
2. Open the SQL Editor, paste the contents of [`schema.sql`](./schema.sql), and click **Run**.
   - Enables PostGIS spatial extensions (`ST_Contains`, spatial GiST indexes).
   - Creates divisions, beat rosters, and incident audit log tables.
3. Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

---

## 📁 Project Structure

```
├── schema.sql                   # PostGIS spatial database schema & functions
├── scripts/
│   └── fetch_firms.py           # Python script for direct NASA VIIRS CLI queries
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── alert/route.ts   # Telegram & SMS instant dispatch webhook
│   │   │   ├── firms/route.ts   # Live NASA VIIRS 375m proxy with spatial division matching
│   │   │   ├── isro/route.ts    # ISRO Bhuvan & MOSDAC metadata architecture
│   │   │   └── weather/route.ts # Open-Meteo elevation-adjusted weather & FWI
│   │   ├── globals.css          # Tailwind CSS styling & custom marker animations
│   │   ├── layout.tsx           # Application shell, fonts, and SEO metadata
│   │   └── page.tsx             # Command Center dashboard & reactive state
│   ├── components/
│   │   ├── HelpModal.tsx        # Bilingual User Manual, SOP & Contact Directory
│   │   ├── IncidentDrawer.tsx   # Telemetry review, guard assignment & GPS dispatch
│   │   ├── IncidentList.tsx     # Incident filtering (Active/Dispatched/Contained)
│   │   ├── MapComponent.tsx     # Leaflet GIS map with Canopy/Vector basemaps & Fullscreen
│   │   ├── MetricsBar.tsx       # Executive metrics & satellite constellation status
│   │   ├── Navbar.tsx           # Division selector, sync trigger, theme & language toggle
│   │   ├── SimulationModal.tsx  # Disaster drill simulator for training & demos
│   │   └── WeatherWidget.tsx    # Live mountain weather & Pirul fuel desiccation index
│   └── data/
│       └── uttarakhand_forests.json # Division GeoJSON polygons, ranges & roster data
```

---

## 💼 The Demo Pitch: Presenting to Forestry Officials

> *"Sir, national systems like FSI Van Agni and Bhuvan provide valuable broad-scale intelligence for state headquarters, but field officers in the division need an operational tool.*
>
> *What we built is a **Division-Level Command Tool** tailored specifically for your division:*
> 1. *It loads instantly on any mobile phone in the field.*
> 2. *It maps fires directly to your specific forest beats and ranges.*
> 3. *It factors in live mountain wind and CartoDEM slope to predict ridge spread.*
> 4. *It provides one-tap Google Maps walking directions so guards reach the exact fire point without guessing.*
> 5. *Most importantly, it provides a **closed-loop record** tracking the fire from active detection to verified extinguishment.*
>
> *Best of all, it runs on an open, reliable ₹0-budget stack with zero required software licensing costs."*

---

## 📜 License & Acknowledgments

- **Satellite Data**: Courtesy of **NASA FIRMS (EOSDIS)** VIIRS 375m Active Fire Product.
- **Elevation & Boundaries**: Derived from **ISRO CartoDEM** and **Survey of India** administrative datasets.
- **Weather Data**: Powered by **Open-Meteo** free mountain weather API.
- **License**: MIT Open Source License. Built for community forest protection in the Himalayas.
