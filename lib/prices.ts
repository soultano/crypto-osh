// Crypto prices in Uzbek som: dollar prices from CoinGecko times the
// Central Bank of Uzbekistan dollar rate. Fetched on the server and cached
// for 10 minutes; any failure returns null and the page shows a notice.

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

export type CoinPrice = { symbol: string; name: string; usd: number; uzs: number; change24h: number | null };
export type Prices = { usdUzs: number; cbuDate: string; coins: CoinPrice[]; fetchedAt: string };

export const REVALIDATE = 600;

async function getJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const res = await fetch(url, {
    headers: { accept: "application/json", ...headers },
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

export async function getPrices(): Promise<Prices | null> {
  try {
    const key = process.env.COINGECKO_API_KEY;
    const ids = coins.map((c) => c.id).join(",");
    const [cg, cbu] = await Promise.all([
      getJson(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        key ? { "x-cg-demo-api-key": key } : {},
      ) as Promise<Record<string, { usd?: number; usd_24h_change?: number }>>,
      getJson("https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/") as Promise<{ Rate?: string; Date?: string }[]>,
    ]);
    const usdUzs = Number(cbu?.[0]?.Rate);
    if (!Number.isFinite(usdUzs) || usdUzs <= 0) return null;
    const list: CoinPrice[] = [];
    for (const c of coins) {
      const usd = cg[c.id]?.usd;
      if (typeof usd !== "number" || !Number.isFinite(usd)) continue;
      const ch = cg[c.id]?.usd_24h_change;
      list.push({ symbol: c.symbol, name: c.name, usd, uzs: usd * usdUzs, change24h: typeof ch === "number" ? ch : null });
    }
    if (!list.length) return null;
    return { usdUzs, cbuDate: cbu[0]?.Date || "", coins: list, fetchedAt: new Date().toISOString() };
  } catch {
    return null;
  }
}

export function fmtUzs(n: number): string {
  const digits = n >= 100 ? 0 : n >= 1 ? 2 : 4;
  return n.toLocaleString("ru-RU", { maximumFractionDigits: digits }).replace(/,/g, ".");
}

export function fmtUsd(n: number): string {
  const digits = n >= 100 ? 2 : n >= 1 ? 3 : 5;
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}
