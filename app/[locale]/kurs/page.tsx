import Link from "next/link";
import { Converter } from "@/components/Converter";
import { pricesText } from "@/content/news";
import type { Locale } from "@/lib/i18n";
import { customPageMetadata } from "@/lib/meta";
import { fmtUsd, fmtUzs, getPrices } from "@/lib/prices";

// Rebuilt in the background at most every 10 minutes (matches lib/prices).
export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const p = pricesText[locale as Locale] ?? pricesText.uz;
  return customPageMetadata({ locale, path: "/kurs", title: p.metaTitle, description: p.metaDescription });
}

export default async function Kurs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const p = pricesText[locale];
  const prices = await getPrices();
  const btc = prices?.coins.find((c) => c.symbol === "BTC");
  const usdt = prices?.coins.find((c) => c.symbol === "USDT");
  const faq = prices && btc && usdt ? p.faq(fmtUzs(btc.uzs), fmtUzs(usdt.uzs)) : p.faq("…", "…").slice(2);
  const updated = prices
    ? new Intl.DateTimeFormat(locale === "uz" ? "uz-Latn" : locale, {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tashkent",
      }).format(new Date(prices.fetchedAt))
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <section className="page-hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container">
          <span className="eyebrow">{p.kicker}</span>
          <h1>{p.title}</h1>
          <p className="lead">{p.lead}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {prices ? (
            <>
              <p className="muted small">
                {p.updated}: {updated} · {p.usdRate} {fmtUzs(prices.usdUzs)} {p.currency}
              </p>
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
                    {prices.coins.map((c) => (
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
              <Converter
                coins={prices.coins.map((c) => ({ symbol: c.symbol, uzs: c.uzs, usd: c.usd }))}
                labels={{ calc: p.calc, amount: p.amount, result: p.result, coin: p.coin, currency: p.currency }}
              />
            </>
          ) : (
            <p className="notice" role="note">
              {p.unavailable}
            </p>
          )}

          <h2 className="faq-title">{p.faqTitle}</h2>
          <div className="faq">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="legal news-legal">{p.source}</p>
          <p>
            <Link className="link-arrow" href={`/${locale}/news`}>
              {p.newsLink} →
            </Link>
          </p>
        </div>
      </section>
      <script
        type="application/ld+json"
        // Built from our own texts and numbers.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
