import { communityText } from "@/content/community";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

// A strip at the very top of every page, above the header, leading to the
// paid community. The full pitch is the CommunityCta block lower down.
export function CommunityBar({ locale }: { locale: Locale }) {
  const c = communityText[locale];
  if (!site.contacts.community) return null;
  return (
    <div className="community-bar">
      <div className="container community-bar-inner">
        <span className="community-bar-text">
          <span aria-hidden="true">🎙</span> <span className="community-bar-long">{c.bar}</span>
          <span className="community-bar-short">{c.barShort}</span>
        </span>
        <a className="community-bar-btn" href={site.contacts.community} target="_blank" rel="noopener noreferrer">
          {c.barButton}
        </a>
      </div>
    </div>
  );
}
