import Link from "next/link";
import { newsText } from "@/content/news";
import type { Locale } from "@/lib/i18n";
import { guides } from "@/lib/news";

// Links to the how-to guides. Placed on the busiest pages so readers and
// search engines both find them.
export function Guides({ locale, skip }: { locale: Locale; skip?: string }) {
  const list = guides().filter((g) => g.slug !== skip);
  if (!list.length) return null;
  return (
    <nav className="guides" aria-label={newsText[locale].guidesTitle}>
      <h2 className="guides-title">{newsText[locale].guidesTitle}</h2>
      <ul>
        {list.map((g) => (
          <li key={g.slug}>
            <Link className="link-arrow" href={`/${locale}/news/${g.slug}`}>
              {g[locale].title} →
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
