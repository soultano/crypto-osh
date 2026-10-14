import fs from "node:fs";
import path from "node:path";
import type { Locale } from "./i18n";

// One news story, written by scripts/news/generate.mts into
// content/articles/<slug>.json. Every language has the same shape.
export type NewsText = {
  title: string;
  summary: string;
  body: string[];
  take: string; // what the story means for Uzbekistan
};

export type NewsItem = {
  slug: string;
  date: string; // ISO with +05:00 offset
  tags: string[];
  sources: { name: string; url: string }[];
} & Record<Locale, NewsText>;

const dir = path.join(process.cwd(), "content", "articles");
const slugRe = /^[a-z0-9-]{3,120}$/;

function isHttps(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

let cache: NewsItem[] | undefined;

// Newest first. Read once per build; a malformed file is skipped rather
// than breaking the whole site.
export function allNews(): NewsItem[] {
  if (cache) return cache;
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")) : [];
  const items: NewsItem[] = [];
  for (const f of files) {
    try {
      const item = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as NewsItem;
      if (!slugRe.test(item.slug) || Number.isNaN(Date.parse(item.date))) continue;
      if (!item.uz?.title || !item.ru?.title || !item.en?.title) continue;
      item.sources = (item.sources || []).filter((s) => s?.name && isHttps(s.url));
      items.push(item);
    } catch {
      // skip
    }
  }
  cache = items.sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.slug.localeCompare(b.slug));
  return cache;
}

export function getNews(slug: string): NewsItem | undefined {
  return allNews().find((n) => n.slug === slug);
}

export function newsDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "uz" ? "uz-Latn" : locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Tashkent",
  }).format(new Date(iso));
}
