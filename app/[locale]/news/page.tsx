import { Art } from "@/components/Illustrations";
import { NewsList } from "@/components/News";
import { Contact } from "@/components/Sections";
import { newsText } from "@/content/news";
import { getDictionary, type Locale } from "@/lib/i18n";
import { customPageMetadata } from "@/lib/meta";
import { allNews } from "@/lib/news";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const n = newsText[locale as Locale] ?? newsText.uz;
  return customPageMetadata({ locale, path: "/news", title: n.metaTitle, description: n.metaDescription });
}

export default async function News({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const n = newsText[locale];

  return (
    <>
      <section className="page-hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container">
          <span className="eyebrow">{n.kicker}</span>
          <h1>{n.title}</h1>
          <p className="lead">{n.lead}</p>
        </div>
        <Art name="choynak" className="page-hero-art" />
      </section>
      <section className="section">
        <div className="container">
          <NewsList items={allNews()} locale={locale} />
          <p className="legal news-legal">{n.disclaimer}</p>
        </div>
      </section>
      <Contact t={getDictionary(locale)} />
    </>
  );
}
