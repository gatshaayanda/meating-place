import type { MetadataRoute } from "next";

const baseUrl = "https://meating-place.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/book`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/offline`, changeFrequency: "yearly", priority: 0.1 },
  ];
}
