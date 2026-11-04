// Texts for the paid Crypto Osh community block shown on every page. The
// free @soulweb news channel has its own block (ChannelCta); this one leads
// to the paid Telegram group, joined through the taps.uz bot.
// Perks follow the CryptoOsh roadmap 2026–2027, section 4 "Платная
// Telegram-группа": a daily expert slot at 20:00 with a topic per weekday.

import type { Locale } from "@/lib/i18n";

type CommunityText = {
  kicker: string;
  title: string;
  lead: string;
  perks: { icon: string; text: string }[];
  weekTitle: string;
  week: { day: string; topic: string }[];
  price: string;
  priceNote: string;
  button: string;
  note: string;
  // The thin strip above the header on every page.
  bar: string;
  barShort: string;
  barButton: string;
};

const uz: CommunityText = {
  kicker: "Crypto Osh hamjamiyati",
  title: "Har oqshom ekspert bilan, kriptanlar davrasida",
  lead: "Kanalda nima bo'lganini o'qiysiz. Guruhda esa u bilan nima qilishni ekspertlardan so'raysiz va butun O'zbekistondagi treyderlar, web3 dasturchilar va tadbirkorlar bilan tanishasiz.",
  perks: [
    { icon: "🎙", text: "Har kuni soat 20:00 da ekspert: post, ovozli xabar yoki qisqa efir" },
    { icon: "❓", text: "Savolingizni to'g'ridan-to'g'ri ekspertga berasiz" },
    { icon: "🤝", text: "Networking: treyderlar, dasturchilar va tadbirkorlar bilan jonli muloqot" },
    { icon: "🍚", text: "Meetup va Crypto Osh uchrashuvlari e'lonlari guruhda" },
    { icon: "📌", text: "Kurs, yangiliklar, ekspertlar va gaydlar bir joyda, zakrepda" },
    { icon: "🛡", text: "Reklama, skam va «signal»larsiz, faqat foydali suhbat" },
  ],
  weekTitle: "Hafta jadvali",
  week: [
    { day: "Du", topic: "Haftaning bozori: BTC, ETH, USDT so'mda" },
    { day: "Se", topic: "Qonun, NAPP va soliqlar" },
    { day: "Chor", topic: "Blokcheyn va Web3 amalda" },
    { day: "Pay", topic: "AI × kripto" },
    { day: "Ju", topic: "Moliya, investitsiya, biznes keyslari" },
    { day: "Sha", topic: "Xavfsizlik: skam, hamyon, P2P" },
    { day: "Ya", topic: "Hafta dayjesti" },
  ],
  price: "12 000 so'm / oy",
  priceNote: "≈ 1 $, bir piyola choy narxida",
  button: "Hamjamiyatga qo'shilish",
  note: "To'lov va guruhga kirish Telegram'dagi taps.uz boti orqali.",
  bar: "Har oqshom 20:00 da ekspert va kriptanlar davrasi",
  barShort: "Hamjamiyat",
  barButton: "Qo'shilish · 12 000 so'm/oy",
};

const ru: CommunityText = {
  kicker: "Комьюнити Crypto Osh",
  title: "Каждый вечер эксперт, вокруг свои криптаны",
  lead: "В канале вы читаете, что случилось. В группе спрашиваете экспертов, что с этим делать, и знакомитесь с трейдерами, Web3-разработчиками и предпринимателями со всего Узбекистана.",
  perks: [
    { icon: "🎙", text: "Каждый день в 20:00 эксперт: пост, голосовое или короткий эфир" },
    { icon: "❓", text: "Свой вопрос можно задать эксперту напрямую" },
    { icon: "🤝", text: "Нетворкинг: живое общение с трейдерами, разработчиками и бизнесом" },
    { icon: "🍚", text: "Анонсы митапов и встреч Crypto Osh прямо в группе" },
    { icon: "📌", text: "Курс, новости, эксперты и гайды собраны в закрепе" },
    { icon: "🛡", text: "Без рекламы, скама и «сигналов», только польза" },
  ],
  weekTitle: "Расписание недели",
  week: [
    { day: "Пн", topic: "Рынок недели: BTC, ETH, USDT в сумах" },
    { day: "Вт", topic: "Закон, НАПП, налоги" },
    { day: "Ср", topic: "Блокчейн и Web3 на практике" },
    { day: "Чт", topic: "AI × крипта" },
    { day: "Пт", topic: "Финансы, инвестиции, кейсы бизнеса" },
    { day: "Сб", topic: "Безопасность: скамы, кошельки, P2P" },
    { day: "Вс", topic: "Дайджест недели" },
  ],
  price: "12 000 сум / месяц",
  priceNote: "≈ 1 $, как чашка чая в чайхане",
  button: "Вступить в комьюнити",
  note: "Оплата и вход в группу через бота taps.uz в Telegram.",
  bar: "Платное комьюнити Crypto Osh: эксперт каждый вечер в 20:00",
  barShort: "Комьюнити",
  barButton: "Вступить · 12 000 сум/мес",
};

const en: CommunityText = {
  kicker: "Crypto Osh community",
  title: "An expert every evening, among your own crypto people",
  lead: "The channel tells you what happened. In the group you ask experts what to do about it and meet traders, Web3 builders and founders from all over Uzbekistan.",
  perks: [
    { icon: "🎙", text: "An expert every day at 20:00: a post, a voice note or a short live" },
    { icon: "❓", text: "Ask the experts your own questions directly" },
    { icon: "🤝", text: "Networking with traders, developers and business people" },
    { icon: "🍚", text: "Meetup and Crypto Osh announcements right in the group" },
    { icon: "📌", text: "Rates, news, experts and guides gathered in the pinned post" },
    { icon: "🛡", text: "No ads, no scams, no “signals”, just useful talk" },
  ],
  weekTitle: "Weekly schedule",
  week: [
    { day: "Mon", topic: "Market of the week: BTC, ETH, USDT in UZS" },
    { day: "Tue", topic: "Law, NAPP, taxes" },
    { day: "Wed", topic: "Blockchain and Web3 in practice" },
    { day: "Thu", topic: "AI × crypto" },
    { day: "Fri", topic: "Finance, investing, business cases" },
    { day: "Sat", topic: "Security: scams, wallets, P2P" },
    { day: "Sun", topic: "Weekly digest" },
  ],
  price: "12,000 UZS / month",
  priceNote: "≈ $1, the price of a cup of tea",
  button: "Join the community",
  note: "Payment and access to the group go through the taps.uz bot on Telegram.",
  bar: "Crypto Osh community: an expert every evening at 20:00",
  barShort: "Community",
  barButton: "Join · 12,000 UZS/mo",
};

export const communityText: Record<Locale, CommunityText> = { uz, ru, en };
