import { newsText } from "@/content/news";
import { htmlLang, isLocale, locales, type Locale } from "@/lib/i18n";
import { allNews } from "@/lib/news";
import { site } from "@/lib/site";

// RSS feed of the latest news, one per language: /uz/news/rss.xml and so on.
// Yandex, news aggregators and feed readers pick new stories up from here.

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "uz";
  const n = newsText[locale];
  const home = `${site.url}/${locale}/news`;
  const items = allNews()
    .slice(0, 50)
    .map((a) => {
      const t = a[locale];
      const url = `${site.url}/${locale}/news/${a.slug}`;
      return [
        "<item>",
        `<title>${esc(t.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${new Date(a.date).toUTCString()}</pubDate>`,
        `<description>${esc(t.summary)}</description>`,
        ...a.tags.map((tag) => `<category>${esc(tag)}</category>`),
        "</item>",
      ].join("");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(n.metaTitle)} · Crypto Osh</title>
<link>${home}</link>
<description>${esc(n.metaDescription)}</description>
<language>${htmlLang[locale]}</language>
<atom:link href="${home}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=600" },
  });
}
