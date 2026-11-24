import Link from "next/link";
import { PersonPhoto } from "@/components/People";
import { SectionHead } from "@/components/Sections";
import { Skyline } from "@/components/Illustrations";
import { communityText } from "@/content/community";
import { communityPage } from "@/content/community-page";
import { isLocale, type Locale } from "@/lib/i18n";
import { customPageMetadata } from "@/lib/meta";
import { people } from "@/lib/people";
import { site } from "@/lib/site";

// The full pitch for the paid Telegram expert group. Every "join" button goes
// to the taps.uz bot; the strip above the header and the block at the bottom
// of other pages lead here first.
const monthlyPrice = 12_000;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = communityPage[locale];
  return customPageMetadata({ locale, path: "/community", title: c.seoTitle, description: c.seoDescription });
}

function JoinButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <a className={`btn ${className}`} href={site.contacts.community} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

export default async function Community({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const c = communityPage[locale];
  const week = communityText[locale].week;
  const url = `${site.url}/${locale}/community`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: c.seoTitle,
      description: c.seoDescription,
      url,
      areaServed: { "@type": "Country", name: "Uzbekistan" },
      provider: { "@type": "Organization", name: "Crypto Osh", url: site.url },
      offers: {
        "@type": "Offer",
        price: monthlyPrice,
        priceCurrency: "UZS",
        url: site.contacts.community || url,
        description: c.included.join("; "),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <div className="cm-page">
      <section className="page-hero cm-hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container split split-center">
          <div>
            <span className="eyebrow">{c.eyebrow}</span>
            <h1>{c.title}</h1>
            <p className="lead">{c.lead}</p>
            <div className="price-tag">
              <span>{c.priceLabel}</span>
              <strong>{c.price}</strong>
              <em>{c.priceNote}</em>
            </div>
            <div className="btn-row">
              <JoinButton label={c.join} />
              <a className="btn btn-ghost" href="#inside">
                {c.more}
              </a>
            </div>
            <ul className="cm-trust">
              {c.trust.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <figure className="cm-chat" aria-label={c.chatLabel}>
            <figcaption className="cm-chat-head">
              <span className="cm-chat-avatar" aria-hidden="true">
                ₿
              </span>
              <span>
                <b>{c.chatGroup}</b>
                <small>
                  <i className="cm-online" aria-hidden="true" /> {c.chatMembers}
                </small>
              </span>
              <span className="cm-chat-tag">{c.chatLabel}</span>
            </figcaption>
            <div className="cm-chat-body">
              {c.chat.map((m, i) => (
                <div className={`cm-msg ${m.role === "expert" ? "is-expert" : ""}`} key={i}>
                  <b>
                    {m.who}
                    {m.role === "expert" && <span className="cm-badge">★</span>}
                  </b>
                  <p>{m.text}</p>
                  <time>{m.time}</time>
                </div>
              ))}
            </div>
            <p className="cm-chat-caption">{c.chatTitle}</p>
          </figure>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHead title={c.painTitle} intro={c.painIntro} />
          <div className="cm-grid-3">
            {c.pains.map((p) => (
              <div className="tile cm-pain" key={p.title}>
                <span className="cm-icon" aria-hidden="true">
                  {p.icon}
                </span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="inside">
        <div className="container">
          <SectionHead title={c.insideTitle} intro={c.insideIntro} />
          <div className="cm-grid-3">
            {c.inside.map((p) => (
              <div className="tile" key={p.title}>
                <span className="cm-icon" aria-hidden="true">
                  {p.icon}
                </span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
          <div className="center cm-mid-cta">
            <JoinButton label={`${c.join} · ${c.price}`} />
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container cm-experts">
          <div>
            <SectionHead title={c.expertsTitle} intro={c.expertsIntro} />
            <ul className="cm-people">
              {people.map((p) => {
                const t = p.text[locale];
                return (
                  <li key={p.slug}>
                    <Link href={`/${locale}/people/${p.slug}`}>
                      <span className="cm-person-photo">
                        <PersonPhoto person={p} name={t.name} alt={t.name} sizes="64px" />
                      </span>
                      <span>
                        <b>{t.name}</b>
                        <small>{t.role}</small>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link className="link-arrow" href={`/${locale}/people`}>
              {c.expertsLink} →
            </Link>
          </div>
          <div className="community-card">
            <h3>{c.weekTitle}</h3>
            <ol className="community-week">
              {week.map((w) => (
                <li key={w.day}>
                  <b>{w.day}</b>
                  <span>{w.topic}</span>
                  <time>20:00</time>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title={c.priceTitle} intro={c.priceIntro} />
          <div className="cm-price">
            <div className="cm-math">
              {c.math.map((m) => (
                <div className="cm-stat" key={m.label}>
                  <strong>{m.value}</strong>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
            <div className="community-card cm-offer">
              <h3>{c.includedTitle}</h3>
              <ul className="cm-included">
                {c.included.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="community-price">
                <strong>{c.price}</strong>
                <span>{c.priceNote}</span>
              </p>
              <JoinButton label={c.join} className="community-btn" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHead title={c.stepsTitle} />
          <ol className="steps cm-steps">
            {c.steps.map((s, i) => (
              <li key={s.title}>
                <span className="step-num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <SectionHead title={c.faqTitle} />
          <div className="faq">
            {c.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <Skyline className="skyline skyline-top" />
        <div className="container center">
          <h2>{c.finalTitle}</h2>
          <p className="lead">{c.finalText}</p>
          <JoinButton label={c.join} />
          <p className="cm-disclaimer">{c.disclaimer}</p>
        </div>
      </section>

      <script
        type="application/ld+json"
        // Static, server-built object from content/*.ts: no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
