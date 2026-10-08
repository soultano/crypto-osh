"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { auctionText } from "@/content/auction";
import { locales, localeLabels, type Locale, type Dictionary } from "@/lib/i18n";

export function Header({ locale, nav }: { locale: Locale; nav: Dictionary["nav"] }) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const rest = pathname.split("/").slice(2).join("/");

  const links = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/business`, label: nav.business },
    { href: `/${locale}/auction`, label: auctionText[locale].nav },
    { href: `/${locale}/people`, label: nav.people },
    { href: `/${locale}/videos`, label: nav.videos },
  ];

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href={`/${locale}`} className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">₿</span>
          <span>
            Crypto <b>Osh</b>
          </span>
        </Link>

        <nav className={`nav ${open ? "is-open" : ""}`} aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : l.href !== `/${locale}` && pathname.startsWith(`${l.href}/`) ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href={`/${locale}#contact`} className="btn btn-small" onClick={() => setOpen(false)}>
            {nav.contact}
          </Link>
        </nav>

        <div className="header-tools">
          <div className="lang" role="group" aria-label="Language">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}${rest ? `/${rest}` : ""}`}
                hrefLang={l}
                aria-current={l === locale ? "true" : undefined}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>
          <button
            className="burger"
            aria-expanded={open}
            aria-label={nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
