"use client";

import { useState } from "react";

// Click-to-load YouTube embed: nothing is requested from YouTube's player
// (and no cookies are set) until the visitor presses play. Uses the
// privacy-enhanced youtube-nocookie.com domain.
export function VideoCard({
  id,
  title,
  city,
  playLabel,
}: {
  id: string;
  title: string;
  city: string;
  playLabel: string;
}) {
  const [active, setActive] = useState(false);
  const safeId = /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
  if (!safeId) return null;

  return (
    <article className="video-card">
      <div className="video-frame">
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${safeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
            allowFullScreen
          />
        ) : (
          <button className="video-poster" onClick={() => setActive(true)} aria-label={`${playLabel}: ${title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${safeId}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <div className="video-meta">
        <span className="chip">{city}</span>
        <h3>{title}</h3>
      </div>
    </article>
  );
}
