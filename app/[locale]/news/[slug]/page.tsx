import { Art } from "@/components/Illustrations";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleShare } from "@/components/ArticleShare";
import { storyText } from "@/content/story";
import { NewsList } from "@/components/News";
import { newsText } from "@/content/news";
import { locales, type Locale } from "@/lib/i18n";
import { customPageMetadata } from "@/lib/meta";
import { allNews, getNews, newsDate } from "@/lib/news";
import { photos, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => allNews().map((n) => ({ locale, slug: n.slug })));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const item = getNews(slug);
  if (!item) return {};
  const t = item[locale as Locale] ?? item.uz;
  return customPageMetadata({
    locale,
    path: `/news/${slug}`,
    title: t.title,
    description: t.summary,
    type: "article",
    publishedTime: item.date,
  });
}

export default async function Article({ params }: { params: Params }) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const item = getNews(slug);
  if (!item) notFound();
  const t = item[locale];
  const n = newsText[locale];
  const more = allNews().filter((x) => x.slug !== slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: t.title,
    description: t.summary,
    datePublished: item.date,
    dateModified: item.date,
    inLanguage: locale === "uz" ? "uz-Latn" : locale,
    mainEntityOfPage: `${site.url}/${locale}/news/${slug}`,
    image: [`${site.url}${photos.poster}`],
    author: { "@type": "Organization", name: "Crypto Osh", url: site.url },
    publisher: { "@type": "Organization", name: "Crypto Osh", logo: { "@type": "ImageObject", url: `${site.url}${photos.poster}` } },
    isBasedOn: item.sources.map((s) => s.url),
    keywords: item.tags.join(", "),
  };

  return (
    <>
      <article className="section article">
        <div className="container narrow">
          <p className="crumbs">
            <Link href={`/${locale}/news`}>← {n.back}</Link>
          </p>
          <p className="news-meta">
            <time dateTime={item.date}>{newsDate(item.date, locale)}</time>
          </p>
          <h1 className="article-title">{t.title}</h1>
          <p className="lead">{t.summary}</p>
          {t.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <aside className="take">
            <Art name="choynak" className="take-art" />
            <h2>{n.take}</h2>
            <p>{t.take}</p>
          </aside>
          <ArticleShare
            url={`${site.url}/${locale}/news/${slug}`}
            title={t.title}
            summary={t.summary}
            date={newsDate(item.date, locale)}
            labels={{
              share: n.share,
              telegram: n.shareTelegram,
              stories: n.shareStories,
              copy: n.shareCopy,
              copied: n.shareCopied,
              storyKicker: n.storyKicker,
              storyCta: n.storyCta,
            }}
            story={storyText[locale]}
          />
          {item.sources.length > 0 && (
            <p className="news-sources">
              {n.sources}:{" "}
              {item.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && ", "}
                  <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">
                    {s.name}
                  </a>
                </span>
              ))}
            </p>
          )}
          {item.tags.length > 0 && (
            <ul className="tag-list">
              {item.tags.map((tag) => (
                <li key={tag} className="chip">
                  #{tag}
                </li>
              ))}
            </ul>
          )}
          <div className="btn-row">
            {site.contacts.group && (
              <a className="btn" href={site.contacts.group} target="_blank" rel="noopener noreferrer">
                {n.telegram}
              </a>
            )}
            <Link className="btn btn-ghost" href={`/${locale}/kurs`}>
              {n.pricesNav} BTC / USDT
            </Link>
          </div>
          <p className="legal news-legal">{n.disclaimer}</p>
        </div>
      </article>
      {more.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h2>{n.latest}</h2>
            <NewsList items={more} locale={locale} />
          </div>
        </section>
      )}
      <script
        type="application/ld+json"
        // Built from our own reviewed article files.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
