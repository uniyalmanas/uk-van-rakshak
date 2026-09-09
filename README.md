# 🔥 UK Van-Rakshak | Hyper-Local Forest Fire Command Platform

> **A real-time, GIS-based forest fire detection, mountain spread prediction, and closed-loop dispatch command system built specifically for Uttarakhand Forest Department divisions.**

Built with **Next.js (App Router)**, **PostGIS / Supabase**, **NASA FIRMS (VIIRS 375m)**, **Leaflet GIS Cartography**, and **Telegram Bot Instant Alerting**.

---

## 🌟 Why This Beats Generic National Dashboards (FSI / Bhuvan)

1. **Hyper-Local Focus (Zero Clutter):** Pre-locked to specific Uttarakhand forest divisions (Nainital Forest Division, Almora Forest Division) with official division polygon boundaries.
2. **Mountain Terrain Intelligence:** Automatically calculates elevation, slope aspect, and combines real-time wind vectors to project where fires will climb upslope across ridges.
3. **Closed-Loop Dispatch Tracking:** Unlike FSI's one-way SMS broadcasts, this dashboard tracks the entire lifecycle:
   - 🔴 **Active Threat Detected**
   - 🟡 **Guard Dispatched** (Assigned to specific beat officer like Ramesh Chandra, Cheena Peak Beat)
   - 🔵 **Fireline Secured / Contained**
   - 🟢 **Extinguished**
4. **Actionable Mobile Cards:** Instant push notifications with direct one-tap **Google Maps GPS Navigation** straight to coordinates.
5. **Simulated Drill Mode:** Built-in disaster drill engine to test alerts, demonstrate response workflows, and conduct training even during the off-season.

---

## 🚀 Quickstart (Running Locally at ₹0 Cost)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The application runs immediately with curated high-resolution Uttarakhand GIS cartography and sample satellite telemetry.

---

## ⚙️ Connecting Free Live Services (Optional for Live Production)

Copy the template environment file:
```bash
cp .env.example .env.local
```

### A. Free NASA FIRMS Satellite Key (Takes 1 min)
1. Go to [firms.modaps.eosdis.nasa.gov/api/map_key/](https://firms.modaps.eosdis.nasa.gov/api/map_key/)
2. Enter your email to receive an instant free `MAP_KEY`.
3. Add it to `.env.local`:
   ```env
   NASA_FIRMS_MAP_KEY=your_key_here
   ```

### B. Free PostGIS Database (Supabase)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor**, open [`schema.sql`](./schema.sql), paste the entire script, and click **Run**.
   - Enables PostGIS spatial extensions.
   - Sets up divisions, beat officers, and spatial indexing tables.
   - Enables real-time WebSocket subscriptions.
3. Add your project URL & Anon Key to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### C. Free Live Telegram Alert Bot (Make the Official's Phone Buzz)
1. Open Telegram, search for `@BotFather`, and type `/newbot` to get a bot token.
2. Search for `@userinfobot` to get your Telegram `chat_id`.
3. Add them to `.env.local`:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdef...
   TELEGRAM_CHAT_ID=987654321
   ```
4. Now, whenever you click **"Dispatch Instant Mobile Alert"**, a rich notification with GPS navigation links will instantly ping your phone!

---

## 🌐 Free 1-Click Deployment to Vercel

1. Push this project to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: UK Van-Rakshak GIS Platform"
   git remote add origin https://github.com/your-username/uk-van-rakshak.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) (Free Account).
3. Click **"Import Project"**, select your repository, and click **Deploy**.
4. You now have a live URL (`https://uk-van-rakshak.vercel.app`) ready to demo to any official or recruiter from your mobile phone!

---

## 💼 The Demo Pitch: How to Present This to the Forestry Official

> *"Sir, I know FSI's VAN AGNI and Bhuvan exist at the national level. But those are heavy, state-wide dashboards meant for scientists in Delhi and Dehradun.*
>
> *What I built for you is a **Division Command Tool** tailored specifically for your division. It opens on a mobile phone in one second, maps out your exact beats, calculates how the fire will climb your ridges based on wind and slope, and lets you dispatch your beat guards with one tap. Most importantly, it gives you a closed-loop record showing when the fire was extinguished."*

---

## 📁 Project Architecture

```
├── schema.sql                 # PostGIS spatial database schema & functions
├── scripts/
│   └── fetch_firms.py         # Python NASA FIRMS API satellite ingestion script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── alert/route.ts # Telegram instant push alert webhook
│   │   │   └── firms/route.ts # NASA satellite feed proxy with caching
│   │   ├── globals.css        # Tailwind v4, custom fire marker pulse animations
│   │   ├── layout.tsx         # Responsive application shell & metadata
│   │   └── page.tsx           # Command Center layout & reactive state
│   ├── components/
│   │   ├── IncidentDrawer.tsx # Slide-out telemetry & guard dispatch console
│   │   ├── MapComponent.tsx   # Leaflet dark GIS map with spread vectors & beats
│   │   ├── MetricsBar.tsx     # Division summary counters & fuel hazard
│   │   ├── Navbar.tsx         # Division selector, satellite sync & drill trigger
│   │   └── SimulationModal.tsx# Drill simulator for live presentations
│   ├── data/
│   │   └── uttarakhand_forests.json # GeoJSON division boundaries & beat roster
│   └── lib/
│       └── supabase.ts        # Supabase client with graceful local fallback
```
