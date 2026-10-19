"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./ShareBar";

// Share buttons under every news article. Telegram has a web share link that
// lets the reader pick any chat, group or channel. Instagram has no web link
// for Stories, so we draw a 1080x1920 story card and hand it to the phone's
// share sheet (Instagram is listed there); on a computer the card downloads.

type Labels = {
  share: string;
  telegram: string;
  stories: string;
  copy: string;
  copied: string;
  storyKicker: string;
  storyCta: string;
  storySaved: string;
};

type Props = { url: string; title: string; summary: string; date: string; labels: Labels };

const W = 1080;
const H = 1920;

// Splits text into lines that fit maxWidth; the last line gets an ellipsis
// when the text does not fit in maxLines.
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
      continue;
    }
    lines.push(line);
    line = words[i];
    if (lines.length === maxLines) {
      let last = lines[maxLines - 1];
      while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
      lines[maxLines - 1] = `${last.trimEnd()}…`;
      return lines;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawStory({ title, summary, date, labels, url }: Props): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  const font = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#12224d");
  bg.addColorStop(0.55, "#0b1838");
  bg.addColorStop(1, "#07122b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Ikat-like stripe, the same colours as the site's ornament band.
  const stripe = ["#c8402f", "#f2b230", "#1fb5b0", "#f6efe2", "#2453b8"];
  const sw = W / 20;
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = stripe[i % stripe.length];
    ctx.fillRect(i * sw, 0, sw, 18);
    ctx.fillRect(i * sw, H - 18, sw, 18);
  }

  const pad = 96;
  const maxW = W - pad * 2;
  let y = 230;

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f2b230";
  ctx.font = `800 40px ${font}`;
  ctx.fillText("CRYPTO OSH", pad, y);
  ctx.fillStyle = "#a9b4cf";
  ctx.font = `600 34px ${font}`;
  ctx.fillText(`${labels.storyKicker} · ${date}`, pad, y + 56);

  y += 190;
  let size = 84;
  let lines: string[];
  for (;;) {
    ctx.font = `800 ${size}px ${font}`;
    lines = wrap(ctx, title, maxW, 9);
    if (lines.length <= 7 || size <= 60) break;
    size -= 6;
  }
  ctx.fillStyle = "#eef1f8";
  const lh = Math.round(size * 1.18);
  for (const l of lines) {
    y += lh;
    ctx.fillText(l, pad, y);
  }

  y += 70;
  ctx.fillStyle = "#f2b230";
  ctx.fillRect(pad, y, 120, 8);
  y += 30;

  ctx.font = `400 40px ${font}`;
  ctx.fillStyle = "#c9d1e6";
  const room = Math.max(2, Math.floor((H - 420 - y) / 56));
  for (const l of wrap(ctx, summary, maxW, Math.min(room, 7))) {
    y += 56;
    ctx.fillText(l, pad, y);
  }

  // Bottom block: where to read the full article.
  const boxY = H - 330;
  ctx.fillStyle = "rgba(242, 178, 48, 0.12)";
  ctx.strokeStyle = "rgba(242, 178, 48, 0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(pad, boxY, maxW, 200, 28);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#eef1f8";
  ctx.font = `600 38px ${font}`;
  ctx.fillText(labels.storyCta, pad + 44, boxY + 80);
  ctx.fillStyle = "#f2b230";
  ctx.font = `800 52px ${font}`;
  ctx.fillText(new URL(url).host, pad + 44, boxY + 152);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

export function ArticleShare(props: Props) {
  const { url, title, labels } = props;
  const [note, setNote] = useState<string | null>(null);
  const story = useRef<File | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Drawn ahead of the click: Safari only opens the share sheet when share()
  // runs straight from the tap, with no await before it.
  useEffect(() => {
    let live = true;
    drawStory(props).then((blob) => {
      if (live && blob) story.current = new File([blob], "cryptoosh-story.png", { type: "image/png" });
    });
    return () => {
      live = false;
      clearTimeout(timer.current);
    };
  }, [url, title]);

  const flash = (msg: string) => {
    setNote(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(null), 6000);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      flash(labels.copied);
    } catch {
      flash(url);
    }
  };

  const download = (file: File) => {
    const href = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = href;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  };

  const stories = async () => {
    const file = story.current;
    if (!file) return;
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    download(file);
    flash(labels.storySaved);
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
        <button type="button" className="article-share-btn share-instagram" onClick={stories}>
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
    </div>
  );
}
