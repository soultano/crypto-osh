"use client";

import Script from "next/script";
import { useEffect } from "react";

// Google Analytics 4. Page views, sources, countries and devices come from GA
// itself (page changes are picked up from browser history). On top of that one
// listener names every click that leaves the page or shares it, so the reports
// show which share buttons, exchanges and contact links people press.

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const shareMethods = ["telegram", "whatsapp", "x", "facebook", "instagram", "copy"];

function describe(el: Element): Record<string, string> | null {
  const share = shareMethods.find((m) => el.classList.contains(`share-${m}`));
  if (share) return { event: "share", method: share };

  if (!(el instanceof HTMLAnchorElement)) return null;
  const href = el.getAttribute("href") || "";
  const text = (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 80);

  if (href.startsWith("tel:")) return { event: "contact_click", channel: "phone" };
  if (el.classList.contains("usdt-provider") || el.classList.contains("usdt-check")) {
    return { event: "partner_click", partner: el.hostname.replace(/^www\./, "") };
  }
  if (el.hostname === location.hostname) {
    return el.classList.contains("btn") ? { event: "cta_click", link_url: el.pathname + el.hash, link_text: text } : null;
  }
  if (el.hostname === "t.me") return { event: "contact_click", channel: href.includes("/+") ? "telegram_group" : "telegram", link_text: text };
  if (el.hostname.endsWith("instagram.com")) return { event: "contact_click", channel: "instagram", link_text: text };
  if (el.hostname.startsWith("yandex.")) return { event: "map_click", link_text: text };
  return { event: "outbound_click", link_domain: el.hostname, link_text: text };
}

export function Analytics({ id }: { id: string }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest("a, button");
      if (!el || typeof window.gtag !== "function") return;
      const info = describe(el);
      if (!info) return;
      const { event, ...params } = info;
      window.gtag("event", event, { ...params, page_path: location.pathname, transport_type: "beacon" });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag("js",new Date());gtag("config","${id}");`}
      </Script>
    </>
  );
}
