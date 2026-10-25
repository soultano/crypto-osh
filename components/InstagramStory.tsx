"use client";

import { useEffect, useRef, useState } from "react";
import type { StoryLabels } from "@/content/story";

// Instagram has no web link that opens Stories with a picture, so we draw a
// 1080x1920 story card and hand it to the phone's share sheet, where Instagram
// offers "Stories". The sheet is only offered on phones: on a computer it has
// no Instagram. Where the browser cannot share files (Telegram's and
// Instagram's in-app browsers, computers) a window shows the card to save,
// with a button that opens the Stories camera.

export type StoryCard = {
  kicker: string;
  title: string;
  // Lines break at "\n".
  body: string;
  cta: string;
  url: string;
};

const W = 1080;
const H = 1920;

// Splits text into lines that fit maxWidth; the last line gets an ellipsis
// when the text does not fit in maxLines.
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= maxWidth || !line) {
        line = next;
        continue;
      }
      lines.push(line);
      line = word;
    }
    if (line) lines.push(line);
  }
  if (lines.length <= maxLines) return lines;
  const cut = lines.slice(0, maxLines);
  let last = cut[maxLines - 1];
  while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
  cut[maxLines - 1] = `${last.trimEnd()}…`;
  return cut;
}

function drawStory({ kicker, title, body, cta, url }: StoryCard): Promise<Blob | null> {
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
  ctx.fillText(kicker, pad, y + 56);

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
  for (const l of wrap(ctx, body, maxW, Math.min(room, 7))) {
    y += 56;
    ctx.fillText(l, pad, y);
  }

  // Bottom block: where to read the rest. It sits above the area Instagram
  // covers with its reply bar.
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
  ctx.fillText(cta, pad + 44, boxY + 80);
  ctx.fillStyle = "#f2b230";
  ctx.font = `800 52px ${font}`;
  ctx.fillText(new URL(url).host, pad + 44, boxY + 152);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

type Phone = "ios" | "android" | null;

function phone(): Phone {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  // iPadOS reports itself as a Mac with a touch screen.
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return null;
}

// Opens Instagram on the Stories camera; Android needs an intent link, as
// Chrome does not follow unknown schemes from a page.
function instagramLink(p: Phone): string {
  if (p === "android") return "intent://story-camera#Intent;scheme=instagram;package=com.instagram.android;S.browser_fallback_url=https%3A%2F%2Fwww.instagram.com%2F;end";
  if (p === "ios") return "instagram://story-camera";
  return "https://www.instagram.com/";
}

// Returns the click handler for the Instagram button and the window it opens
// when the phone cannot take the card through its share sheet.
export function useInstagramStory(card: StoryCard, labels: StoryLabels, flash: (msg: string) => void) {
  const file = useRef<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [device, setDevice] = useState<Phone>(null);

  // Drawn ahead of the click: Safari only opens the share sheet when share()
  // runs straight from the tap, with no await before it.
  useEffect(() => {
    setDevice(phone());
    let live = true;
    let href: string | null = null;
    drawStory(card).then((blob) => {
      if (!live || !blob) return;
      file.current = new File([blob], "cryptoosh-story.png", { type: "image/png" });
      href = URL.createObjectURL(blob);
      setSrc(href);
    });
    return () => {
      live = false;
      if (href) URL.revokeObjectURL(href);
    };
  }, [card.kicker, card.title, card.body, card.cta, card.url]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const share = async () => {
    const f = file.current;
    // Only the file goes to the share sheet: with a link or text alongside,
    // Instagram offers only Direct, not Stories.
    if (f && device && navigator.canShare?.({ files: [f] })) {
      try {
        await navigator.share({ files: [f] });
        flash(labels.tip);
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    setCopied(false);
    setOpen(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(card.url);
      setCopied(true);
    } catch {
      flash(card.url);
    }
  };

  const sheet = open ? (
    <div className="story-sheet" role="dialog" aria-modal="true" aria-label={labels.title} onClick={() => setOpen(false)}>
      <div className="story-sheet-box" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="story-sheet-close" onClick={() => setOpen(false)} aria-label={labels.close}>
          ×
        </button>
        <p className="story-sheet-title">{labels.title}</p>
        {src && <img className="story-sheet-img" src={src} alt={card.title} />}
        <p className="story-sheet-hint">{device ? labels.hold : labels.desktop}</p>
        <div className="story-sheet-actions">
          {device && (
            <a className="story-sheet-btn story-sheet-ig" href={instagramLink(device)}>
              {labels.open}
            </a>
          )}
          {src && (
            <a className="story-sheet-btn" href={src} download="cryptoosh-story.png">
              {labels.download}
            </a>
          )}
          <button type="button" className="story-sheet-btn" onClick={copy}>
            {copied ? labels.copied : labels.copy}
          </button>
        </div>
        <p className="story-sheet-steps">{labels.steps}</p>
      </div>
    </div>
  ) : null;

  return { share, sheet };
}
