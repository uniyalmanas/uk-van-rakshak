import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UK Van-Rakshak | Hyper-Local Forest Fire Command Dashboard",
  description: "Next-gen GIS Forest Fire Detection, Spread Vector Prediction & Dispatch Platform for Uttarakhand Forest Divisions.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>",
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
