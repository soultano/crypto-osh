import Link from "next/link";
import { communityText } from "@/content/community";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

// A strip at the very top of every page, above the header. It says what the
// paid group is and leads to the /community page, which explains its value
// before sending people to the taps.uz bot.
export function CommunityBar({ locale }: { locale: Locale }) {
  const c = communityText[locale];
  if (!site.contacts.community) return null;
  const href = `/${locale}/community`;
  return (
    <div className="community-bar">
      <div className="container community-bar-inner">
        <Link className="community-bar-text" href={href}>
          <span aria-hidden="true">🎙</span> <span className="community-bar-long">{c.bar}</span>
          <span className="community-bar-short">{c.barShort}</span>
        </Link>
        <Link className="community-bar-btn" href={href}>
          {c.barButton}
        </Link>
      </div>
    </div>
  );
}
