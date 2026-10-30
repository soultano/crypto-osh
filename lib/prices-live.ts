// Live price sources, shared by the site (lib/prices.ts) and the snapshot
// script (scripts/rates/prices.mts), so plain TypeScript with no "@/" imports.

export const coins = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "tether", symbol: "USDT", name: "Tether" },
  { id: "the-open-network", symbol: "TON", name: "Toncoin" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "tron", symbol: "TRX", name: "TRON" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin" },
] as const;

export type UsdQuote = { usd: number; change24h: number | null };
export type CoinQuotes = Record<string, UsdQuote>;
export type CbuRate = { rate: number; date: string };

export const REVALIDATE = 600;

async function getJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const res = await fetch(url, {
    headers: { accept: "application/json", ...headers },
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(8000),
  } as RequestInit);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

// The Central Bank dollar rate. cbu.uz often doesn't answer servers abroad
// (Vercel, GitHub), so Voluto's copy of the same CBU rate is the backup.
export async function fetchCbuRate(): Promise<CbuRate> {
  try {
    const r = (await getJson("https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/")) as { Rate?: string; Date?: string }[];
    const rate = Number(r?.[0]?.Rate);
    if (Number.isFinite(rate) && rate > 0) return { rate, date: r[0]?.Date || "" };
  } catch {}
  const { data } = (await getJson("https://voluto.uz/api/rate-setting")) as { data?: { cbuRate?: unknown } };
  const rate = Number(data?.cbuRate);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("no Central Bank rate");
  return { rate, date: "" };
}

// Dollar prices keyed by symbol: CoinGecko, or Coinbase's rate table
// (no 24-hour change there) when CoinGecko rate-limits the server.
export async function fetchCoinQuotes(): Promise<CoinQuotes> {
  const out: CoinQuotes = {};
  try {
    const key = process.env.COINGECKO_API_KEY;
    const cg = (await getJson(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coins.map((c) => c.id).join(",")}&vs_currencies=usd&include_24hr_change=true`,
      key ? { "x-cg-demo-api-key": key } : {},
    )) as Record<string, { usd?: number; usd_24h_change?: number }>;
    for (const c of coins) {
      const usd = cg[c.id]?.usd;
      const ch = cg[c.id]?.usd_24h_change;
      if (typeof usd === "number" && Number.isFinite(usd) && usd > 0) out[c.symbol] = { usd, change24h: typeof ch === "number" ? ch : null };
    }
  } catch {}
  if (Object.keys(out).length === coins.length) return out;
  try {
    const cb = (await getJson("https://api.coinbase.com/v2/exchange-rates?currency=USD")) as { data?: { rates?: Record<string, string> } };
    for (const c of coins) {
      const perUsd = Number(cb.data?.rates?.[c.symbol]);
      if (!out[c.symbol] && Number.isFinite(perUsd) && perUsd > 0) out[c.symbol] = { usd: 1 / perUsd, change24h: null };
    }
  } catch {}
  if (!Object.keys(out).length) throw new Error("no coin prices");
  return out;
}
