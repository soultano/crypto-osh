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
  // Optional "why in this section" paragraph; the block is hidden when absent.
  why?: string;
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
  {
    slug: "sarvar-rasulev",
    photo: "/people/sarvar-rasulev.webp",
    ogImage: "/people/sarvar-rasulev-og.jpg",
    cardTags: [1, 5, 3, 0],
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/sarvarrasulev" },
      { label: "Instagram", url: "https://instagram.com/sarvar.rasulev" },
      { label: "Telegram", url: "https://t.me/mr_bitcoin_game" },
      { label: "YouTube", url: "https://youtube.com/@sarvarcrypto" },
    ],
    text: {
      ru: {
        name: "Sarvar Rasulev",
        role: "Предприниматель и инвестор в сфере финансов, blockchain, AI и технологических продуктов",
        metaDescription: "Sarvar Rasulev — предприниматель и инвестор: более 15 лет в финансах и инвестициях, около 8 лет в blockchain. AI, fintech и технологическое предпринимательство.",
        short:
          "Sarvar Rasulev — предприниматель и инвестор с более чем 15-летним опытом в финансах, инвестициях и развитии бизнеса. Около 8 лет работает с blockchain и цифровыми активами. Сегодня его основные интересы находятся на пересечении финансов, AI, fintech, blockchain и технологического предпринимательства.",
        bio: [
          "Sarvar Rasulev — предприниматель, инвестор и специалист в области финансовых рынков, blockchain, цифровых активов и новых технологий.",
          "Имеет более 15 лет профессионального опыта в инвестициях, финансовом анализе, рынках капитала, управлении портфелями, развитии бизнеса и руководстве компаниями. Последние около 8 лет активно работает с криптовалютами и blockchain-индустрией.",
          "Его опыт объединяет традиционные финансы и новые технологии: инвестиции, digital assets, fintech, blockchain, AI, data-driven продукты и технологическое предпринимательство. Занимается созданием и развитием новых бизнесов, инвестиционным анализом, стратегическими партнерствами и развитием продуктов.",
          "Отдельное направление его деятельности — развитие международных партнерств и связей между глобальными технологическими компаниями и рынком Узбекистана и Центральной Азии.",
          "Sarvar также имеет значительный опыт в медиа и развитии digital-аудиторий. Это позволяет ему совмещать создание технологических и финансовых продуктов с их продвижением, построением сообществ, развитием партнерской сети и выходом на массовую аудиторию.",
          "В настоящее время особое внимание уделяет направлениям на пересечении AI × Finance × Blockchain, а также инвестициям, venture ecosystem и развитию технологического предпринимательства в Узбекистане.",
        ],
        directions: [
          "Investments & Capital Markets",
          "Blockchain & Web3",
          "Digital Assets",
          "FinTech",
          "Artificial Intelligence",
          "AI × Finance",
          "Technology Entrepreneurship",
          "Venture & Startups",
          "Trading & Financial Markets",
          "Business Development",
          "Strategic Partnerships",
          "Digital Media & Community Building",
          "Uzbekistan & Central Asia Tech Ecosystem",
        ],
      },
      uz: {
        name: "Sarvar Rasulev",
        role: "Moliya, blokcheyn, AI va texnologik mahsulotlar sohasidagi tadbirkor va investor",
        metaDescription: "Sarvar Rasulev — tadbirkor va investor: moliya va investitsiyalarda 15 yildan ortiq, blokcheynda qariyb 8 yil tajriba. AI, fintech va texnologik tadbirkorlik.",
        short:
          "Sarvar Rasulev — moliya, investitsiyalar va biznesni rivojlantirish sohasida 15 yildan ortiq tajribaga ega tadbirkor va investor. Qariyb 8 yildan beri blokcheyn va raqamli aktivlar bilan ishlaydi. Bugungi kunda uning asosiy qiziqishlari moliya, AI, fintech, blokcheyn va texnologik tadbirkorlik kesishmasida.",
        bio: [
          "Sarvar Rasulev — tadbirkor, investor hamda moliya bozorlari, blokcheyn, raqamli aktivlar va yangi texnologiyalar sohasidagi mutaxassis.",
          "U investitsiyalar, moliyaviy tahlil, kapital bozorlari, portfellarni boshqarish, biznesni rivojlantirish va kompaniyalarga rahbarlik qilish bo'yicha 15 yildan ortiq kasbiy tajribaga ega. So'nggi qariyb 8 yil davomida kriptovalyutalar va blokcheyn sanoati bilan faol ishlaydi.",
          "Uning tajribasi an'anaviy moliya va yangi texnologiyalarni birlashtiradi: investitsiyalar, raqamli aktivlar, fintech, blokcheyn, AI, ma'lumotlarga asoslangan (data-driven) mahsulotlar va texnologik tadbirkorlik. Yangi bizneslarni yaratish va rivojlantirish, investitsion tahlil, strategik hamkorliklar va mahsulotlarni rivojlantirish bilan shug'ullanadi.",
          "Faoliyatining alohida yo'nalishi — xalqaro hamkorliklarni hamda global texnologik kompaniyalar bilan O'zbekiston va Markaziy Osiyo bozori o'rtasidagi aloqalarni rivojlantirish.",
          "Sarvar media va raqamli auditoriyalarni rivojlantirishda ham katta tajribaga ega. Bu unga texnologik va moliyaviy mahsulotlar yaratishni ularni ilgari surish, hamjamiyatlar qurish, hamkorlar tarmog'ini kengaytirish va keng auditoriyaga chiqish bilan uyg'unlashtirish imkonini beradi.",
          "Hozirgi vaqtda AI × Finance × Blockchain kesishmasidagi yo'nalishlarga, shuningdek investitsiyalar, venchur ekotizimi va O'zbekistonda texnologik tadbirkorlikni rivojlantirishga alohida e'tibor qaratmoqda.",
        ],
        directions: [
          "Investments & Capital Markets",
          "Blockchain & Web3",
          "Digital Assets",
          "FinTech",
          "Artificial Intelligence",
          "AI × Finance",
          "Technology Entrepreneurship",
          "Venture & Startups",
          "Trading & Financial Markets",
          "Business Development",
          "Strategic Partnerships",
          "Digital Media & Community Building",
          "Uzbekistan & Central Asia Tech Ecosystem",
        ],
      },
      en: {
        name: "Sarvar Rasulev",
        role: "Entrepreneur and investor in finance, blockchain, AI and technology products",
        metaDescription: "Sarvar Rasulev is an entrepreneur and investor with 15+ years in finance and investment and about 8 years in blockchain, focused on AI, fintech and tech ventures.",
        short:
          "Sarvar Rasulev is an entrepreneur and investor with more than 15 years of experience in finance, investment and business development. He has worked with blockchain and digital assets for about 8 years. Today his main interests lie at the intersection of finance, AI, fintech, blockchain and tech entrepreneurship.",
        bio: [
          "Sarvar Rasulev is an entrepreneur, investor and specialist in financial markets, blockchain, digital assets and emerging technologies.",
          "He has more than 15 years of professional experience in investment, financial analysis, capital markets, portfolio management, business development and company leadership. For roughly the past 8 years he has been actively working with cryptocurrencies and the blockchain industry.",
          "His experience bridges traditional finance and new technology: investment, digital assets, fintech, blockchain, AI, data-driven products and tech entrepreneurship. He builds and grows new businesses and works on investment analysis, strategic partnerships and product development.",
          "A separate focus of his work is building international partnerships and connections between global technology companies and the markets of Uzbekistan and Central Asia.",
          "Sarvar also has extensive experience in media and growing digital audiences. This lets him combine building technology and financial products with promoting them, building communities, growing a partner network and reaching a mass audience.",
          "He currently gives particular attention to the intersection of AI × Finance × Blockchain, as well as investment, the venture ecosystem and the development of tech entrepreneurship in Uzbekistan.",
        ],
        directions: [
          "Investments & Capital Markets",
          "Blockchain & Web3",
          "Digital Assets",
          "FinTech",
          "Artificial Intelligence",
          "AI × Finance",
          "Technology Entrepreneurship",
          "Venture & Startups",
          "Trading & Financial Markets",
          "Business Development",
          "Strategic Partnerships",
          "Digital Media & Community Building",
          "Uzbekistan & Central Asia Tech Ecosystem",
        ],
      },
    },
  },
];

export function getPerson(slug: string): Person | undefined {
  return people.find((p) => p.slug === slug);
}
