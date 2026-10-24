// Rates entered by hand for services with no public rate (Binance UZ,
// Walt, Unexpay, Asterium): someone checks the app or the office and types
// the numbers into Actions → "USDT rates: enter by hand". Each pair is
// checked against the Central Bank dollar rate like the automatic ones and
// written to content/usdt-rates.json with source "manual".
//
// Env: RATE_<ID>=<buy>/<sell>, e.g. RATE_BINANCE="12 150 / 11 980".
// A blank value leaves that service as it is.

import fs from "node:fs";
import path from "node:path";

type Quote = { buy: number | null; sell: number | null; fee: number | null; at: string; source: string };
type RatesFile = { updatedAt: string | null; quotes: Record<string, Quote> };

const ids = ["binance", "walt", "unexpay", "asterium"];
const outPath = path.join(process.cwd(), "content", "usdt-rates.json");

// The Central Bank dollar rate; Voluto's API republishes it when cbu.uz is
// unreachable from GitHub's runners.
async function cbuBand(): Promise<[number, number]> {
  const get = async (url: string, pick: (j: any) => unknown) => {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
      return Number(pick(await r.json()));
    } catch {
      return NaN;
    }
  };
  let usd = await get("https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/", (j) => j?.[0]?.Rate);
  if (!(usd > 0)) usd = await get("https://voluto.uz/api/rate-setting", (j) => j?.data?.cbuRate);
  if (!(usd > 0)) throw new Error("no Central Bank USD rate (cbu.uz and voluto.uz both failed)");
  return [usd * 0.93, usd * 1.12];
}

function parse(id: string, raw: string, band: [number, number]): { buy: number; sell: number } {
  const parts = raw.split("/").map((s) => Number(s.replace(/\s/g, "").replace(",", ".")));
  if (parts.length !== 2) throw new Error(`${id}: write it as buy/sell, e.g. 12150/11980 (got "${raw}")`);
  const [buy, sell] = parts;
  for (const [k, n] of [["buy", buy], ["sell", sell]] as const) {
    if (!Number.isFinite(n) || n < band[0] || n > band[1]) {
      throw new Error(`${id}: ${k} ${n} is not a USDT price in som (expected ${Math.round(band[0])}–${Math.round(band[1])})`);
    }
  }
  if (sell > buy) throw new Error(`${id}: sell ${sell} is above buy ${buy}; swapped?`);
  return { buy, sell };
}

async function main() {
  const entered = ids.map((id) => [id, (process.env[`RATE_${id.toUpperCase()}`] ?? "").trim()] as const).filter(([, v]) => v);
  if (!entered.length) throw new Error("No rates entered.");
  const band = await cbuBand();
  const file: RatesFile = JSON.parse(fs.readFileSync(outPath, "utf8"));
  const now = new Date().toISOString();
  for (const [id, raw] of entered) {
    const { buy, sell } = parse(id, raw, band);
    // Keep a fee the morning run read from the service's page (Asterium's 0.6%).
    file.quotes[id] = { buy, sell, fee: file.quotes[id]?.fee ?? null, at: now, source: "manual" };
    console.log(`${id}: buy ${buy} · sell ${sell}`);
  }
  file.updatedAt = now;
  fs.writeFileSync(outPath, JSON.stringify(file, null, 2) + "\n");
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exit(1);
});
