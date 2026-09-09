"""
NASA FIRMS Satellite Hotspot Ingestion Script for Uttarakhand
Pulls Near-Real-Time (NRT) VIIRS 375m fire detections for Uttarakhand bounding box.
"""

import os
import sys
import urllib.request
import csv

# Uttarakhand Bounding Box: [West: 77.5, South: 28.7, East: 81.0, North: 31.5]
UTTARAKHAND_BBOX = "77.5,28.7,81.0,31.5"

def fetch_satellite_hotspots(map_key: str, days: int = 1):
    if not map_key or map_key == "YOUR_NASA_MAP_KEY":
        print("[!] Error: Please provide a valid NASA FIRMS MAP_KEY.")
        print("[i] Get your free key instantly at: https://firms.modaps.eosdis.nasa.gov/api/map_key/")
        return []

    # Using VIIRS S-NPP 375m NRT product
    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{map_key}/VIIRS_SNPP_NRT/{UTTARAKHAND_BBOX}/{days}"
    print(f"[*] Querying NASA FIRMS Satellite API for Uttarakhand...")
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'UK-Forest-Watch/1.0'})
        with urllib.request.urlopen(req) as response:
            csv_data = response.read().decode('utf-8')
            
        reader = csv.DictReader(csv_data.splitlines())
        hotspots = list(reader)
        print(f"[+] Successfully retrieved {len(hotspots)} active satellite detections in Uttarakhand bounding box.")
        return hotspots
    except Exception as e:
        print(f"[-] Failed to fetch data: {e}")
        return []

if __name__ == "__main__":
    key = os.environ.get("NASA_FIRMS_MAP_KEY", "ec1d195941eba4f152042bb19e8d9090")
    if len(sys.argv) > 1:
        key = sys.argv[1]
        
    spots = fetch_satellite_hotspots(key)
    for i, s in enumerate(spots[:5]):
        print(f"  [{i+1}] Lat: {s.get('latitude')}, Lon: {s.get('longitude')}, Brightness: {s.get('bright_ti4')}K, Acq Date: {s.get('acq_date')} {s.get('acq_time')} UTC")
