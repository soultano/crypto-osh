// Saves the current crypto prices and Central Bank dollar rate to
// content/prices-snapshot.json. The site falls back to this file when its own
// live requests fail, so the /kurs page never sits on an error. Runs with the
// USDT rates (daily-rates.yml); a failed source keeps its last saved value.
//
//   node scripts/rates/prices.mts

import fs from "node:fs";
import path from "node:path";
import { fetchCbuRate, fetchCoinQuotes } from "../../lib/prices-live.ts";

const outPath = path.join(process.cwd(), "content", "prices-snapshot.json");
const prev = JSON.parse(fs.readFileSync(outPath, "utf8"));
const next = { ...prev };

try {
  const cbu = await fetchCbuRate();
  next.usdUzs = cbu.rate;
  next.cbuDate = cbu.date;
  console.log(`CBU: ${cbu.rate} (${cbu.date || "via voluto"})`);
} catch (e) {
  console.warn(`CBU rate: ${(e as Error).message} — keeping ${prev.usdUzs}`);
}
try {
  const quotes = await fetchCoinQuotes();
  next.coins = { ...prev.coins, ...quotes };
  next.fetchedAt = new Date().toISOString();
  console.log(`coins: ${Object.keys(quotes).join(", ")}`);
} catch (e) {
  console.warn(`coins: ${(e as Error).message} — keeping the last snapshot`);
}

fs.writeFileSync(outPath, JSON.stringify(next, null, 2) + "\n");
