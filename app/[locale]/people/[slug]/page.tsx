import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Sections";
import { Rosette } from "@/components/Ornament";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { customPageMetadata } from "@/lib/meta";
import { getPerson, people } from "@/lib/people";
import { site } from "@/lib/site";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => people.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const person = getPerson(slug);
  if (!person || !isLocale(locale)) return {};
  const p = person.text[locale];
  return customPageMetadata({
    locale,
    path: `/people/${slug}`,
    title: `${p.name} · ${getDictionary(locale).people.title}`,
    description: p.metaDescription,
    type: "profile",
    image: { url: person.ogImage, width: 1200, height: 630, alt: p.name },
  });
}

export default async function PersonPage({ params }: { params: Params }) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const person = getPerson(slug);
  if (!person) notFound();
  const t = getDictionary(locale);
  const p = person.text[locale];

  const url = `${site.url}/${locale}/people/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    mainEntity: {
      "@type": "Person",
      url,
      name: p.name,
      description: p.short,
      jobTitle: p.role,
      image: `${site.url}${person.photo}`,
      knowsAbout: p.directions,
      sameAs: person.links.map((l) => l.url),
    },
  };

  return (
    <>
      <section className="page-hero profile-hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href={`/${locale}/people`}>← {t.people.back}</Link>
          </nav>
          <div className="profile-head">
            <div className="profile-photo arch">
              <Image
                src={person.photo}
                alt={t.people.photoAlt.replace("{name}", p.name)}
                width={1024}
                height={1024}
                priority
                sizes="(max-width: 900px) 260px, 340px"
              />
            </div>
            <div>
              <span className="kicker">{t.people.kicker}</span>
              <h1>{p.name}</h1>
              <p className="profile-role">{p.role}</p>
              <p className="lead">{p.short}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container profile-body">
          <div className="prose">
            <h2>{t.people.about}</h2>
            {p.bio.map((para) => (
              <p key={para}>{para}</p>
            ))}
            {p.why && (
              <>
                <h2>{t.people.why}</h2>
                <p>{p.why}</p>
              </>
            )}
          </div>
          <aside className="profile-aside">
            <div className="card-plain">
              <h2 className="h3">{t.people.directions}</h2>
              <ul className="tag-list">
                {p.directions.map((d) => (
                  <li key={d} className="chip">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-plain">
              <h2 className="h3">{t.people.links}</h2>
              <ul className="profile-links">
                {person.links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <Rosette className="founder-rosette" size={90} />
          </aside>
        </div>
        <div className="container">
          <p className="muted small profile-note">{t.people.disclaimer}</p>
        </div>
      </section>

      <Contact t={t} />
      <script
        type="application/ld+json"
        // Static, server-built object from lib/people.ts: no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
