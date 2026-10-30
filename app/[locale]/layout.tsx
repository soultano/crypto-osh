import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/Analytics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { themeColors } from "@/lib/theme";
import { defaultLocale, getDictionary, htmlLang, isLocale, locales, ogLocale } from "@/lib/i18n";
import { site, photos, videos } from "@/lib/site";
import "../globals.css";

export const dynamicParams = false;

// A choice made with the toggle wins; until then the site follows the system theme.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: themeColors.light,
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

  const sameAsLinks = [
    site.contacts.telegram,
    site.contacts.group,
    site.contacts.instagram,
    ...videos.map((v) => `https://www.youtube.com/watch?v=${v.id}`),
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: "Crypto Osh",
        alternateName: ["Kripto Osh", "Крипто Ош"],
        description: t.meta.description,
        inLanguage: htmlLang[locale],
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: "Crypto Osh",
        alternateName: ["Kripto Osh", "Крипто Ош"],
        url: site.url,
        logo: `${site.url}${photos.poster}`,
        description: t.meta.description,
        areaServed: "UZ",
        founder: {
          "@type": "Person",
          name: t.founder.name,
          url: site.contacts.telegram || undefined,
        },
        sameAs: sameAsLinks,
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/${locale}/#faq`,
        mainEntity: t.business.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    // data-theme is set by the script below before React hydrates.
    <html lang={htmlLang[locale]} data-theme="light" suppressHydrationWarning>
      <head>
        <script
          // Runs before paint, so a dark-theme visitor never sees a light flash.
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Header locale={locale} nav={t.nav} />
        <main id="main">{children}</main>
        <Footer t={t} locale={locale} />
        {site.analytics && <Analytics id={site.analytics} />}
        <script
          type="application/ld+json"
          // Static, server-built object: no user input reaches it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
