import Image from "next/image";
import { Contact, Mission, SectionHead } from "@/components/Sections";
import { Rosette } from "@/components/Ornament";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { photos } from "@/lib/site";

export const generateMetadata = ({ params }: { params: Promise<{ locale: string }> }) => pageMetadata(params, "about");

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale);

  return (
    <>
      <section className="page-hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container">
          <span className="eyebrow">{t.about.kicker}</span>
          <h1>{t.about.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="prose">
            {t.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="split-media arch">
            <Image src={photos.groupOutdoor} alt={t.about.title} width={1600} height={1200} sizes="(max-width: 900px) 90vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHead title={t.timeline.title} />
          <ol className="timeline">
            {t.timeline.items.map((it) => (
              <li key={it.label}>
                <span className="timeline-dot" aria-hidden="true" />
                <h3>{it.label}</h3>
                <p>{it.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container founder">
          <div className="founder-photo arch">
            <Image src={photos.founder} alt={t.founder.name} width={1200} height={1600} sizes="(max-width: 900px) 70vw, 360px" />
          </div>
          <div>
            <span className="kicker">{t.founder.kicker}</span>
            <h2>{t.founder.title}</h2>
            <p className="founder-name">
              {t.founder.name} <span className="muted">— {t.founder.role}</span>
            </p>
            <p>{t.founder.text}</p>
            <Rosette className="founder-rosette" size={90} />
          </div>
        </div>
      </section>

      <Mission t={t} />
      <Contact t={t} />
    </>
  );
}
