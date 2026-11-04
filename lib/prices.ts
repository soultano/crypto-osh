// Crypto prices in Uzbek som: dollar prices times the Central Bank of
// Uzbekistan dollar rate. Fetched live on the server and cached for 10
// minutes; whatever the live sources miss comes from the last snapshot
// (content/prices-snapshot.json, refreshed with the USDT rates twice a day),
// however old it is: visitors never see an error, only the time of the data.

import snapshotFile from "@/content/prices-snapshot.json";
import { coins, fetchCbuRate, fetchCoinQuotes, type CoinQuotes } from "./prices-live";

export { coins, REVALIDATE } from "./prices-live";

export type CoinPrice = { symbol: string; name: string; usd: number; uzs: number; change24h: number | null };
export type Prices = { usdUzs: number; cbuDate: string; coins: CoinPrice[]; fetchedAt: string };
export type PricesSnapshot = { fetchedAt: string | null; usdUzs: number | null; cbuDate: string; coins: CoinQuotes };

export async function getPrices(): Promise<Prices | null> {
  const [cbu, live] = await Promise.allSettled([fetchCbuRate(), fetchCoinQuotes()]);
  const snap = snapshotFile as PricesSnapshot;
  const snapOk = !!snap.fetchedAt;

  const usdUzs = cbu.status === "fulfilled" ? cbu.value.rate : snapOk ? snap.usdUzs : null;
  const cbuDate = cbu.status === "fulfilled" ? cbu.value.date : snap.cbuDate;
  if (!usdUzs) return null;

  const liveQuotes = live.status === "fulfilled" ? live.value : {};
  const list: CoinPrice[] = [];
  for (const c of coins) {
    const q = liveQuotes[c.symbol] ?? (snapOk ? snap.coins[c.symbol] : undefined);
    if (q) list.push({ symbol: c.symbol, name: c.name, usd: q.usd, uzs: q.usd * usdUzs, change24h: q.change24h });
  }
  if (!list.length) return null;
  // "Updated" shows the snapshot's time when the live coin prices failed.
  const fetchedAt = Object.keys(liveQuotes).length ? new Date().toISOString() : snap.fetchedAt!;
  return { usdUzs, cbuDate, coins: list, fetchedAt };
}

export function fmtUzs(n: number): string {
  const digits = n >= 100 ? 0 : n >= 1 ? 2 : 4;
  return n.toLocaleString("ru-RU", { maximumFractionDigits: digits }).replace(/,/g, ".");
}

export function fmtUsd(n: number): string {
  const digits = n >= 100 ? 2 : n >= 1 ? 3 : 5;
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}
