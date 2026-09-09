import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aapda-Sutra: Uttarakhand Multi-Hazard Command",
    short_name: "Aapda-Sutra",
    description: "Himalayan Multi-Hazard & Char Dham Road Clearance System powered by Google Gemini AI & Google Maps Platform",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#090e17",
    theme_color: "#059669",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
