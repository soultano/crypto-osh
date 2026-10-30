import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Person } from "@/lib/people";

// Round portrait, or the person's initials when there is no photo yet.
export function PersonPhoto({
  person,
  name,
  alt,
  sizes,
  priority,
}: {
  person: Person;
  name: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!person.photo) {
    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("");
    return (
      <svg className="person-initials" viewBox="0 0 300 400" role="img" aria-label={alt}>
        <text x="150" y="245" textAnchor="middle">
          {initials}
        </text>
      </svg>
    );
  }
  return <Image src={person.photo} alt={alt} width={1024} height={1024} priority={priority} sizes={sizes} />;
}

export function PersonCard({ person, locale, t }: { person: Person; locale: Locale; t: Dictionary }) {
  const p = person.text[locale];
  const href = `/${locale}/people/${person.slug}`;
  return (
    <article className="person-card">
      <div className="person-photo round">
        <PersonPhoto
          person={person}
          name={p.name}
          alt={t.people.photoAlt.replace("{name}", p.name)}
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
