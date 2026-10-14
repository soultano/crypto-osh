import Link from "next/link";
import { newsText } from "@/content/news";
import type { Locale } from "@/lib/i18n";
import { newsDate, type NewsItem } from "@/lib/news";

export function NewsCard({ item, locale }: { item: NewsItem; locale: Locale }) {
  const t = item[locale];
  return (
    <article className="news-card">
      <p className="news-meta">
        <time dateTime={item.date}>{newsDate(item.date, locale)}</time>
        {item.sources[0] && <span> · {item.sources.map((s) => s.name).join(", ")}</span>}
      </p>
      <h3>
        <Link className="news-link" href={`/${locale}/news/${item.slug}`}>
          {t.title}
        </Link>
      </h3>
      <p className="news-summary">{t.summary}</p>
      <span className="link-arrow" aria-hidden="true">
        {newsText[locale].readMore} →
      </span>
    </article>
  );
}

export function NewsList({ items, locale }: { items: NewsItem[]; locale: Locale }) {
  if (!items.length) return <p className="muted">{newsText[locale].empty}</p>;
  return (
    <ul className="news-grid">
      {items.map((n) => (
        <li key={n.slug}>
          <NewsCard item={n} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
