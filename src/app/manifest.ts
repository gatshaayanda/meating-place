import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "THE MEATING PLACE",
    short_name: "Meating Place",
    description: "THE MEATING PLACE — CAR WASH & BRAAI. Good food, good mood.",
    start_url: "/",
    display: "standalone",
    background_color: "#17110d",
    theme_color: "#17110d",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["food", "lifestyle", "business"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
