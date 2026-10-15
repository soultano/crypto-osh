import { pricesText } from "@/content/news";
import type { Locale } from "@/lib/i18n";
import { fmtUsd, fmtUzs, type Prices } from "@/lib/prices";

// Crypto prices in som and dollars: used on /kurs and, shorter, on the home page.
export function CoinPrices({ prices, locale, limit }: { prices: Prices; locale: Locale; limit?: number }) {
  const p = pricesText[locale];
  return (
    <div className="bids prices">
      <table>
        <thead>
          <tr>
            <th scope="col">{p.coin}</th>
            <th scope="col">{p.priceUzs}</th>
            <th scope="col">{p.priceUsd}</th>
            <th scope="col">{p.change}</th>
          </tr>
        </thead>
        <tbody>
          {prices.coins.slice(0, limit).map((c) => (
            <tr key={c.symbol}>
              <th scope="row">
                <strong>{c.symbol}</strong> <span className="muted">{c.name}</span>
              </th>
              <td>{fmtUzs(c.uzs)}</td>
              <td>{fmtUsd(c.usd)}</td>
              <td className={c.change24h === null ? "" : c.change24h >= 0 ? "up" : "down"}>
                {c.change24h === null ? "—" : `${c.change24h >= 0 ? "+" : ""}${c.change24h.toFixed(2)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
