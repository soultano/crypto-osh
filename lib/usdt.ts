// USDT/UZS rates at licensed exchangers in Uzbekistan. The numbers live in
// content/usdt-rates.json, written twice a day by scripts/rates/update.mts
// from each exchanger's own public API or page. A rate that could not be
// verified today is never guessed: the table links to the exchanger's site
// to check it there.

import providerList from "@/content/usdt-providers.json";
import data from "@/content/usdt-rates.json";

export type ProviderId = "binance" | "voluto" | "asterium" | "tcrypto" | "walt" | "unexpay";

// Shared with the morning script and the Telegram post. Badges are a letter
// on the exchanger's colour, not its logo.
// An office in Tashkent where the exchange is done in person, with cash.
export type Office = { ru: string; uz: string; en: string; map: string; hours: { ru: string; uz: string; en: string } };

// fee: a published cash-dollar fee (%) to show when the morning run could not read it.
// partner: a paid placement, shown first in the table in a frame and marked as a partner.
export type Provider = { id: ProviderId; name: string; note?: string; url: string; mark: string; bg: string; fg: string; offline?: Office[]; fee?: number; partner?: boolean };

export const providers = providerList as Provider[];

// A verified quote: buy = what you pay in som for 1 USDT, sell = what you get.
export type Quote = { buy: number | null; sell: number | null; fee: number | null; at: string; source: string };
export type RatesFile = { updatedAt: string | null; quotes: Partial<Record<ProviderId, Quote>> };

export const rates = data as RatesFile;

// A quote counts as today's for 26 hours after it was verified: one day plus
// a margin for a late morning run. After that its cell links to the site.
const FRESH_MS = 26 * 3600_000;

// A rate entered by hand (scripts/rates/manual.mts) holds for the Tashkent
// day it was entered on: the next morning someone has to check it again.
const day = (t: number) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(t);

export function isFresh(quote: Quote, now = Date.now()): boolean {
  const at = Date.parse(quote.at);
  return quote.source === "manual" ? day(at) === day(now) : now - at < FRESH_MS;
}

export type Row = Omit<Provider, "fee"> & { quote: Quote | null; fresh: boolean; fee: number | null };

export function rateRows(file: RatesFile = rates, now = Date.now()): Row[] {
  return providers.map((p) => {
    const quote = file.quotes[p.id] ?? null;
    const fresh = !!quote && isFresh(quote, now);
    return { ...p, quote, fresh, fee: fresh && quote?.fee != null ? quote.fee : (p.fee ?? null) };
  });
}

// Best buy: the lowest price to pay. Best sell: the highest price received.
// Only among today's quotes, and only when there are at least two to compare.
export function best(rows: Row[]) {
  const pick = (key: "buy" | "sell" | "fee", better: (a: number, b: number) => boolean) => {
    const val = (r: Row) => (key === "fee" ? r.fee : r.fresh ? (r.quote?.[key] ?? null) : null);
    const live = rows.filter((r) => val(r) != null);
    if (live.length < 2) return null;
    return live.reduce((acc, r) => (better(val(r)!, val(acc)!) ? r : acc));
  };
  // fee: the lowest commission for buying USDT with cash dollars.
  return { buy: pick("buy", (a, b) => a < b), sell: pick("sell", (a, b) => a > b), fee: pick("fee", (a, b) => a < b) };
}

// 12 066 or 11 942,90 — the way the reference table writes som.
export function fmtSom(n: number): string {
  const whole = Math.round(n * 100) % 100 === 0;
  return n
    .toLocaleString("ru-RU", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 })
    .replace(/\u00a0|\u202f/g, " ");
}

export function fmtTime(iso: string, locale: string, withDate = true): string {
  return new Intl.DateTimeFormat(locale === "uz" ? "uz-Latn" : locale, {
    ...(withDate ? { day: "numeric", month: "long" } : {}),
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tashkent",
  }).format(new Date(iso));
}

export function fmtDay(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "uz" ? "uz-Latn" : locale, { day: "numeric", month: "long", timeZone: "Asia/Tashkent" }).format(new Date(iso));
}
