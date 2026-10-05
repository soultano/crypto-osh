import { PersonCard } from "@/components/People";
import { Contact } from "@/components/Sections";
import { getDictionary, type Locale } from "@/lib/i18n";
import { customPageMetadata } from "@/lib/meta";
import { people } from "@/lib/people";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return customPageMetadata({ locale, path: "/people", title: t.people.title, description: t.people.metaDescription });
}

export default async function People({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = getDictionary(locale);

  return (
    <>
      <section className="page-hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container">
          <span className="eyebrow">{t.people.kicker}</span>
          <h1>{t.people.title}</h1>
          <p className="lead">{t.people.intro}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ul className="people-grid">
            {people.map((p) => (
              <li key={p.slug}>
                <PersonCard person={p} locale={locale} t={t} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Contact t={t} />
    </>
  );
}
