"use client";

import { useEffect, useRef, useState } from "react";
import type { StoryLabels } from "@/content/story";
import { useInstagramStory } from "./InstagramStory";
import { Icon } from "./ShareBar";

// Share buttons under every news article. Telegram has a web share link that
// lets the reader pick any chat, group or channel. Instagram gets a story card
// of the article, see InstagramStory.

type Labels = {
  share: string;
  telegram: string;
  stories: string;
  copy: string;
  copied: string;
  storyKicker: string;
  storyCta: string;
};

type Props = { url: string; title: string; summary: string; date: string; labels: Labels; story: StoryLabels };

export function ArticleShare({ url, title, summary, date, labels, story }: Props) {
  const [note, setNote] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = (msg: string) => {
    setNote(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(null), 6000);
  };

  const ig = useInstagramStory(
    { kicker: `${labels.storyKicker} · ${date}`, title, body: summary, cta: labels.storyCta, url },
    story,
    flash,
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      flash(labels.copied);
    } catch {
      flash(url);
    }
  };

  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <div className="article-share">
      <span className="article-share-label">{labels.share}</span>
      <div className="article-share-buttons">
        <a className="article-share-btn share-telegram" href={tg} target="_blank" rel="noopener">
          <Icon id="telegram" />
          {labels.telegram}
        </a>
        <button type="button" className="article-share-btn share-instagram" onClick={ig.share}>
          <Icon id="instagram" />
          {labels.stories}
        </button>
        <button type="button" className="article-share-btn share-copy" onClick={copy}>
          <Icon id="copy" />
          {labels.copy}
        </button>
      </div>
      <span className="share-note" role="status" aria-live="polite">
        {note}
      </span>
      {ig.sheet}
    </div>
  );
}
