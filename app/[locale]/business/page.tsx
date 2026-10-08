import Image from "next/image";
import Link from "next/link";
import { Contact, SectionHead } from "@/components/Sections";
import { IkatBand } from "@/components/Ornament";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { customPageMetadata } from "@/lib/meta";
import { photos, site } from "@/lib/site";

// Price of the base package, for structured data (shown on the page as text).
const basePrice = 29_000_000;
const baseGuests = 50;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const b = getDictionary(locale).business;
  return customPageMetadata({ locale, path: "/business", title: b.seoTitle, description: b.seoDescription });
}

export default async function Business({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale);
  const b = t.business;
  const url = `${site.url}/${locale}/business`;

  // Service with its offer, plus the FAQ, so Google and Yandex can read the
  // price and what it includes.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: b.seoTitle,
      description: b.seoDescription,
      serviceType: b.title,
      url,
      areaServed: { "@type": "Country", name: "Uzbekistan" },
      provider: { "@type": "Organization", name: "Crypto Osh", url: site.url },
      offers: {
        "@type": "Offer",
        price: basePrice,
        priceCurrency: "UZS",
        url,
        description: b.includeGroups.flatMap((g) => g.items.map((i) => i.text)).join("; "),
        eligibleQuantity: { "@type": "QuantitativeValue", maxValue: baseGuests, unitText: "guests" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: b.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container split split-center">
          <div>
            <span className="eyebrow">{b.kicker}</span>
            <h1>{b.title}</h1>
            <p className="lead">{b.lead}</p>
            <div className="price-tag">
              <span>{b.priceLabel}</span>
              <strong>{b.price}</strong>
              <em>{b.priceNote}</em>
            </div>
            <div className="btn-row">
              <Link className="btn" href={`/${locale}/business#contact`}>
                {b.ctaButton}
              </Link>
            </div>
          </div>
          <div className="split-media arch">
            <Image src={photos.plov} alt={b.heroAlt} width={1200} height={1600} priority sizes="(max-width: 900px) 90vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title={b.includesTitle} />
          {b.includeGroups.map((g) => (
            <div className="includes-group" key={g.title}>
              <h3>{g.title}</h3>
              <ul className="includes">
                {g.items.map((item) => (
                  <li key={item.text}>
                    <span className="emoji" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="includes-note">{b.moreGuests}</p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHead title={b.imageTitle} intro={b.imageLead} />
          <div className="grid-4">
            {b.imagePoints.map((p, i) => (
              <div className="tile" key={p.title}>
                <span className="tile-num">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title={b.packagesTitle} />
          <div className="packages">
            {b.packages.map((p, i) => (
              <div className={`package ${i === 0 ? "is-featured" : ""}`} key={p.name}>
                {i === 0 && <span className="badge">{b.popular}</span>}
                <h3>{p.name}</h3>
                <strong className="package-price">{p.price}</strong>
                <p>{p.text}</p>
                <Link className={`btn ${i === 0 ? "" : "btn-ghost"}`} href={`/${locale}/business#contact`}>
                  {b.ctaButton}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHead title={b.processTitle} />
          <ol className="steps">
            {b.process.map((s, i) => (
              <li key={s.step}>
                <span className="step-num">{i + 1}</span>
                <h3>{s.step}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <SectionHead title={b.faqTitle} />
          <div className="faq">
            {b.faq.map((f) => (
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
          <h2>{b.ctaTitle}</h2>
          <Link className="btn" href={`/${locale}/business#contact`}>
            {b.ctaButton}
          </Link>
        </div>
      </section>

      <Contact t={t} />
      <script
        type="application/ld+json"
        // Static, server-built object from content/*.ts: no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
