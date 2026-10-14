// Posts the news written today (news-new.json) to the Telegram channel,
// in Uzbek, each with a link to the article on the site. Waits until the
// new deploy actually serves the article, so the link preview works.
//
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_NEWS_CHAT_ID (e.g. @cryptoosh or -100…),
// SITE_URL (default https://cryptoosh.uz). Without the token or chat id the
// step does nothing.

import fs from "node:fs";
import path from "node:path";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chat = process.env.TELEGRAM_NEWS_CHAT_ID;
const site = (process.env.SITE_URL || "https://cryptoosh.uz").replace(/\/$/, "");
const root = process.cwd();

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function waitFor(url: string, minutes = 12): Promise<boolean> {
  const until = Date.now() + minutes * 60_000;
  while (Date.now() < until) {
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(15000) });
      if (res.status === 200) return true;
    } catch {
      // not yet
    }
    await new Promise((r) => setTimeout(r, 20_000));
  }
  return false;
}

async function main() {
  if (!token || !chat) {
    console.log("TELEGRAM_BOT_TOKEN or TELEGRAM_NEWS_CHAT_ID not set: skipping Telegram.");
    return;
  }
  const listPath = path.join(root, "news-new.json");
  const slugs: string[] = fs.existsSync(listPath) ? JSON.parse(fs.readFileSync(listPath, "utf8")) : [];
  if (!slugs.length) return console.log("No new articles.");

  for (const slug of slugs) {
    const a = JSON.parse(fs.readFileSync(path.join(root, "content", "articles", `${slug}.json`), "utf8"));
    const url = `${site}/uz/news/${slug}`;
    if (!(await waitFor(url))) {
      console.warn(`${url} is not live yet: skipping its post.`);
      continue;
    }
    const text = [
      `<b>${esc(a.uz.title)}</b>`,
      "",
      esc(a.uz.summary),
      "",
      `🇺🇿 ${esc(a.uz.take)}`,
      "",
      `👉 <a href="${url}">Batafsil saytda</a>`,
      (a.tags as string[]).map((t) => `#${t.replace(/-/g, "_")}`).join(" "),
    ].join("\n");
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", link_preview_options: { url, prefer_large_media: true } }),
    });
    const body = (await res.json()) as { ok: boolean; description?: string };
    if (!body.ok) throw new Error(`Telegram: ${body.description}`);
    console.log(`posted ${slug}`);
    await new Promise((r) => setTimeout(r, 3000));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
