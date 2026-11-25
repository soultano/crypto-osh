// Tells Yandex and Bing (Bing also feeds ChatGPT search) about new news
// pages right after they are published, through IndexNow
// (https://www.indexnow.org). Without it they find new pages on their own,
// days later.
//
// Reads news-new.json (written by generate.mts), waits until Vercel has
// deployed the first new page, then sends every new page in all three
// languages plus the news lists in one request.
//
// The key below is public on purpose: IndexNow checks that
// <site>/<key>.txt on our own domain holds the same text, which proves the
// request comes from the site owner. Env: SITE_URL (default
// https://cryptoosh.uz), NEWS_SLUGS (comma-separated, for a manual run).

import fs from "node:fs";
import path from "node:path";

const key = "2dcd79c072e4e0e810f4e56ab40b04b2";
const site = (process.env.SITE_URL || "https://cryptoosh.uz").replace(/\/$/, "");
const locales = ["uz", "ru", "en"];
const root = process.cwd();

function slugs(): string[] {
  const manual = process.env.NEWS_SLUGS?.split(",").map((s) => s.trim()).filter(Boolean);
  if (manual?.length) return manual;
  const listPath = path.join(root, "news-new.json");
  return fs.existsSync(listPath) ? JSON.parse(fs.readFileSync(listPath, "utf8")) : [];
}

async function waitFor(url: string, minutes = 15): Promise<boolean> {
  const until = Date.now() + minutes * 60_000;
  while (Date.now() < until) {
    try {
      const r = await fetch(url, { redirect: "follow" });
      if (r.ok) return true;
    } catch {
      // not yet
    }
    await new Promise((r) => setTimeout(r, 30_000));
  }
  return false;
}

async function main() {
  const list = slugs();
  if (!list.length) return console.log("IndexNow: no new articles.");
  const first = `${site}/uz/news/${list[0]}`;
  if (!(await waitFor(first))) return console.log(`IndexNow: ${first} is not live yet, skipping.`);

  const urlList = [
    ...list.flatMap((s) => locales.map((l) => `${site}/${l}/news/${s}`)),
    ...locales.map((l) => `${site}/${l}/news`),
  ];
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
  });
  console.log(`IndexNow: ${res.status} for ${urlList.length} URLs`);
}

// Never fail the news job over this.
main().catch((e) => console.log("IndexNow error:", e));
