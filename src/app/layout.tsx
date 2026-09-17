import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PwaRegister from "@/app/pwa-register";
import "./globals.css";
import "./pwa.css";

const siteUrl = "https://meating-place.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "THE MEATING PLACE | Car Wash & Braai",
    template: "%s | THE MEATING PLACE",
  },
  description: "THE MEATING PLACE — CAR WASH & BRAAI. Good food, good mood. Let's Meat & Eat.",
  applicationName: "THE MEATING PLACE",
  generator: "Next.js",
  keywords: ["The Meating Place", "car wash", "braai", "food", "restaurant", "car wash and braai"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "THE MEATING PLACE",
    title: "THE MEATING PLACE | Car Wash & Braai",
    description: "Good food, good mood. Let's Meat & Eat.",
  },
  twitter: {
    card: "summary",
    title: "THE MEATING PLACE | Car Wash & Braai",
    description: "Good food, good mood. Let's Meat & Eat.",
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Meating Place",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#17110d",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
