import Image from "next/image";
import { SectionHead } from "@/components/Sections";
import { IkatBand } from "@/components/Ornament";
import { auctionText } from "@/content/auction";
import { auction } from "@/lib/auction";
import { htmlLang, type Locale } from "@/lib/i18n";
import { customPageMetadata } from "@/lib/meta";
import { photos, site } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const a = auctionText[locale as Locale] ?? auctionText.ru;
  return customPageMetadata({
    locale,
    path: "/auction",
    title: a.metaTitle,
    description: a.metaDescription,
    image: { url: photos.plov, width: 1200, height: 1600 },
  });
}

export default async function Auction({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const a = auctionText[locale];
  const tba = <span className="tba">{a.status.tba}</span>;
  const fmtDate = (iso: string, withTime = false) =>
    new Intl.DateTimeFormat(htmlLang[locale], {
      day: "numeric",
      month: "long",
      year: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      timeZone: "Asia/Tashkent",
    }).format(new Date(iso.length === 10 ? `${iso}T12:00:00+05:00` : `${iso}+05:00`));
  const money = (n: number) => `${n.toLocaleString("ru-RU")} ${auction.currency}`;
  const place = [auction.city[locale], auction.venue].filter(Boolean).join(", ");
  const bids = [...auction.bids].sort((x, y) => y.amount - x.amount);
  const icons = ["🍚", "✨", "🏅"];

  const status = [
    { label: a.status.date, value: auction.date ? fmtDate(auction.date) : tba },
    { label: a.status.place, value: place || tba },
    { label: a.status.start, value: auction.startPrice ? money(auction.startPrice) : tba },
    { label: a.status.step, value: auction.step ? money(auction.step) : tba },
    { label: a.status.closes, value: auction.onlineCloses ? fmtDate(auction.onlineCloses, true) : tba },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container split split-center">
          <div>
            <span className="eyebrow">{a.kicker}</span>
            <h1>{a.title}</h1>
            <p className="lead">{a.lead}</p>
            {!auction.open && (
              <p className="notice" role="note">
                {a.preview}
              </p>
            )}
            <div className="btn-row">
              <button className="btn" type="button" disabled>
                {a.bidSoon}
              </button>
              {site.contacts.telegram && (
                <a className="btn btn-ghost" href={site.contacts.telegram} target="_blank" rel="noopener noreferrer">
                  {a.notify}
                </a>
              )}
            </div>
          </div>
          <div className="split-media arch">
            <Image src={photos.plov2} alt="" width={1200} height={1600} priority sizes="(max-width: 900px) 90vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="auction-status">
            <h2 className="h3">{a.status.title}</h2>
            <dl>
              {status.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHead title={a.whatTitle} intro={a.whatLead} />
          <ul className="includes">
            {a.what.map((w, i) => (
              <li key={w.title}>
                <span className="emoji" aria-hidden="true">
                  {icons[i]}
                </span>
                <span>
                  {w.title}
                  <span className="includes-sub">{w.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title={a.howTitle} />
          <ol className="steps steps-3">
            {a.how.map((s, i) => (
              <li key={s.step}>
                <span className="step-num">{i + 1}</span>
                <h3>{s.step}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split split-top">
          <div>
            <SectionHead title={a.rulesTitle} />
            <ol className="rules">
              {a.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHead title={a.bidsTitle} />
            <div className="bids">
              <table>
                <thead>
                  <tr>
                    <th scope="col">{a.bidsCols.name}</th>
                    <th scope="col">{a.bidsCols.amount}</th>
                    <th scope="col">{a.bidsCols.at}</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.length ? (
                    bids.map((b, i) => (
                      <tr key={`${b.name}-${b.at}`} className={i === 0 ? "is-leader" : undefined}>
                        <td>{b.name}</td>
                        <td>{money(b.amount)}</td>
                        <td>{fmtDate(b.at, true)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="muted">
                        {a.bidsEmpty}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <SectionHead title={a.payTitle} />
          {a.pay.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="legal">{a.legal}</p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container narrow">
          <SectionHead title={a.faqTitle} />
          <div className="faq">
            {a.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <IkatBand />
        <div className="container center">
          <h2>{a.ctaTitle}</h2>
          {site.contacts.telegram && (
            <a className="btn" href={site.contacts.telegram} target="_blank" rel="noopener noreferrer">
              {a.notify}
            </a>
          )}
        </div>
      </section>
    </>
  );
}
