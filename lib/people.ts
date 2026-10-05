import type { Locale } from "./i18n";

// "Blockchain People": profiles of specialists in Uzbekistan's blockchain
// ecosystem. Only facts confirmed by the person or the community go here.
// To add someone: put a square portrait in public/people/, add an entry
// below with all three locales, and the list, profile page and sitemap
// pick it up.

type PersonText = {
  name: string;
  role: string;
  short: string;
  // ~150 characters for search results and link previews
  metaDescription: string;
  bio: string[];
  directions: string[];
  why: string;
};

export type Person = {
  slug: string;
  photo: string;
  ogImage: string;
  // Directions shown as chips on the card (indexes into `directions`).
  cardTags: number[];
  links: { label: string; url: string }[];
  text: Record<Locale, PersonText>;
};

export const people: Person[] = [
  {
    slug: "shakhruz-ashirov",
    photo: "/people/shakhruz-ashirov.webp",
    ogImage: "/people/shakhruz-ashirov-og.jpg",
    cardTags: [0, 1, 2, 5],
    links: [
      { label: "AshotAI", url: "https://ashotai.com/" },
      { label: "GitHub", url: "https://github.com/shakhruz" },
      { label: "LinkedIn", url: "https://uz.linkedin.com/in/ashotai" },
      { label: "Telegraph", url: "https://telegra.ph/SHahruz-Ashot-Ashirov-08-27" },
    ],
    text: {
      ru: {
        name: "Шахруз Ашот Аширов",
        role: "Разработчик и предприниматель в сфере AI, блокчейна и Web3",
        metaDescription: "Шахруз Ашот Аширов — разработчик и IT-предприниматель из Ташкента: AI, блокчейн, TON и Web3. Основатель MILAGPT и AshotAI.",
        short:
          "Шахруз Ашот Аширов — IT-предприниматель, разработчик и эксперт по искусственному интеллекту, блокчейн-технологиям и Web3 из Ташкента. Развивает решения на TON, исследует смарт-контракты, токенизацию и Web3-приложения. Основатель MILAGPT и AshotAI.",
        bio: [
          "Шахруз Ашот Аширов — разработчик, IT-предприниматель и популяризатор цифровых технологий из Узбекистана. Его профессиональная деятельность объединяет программирование, искусственный интеллект, блокчейн, виртуальную реальность и развитие цифрового бизнеса.",
          "Он занимается разработкой программного обеспечения и цифровых продуктов, работает с искусственным интеллектом, чат-ботами, автономными цифровыми системами и Web3-направлениями.",
          "В блокчейн-сфере Шахруз изучает TON, смарт-контракты, NFT, токенизацию и децентрализованные приложения. Его интересует не только криптовалюта как финансовый актив, но и блокчейн как инфраструктура для цифрового права собственности, программируемых соглашений, сообществ и новых бизнес-моделей.",
          "В публичных материалах Шахруз объясняет простым языком устройство криптокошельков, NFT, блокчейн-эксплореров и практические особенности цифровых активов.",
          "Сейчас он развивает MILAGPT — проект по созданию цифровых сотрудников и AI-агентов для бизнеса, а также AshotAI — технологическую платформу о программировании, искусственном интеллекте и цифровом предпринимательстве.",
        ],
        directions: [
          "Блокчейн и Web3",
          "TON",
          "Смарт-контракты",
          "Токенизация",
          "NFT",
          "Искусственный интеллект",
          "Цифровые сотрудники и AI-агенты",
          "Разработка программных продуктов",
          "Чат-боты",
          "Виртуальная и дополненная реальность",
          "Технологическое предпринимательство",
        ],
        why: "Шахруз представляет техническую и предпринимательскую сторону блокчейн-экосистемы. Его профиль объединяет разработку программных продуктов, изучение TON и Web3, популяризацию блокчейн-технологий и поиск практического применения децентрализованных решений в бизнесе.",
      },
      uz: {
        name: "Shahruz Ashot Ashirov",
        role: "Sun'iy intellekt, blokcheyn va Web3 sohasidagi dasturchi va tadbirkor",
        metaDescription: "Shahruz Ashot Ashirov — toshkentlik dasturchi va IT-tadbirkor: sun'iy intellekt, blokcheyn, TON va Web3. MILAGPT va AshotAI asoschisi.",
        short:
          "Shahruz Ashot Ashirov — toshkentlik IT-tadbirkor, dasturchi hamda sun'iy intellekt, blokcheyn texnologiyalari va Web3 bo'yicha ekspert. TON'da yechimlar ishlab chiqadi, smart-kontraktlar, tokenizatsiya va Web3 ilovalarini o'rganadi. MILAGPT va AshotAI asoschisi.",
        bio: [
          "Shahruz Ashot Ashirov — o'zbekistonlik dasturchi, IT-tadbirkor va raqamli texnologiyalar targ'ibotchisi. Uning kasbiy faoliyati dasturlash, sun'iy intellekt, blokcheyn, virtual reallik va raqamli biznesni rivojlantirishni birlashtiradi.",
          "U dasturiy ta'minot va raqamli mahsulotlar ishlab chiqadi, sun'iy intellekt, chat-botlar, avtonom raqamli tizimlar va Web3 yo'nalishlarida ishlaydi.",
          "Blokcheyn sohasida Shahruz TON, smart-kontraktlar, NFT, tokenizatsiya va markazlashmagan ilovalarni o'rganadi. Uni nafaqat moliyaviy aktiv sifatidagi kriptovalyuta, balki raqamli mulk huquqi, dasturlashtiriladigan kelishuvlar, hamjamiyatlar va yangi biznes modellari uchun infratuzilma sifatidagi blokcheyn ham qiziqtiradi.",
          "Ommaviy materiallarida Shahruz kripto hamyonlar, NFT va blokcheyn eksplorerlari qanday ishlashini hamda raqamli aktivlarning amaliy jihatlarini sodda tilda tushuntiradi.",
          "Hozir u MILAGPT — biznes uchun raqamli xodimlar va AI-agentlar yaratish loyihasini, shuningdek AshotAI — dasturlash, sun'iy intellekt va raqamli tadbirkorlik haqidagi texnologik platformani rivojlantirmoqda.",
        ],
        directions: [
          "Blokcheyn va Web3",
          "TON",
          "Smart-kontraktlar",
          "Tokenizatsiya",
          "NFT",
          "Sun'iy intellekt",
          "Raqamli xodimlar va AI-agentlar",
          "Dasturiy mahsulotlar ishlab chiqish",
          "Chat-botlar",
          "Virtual va to'ldirilgan reallik",
          "Texnologik tadbirkorlik",
        ],
        why: "Shahruz blokcheyn ekotizimining texnik va tadbirkorlik tomonini ifodalaydi. Uning profili dasturiy mahsulotlar ishlab chiqish, TON va Web3'ni o'rganish, blokcheyn texnologiyalarini ommalashtirish hamda markazlashmagan yechimlarning biznesda amaliy qo'llanilishini izlashni birlashtiradi.",
      },
      en: {
        name: "Shakhruz Ashot Ashirov",
        role: "Developer and entrepreneur in AI, blockchain and Web3",
        metaDescription: "Shakhruz Ashot Ashirov is a developer and IT entrepreneur from Tashkent working in AI, blockchain, TON and Web3. Founder of MILAGPT and AshotAI.",
        short:
          "Shakhruz Ashot Ashirov, from Tashkent, is an IT entrepreneur, developer and expert in artificial intelligence, blockchain technology and Web3. He builds solutions on TON and explores smart contracts, tokenization and Web3 applications. Founder of MILAGPT and AshotAI.",
        bio: [
          "Shakhruz Ashot Ashirov is a developer, IT entrepreneur and popularizer of digital technology from Uzbekistan. His work brings together programming, artificial intelligence, blockchain, virtual reality and digital business development.",
          "He develops software and digital products and works with artificial intelligence, chatbots, autonomous digital systems and Web3.",
          "In blockchain, Shakhruz explores TON, smart contracts, NFTs, tokenization and decentralized applications. He is interested not only in cryptocurrency as a financial asset, but also in blockchain as infrastructure for digital ownership, programmable agreements, communities and new business models.",
          "In his public materials, Shakhruz explains in plain language how crypto wallets, NFTs and blockchain explorers work, as well as the practical aspects of digital assets.",
          "He is currently developing MILAGPT, a project that builds digital employees and AI agents for business, and AshotAI, a technology platform about programming, artificial intelligence and digital entrepreneurship.",
        ],
        directions: [
          "Blockchain and Web3",
          "TON",
          "Smart contracts",
          "Tokenization",
          "NFTs",
          "Artificial intelligence",
          "Digital employees and AI agents",
          "Software product development",
          "Chatbots",
          "Virtual and augmented reality",
          "Tech entrepreneurship",
        ],
        why: "Shakhruz represents the technical and entrepreneurial side of the blockchain ecosystem. His profile combines software product development, exploring TON and Web3, popularizing blockchain technology, and finding practical uses for decentralized solutions in business.",
      },
    },
  },
];

export function getPerson(slug: string): Person | undefined {
  return people.find((p) => p.slug === slug);
}
