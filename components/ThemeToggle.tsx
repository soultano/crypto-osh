"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { themeColors } from "@/lib/theme";

// Light by default; the choice is kept in localStorage. The inline script in
// the layout sets <html data-theme> before paint, so this button only flips it.
// Both icons are rendered and CSS shows the one for the current theme, so the
// server HTML never has to know which theme the visitor picked.

function setChromeColor(theme: "light" | "dark") {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[theme]);
}

const labels: Record<Locale, string> = {
  uz: "Yorug‘ yoki tungi rejim",
  ru: "Светлая или тёмная тема",
  en: "Light or dark theme",
};

export function ThemeToggle({ locale }: { locale: Locale }) {
  // The browser bar follows a stored dark choice too.
  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") setChromeColor("dark");
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setChromeColor(next);
  };

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={labels[locale]} title={labels[locale]}>
      <svg className="theme-icon-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M20.2 14.6A8.5 8.5 0 0 1 9.4 3.8a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 20.9 15.4a.6.6 0 0 0-.7-.8Z" />
      </svg>
      <svg className="theme-icon-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
        />
      </svg>
    </button>
  );
}
