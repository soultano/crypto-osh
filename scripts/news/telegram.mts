// Posts the morning news to the Telegram channel one at a time, spread
// over the day, each with a link to the article on the site.
//
// The daily run (news-new.json present) puts today's stories in a queue and
// posts the first one right away. The hourly "Telegram queue" workflow then
// posts the next one when at least TELEGRAM_GAP_HOURS (default 2.5) have
// passed since the last post. The queue lives in TELEGRAM_STATE (default
// .telegram/state.json), which the workflows keep in the Actions cache.
//
// Links carry utm_source=telegram&utm_medium=social&utm_campaign=<channel>,
// so GA4 shows channel visits under Traffic acquisition.
//
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_NEWS_CHAT_ID (e.g. @soulweb or -100…),
// TELEGRAM_NEWS_LANG (uz | ru | en, default uz), SITE_URL (default
// https://cryptoosh.uz), NEWS_SLUGS (comma-separated slugs, or "latest" for
// the newest article: posts those right away and leaves the queue alone, for
// a test run).
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

type State = { queue: string[]; lastAt: string | null };
const statePath = path.resolve(root, process.env.TELEGRAM_STATE || ".telegram/state.json");
const gapHours = Number(process.env.TELEGRAM_GAP_HOURS) > 0 ? Number(process.env.TELEGRAM_GAP_HOURS) : 2.5;

function readState(): State {
  try {
    const s = JSON.parse(fs.readFileSync(statePath, "utf8"));
    return { queue: Array.isArray(s.queue) ? s.queue : [], lastAt: typeof s.lastAt === "string" ? s.lastAt : null };
  } catch {
    return { queue: [], lastAt: null };
  }
}

function writeState(s: State) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, `${JSON.stringify(s, null, 2)}\n`);
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
  const text = [
    `<b>${esc(t.title)}</b>`,
    "",
    esc(t.summary),
    "",
    `${LABELS[lang].take} ${esc(t.take)}`,
    "",
    `👉 <a href="${esc(link)}">${LABELS[lang].more}</a>`,
    (a.tags as string[]).map((t) => `#${t.replace(/-/g, "_")}`).join(" "),
  ].join("\n");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", link_preview_options: { url: link, prefer_large_media: true } }),
  });
  const body = (await res.json()) as { ok: boolean; description?: string };
  if (!body.ok) throw new Error(`Telegram: ${body.description}`);
  console.log(`posted ${slug}`);
}

async function main() {
  if (!token || !chat) {
    console.log("TELEGRAM_BOT_TOKEN or TELEGRAM_NEWS_CHAT_ID not set: skipping Telegram.");
    return;
  }

  // Test run: post the given articles now, queue untouched.
  const test = pickSlugs();
  if (process.env.NEWS_SLUGS?.trim()) {
    for (const slug of test) {
      await post(slug, false);
      await new Promise((r) => setTimeout(r, 3000));
    }
    return;
  }

  const state = readState();
  const listPath = path.join(root, "news-new.json");
  const fresh: string[] = fs.existsSync(listPath) ? JSON.parse(fs.readFileSync(listPath, "utf8")) : [];
  if (fresh.length) {
    // New morning: today's stories replace whatever was left from yesterday.
    state.queue = fresh;
    state.lastAt = null;
  }
  state.queue = state.queue.filter((slug) => fs.existsSync(path.join(root, "content", "articles", `${slug}.json`)));
  if (!state.queue.length) {
    writeState(state);
    return console.log("Queue is empty.");
  }
  const since = state.lastAt ? (Date.now() - Date.parse(state.lastAt)) / 3_600_000 : Infinity;
  if (since < gapHours) {
    writeState(state);
    return console.log(`Last post ${since.toFixed(1)} h ago (gap ${gapHours} h); ${state.queue.length} waiting.`);
  }
  const slug = state.queue[0];
  await post(slug, fresh.length > 0);
  state.queue.shift();
  state.lastAt = new Date().toISOString();
  writeState(state);
  console.log(`${state.queue.length} left in the queue.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
