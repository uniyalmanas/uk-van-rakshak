# 🏔️ Aapda-Sutra (आपदा-सूत्र) | Uttarakhand Multi-Hazard Command & Char Dham Road Clearance Platform

> **A unified, real-time Himalayan disaster management and road clearance command system powered by Google Gemini AI and Google Maps Platform. Connecting stranded pilgrims, citizens, and SDRF/PWD officers on a single synchronized platform.**

[![Live Production](https://img.shields.io/badge/Live%20Portal-uk--van--rakshak.vercel.app-emerald?style=flat-square&logo=vercel)](https://uk-van-rakshak.vercel.app)
[![Google Gemini AI](https://img.shields.io/badge/AI%20Vision-Google%20Gemini%202.5%20Flash-blue?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Google Maps](https://img.shields.io/badge/Routing-Google%20Maps%20Platform-green?style=flat-square&logo=googlemaps)](https://cloud.google.com/maps-platform)
[![Satellite Telemetry](https://img.shields.io/badge/Telemetry-NASA%20VIIRS%20375m%20NRT-orange?style=flat-square&logo=nasa)](https://firms.modaps.eosdis.nasa.gov/)
[![Android PWA](https://img.shields.io/badge/Mobile-Android%20Installable%20PWA-purple?style=flat-square&logo=android)](https://uk-van-rakshak.vercel.app)

**Live Production Portal:** [https://uk-van-rakshak.vercel.app](https://uk-van-rakshak.vercel.app)

---

## 🌟 What is Aapda-Sutra?

In the rugged Himalayas of Uttarakhand, disasters are multifaceted: **monsoon cloudbursts, sudden rockfalls, sinking roads, flash floods, winter avalanches, and summer wildfires**. When a major highway like **NH-58 (Badrinath)** or **NH-107 (Kedarnath)** is blocked, thousands of pilgrims and local villagers get stranded without real-time updates.

Existing departmental silos (PWD, SDRF, Police, Forest Dept, District Administration) operate on isolated radios or delayed PDFs. 

**Aapda-Sutra bridges this gap by bringing citizens, pilgrims, and government response teams onto a single transparent dashboard:**

1. 📸 **Google Gemini AI Multimodal Vision Hazard Triage:**
   - Citizens and pilgrims take photos of road blockages, rockfalls, or floods.
   - Google Gemini 2.5 Flash automatically assesses hazard severity (1-5), estimates cubic meters of debris, calculates clearance time, identifies required heavy machinery (JCB excavators, pneumatic rock breakers), and generates bilingual advisories.

2. 🛣️ **Char Dham Corridor Real-Time Clearance Status:**
   - Live status tracking of all four pilgrimage arteries:
     - **NH-58**: Rishikesh - Badrinath (298 km)
     - **NH-107**: Rudraprayag - Kedarnath (76 km)
     - **NH-34**: Dharasu - Gangotri (124 km)
     - **NH-134**: Dharasu - Yamunotri (85 km)
   - Color-coded clearance indicators (Clear 🟢, Caution 🟡, Blocked 🔴).

3. 🚜 **Closed-Loop Clearance Tracking ("Uber for JCBs"):**
   - Tracks clearance progress (0% ➔ 100%) in real time.
   - Deployed machinery cards display operator contacts (e.g. Gurpreet Singh on Wheel Loader, BRO Camp Joshimath).

4. 🆘 **Emergency SOS Distress Beacon with Offline 2G SMS Fallback:**
   - In deep valleys where 4G/5G drops to 0 or 1 bar of 2G, the emergency SOS beacon generates a compressed cellular SMS packet routed to **112 / 1070 State Emergency Control Rooms** containing exact GPS coordinates, headcount, and medical needs.

5. 📑 **Gemini AI Situation Report (SitRep) Generator:**
   - One-click synthesis of active incidents, blocked highways, and relief operations formatted for District Magistrates and WhatsApp broadcast.

6. 🛡️ **Dual-Persona Architecture:**
   - **Citizen & Pilgrim View**: Safe routes, nearest GMVN/shelter safe havens, photo report hazard, SOS beacon.
   - **Officer Command Console**: SDRF/PWD machinery dispatch, clearance verification, SitRep export.

7. 📱 **Android Installable App (PWA):**
   - Progressive Web App with standalone viewport, home screen icon, and offline asset caching.

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
