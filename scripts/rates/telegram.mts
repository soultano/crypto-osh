// Posts this morning's USDT/UZS rates to the Telegram channel, in Uzbek,
// with the best buy and sell offers marked and partner links to each service.
// Only rates verified by today's run are posted; for the rest the post says
// to check the rate on the service's site.
//
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_NEWS_CHAT_ID (e.g. @cryptoosh or -100…),
// SITE_URL (default https://cryptoosh.uz). Without the token or chat id the
// step does nothing.

import fs from "node:fs";
import path from "node:path";

type Quote = { buy: number | null; sell: number | null; fee: number | null; at: string; source?: string };
type Provider = { id: string; name: string; url: string };

const token = process.env.TELEGRAM_BOT_TOKEN;
const chat = process.env.TELEGRAM_NEWS_CHAT_ID;
const site = (process.env.SITE_URL || "https://cryptoosh.uz").replace(/\/$/, "");
const root = process.cwd();

const read = <T,>(f: string): T => JSON.parse(fs.readFileSync(path.join(root, "content", f), "utf8"));

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function som(n: number | null | undefined): string {
  if (n == null) return "—";
  const whole = Math.round(n * 100) % 100 === 0;
  return n.toLocaleString("ru-RU", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 }).replace(/ | /g, " ");
}

export function buildPost(providers: Provider[], file: { updatedAt: string | null; quotes: Record<string, Quote> }): string | null {
  if (!file.updatedAt) return null;
  // Today's quotes only: from this run, or checked earlier the same Tashkent
  // day (rates entered by hand). A quote kept from an earlier day is not posted.
  const day = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(new Date(iso));
  const today = (q?: Quote) => (q && (q.at === file.updatedAt || (q.source === "manual" && day(q.at) === day(file.updatedAt!))) ? q : undefined);
  const rows = providers.map((p) => ({ p, q: today(file.quotes[p.id]) }));
  const pick = (key: "buy" | "sell", better: (a: number, b: number) => boolean) => {
    const live = rows.filter((r) => r.q?.[key] != null);
    return live.length < 2 ? null : live.reduce((a, r) => (better(r.q![key]!, a.q![key]!) ? r : a));
  };
  const bestBuy = pick("buy", (a, b) => a < b);
  const bestSell = pick("sell", (a, b) => a > b);
  if (!rows.some((r) => r.q?.buy != null || r.q?.sell != null)) return null;

  const date = new Intl.DateTimeFormat("uz-Latn", { day: "numeric", month: "long", timeZone: "Asia/Tashkent" }).format(new Date(file.updatedAt));
  const lines = [
    `💵 <b>USDT / UZS — ${esc(date)}</b>`,
    "Sotib olish / sotish, so'm",
    "",
    ...rows.map(({ p, q }) => {
      const mark = (key: "buy" | "sell", best: typeof bestBuy) => (best?.p.id === p.id ? `<b>${som(q?.[key])}</b> 🏆` : som(q?.[key]));
      const fee = q?.fee != null ? ` · $ naqd ${String(q.fee).replace(".", ",")}%` : "";
      const link = `<a href="${esc(p.url)}">${esc(p.name)}</a>`;
      if (q?.buy == null && q?.sell == null) return `${link}: kursni saytda tekshiring${fee}`;
      return `${link}: ${mark("buy", bestBuy)} / ${mark("sell", bestSell)}${fee}`;
    }),
    "",
  ];
  if (bestBuy) lines.push(`🏆 Sotib olishda eng yaxshi kurs: <b>${som(bestBuy.q!.buy)} so'm</b> — ${esc(bestBuy.p.name)}`);
  if (bestSell) lines.push(`🏆 Sotishda eng yaxshi kurs: <b>${som(bestSell.q!.sell)} so'm</b> — ${esc(bestSell.p.name)}`);
  lines.push(
    "",
    "Kurslar xizmatlarning rasmiy saytlari va ilovalaridan olindi; ma'lumot uchun, investitsiya tavsiyasi emas.",
    `👉 <a href="${site}/uz">Jadval saytda</a>`,
  );
  return lines.join("\n");
}

async function main() {
  const text = buildPost(read<Provider[]>("usdt-providers.json"), read("usdt-rates.json"));
  if (!text) return console.log("No rates verified today: nothing to post.");
  if (!token || !chat) {
    console.log("TELEGRAM_BOT_TOKEN or TELEGRAM_NEWS_CHAT_ID not set: skipping Telegram.\n\n" + text);
    return;
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", link_preview_options: { is_disabled: true } }),
  });
  const body = (await res.json()) as { ok: boolean; description?: string };
  if (!body.ok) throw new Error(`Telegram: ${body.description}`);
  console.log("posted rates");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
