"use client";

import { useState } from "react";

type Coin = { symbol: string; uzs: number; usd: number };

export function Converter({ coins, labels }: { coins: Coin[]; labels: { calc: string; amount: string; result: string; coin: string; currency: string } }) {
  const [symbol, setSymbol] = useState(coins[0]?.symbol ?? "");
  const [amount, setAmount] = useState("1");
  const coin = coins.find((c) => c.symbol === symbol) ?? coins[0];
  const qty = Number(amount.replace(",", "."));
  const ok = coin && Number.isFinite(qty) && qty >= 0;
  const uzs = ok ? qty * coin.uzs : 0;
  const usd = ok ? qty * coin.usd : 0;

  return (
    <div className="converter">
      <h2 className="h3">{labels.calc}</h2>
      <div className="converter-row">
        <label>
          <span>{labels.amount}</span>
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label>
          <span>{labels.coin}</span>
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {coins.map((c) => (
              <option key={c.symbol} value={c.symbol}>
                {c.symbol}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="converter-result" aria-live="polite">
        {labels.result}: <strong>{ok ? `${Math.round(uzs).toLocaleString("ru-RU")} ${labels.currency}` : "—"}</strong>
        {ok && <span className="muted"> · ${usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>}
      </p>
    </div>
  );
}
