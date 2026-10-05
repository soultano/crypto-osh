import type { Metadata } from "next";
import { getDictionary, htmlLang, isLocale, locales, ogLocale } from "./i18n";
import { photos } from "./site";

type Page = "" | "about" | "business" | "videos";

function alternates(locale: string, suffix: string): Metadata["alternates"] {
  return {
    canonical: `/${locale}${suffix}`,
    languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}${suffix}`])),
  };
}

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
    alternates: alternates(locale, suffix),
  };
}

// Full metadata for a page with its own title, description and share image
// (Open Graph replaces the layout's object, so every field is set here).
export function customPageMetadata({
  locale,
  path,
  title,
  description,
  image = { url: photos.poster, width: 1024, height: 1024 },
  type = "website",
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: { url: string; width: number; height: number; alt?: string };
  type?: "website" | "profile";
}): Metadata {
  if (!isLocale(locale)) return {};
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type,
      siteName: "Crypto Osh",
      title: `${title} · Crypto Osh`,
      description,
      url: `/${locale}${path}`,
      locale: ogLocale[locale],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: `${title} · Crypto Osh`, description, images: [image.url] },
  };
}
