import { Contact, VideoGrid } from "@/components/Sections";
import { getDictionary, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";

export const generateMetadata = ({ params }: { params: Promise<{ locale: string }> }) => pageMetadata(params, "videos");

export default async function Videos({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale);

  return (
    <>
      <section className="page-hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container">
          <span className="eyebrow">{t.videos.kicker}</span>
          <h1>{t.videos.title}</h1>
          <p className="lead">{t.videos.intro}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <VideoGrid t={t} locale={locale} />
          <p className="muted center small">{t.videos.privacy}</p>
        </div>
      </section>
      <Contact t={t} />
    </>
  );
}
