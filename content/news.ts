// Texts for the «Yangiliklar» news section and the crypto rates page, kept
// apart from the main dictionaries. The news articles themselves live in
// content/news/*.json and are written daily by scripts/news/generate.mts.

const uz = {
  nav: "Yangiliklar",
  kicker: "Kripto yangiliklar",
  title: "Kripto, blokcheyn va web3 yangiliklari",
  lead: "Har kuni O'zbekiston va dunyodagi eng muhim 3–4 ta kripto yangilik. Qisqa, tushunarli va o'zbekistonlik ko'zi bilan: bu biz uchun nima degani.",
  metaTitle: "Kripto yangiliklar bugun — bitcoin, blokcheyn, web3",
  metaDescription:
    "Bugungi eng muhim kripto yangiliklar o'zbek tilida: bitcoin, ethereum, blokcheyn va web3. Har bir yangilikda — O'zbekiston uchun bu nima degani.",
  take: "O'zbekiston uchun bu nima degani?",
  sources: "Manbalar",
  readMore: "O'qish",
  all: "Barcha yangiliklar",
  back: "Barcha yangiliklar",
  latest: "So'nggi yangiliklar",
  empty: "Yangiliklar tez orada paydo bo'ladi.",
  disclaimer: "Yangiliklar ma'lumot uchun berilgan va investitsiya tavsiyasi emas. Kriptovalyuta bilan faqat O'zbekistonda litsenziyaga ega provayderlar orqali ishlang.",
  telegram: "Yangiliklarni Telegramda kuzatish",
  pricesNav: "Kurs",
  share: "Ulashish:",
  shareTelegram: "Telegram",
  shareStories: "Instagram Stories",
  shareCopy: "Havolani nusxalash",
  shareCopied: "Havola nusxalandi",
  storyKicker: "Yangiliklar",
  storyCta: "To'liq maqola saytda:",
  storySaved: "Rasm saqlandi. Instagram'da Story oching, rasmni qo'shing va «Link» stikeri bilan maqola havolasini qo'ying.",
};

const ru: typeof uz = {
  nav: "Новости",
  kicker: "Крипто-новости",
  title: "Новости крипты, блокчейна и web3",
  lead: "Каждый день 3–4 главные крипто-новости Узбекистана и мира. Коротко, понятно и глазами узбекистанца: что это значит для нас.",
  metaTitle: "Крипто-новости сегодня — биткоин, блокчейн, web3",
  metaDescription:
    "Главные крипто-новости дня: биткоин, эфир, блокчейн и web3. В каждой новости — что это значит для Узбекистана.",
  take: "Что это значит для Узбекистана?",
  sources: "Источники",
  readMore: "Читать",
  all: "Все новости",
  back: "Все новости",
  latest: "Свежие новости",
  empty: "Новости скоро появятся.",
  disclaimer: "Новости носят информационный характер и не являются инвестиционной рекомендацией. Работайте с криптовалютой только через провайдеров, лицензированных в Узбекистане.",
  telegram: "Следить за новостями в Telegram",
  pricesNav: "Курс",
  share: "Поделиться:",
  shareTelegram: "Telegram",
  shareStories: "Instagram Stories",
  shareCopy: "Копировать ссылку",
  shareCopied: "Ссылка скопирована",
  storyKicker: "Новости",
  storyCta: "Полная статья на сайте:",
  storySaved: "Картинка сохранена. Откройте Story в Instagram, добавьте её и прикрепите ссылку на статью стикером «Ссылка».",
};

const en: typeof uz = {
  nav: "News",
  kicker: "Crypto news",
  title: "Crypto, blockchain and web3 news",
  lead: "Every day, the 3–4 top crypto stories from Uzbekistan and the world. Short, clear and seen from Uzbekistan: what it means for us.",
  metaTitle: "Crypto news today — bitcoin, blockchain, web3",
  metaDescription:
    "Today's top crypto news: bitcoin, ether, blockchain and web3. Every story explains what it means for Uzbekistan.",
  take: "What it means for Uzbekistan",
  sources: "Sources",
  readMore: "Read",
  all: "All news",
  back: "All news",
  latest: "Latest news",
  empty: "News is coming soon.",
  disclaimer: "News is for information only and is not investment advice. Use only crypto providers licensed in Uzbekistan.",
  telegram: "Follow the news on Telegram",
  pricesNav: "Rates",
  share: "Share:",
  shareTelegram: "Telegram",
  shareStories: "Instagram Stories",
  shareCopy: "Copy link",
  shareCopied: "Link copied",
  storyKicker: "News",
  storyCta: "Read the full article at:",
  storySaved: "Image saved. Open a Story in Instagram, add the image and attach the article with a Link sticker.",
};

export const newsText = { uz, ru, en };

const pricesUz = {
  kicker: "Kripto kurslari",
  title: "Kripto narxi so'mda",
  lead: "Bitcoin, Ethereum, USDT va boshqa mashhur kriptovalyutalarning bugungi narxi so'mda va dollarda. Narxlar har 10 daqiqada yangilanadi.",
  metaTitle: "Bitcoin narxi so'mda bugun — kripto kurslari",
  metaDescription:
    "Bitcoin, Ethereum, USDT, TON va boshqa kriptovalyutalarning bugungi narxi so'mda. 1 bitcoin necha so'm, kalkulyator va Markaziy bank dollar kursi.",
  coin: "Kriptovalyuta",
  priceUzs: "Narx, so'm",
  priceUsd: "Narx, $",
  change: "24 soat",
  updated: "Yangilangan",
  usdRate: "Markaziy bank kursi: 1 $ =",
  unavailable: "Narxlarni hozir olib bo'lmadi. Bir necha daqiqadan keyin sahifani yangilang.",
  calc: "Kalkulyator",
  currency: "so'm",
  amount: "Miqdor",
  result: "Natija",
  faqTitle: "Ko'p beriladigan savollar",
  faq: (btc: string, usdt: string) => [
    { q: "1 bitcoin necha so'm?", a: `Hozir 1 BTC taxminan ${btc} so'm turadi. Narx dollar narxi va Markaziy bank kursidan hisoblanadi.` },
    { q: "1 USDT necha so'm?", a: `1 USDT taxminan ${usdt} so'm. Birjalar va P2P'da narx biroz farq qilishi mumkin.` },
    {
      q: "O'zbekistonda kriptovalyutani qayerda sotib olish mumkin?",
      a: "Faqat Perspektiv loyihalar milliy agentligi (NAPP) litsenziyasiga ega kripto-birjalar va do'konlar orqali. Litsenziyasiz platformalar orqali ishlash qonunga zid va xavfli.",
    },
  ],
  source: "Manba: CoinGecko (dollar narxi) va O'zbekiston Markaziy banki (dollar kursi). Ma'lumot uchun, investitsiya tavsiyasi emas.",
  newsLink: "Bugungi kripto yangiliklar",
  allPrices: "Barcha kurslar va kalkulyator",
};

const pricesRu: typeof pricesUz = {
  kicker: "Курс криптовалют",
  title: "Курс крипты в сумах",
  lead: "Сегодняшняя цена биткоина, эфира, USDT и других популярных криптовалют в сумах и долларах. Цены обновляются каждые 10 минут.",
  metaTitle: "Курс биткоина в сумах сегодня — курсы криптовалют",
  metaDescription:
    "Курс биткоина, эфира, USDT, TON и других криптовалют в сумах на сегодня. Сколько стоит 1 биткоин в сумах, калькулятор и курс доллара ЦБ Узбекистана.",
  coin: "Криптовалюта",
  priceUzs: "Цена, сум",
  priceUsd: "Цена, $",
  change: "24 часа",
  updated: "Обновлено",
  usdRate: "Курс ЦБ: 1 $ =",
  unavailable: "Сейчас не удалось получить цены. Обновите страницу через несколько минут.",
  calc: "Калькулятор",
  currency: "сум",
  amount: "Количество",
  result: "Итого",
  faqTitle: "Частые вопросы",
  faq: (btc: string, usdt: string) => [
    { q: "Сколько стоит 1 биткоин в сумах?", a: `Сейчас 1 BTC стоит примерно ${btc} сум. Цена считается по долларовой цене и курсу ЦБ Узбекистана.` },
    { q: "Сколько стоит 1 USDT в сумах?", a: `1 USDT примерно ${usdt} сум. На биржах и в P2P цена может немного отличаться.` },
    {
      q: "Где купить криптовалюту в Узбекистане?",
      a: "Только через криптобиржи и магазины с лицензией Национального агентства перспективных проектов (НАПП). Работать через нелицензированные платформы незаконно и рискованно.",
    },
  ],
  source: "Источник: CoinGecko (цена в долларах) и ЦБ Узбекистана (курс доллара). Для информации, не инвестиционная рекомендация.",
  newsLink: "Крипто-новости сегодня",
  allPrices: "Все курсы и калькулятор",
};

const pricesEn: typeof pricesUz = {
  kicker: "Crypto rates",
  title: "Crypto prices in Uzbek som",
  lead: "Today's price of Bitcoin, Ether, USDT and other popular cryptocurrencies in som and dollars. Prices refresh every 10 minutes.",
  metaTitle: "Bitcoin price in UZS today — crypto rates",
  metaDescription:
    "Today's Bitcoin, Ether, USDT, TON and other crypto prices in Uzbek som. How much is 1 bitcoin in UZS, a converter and the Central Bank dollar rate.",
  coin: "Coin",
  priceUzs: "Price, UZS",
  priceUsd: "Price, $",
  change: "24h",
  updated: "Updated",
  usdRate: "Central Bank rate: $1 =",
  unavailable: "Prices are unavailable right now. Please refresh in a few minutes.",
  calc: "Converter",
  currency: "UZS",
  amount: "Amount",
  result: "Total",
  faqTitle: "FAQ",
  faq: (btc: string, usdt: string) => [
    { q: "How much is 1 bitcoin in Uzbek som?", a: `Right now 1 BTC is about ${btc} UZS, based on the dollar price and the Central Bank of Uzbekistan rate.` },
    { q: "How much is 1 USDT in som?", a: `1 USDT is about ${usdt} UZS. Exchange and P2P prices can differ slightly.` },
    {
      q: "Where can I buy crypto in Uzbekistan?",
      a: "Only through exchanges and shops licensed by the National Agency of Perspective Projects (NAPP). Using unlicensed platforms is illegal and risky.",
    },
  ],
  source: "Source: CoinGecko (dollar price) and the Central Bank of Uzbekistan (dollar rate). For information only, not investment advice.",
  newsLink: "Today's crypto news",
  allPrices: "All rates and calculator",
};

export const pricesText = { uz: pricesUz, ru: pricesRu, en: pricesEn };
