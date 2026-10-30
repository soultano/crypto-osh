"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Blocks that rise into place as they scroll into view. Anything already on
// screen when the page opens is left alone, so nothing above the fold blinks.
const targets = [
  ".section-head",
  ".tile",
  ".card-plain",
  ".person-card",
  ".news-card",
  ".video-card",
  ".gallery figure",
  ".split > *",
  ".founder > *",
  ".offer-banner",
  ".stat",
  ".includes li",
  ".package",
  ".steps li",
  ".faq details",
  ".timeline li",
  ".table-card",
  ".converter",
  ".contact-inner > *",
  ".dastarkhan-item",
  ".art-scene",
].join(",");

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("motion");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const fold = window.innerHeight;
    document.querySelectorAll<HTMLElement>(targets).forEach((el) => {
      if (el.classList.contains("in")) return;
      if (!el.classList.contains("rv")) {
        if (el.getBoundingClientRect().top < fold) return;
        // Siblings in a grid arrive one after another.
        const index = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.setProperty("--rv-i", String(Math.min(index, 6)));
        el.classList.add("rv");
      }
      io.observe(el);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
