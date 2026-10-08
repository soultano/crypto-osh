import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { defaultLocale, getDictionary, htmlLang, isLocale, locales, ogLocale } from "@/lib/i18n";
import { site, photos } from "@/lib/site";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0b1838",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s · Crypto Osh` },
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { ...Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])), "x-default": `/${defaultLocale}` },
    },
    openGraph: {
      type: "website",
      siteName: "Crypto Osh",
      title: t.meta.title,
      description: t.meta.description,
      locale: ogLocale[locale],
      images: [{ url: photos.poster, width: 1024, height: 1024 }],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    icons: { icon: "/icon.svg" },
    verification: {
      ...(site.verification.google ? { google: site.verification.google } : {}),
      ...(site.verification.yandex ? { yandex: site.verification.yandex } : {}),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Crypto Osh",
    alternateName: ["Крипто Ош", "Kripto Osh"],
    url: site.url,
    logo: `${site.url}${photos.poster}`,
    description: t.meta.description,
    areaServed: "UZ",
    founder: { "@type": "Person", name: t.founder.name },
  };

  return (
    <html lang={htmlLang[locale]}>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Header locale={locale} nav={t.nav} />
        <main id="main">{children}</main>
        <Footer t={t} locale={locale} />
        <script
          type="application/ld+json"
          // Static, server-built object: no user input reaches it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
