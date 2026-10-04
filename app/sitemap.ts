import type { MetadataRoute } from "next";
import { htmlLang, locales } from "@/lib/i18n";
import { site } from "@/lib/site";

const pages = ["", "/about", "/business", "/videos"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((p) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((x) => [htmlLang[x], `${site.url}/${x}${p}`])) },
    })),
  );
}
