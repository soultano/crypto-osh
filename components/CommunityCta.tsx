import { communityText } from "@/content/community";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

// The paid community group, on every page (rendered by the locale layout).
// Kept apart from ChannelCta: the channel is free news, this is the group.
export function CommunityCta({ locale }: { locale: Locale }) {
  const c = communityText[locale];
  if (!site.contacts.community) return null;
  return (
    <section className="section community" id="community" aria-labelledby="community-title">
      <div className="container community-inner">
        <div className="community-main">
          <span className="kicker">{c.kicker}</span>
          <h2 id="community-title">{c.title}</h2>
          <p className="lead">{c.lead}</p>
          <ul className="community-perks">
            {c.perks.map((p) => (
              <li key={p.text}>
                <span aria-hidden="true">{p.icon}</span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="community-card">
          <h3>{c.weekTitle}</h3>
          <ol className="community-week">
            {c.week.map((w) => (
              <li key={w.day}>
                <b>{w.day}</b>
                <span>{w.topic}</span>
                <time>20:00</time>
              </li>
            ))}
          </ol>
          <p className="community-price">
            <strong>{c.price}</strong>
            <span>{c.priceNote}</span>
          </p>
          <a className="btn community-btn" href={site.contacts.community} target="_blank" rel="noopener noreferrer">
            {c.button}
          </a>
          <p className="community-note">{c.note}</p>
        </div>
      </div>
    </section>
  );
}
