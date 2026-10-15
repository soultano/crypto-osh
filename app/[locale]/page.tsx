import Image from "next/image";
import Link from "next/link";
import { Audience, Contact, Gallery, Mission, SectionHead, VideoGrid } from "@/components/Sections";
import { NewsList } from "@/components/News";
import { IkatBand, Rosette } from "@/components/Ornament";
import { UsdtRates } from "@/components/UsdtRates";
import { newsText } from "@/content/news";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { allNews } from "@/lib/news";
import { photos } from "@/lib/site";

// Re-rendered hourly so a rate older than a day turns into a dash even if
// the morning update stops.
export const revalidate = 3600;

export const generateMetadata = ({ params }: { params: Promise<{ locale: string }> }) => pageMetadata(params, "");

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale);
  const n = newsText[locale];
  const latest = allNews().slice(0, 3);

  return (
    <>
      <UsdtRates locale={locale} />

      <section className="hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <h1>{t.hero.tagline}</h1>
            <p className="lead">{t.hero.subtitle}</p>
            <div className="btn-row">
              <Link className="btn" href={`/${locale}/business`}>
                {t.hero.ctaPrimary}
              </Link>
              <Link className="btn btn-ghost" href={`/${locale}/videos`}>
                {t.hero.ctaSecondary}
              </Link>
            </div>
          </div>
          <div className="hero-art">
            <Rosette className="hero-rosette" size={420} />
            <div className="hero-photo">
              <Image src={photos.poster} alt="Crypto Osh" width={1024} height={1024} priority sizes="(max-width: 900px) 80vw, 420px" />
            </div>
          </div>
        </div>
        <IkatBand />
      </section>

      <section className="stats">
        <div className="container stats-grid">
          {t.stats.map((s) => (
            <div key={s.label} className="stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {latest.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead kicker={n.kicker} title={n.latest} />
            <NewsList items={latest} locale={locale} />
            <div className="center">
              <Link className="btn btn-ghost" href={`/${locale}/news`}>
                {n.all} →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container split">
          <div className="split-media arch">
            <Image src={photos.group2} alt={t.gallery.title} width={1200} height={1600} sizes="(max-width: 900px) 90vw, 45vw" />
          </div>
          <div>
            <span className="kicker">{t.about.kicker}</span>
            <h2>{t.about.title}</h2>
            {t.about.paragraphs.slice(0, 2).map((p) => (
              <p key={p}>{p}</p>
            ))}
            <Link className="link-arrow" href={`/${locale}/about`}>
              {t.about.more} →
            </Link>
          </div>
        </div>
      </section>

      <Mission t={t} />
      <Audience t={t} />

      <section className="section">
        <div className="container">
          <div className="offer-banner">
            <div>
              <span className="kicker">{t.businessTeaser.kicker}</span>
              <h2>{t.businessTeaser.title}</h2>
              <p>{t.businessTeaser.text}</p>
            </div>
            <div className="offer-price">
              <strong>{t.businessTeaser.price}</strong>
              <Link className="btn" href={`/${locale}/business`}>
                {t.businessTeaser.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Gallery t={t} />

      <section className="section section-alt">
        <div className="container">
          <SectionHead kicker={t.videos.kicker} title={t.videos.title} intro={t.videos.intro} />
          <VideoGrid t={t} locale={locale} limit={2} />
          <div className="center">
            <Link className="btn btn-ghost" href={`/${locale}/videos`}>
              {t.videos.all} →
            </Link>
          </div>
        </div>
      </section>

      <Contact t={t} />
    </>
  );
}
