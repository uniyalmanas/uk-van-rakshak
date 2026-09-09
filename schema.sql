-- ==============================================================================
-- UTTARAKHAND FOREST FIRE COMMAND PLATFORM (POSTGIS SCHEMA)
-- Run this script in the Supabase SQL Editor (100% Free Tier Compatible)
-- ==============================================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Forest Divisions Boundary Table
CREATE TABLE IF NOT EXISTS forest_divisions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    circle TEXT NOT NULL,
    headquarters TEXT,
    dfo_name TEXT,
    control_room_contact TEXT,
    total_area_sqkm NUMERIC,
    fire_vulnerability TEXT,
    geom GEOMETRY(Polygon, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_divisions_geom ON forest_divisions USING GIST (geom);

-- 3. Beat Officers Directory Table
CREATE TABLE IF NOT EXISTS beat_officers (
    id TEXT PRIMARY KEY,
    division_id TEXT REFERENCES forest_divisions(id),
    range_name TEXT NOT NULL,
    beat_name TEXT NOT NULL,
    officer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    status TEXT DEFAULT 'Available', -- 'On Patrol', 'Dispatched', 'Available'
    last_location GEOMETRY(Point, 4326),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Fire Hotspots & Incidents Table
CREATE TABLE IF NOT EXISTS fire_hotspots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_id TEXT REFERENCES forest_divisions(id),
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    geom GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
    brightness_kelvin NUMERIC(6, 2),
    confidence TEXT DEFAULT 'nominal', -- 'low', 'nominal', 'high'
    confidence_percent INT DEFAULT 75,
    frp_mw NUMERIC(6, 2), -- Fire Radiative Power (Megawatts)
    satellite TEXT DEFAULT 'VIIRS-375m',
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Mountain GIS Intelligence
    range_name TEXT,
    nearest_beat TEXT,
    elevation_meters INT,
    slope_aspect TEXT,
    fuel_type TEXT,
    wind_speed_kmh NUMERIC(5, 2),
    wind_direction TEXT,
    spread_risk TEXT,
    
    -- Dispatch & Operational Status
    status TEXT DEFAULT 'active', -- 'active', 'dispatched', 'contained', 'resolved'
    assigned_guard TEXT,
    resolved_at TIMESTAMPTZ,
    proof_photo_url TEXT,
    is_simulation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Spatial Index for Rapid Querying
CREATE INDEX IF NOT EXISTS idx_fire_hotspots_geom ON fire_hotspots USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_fire_hotspots_division ON fire_hotspots(division_id);
CREATE INDEX IF NOT EXISTS idx_fire_hotspots_status ON fire_hotspots(status);

-- 6. Helper Function: Check if a Point lies inside Uttarakhand Division
CREATE OR REPLACE FUNCTION get_enclosing_division(lon NUMERIC, lat NUMERIC)
RETURNS TABLE (division_id TEXT, division_name TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT fd.id, fd.name
    FROM forest_divisions fd
    WHERE ST_Contains(fd.geom, ST_SetSRID(ST_MakePoint(lon, lat), 4326))
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 7. Enable Realtime Notifications for Hotspots
ALTER PUBLICATION supabase_realtime ADD TABLE fire_hotspots;

-- 8. Row Level Security (RLS) - Permissive for prototype demo
ALTER TABLE forest_divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE beat_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire_hotspots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access on Divisions" ON forest_divisions FOR SELECT USING (true);
CREATE POLICY "Public Read Access on Beat Officers" ON beat_officers FOR SELECT USING (true);
CREATE POLICY "Public Full Access on Hotspots" ON fire_hotspots FOR ALL USING (true) WITH CHECK (true);
