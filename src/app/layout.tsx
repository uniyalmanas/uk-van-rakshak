import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aapda-Sutra (आपदा-सूत्र) | Uttarakhand Multi-Hazard Command & Char Dham Clearance",
  description: "Himalayan disaster management platform connecting pilgrims, citizens, and SDRF/PWD officers with Google Gemini AI vision triage and Google Maps live road clearance.",
  applicationName: "Aapda-Sutra",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏔️</text></svg>",
    apple: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏔️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070a12] text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
