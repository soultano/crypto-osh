// Morning USDT/UZS rates for the table at the top of the home page.
//
// Reads each exchanger's own public API — the same one its website calls to
// show the rate — and writes content/usdt-rates.json. A source that fails or
// returns something implausible keeps its previous quote with the old time,
// so the site shows a dash and "last verified at …" instead of a guess.
//
//   Voluto   voluto.uz/api/rate-setting   (Central Bank rate + published spreads)
//   tcrypto  api.tcrypto.uz info/calc     (quote for 100 USDT)
//   Unexpay  api.unexpay.uz make-calc     (quote for 100 USDT; its flat 10 000
//            placeholder is rejected by the Central Bank sanity band)
//   Asterium shop-rates.asterium.dev (office rates, Basic auth from the
//            ASTERIUM_API_USER / ASTERIUM_API_PASS secrets); without them,
//            only the fee from asterium.uz/ru/crypto-exchange
//   Binance, Walt: no public rate API reachable; rows link to the site
//
// Rates for the others are entered by hand: scripts/rates/manual.mts.
//
// Runs twice a day (.github/workflows/daily-rates.yml).
// Run: node scripts/rates/update.mts   (RATES_DRY_RUN=1 prints, writes nothing)

import fs from "node:fs";
import path from "node:path";

type Quote = { buy: number | null; sell: number | null; fee: number | null; at: string; source: string };
type RatesFile = { updatedAt: string | null; quotes: Record<string, Quote> };

const root = process.cwd();
const outPath = path.join(root, "content", "usdt-rates.json");
const UA = "Mozilla/5.0 (compatible; CryptoOshRates/1.0; +https://cryptoosh.uz)";

async function http(url: string, init: RequestInit = {}): Promise<unknown> {
  const res = await fetch(url, {
    ...init,
    headers: { accept: "application/json", "user-agent": UA, ...(init.headers as Record<string, string>) },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

// USDT trades within a few percent of the dollar, so a quote far from the
// Central Bank dollar rate is a placeholder or a broken source, never a real
// price (Unexpay's public calculator, for one, answers a flat 10 000).
let band: [number, number] = [0, 0];

function plausible(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > band[0] && n < band[1];
}

// The Central Bank dollar rate from cbu.uz; when cbu.uz is unreachable
// (it often is from GitHub's runners), the same CBU rate as Voluto's API
// republishes it. With neither, no quote is trusted: a wide band let
// Unexpay's flat 10 000 placeholder through.
async function setBandFromCbu() {
  const set = (usd: number) => usd > 0 && (band = [usd * 0.93, usd * 1.12]);
  try {
    const r = (await http("https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/")) as { Rate?: string }[];
    if (set(Number(r?.[0]?.Rate))) return;
  } catch (e) {
    console.warn(`cbu.uz: ${(e as Error).message} — trying Voluto's copy of the CBU rate`);
  }
  try {
    const { data } = (await http("https://voluto.uz/api/rate-setting")) as { data: { cbuRate?: unknown } };
    if (set(Number(data.cbuRate))) return;
  } catch (e) {
    console.warn(`voluto cbuRate: ${(e as Error).message}`);
  }
  throw new Error("no Central Bank rate to check quotes against");
}

type Source = () => Promise<Omit<Quote, "at">>;

const sources: Record<string, Source> = {
  // Voluto's site computes its rates in the browser from this settings record:
  // you buy at CBU × (1 + bank spread + Paynet fee), sell at CBU × (1 − spread − fee).
  async voluto() {
    const { data: d } = (await http("https://voluto.uz/api/rate-setting")) as { data: Record<string, unknown> };
    const cbu = Number(d.cbuRate);
    const pct = (k: string) => Number(d[k] ?? 0) / 100;
    const buy = cbu * (1 + pct("bankSpreadPercentUzsBuy") + pct("paynetCommissionPercentUzsBuy"));
    const sell = cbu * (1 - pct("bankSpreadPercentUzsSell") - pct("paynetCommissionPercentUzsSell"));
    // Fee for buying USDT with cash dollars: the site shows the override text when set.
    const override = String(d.usdSellOverride ?? "").trim();
    const m = override.match(/^(\d+(?:[.,]\d+)?)\s*%$/);
    const fee = m ? Number(m[1].replace(",", ".")) : Number(d.paynetCommissionPercentUsdBuy);
    // Rounded to whole som, as voluto.uz shows them.
    return { buy: Math.round(buy), sell: Math.round(sell), fee: Number.isFinite(fee) && fee > 0 ? fee : null, source: "voluto.uz/api/rate-setting" };
  },

  // tcrypto quotes in tiyin (1/100 som) per USDT for a given amount in cents.
  async tcrypto() {
    const calc = async (type: "BUY" | "SELL") => {
      const r = (await http("https://api.tcrypto.uz/api/v1/info/calc", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://tcrypto.uz" },
        body: JSON.stringify({ amount: 100 * 100, type, currency: "UZS" }),
      })) as { success?: boolean; result?: { data?: { rate?: number } } };
      const rate = r.result?.data?.rate;
      if (!r.success || typeof rate !== "number") throw new Error(`tcrypto ${type}: ${JSON.stringify(r).slice(0, 200)}`);
      return rate / 100;
    };
    return { buy: await calc("BUY"), sell: await calc("SELL"), fee: null, source: "api.tcrypto.uz/api/v1/info/calc" };
  },

  // Unexpay's landing calculator: rate for 100 USDT, no fee on the site.
  async unexpay() {
    const calc = async (operation: "BUY" | "SELL") => {
      const r = (await http(`https://api.unexpay.uz/public/make-calc?operation=${operation}&source=WEB&usdt_amount=100`, {
        headers: { origin: "https://unexpay.uz" },
      })) as Record<string, unknown>;
      return pickRate(r, `unexpay ${operation}`);
    };
    return { buy: await calc("BUY"), sell: await calc("SELL"), fee: null, source: "api.unexpay.uz/public/make-calc" };
  },

  // Asterium's shop (office) rates API. Without the credentials, only the
  // published fee is read from their page.
  async asterium() {
    const user = process.env.ASTERIUM_API_USER;
    const pass = process.env.ASTERIUM_API_PASS;
    if (user && pass) {
      const auth = Buffer.from(`${user}:${pass}`).toString("base64");
      const r = await http("https://shop-rates.asterium.dev/", { headers: { authorization: `Basic ${auth}` } });
      return { ...asteriumQuote(r as AsteriumRates), source: "shop-rates.asterium.dev" };
    }
    const res = await fetch("https://asterium.uz/ru/crypto-exchange", { headers: { "user-agent": UA }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`asterium: HTTP ${res.status}`);
    // "Комиссия за обмен 0,6%", possibly split across tags.
    const text = (await res.text()).replace(/<[^>]+>/g, " ").replace(/&nbsp;|\s+/g, " ");
    const m = text.match(/комисси[а-я]*[^0-9%]{0,40}?(\d+(?:[.,]\d+)?)\s*%/i);
    if (!m) throw new Error("asterium: fee not found on the page");
    return { buy: null, sell: null, fee: Number(m[1].replace(",", ".")), source: "asterium.uz/ru/crypto-exchange" };
  },
};

// Asterium answers a list of tiers by amount ("count"); the smallest tier is
// what an ordinary customer gets. buy = UZS→USDT, sell = USDT→UZS, and the
// cash-dollar fee is the markup on USD→USDT (1.008 USD per USDT = 0.8%).
type AsteriumRates = { data?: { operation: string; from: string; to: string; count: number; rate: number }[] };

function asteriumQuote(r: AsteriumRates) {
  const tier = (operation: string, from: string, to: string) => {
    const rows = (r.data ?? []).filter((x) => x.operation === operation && x.from === from && x.to === to && typeof x.rate === "number");
    if (!rows.length) throw new Error(`asterium: no ${operation} ${from}→${to} in ${JSON.stringify(r).slice(0, 300)}`);
    return rows.reduce((a, b) => (b.count < a.count ? b : a)).rate;
  };
  const cents = (n: number) => Math.round(n * 100) / 100;
  const usd = tier("buy", "USD", "USDT");
  const fee = usd > 1 && usd < 1.1 ? cents((usd - 1) * 100) : null;
  return { buy: cents(tier("buy", "UZS", "USDT")), sell: cents(tier("sell", "USDT", "UZS")), fee };
}

// The first plausible numeric field called rate/rate_amount/price/course.
function pickRate(obj: Record<string, unknown>, label: string): number {
  const found: number[] = [];
  const walk = (o: unknown) => {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (/^(rate|rate_amount|price|course|exchange_?rate)$/i.test(k)) {
        const n = typeof v === "string" ? Number(v.replace(/\s/g, "").replace(",", ".")) : v;
        if (plausible(n)) found.push(n as number);
      } else walk(v);
    }
  };
  walk(obj);
  if (!found.length) throw new Error(`${label}: no rate in ${JSON.stringify(obj).slice(0, 300)}`);
  return found[0];
}

async function main() {
  const prev: RatesFile = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : { updatedAt: null, quotes: {} };
  const now = new Date().toISOString();
  const next: RatesFile = { updatedAt: now, quotes: { ...prev.quotes } };
  const failed: string[] = [];
  await setBandFromCbu();

  await Promise.all(
    Object.entries(sources).map(async ([id, fetchQuote]) => {
      try {
        const q = await fetchQuote();
        for (const k of ["buy", "sell"] as const) {
          if (q[k] !== null && !plausible(q[k])) throw new Error(`${id}: implausible ${k} ${q[k]}`);
        }
        // An exchanger always buys dearer than it sells: equal numbers are a placeholder.
        if (q.buy !== null && q.sell !== null && q.buy <= q.sell) throw new Error(`${id}: buy ${q.buy} ≤ sell ${q.sell}`);
        const was = prev.quotes[id];
        // A fee-only source (Asterium) must not wipe a rate entered by hand.
        if (q.buy === null && q.sell === null && was?.source === "manual") next.quotes[id] = { ...was, fee: q.fee };
        else next.quotes[id] = { ...q, at: now };
        console.log(`${id}: buy ${q.buy ?? "—"} · sell ${q.sell ?? "—"} · fee ${q.fee ?? "—"}`);
      } catch (e) {
        failed.push(id);
        console.warn(`${id}: ${(e as Error).message} — keeping the last verified value`);
      }
    }),
  );

  if (failed.length === Object.keys(sources).length) {
    console.error("Every source failed: leaving the file unchanged.");
    process.exit(1);
  }
  if (process.env.RATES_DRY_RUN) return console.log(JSON.stringify(next, null, 2));
  fs.writeFileSync(outPath, JSON.stringify(next, null, 2) + "\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
