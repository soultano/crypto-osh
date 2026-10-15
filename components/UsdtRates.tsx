import Link from "next/link";
import { usdtText } from "@/content/usdt";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { ShareBar } from "./ShareBar";
import { best, fmtDay, fmtSom, fmtTime, rateRows, rates, type Row } from "@/lib/usdt";

// USDT/UZS rates at Uzbek exchangers, light card with the best offers in an
// ikat-patterned frame. Server-rendered from content/usdt-rates.json.

function Tether() {
  return (
    <svg className="usdt-coin" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#26a17b" />
      <text x="24" y="33" textAnchor="middle" fontSize="28" fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif">
        ₮
      </text>
    </svg>
  );
}

function Badge({ row }: { row: Row }) {
  return (
    <span className="usdt-badge" style={{ background: row.bg, color: row.fg }} aria-hidden="true">
      {row.mark}
    </span>
  );
}

// Offline shops: the offices in Tashkent, each linked to the map.
function Offices({ row, locale, t }: { row: Row; locale: Locale; t: (typeof usdtText)[Locale] }) {
  if (!row.offline?.length) return <span className="usdt-online">{t.onlineOnly}</span>;
  // The service's own published rate is its office rate (Voluto: "по курсу дня").
  const q = row.fresh ? row.quote : null;
  return (
    <span className="usdt-offices">
      {q?.buy != null && q.sell != null && (
        <span className="usdt-office-rates">
          <strong>
            {fmtSom(q.buy)} / {fmtSom(q.sell)}
          </strong>
          <small>{t.officeRateLabel}</small>
        </span>
      )}
      {row.offline.map((o) => (
        <a key={o.map} href={`https://yandex.uz/maps/?text=${encodeURIComponent(o.map)}`} target="_blank" rel="noopener">
          <span aria-hidden="true">📍</span> {o[locale]}
          <small>{o.hours[locale]}</small>
        </a>
      ))}
      {q?.buy == null && <small className="usdt-office-rate">{t.rateInOffice}</small>}
    </span>
  );
}

function Provider({ row, fee, office }: { row: Row; fee: string | null; office: string | null }) {
  return (
    <a className="usdt-provider" href={row.url} target="_blank" rel="sponsored noopener">
      <Badge row={row} />
      <span>
        <strong>{row.name}</strong>
        {row.note && <small>{row.note}</small>}
        {office && <small className="usdt-office-mobile">📍 {office}</small>}
        {fee && <small className="usdt-fee-mobile">{fee}</small>}
      </span>
    </a>
  );
}

export function UsdtRates({ locale }: { locale: Locale }) {
  const t = usdtText[locale];
  const rows = rateRows();
  const top = best(rows);

  const cell = (row: Row, key: "buy" | "sell") => {
    const v = row.quote?.[key];
    const isBest = top[key]?.id === row.id;
    if (row.fresh && v != null) {
      const value = <span className="usdt-num">{fmtSom(v)}</span>;
      return isBest ? (
        <span className="ikat-frame" title={t.best}>
          <span className="ikat-frame-in">
            {value}
            <small className="usdt-best-tag">{t.bestShort}</small>
          </span>
        </span>
      ) : (
        value
      );
    }
    // Not verified today: never a guess, a link to check it at the source.
    return (
      <a className="usdt-check" href={row.url} target="_blank" rel="sponsored noopener">
        {row.id === "asterium" ? t.checkOfficial : t.check} ↗
      </a>
    );
  };

  const feeText = (row: Row) =>
    row.fresh && row.quote?.fee != null ? `${row.quote.fee.toLocaleString(locale === "en" ? "en-US" : "ru-RU")}%` : null;
  const fee = (row: Row) => {
    const f = feeText(row);
    return f ? <span className="usdt-fee">{f}</span> : <span className="usdt-dash">—</span>;
  };

  const summary = (key: "buy" | "sell" | "fee", label: string) => {
    const row = top[key];
    if (!row) return null;
    const value = key === "fee" ? feeText(row) : `${fmtSom(row.quote![key]!)} ${t.som}`;
    return (
      <a className="ikat-frame usdt-best" href={row.url} target="_blank" rel="sponsored noopener">
        <span className="ikat-frame-in">
          <span className="usdt-best-label">{label}</span>
          <span className="usdt-best-row">
            <Badge row={row} />
            <span>
              <strong>{value}</strong>
              <small>{row.name}</small>
            </span>
          </span>
        </span>
      </a>
    );
  };

  // What the share buttons post: the date and today's best offers.
  const shareText = [
    rates.updatedAt ? `${t.shareTitle}, ${fmtDay(rates.updatedAt, locale)}` : t.shareTitle,
    top.buy && `${t.bestBuy}: ${fmtSom(top.buy.quote!.buy!)} ${t.som} (${top.buy.name})`,
    top.sell && `${t.bestSell}: ${fmtSom(top.sell.quote!.sell!)} ${t.som} (${top.sell.name})`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section className="usdt" aria-labelledby="usdt-title">
      <div className="container">
        <div className="usdt-card">
          <header className="usdt-head">
            <Tether />
            <div>
              <h2 id="usdt-title">{t.title}</h2>
              <p>{t.subtitle}</p>
            </div>
            {rates.updatedAt && (
              <span className="usdt-date">
                {t.updated}
                <br />
                <time dateTime={rates.updatedAt}>{fmtTime(rates.updatedAt, locale)}</time>
              </span>
            )}
          </header>

          <div className="usdt-table-wrap">
            <table className="usdt-table">
              <thead>
                <tr>
                  <th scope="col">{t.service}</th>
                  <th scope="col">
                    <span className="usdt-ico usdt-ico-in" aria-hidden="true">↓</span>
                    {t.buy} <small>{t.uzs}</small>
                  </th>
                  <th scope="col">
                    <span className="usdt-ico usdt-ico-out" aria-hidden="true">↑</span>
                    {t.sell} <small>{t.uzs}</small>
                  </th>
                  <th scope="col" className="usdt-col-offline">
                    <span className="usdt-ico usdt-ico-shop" aria-hidden="true">⌂</span>
                    {t.offline} <small>{t.offlineSub}</small>
                  </th>
                  <th scope="col" className="usdt-col-fee">
                    <span className="usdt-ico usdt-ico-cash" aria-hidden="true">$</span>
                    {t.cash} <small>{t.fee}</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">
                      <Provider
                        row={row}
                        fee={feeText(row) && `${t.cashShort}: ${feeText(row)}`}
                        office={row.offline?.length ? `${t.office}: ${row.offline.map((o) => o[locale]).join("; ")}` : null}
                      />
                    </th>
                    <td>{cell(row, "buy")}</td>
                    <td>{cell(row, "sell")}</td>
                    <td className="usdt-col-offline">
                      <Offices row={row} locale={locale} t={t} />
                    </td>
                    <td className="usdt-col-fee">{fee(row)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(top.buy || top.sell || top.fee) && (
            <div className="usdt-bests">
              {summary("buy", t.bestBuy)}
              {summary("sell", t.bestSell)}
              {summary("fee", t.bestCash)}
            </div>
          )}

          <p className="usdt-note">
            {t.note} {t.partner}{" "}
            <Link href={`/${locale}/kurs`}>{t.more} →</Link>
          </p>

          <ShareBar
            text={shareText}
            url={`${site.url}/${locale}`}
            labels={{ share: t.share, copy: t.copy, copied: t.copied, instagramHint: t.instagramHint }}
          />
        </div>
      </div>
    </section>
  );
}

// At the very bottom of the pages that show rates.
export function UsdtDisclaimer({ locale }: { locale: Locale }) {
  const t = usdtText[locale];
  return (
    <section className="usdt-disclaimer" aria-label={t.disclaimerTitle}>
      <div className="container">
        <p className="legal">
          <strong>{t.disclaimerTitle}.</strong> {t.disclaimer}
        </p>
      </div>
    </section>
  );
}
