import { newsText } from "@/content/news";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Icon } from "./ShareBar";

// Invitation to the Telegram news channel. A reader who came from search
// becomes a subscriber, and the channel brings them back with every post.
export function ChannelCta({ locale }: { locale: Locale }) {
  const n = newsText[locale];
  if (!site.contacts.channel) return null;
  return (
    <aside className="channel-cta">
      <span className="channel-cta-icon" aria-hidden="true">
        <Icon id="telegram" />
      </span>
      <div className="channel-cta-text">
        <strong>{n.channelTitle}</strong>
        <p>{n.channelText}</p>
      </div>
      <a className="btn" href={site.contacts.channel} target="_blank" rel="noopener noreferrer">
        {n.channelButton}
      </a>
    </aside>
  );
}
