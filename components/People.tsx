import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Person } from "@/lib/people";

export function PersonCard({ person, locale, t }: { person: Person; locale: Locale; t: Dictionary }) {
  const p = person.text[locale];
  const href = `/${locale}/people/${person.slug}`;
  return (
    <article className="person-card">
      <div className="person-photo arch">
        <Image
          src={person.photo}
          alt={t.people.photoAlt.replace("{name}", p.name)}
          width={1024}
          height={1024}
          sizes="(max-width: 640px) 200px, 220px"
        />
      </div>
      <div className="person-body">
        <h2 className="h3">
          <Link href={href} className="person-link">
            {p.name}
          </Link>
        </h2>
        <p className="person-role">{p.role}</p>
        <p className="person-short">{p.short}</p>
        <ul className="tag-list">
          {person.cardTags.map((i) => (
            <li key={i} className="chip">
              {p.directions[i]}
            </li>
          ))}
        </ul>
        <span className="link-arrow" aria-hidden="true">
          {t.people.open} →
        </span>
      </div>
    </article>
  );
}
