"use client";

import { useState } from "react";
import type { StoryLabels } from "@/content/story";
import { useInstagramStory } from "./InstagramStory";

// Share buttons under the USDT table. Telegram, WhatsApp, X and Facebook have
// web share links. Instagram gets a story card with today's best rates, see
// InstagramStory.

type Labels = { share: string; copy: string; copied: string; storyKicker: string; storyCta: string };

const nets = [
  { id: "telegram", name: "Telegram", href: (u: string, t: string) => `https://t.me/share/url?url=${u}&text=${t}` },
  { id: "whatsapp", name: "WhatsApp", href: (u: string, t: string) => `https://wa.me/?text=${t}%0A${u}` },
  { id: "x", name: "X", href: (u: string, t: string) => `https://x.com/intent/post?text=${t}&url=${u}` },
  { id: "facebook", name: "Facebook", href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
] as const;

export function Icon({ id }: { id: string }) {
  const paths: Record<string, string> = {
    telegram: "M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13 1.4 11.5c-1-.3-1.1-1 .2-1.5L20.5 2.8c.9-.3 1.6.2 1.4 1.5z",
    whatsapp: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.7-.6 13 13 0 0 1-5-4.4c-.4-.5-1.2-1.6-1.2-3.1s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2.1.4 0 .6l-.3.5-.4.5c-.2.1-.3.3-.1.6.2.3.8 1.3 1.6 2.1 1.1 1 2 1.3 2.3 1.4.3.2.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.5.3.1.2.1.7-.1 1.4z",
    x: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z",
    facebook: "M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V9c0-.6.4-1 1-1z",
    instagram: "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.8-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM21.9 7.9c-.1-1.6-.4-3-1.6-4.2S17.7 2.2 16.1 2.1C14.5 2 9.5 2 7.9 2.1 6.3 2.2 4.9 2.5 3.7 3.7S2.2 6.3 2.1 7.9C2 9.5 2 14.5 2.1 16.1c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.6.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.6 0-8.2zM19.8 18a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.9.4s-4.6.1-5.9-.4A3.3 3.3 0 0 1 4.2 18c-.5-1.3-.4-4.4-.4-5.9s-.1-4.6.4-5.9A3.3 3.3 0 0 1 6.1 4.2c1.3-.5 4.4-.4 5.9-.4s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.9s.1 4.6-.4 5.9z",
    copy: "M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z",
  };
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d={paths[id]} />
    </svg>
  );
}

export function ShareBar({ text, url, labels, story }: { text: string; url: string; labels: Labels; story: StoryLabels }) {
  const [note, setNote] = useState<string | null>(null);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  const full = `${text}\n${url}`;

  const flash = (msg: string) => {
    setNote(msg);
    setTimeout(() => setNote(null), 6000);
  };

  const copy = async (msg: string) => {
    try {
      await navigator.clipboard.writeText(full);
      flash(msg);
    } catch {
      flash(url);
    }
  };

  // The first line of the text is the card's title, the rest its body.
  const [title, ...rest] = text.split("\n");
  const ig = useInstagramStory(
    { kicker: labels.storyKicker, title, body: rest.join("\n"), cta: labels.storyCta, url },
    story,
    flash,
  );

  return (
    <div className="share-bar">
      <span className="share-label">{labels.share}</span>
      <div className="share-buttons">
        {nets.map((n) => (
          <a key={n.id} className={`share-btn share-${n.id}`} href={n.href(u, t)} target="_blank" rel="noopener" aria-label={n.name} title={n.name}>
            <Icon id={n.id} />
          </a>
        ))}
        <button type="button" className="share-btn share-instagram" onClick={ig.share} aria-label="Instagram" title="Instagram">
          <Icon id="instagram" />
        </button>
        <button type="button" className="share-btn share-copy" onClick={() => copy(labels.copied)} aria-label={labels.copy} title={labels.copy}>
          <Icon id="copy" />
        </button>
      </div>
      <span className="share-note" role="status" aria-live="polite">
        {note}
      </span>
      {ig.sheet}
    </div>
  );
}
