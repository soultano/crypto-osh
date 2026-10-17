import type { MetadataRoute } from "next";
import { defaultLocale, htmlLang, locales } from "@/lib/i18n";
import { allNews } from "@/lib/news";
import { people } from "@/lib/people";
import { site } from "@/lib/site";

const pages = ["", "/news", "/kurs", "/about", "/business", "/videos", "/people", ...people.map((p) => `/people/${p.slug}`)];
const daily = new Set(["", "/news", "/kurs"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const news = allNews().map((n) => ({ path: `/news/${n.slug}`, date: n.date }));
  const entries: { path: string; date?: string }[] = [...pages.map((path) => ({ path })), ...news];
  return entries.flatMap(({ path: p, date }) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${p}`,
      ...(date ? { lastModified: date } : {}),
      changeFrequency: daily.has(p) ? ("daily" as const) : date ? ("yearly" as const) : ("monthly" as const),
      priority: p === "" ? 1 : p === "/business" || p === "/news" || p === "/kurs" ? 0.9 : 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((x) => [htmlLang[x], `${site.url}/${x}${p}`])),
          "x-default": `${site.url}/${defaultLocale}${p}`,
        },
      },
    })),
  );
}
