import Image from "next/image";
import Link from "next/link";
import { Contact, SectionHead } from "@/components/Sections";
import { IkatBand } from "@/components/Ornament";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { photos } from "@/lib/site";

export const generateMetadata = ({ params }: { params: Promise<{ locale: string }> }) => pageMetadata(params, "business");

export default async function Business({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale);
  const b = t.business;
  const icons = ["🍚", "📣", "👥", "🎯", "🎬", "🎤"];

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
            </div>
            <div className="btn-row">
              <Link className="btn" href={`/${locale}/business#contact`}>
                {b.ctaButton}
              </Link>
            </div>
          </div>
          <div className="split-media arch">
            <Image src={photos.plov} alt="" width={1200} height={1600} priority sizes="(max-width: 900px) 90vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title={b.includesTitle} />
          <ul className="includes">
            {b.includes.map((item, i) => (
              <li key={item}>
                <span className="emoji" aria-hidden="true">
                  {icons[i]}
                </span>
                {item}
              </li>
            ))}
          </ul>
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
    </>
  );
}
