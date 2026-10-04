import type { Metadata } from "next";
import { getDictionary, htmlLang, isLocale, locales } from "./i18n";

type Page = "" | "about" | "business" | "videos";

export async function pageMetadata(params: Promise<{ locale: string }>, page: Page): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const suffix = page ? `/${page}` : "";
  const titles: Record<Page, string | undefined> = {
    "": undefined,
    about: t.nav.about,
    business: t.business.title,
    videos: t.videos.title,
  };
  const title = titles[page];
  return {
    ...(title ? { title } : {}),
    alternates: {
      canonical: `/${locale}${suffix}`,
      languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}${suffix}`])),
    },
  };
}
