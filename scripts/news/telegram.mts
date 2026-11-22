// Posts the morning news to the Telegram channel one at a time, spread
// over the day, each with a link to the article on the site.
//
// The daily run passes today's stories in news-new.json: the first goes out
// right away, then the script sleeps TELEGRAM_GAP_HOURS (default 2.5)
// before each next one. The workflow job stays alive meanwhile; GitHub's
// hourly schedules skip too many runs to rely on them.
//
// Links carry utm_source=telegram&utm_medium=social&utm_campaign=<channel>,
// so GA4 shows channel visits under Traffic acquisition.
//
// The link preview is the small one (thumbnail at the side, below the
// text), and the summary and take are cut to about 80% of their length.
//
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_NEWS_CHAT_ID (e.g. @soulweb or -100…),
// TELEGRAM_NEWS_LANG (uz | ru | en, default uz), SITE_URL (default
// https://cryptoosh.uz), NEWS_SLUGS (comma-separated slugs, or "latest" for
// the newest article: posts those right away, for a test run),
// TELEGRAM_TEXT_SHARE (0–1, how much of the text to keep, default 0.8).
// Without the token or chat id the step does nothing.

import fs from "node:fs";
import path from "node:path";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chat = process.env.TELEGRAM_NEWS_CHAT_ID;
const site = (process.env.SITE_URL || "https://cryptoosh.uz").replace(/\/$/, "");
const root = process.cwd();
const lang = (["uz", "ru", "en"] as const).find((l) => l === process.env.TELEGRAM_NEWS_LANG?.trim()) ?? "uz";
const campaign = (chat || "channel").replace(/^@/, "").replace(/[^\w-]/g, "") || "channel";

const LABELS = {
  uz: { take: "🇺🇿", more: "Batafsil saytda" },
  ru: { take: "🇺🇿", more: "Подробнее на сайте" },
  en: { take: "🇺🇿", more: "Read more on the site" },
};

function utm(url: string, slug: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "telegram");
  u.searchParams.set("utm_medium", "social");
  u.searchParams.set("utm_campaign", campaign);
  u.searchParams.set("utm_content", slug);
  return u.toString();
}

function pickSlugs(): string[] {
  const dir = path.join(root, "content", "articles");
  const wanted = process.env.NEWS_SLUGS?.trim();
  if (wanted === "latest") {
    const all = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    const dated = all.map((f) => ({ slug: f.slice(0, -5), date: JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")).date as string }));
    dated.sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || b.slug.localeCompare(a.slug));
    return dated.slice(0, 1).map((d) => d.slug);
  }
  return (wanted ?? "").split(",").map((x) => x.trim()).filter((x) => /^[\w-]+$/.test(x));
}

const gapEnv = Number(process.env.TELEGRAM_GAP_HOURS);
const gapHours = process.env.TELEGRAM_GAP_HOURS && gapEnv >= 0 ? gapEnv : 2.5;

// Splits text into sentences at end punctuation followed by a space, so
// numbers like 2.5 or $1.2 stay whole.
function sentences(s: string): string[] {
  return s.trim().split(/(?<=[.!?…]["»”)]*)\s+/);
}

// Shortens the post body to about SHARE of its full length (default 0.8),
// cutting whole sentences from the end of the take first, then from the
// summary, so the result lands as near the target as sentence breaks allow.
// The first sentence of each always stays; the full text is on the site
// behind the link.
const shareEnv = Number(process.env.TELEGRAM_TEXT_SHARE);
const share = shareEnv > 0 && shareEnv <= 1 ? shareEnv : 0.8;

function shorten(summary: string, take: string): { summary: string; take: string } {
  const s = sentences(summary);
  const t = sentences(take);
  const len = () => s.join(" ").length + t.join(" ").length;
  const budget = Math.round((summary.length + take.length) * share);
  // Drop a sentence only while that lands closer to the budget than keeping it.
  for (const part of [t, s]) {
    while (len() > budget && part.length > 1) {
      const last = part[part.length - 1];
      if (len() - last.length - 1 < budget && budget - (len() - last.length - 1) > len() - budget) break;
      part.pop();
    }
  }
  return { summary: s.join(" "), take: t.join(" ") };
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Waits until the site serves the article (following redirects, e.g. to
// www). Returns the last status seen so the log shows why it gave up.
async function waitFor(url: string, minutes = 10): Promise<string> {
  const until = Date.now() + minutes * 60_000;
  let last = "no answer";
  while (Date.now() < until) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": "Mozilla/5.0 (compatible; CryptoOshNews/1.0; +https://cryptoosh.uz)" },
        signal: AbortSignal.timeout(15000),
      });
      await res.body?.cancel();
      if (res.ok) return "ok";
      last = `HTTP ${res.status} at ${res.url}`;
    } catch (e) {
      last = String((e as Error).message || e);
    }
    console.log(`waiting for ${url}: ${last}`);
    await new Promise((r) => setTimeout(r, 20_000));
  }
  return last;
}

async function post(slug: string, wait: boolean) {
  const a = JSON.parse(fs.readFileSync(path.join(root, "content", "articles", `${slug}.json`), "utf8"));
  const url = `${site}/${lang}/news/${slug}`;
  const state = wait ? await waitFor(url) : "ok";
  if (state !== "ok") console.warn(`${url} did not answer 200 (${state}); posting anyway.`);
  const t = a[lang] ?? a.uz;
  const link = utm(url, slug);
  const body = shorten(t.summary, t.take);
  const text = [
    `<b>${esc(t.title)}</b>`,
    "",
    esc(body.summary),
    "",
    `${LABELS[lang].take} ${esc(body.take)}`,
    "",
    `👉 <a href="${esc(link)}">${LABELS[lang].more}</a>`,
    (a.tags as string[]).map((t) => `#${t.replace(/-/g, "_")}`).join(" "),
  ].join("\n");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", link_preview_options: { url: link, prefer_small_media: true, show_above_text: false } }),
  });
  const reply = (await res.json()) as { ok: boolean; description?: string };
  if (!reply.ok) throw new Error(`Telegram: ${reply.description}`);
  console.log(`posted ${slug}`);
}

async function main() {
  if (!token || !chat) {
    console.log("TELEGRAM_BOT_TOKEN or TELEGRAM_NEWS_CHAT_ID not set: skipping Telegram.");
    return;
  }

  // Test run: post the given articles now, a few seconds apart.
  if (process.env.NEWS_SLUGS?.trim()) {
    for (const slug of pickSlugs()) {
      await post(slug, false);
      await new Promise((r) => setTimeout(r, 3000));
    }
    return;
  }

  const listPath = path.join(root, "news-new.json");
  const slugs: string[] = fs.existsSync(listPath) ? JSON.parse(fs.readFileSync(listPath, "utf8")) : [];
  if (!slugs.length) return console.log("No new articles.");
  for (const [i, slug] of slugs.entries()) {
    if (i > 0) {
      console.log(`next post in ${gapHours} h`);
      await new Promise((r) => setTimeout(r, gapHours * 3_600_000));
    }
    await post(slug, i === 0);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
