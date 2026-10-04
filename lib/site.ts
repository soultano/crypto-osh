// Public site settings. Contacts are intentionally empty until the team
// confirms them: empty values hide the matching buttons instead of linking
// to a guessed account.
export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://crypto-osh.vercel.app").replace(/\/$/, ""),
  name: "Crypto Osh",
  contacts: {
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || "", // e.g. https://t.me/cryptoosh
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    phone: process.env.NEXT_PUBLIC_PHONE || "", // e.g. +998901234567
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
