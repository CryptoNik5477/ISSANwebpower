import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/*/admin", "/*/dashboard", "/*/learn", "/*/exam", "/*/settings"],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
