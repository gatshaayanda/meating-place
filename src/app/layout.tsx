import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import PwaRegister from "@/app/pwa-register";
import "./globals.css";
import "./pwa.css";

export const metadata: Metadata = {
  title: "THE MEATING PLACE | Car Wash & Braai",
  description: "THE MEATING PLACE — CAR WASH & BRAAI. Let's Meat & Eat. Good food, good mood.",
  applicationName: "THE MEATING PLACE",
  appleWebApp: { capable: true, title: "Meating Place", statusBarStyle: "black-translucent" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
