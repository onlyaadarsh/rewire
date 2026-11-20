import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://heyrewire.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/trpc/*",
          "/chat",
          "/chat/*",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
