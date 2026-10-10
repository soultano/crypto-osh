// Public site settings. Env vars override the defaults; an empty phone
// hides the call button.
// Accept only https links to known hosts, so a mistyped or malicious env
// value can never become a javascript: or phishing link.
function safeUrl(value: string | undefined, hosts: string[]): string {
  if (!value) return "";
  try {
    const u = new URL(value);
    return u.protocol === "https:" && hosts.includes(u.hostname) ? u.toString() : "";
  } catch {
    return "";
  }
}

// Search console verification codes are short tokens; anything else is dropped.
function token(value: string | undefined): string {
  return value && /^[A-Za-z0-9_-]{1,100}$/.test(value) ? value : "";
}

export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://cryptoosh.uz").replace(/\/$/, ""),
  name: "Crypto Osh",
  contacts: {
    telegram: safeUrl(process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/Soultanov", ["t.me"]),
    // Community group: an invite link with join requests on, so the bot can
    // ask each newcomer to introduce themselves. Empty hides the button.
    group: safeUrl(process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL || "https://t.me/+CgPkX3WvirdhMTUy", ["t.me"]),
    instagram: safeUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/uzsoul/", ["instagram.com", "www.instagram.com"]),
    phone: process.env.NEXT_PUBLIC_PHONE || "", // e.g. +998901234567
  },
  // Google Search Console / Yandex Webmaster "meta tag" verification codes.
  verification: {
    google: token(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
    yandex: token(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION),
  },
};

export type Video = { id: string; title: string; city: Record<"ru" | "uz" | "en", string> };

// Titles are the original YouTube titles.
export const videos: Video[] = [
  {
    id: "m2ewyvtGetE",
    title: "Crypto Osh Xorazm — 120 odamlik eng katta kripto uchrashuv! Urganchda tarix yozildi!",
    city: { ru: "Хорезм, Ургенч", uz: "Xorazm, Urganch", en: "Khorezm, Urgench" },
  },
  {
    id: "w9Ms1TNDTEk",
    title: "Crypto Osh Farg'ona 2025 — osh, blockchain va networking",
    city: { ru: "Фергана", uz: "Farg'ona", en: "Fergana" },
  },
  {
    id: "dxaznL8ueF0",
    title: "Crypto-Ош Vol.5 | Samarqandda plov, kripto va kelajak trendlari",
    city: { ru: "Самарканд", uz: "Samarqand", en: "Samarkand" },
  },
  {
    id: "Y-AuLPLpM8k",
    title: "Crypto-Ош Vol.4 | BEK restoranida kripto trendlar, plov va netvork!",
    city: { ru: "Ресторан BEK", uz: "BEK restorani", en: "BEK restaurant" },
  },
];

export const photos = {
  poster: "/photos/photo-8055.webp",
  plov: "/photos/photo-2517.webp",
  plov2: "/photos/photo-6033.webp",
  group1: "/photos/photo-3844.webp",
  group2: "/photos/photo-3847.webp",
  groupOutdoor: "/photos/photo-4305.webp",
  founder: "/photos/photo-4281.webp",
};
