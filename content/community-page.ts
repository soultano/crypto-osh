// Texts for the /community page: the full, warming pitch for the paid
// Telegram expert group (12 000 UZS a month, joined through the taps.uz bot).
// The strip above the header and the block at the bottom of every page lead
// here. Facts follow the roadmap 2026–2027, section 4: an expert every day at
// 20:00, a topic per weekday, a pinned post with useful links. The chat on the
// page is an illustration and is labelled as one.

import type { Locale } from "@/lib/i18n";

type Msg = { who: string; role?: "expert" | "member"; text: string; time: string };

export type CommunityPage = {
  nav: string;
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  priceLabel: string;
  price: string;
  priceNote: string;
  join: string;
  more: string;
  trust: string[];

  painTitle: string;
  painIntro: string;
  pains: { icon: string; title: string; text: string }[];

  insideTitle: string;
  insideIntro: string;
  inside: { icon: string; title: string; text: string }[];

  chatTitle: string;
  chatGroup: string;
  chatMembers: string;
  chatLabel: string;
  chat: Msg[];

  expertsTitle: string;
  expertsIntro: string;
  expertsLink: string;
  weekTitle: string;

  priceTitle: string;
  priceIntro: string;
  math: { value: string; label: string }[];
  includedTitle: string;
  included: string[];

  stepsTitle: string;
  steps: { title: string; text: string }[];

  faqTitle: string;
  faq: { q: string; a: string }[];

  finalTitle: string;
  finalText: string;
  disclaimer: string;
};

const ru: CommunityPage = {
  nav: "Комьюнити",
  seoTitle: "Telegram-группа с блокчейн-экспертами за 12 000 сум в месяц",
  seoDescription:
    "Закрытая Telegram-группа Crypto Osh: эксперты каждый вечер в 20:00, разборы блокчейн-проектов, ответы на ваши вопросы и нетворкинг. 12 000 сум в месяц.",
  eyebrow: "Закрытая Telegram-группа Crypto Osh",
  title: "Прежде чем вложиться в проект, спросите тех, кто в блокчейне годами",
  lead: "В нашей Telegram-группе собраны блокчейн-специалисты, трейдеры, инвесторы и Web3-разработчики Узбекистана. Мы вместе разбираем проекты и токены, эксперты говорят, что думают, без рекламы и «сигналов», а вы задаёте свои вопросы напрямую.",
  priceLabel: "Подписка",
  price: "12 000 сум / месяц",
  priceNote: "≈ 400 сум в день, дешевле чашки чая",
  join: "Вступить в группу",
  more: "Что внутри",
  trust: ["Эксперт каждый вечер в 20:00", "Без рекламы, скама и «сигналов»", "Вход через бота в Telegram"],

  painTitle: "Знакомо?",
  painIntro: "Крипта в одиночку — это постоянные сомнения. Группа нужна, чтобы решать их не наугад.",
  pains: [
    {
      icon: "🤔",
      title: "Каждый день «новый перспективный проект»",
      text: "Блогеры обещают иксы, в чатах хвалят токен. Как понять, где проект, а где красивая обёртка для чужой выгоды?",
    },
    {
      icon: "🙊",
      title: "Спросить толком некого",
      text: "В открытых чатах реклама и боты, друзья не в теме, а платные курсы продают мечту. Нужен честный ответ от практика.",
    },
    {
      icon: "💸",
      title: "Одна ошибка стоит дороже года подписки",
      text: "Скам-токен, фейковый P2P-обменник, слив на плече. Обычно хватало одного вопроса знающему человеку, чтобы этого не случилось.",
    },
  ],

  insideTitle: "Что происходит в группе",
  insideIntro: "Это не канал, который вы просто читаете. Это место, где обсуждают и отвечают.",
  inside: [
    {
      icon: "🔍",
      title: "Разборы блокчейн-проектов",
      text: "Приносите проект или токен, который вам предлагают. Вместе смотрим команду, токеномику, разлоки, аудит и реальную пользу.",
    },
    {
      icon: "🎙",
      title: "Эксперт каждый вечер в 20:00",
      text: "Пост, голосовое или короткий эфир на тему дня: рынок, закон и НАПП, Web3, AI, безопасность. Расписание ниже.",
    },
    {
      icon: "💬",
      title: "Мнения, а не новости",
      text: "Новости есть везде. Здесь эксперты говорят, что они о них думают и что бы сделали сами, и спорят между собой.",
    },
    {
      icon: "❓",
      title: "Ваши вопросы напрямую",
      text: "Как купить USDT безопасно, где хранить, как платить налоги, стоит ли заходить в проект. Спрашивайте, отвечают люди, которые это делают.",
    },
    {
      icon: "🤝",
      title: "Нетворкинг",
      text: "Трейдеры, разработчики, предприниматели и инвесторы со всего Узбекистана. Здесь находят партнёров, команду и работу.",
    },
    {
      icon: "🍚",
      title: "Встречи Crypto Osh",
      text: "Анонсы митапов и наших встреч за пловом первыми получают участники группы. Курс, гайды и ссылки собраны в закрепе.",
    },
  ],

  chatTitle: "Так выглядит разбор",
  chatGroup: "Crypto Osh · комьюнити",
  chatMembers: "эксперты онлайн",
  chatLabel: "Пример переписки",
  chat: [
    {
      who: "Азиз",
      role: "member",
      text: "Друзья, знакомый зовёт в новый токен, обещают x10 до конца месяца. Кто-нибудь смотрел?",
      time: "19:12",
    },
    {
      who: "Эксперт",
      role: "expert",
      text: "Посмотрел. 60% токенов у команды, первый разлок через три месяца, аудита нет. Я бы не заходил. Если очень хочется, только на сумму, которую не жалко потерять.",
      time: "19:20",
    },
    {
      who: "Нилуфар",
      role: "member",
      text: "Плюс сайт проекта зарегистрирован две недели назад. Спасибо, что разобрали!",
      time: "19:24",
    },
    {
      who: "Эксперт",
      role: "expert",
      text: "Сегодня в 20:00 покажу, как самому проверить токеномику любого проекта за пять минут 👇",
      time: "19:31",
    },
  ],

  expertsTitle: "Эксперты группы",
  expertsIntro: "Специалисты, разработчики и предприниматели, которые развивают блокчейн в Узбекистане. Они выступают в группе, разбирают проекты и отвечают на вопросы участников.",
  expertsLink: "Все люди блокчейна",
  weekTitle: "Расписание экспертов, каждый день в 20:00",

  priceTitle: "12 000 сум в месяц. Почему так недорого",
  priceIntro: "Мы хотим, чтобы честные ответы о крипте были доступны каждому, а не только тем, кто платит за курсы миллионы.",
  math: [
    { value: "≈ 400 сум", label: "в день" },
    { value: "30", label: "вечеров с экспертом в месяц" },
    { value: "144 000 сум", label: "за целый год, меньше одной ошибки со скам-токеном" },
  ],
  includedTitle: "В подписку входит",
  included: [
    "Доступ к закрытой Telegram-группе",
    "Эксперт каждый день в 20:00",
    "Разборы проектов, которые приносят участники",
    "Вопросы экспертам напрямую",
    "Закреп: курс, гайды, полезные ссылки",
    "Анонсы встреч и митапов Crypto Osh",
  ],

  stepsTitle: "Как вступить",
  steps: [
    { title: "Нажмите «Вступить в группу»", text: "Откроется наш бот taps.uz в Telegram." },
    { title: "Оплатите подписку", text: "12 000 сум в месяц, прямо в Telegram." },
    { title: "Заходите в группу", text: "Представьтесь, посмотрите закреп и задайте первый вопрос." },
  ],

  faqTitle: "Частые вопросы",
  faq: [
    {
      q: "Я новичок. Мне будет понятно?",
      a: "Да. Группа как раз для того, чтобы не разбираться в одиночку. Можно задавать самые простые вопросы: как купить первый USDT, где хранить, как не попасть на мошенников.",
    },
    {
      q: "Чем группа отличается от бесплатного канала?",
      a: "В канале мы публикуем новости и курс, его можно только читать. В группе идёт живое обсуждение: эксперты выступают каждый вечер, разбирают проекты и отвечают на ваши вопросы.",
    },
    {
      q: "Вы даёте сигналы или советуете, что покупать?",
      a: "Нет. Сигналов и платных «закрытых входов» здесь нет. Эксперты делятся мнением и опытом, показывают, на что смотреть, а решение всегда остаётся за вами.",
    },
    {
      q: "Как оплатить?",
      a: "Через бота taps.uz прямо в Telegram, в сумах. Сразу после оплаты бот сам открывает доступ в группу.",
    },
    {
      q: "Можно ли рассказать о своём проекте?",
      a: "Да, принесите его на разбор. Только будьте готовы к честной обратной связи: рекламу и накрутку мы не пропускаем.",
    },
  ],

  finalTitle: "Следующий вопрос о крипте задайте экспертам",
  finalText: "12 000 сум в месяц, и вы не один на один с рынком.",
  disclaimer: "Мнения экспертов в группе не являются инвестиционной рекомендацией. Решения о вложениях вы принимаете сами.",
};

const uz: CommunityPage = {
  nav: "Hamjamiyat",
  seoTitle: "Blokcheyn ekspertlari bilan Telegram guruh, oyiga 12 000 so'm",
  seoDescription:
    "Crypto Osh yopiq Telegram guruhi: har oqshom 20:00 da ekspert, blokcheyn loyihalari tahlili, savollaringizga javob va networking. Oyiga 12 000 so'm.",
  eyebrow: "Crypto Osh yopiq Telegram guruhi",
  title: "Loyihaga pul tikishdan oldin blokcheynda yillab ishlaganlardan so'rang",
  lead: "Telegram guruhimizda O'zbekistonning blokcheyn mutaxassislari, treyderlar, investorlar va Web3 dasturchilari bor. Loyiha va tokenlarni birga tahlil qilamiz, ekspertlar reklama va «signal»larsiz o'z fikrini aytadi, siz esa savolingizni to'g'ridan-to'g'ri berasiz.",
  priceLabel: "Obuna",
  price: "12 000 so'm / oy",
  priceNote: "kuniga ≈ 400 so'm, bir piyola choydan arzon",
  join: "Guruhga qo'shilish",
  more: "Ichida nima bor",
  trust: ["Har oqshom 20:00 da ekspert", "Reklama, skam va «signal»larsiz", "Telegram'dagi bot orqali kirish"],

  painTitle: "Tanishmi?",
  painIntro: "Kriptada yolg'iz bo'lish doimiy shubha degani. Guruh ularni taxminan emas, bilib hal qilish uchun kerak.",
  pains: [
    {
      icon: "🤔",
      title: "Har kuni «yangi istiqbolli loyiha»",
      text: "Blogerlar iks va'da qiladi, chatlarda tokenni maqtashadi. Qayerda haqiqiy loyiha, qayerda birovning foydasi uchun chiroyli o'ram, qanday bilasiz?",
    },
    {
      icon: "🙊",
      title: "So'raydigan odam yo'q",
      text: "Ochiq chatlarda reklama va botlar, do'stlar bu sohadan uzoq, pullik kurslar esa orzu sotadi. Amaliyotchidan halol javob kerak.",
    },
    {
      icon: "💸",
      title: "Bitta xato bir yillik obunadan qimmat",
      text: "Skam token, soxta P2P ayirboshlash, leverajda yo'qotish. Odatda bilimli odamga bitta savol berish buning oldini olishga yetardi.",
    },
  ],

  insideTitle: "Guruhda nima bo'ladi",
  insideIntro: "Bu shunchaki o'qiladigan kanal emas. Bu yerda muhokama qilishadi va javob berishadi.",
  inside: [
    {
      icon: "🔍",
      title: "Blokcheyn loyihalari tahlili",
      text: "Sizga taklif qilingan loyiha yoki tokenni olib keling. Jamoa, tokenomika, razlok, audit va real foydasini birga ko'ramiz.",
    },
    {
      icon: "🎙",
      title: "Har oqshom 20:00 da ekspert",
      text: "Kun mavzusida post, ovozli xabar yoki qisqa efir: bozor, qonun va NAPP, Web3, AI, xavfsizlik. Jadval pastda.",
    },
    {
      icon: "💬",
      title: "Yangilik emas, fikr",
      text: "Yangiliklar hamma joyda bor. Bu yerda ekspertlar ular haqida nima o'ylashini va o'zlari nima qilishini aytadi, o'zaro bahslashadi.",
    },
    {
      icon: "❓",
      title: "Savollaringiz to'g'ridan-to'g'ri",
      text: "USDT ni xavfsiz qanday olish, qayerda saqlash, soliqni qanday to'lash, loyihaga kirishga arziydimi. So'rang, buni qiladigan odamlar javob beradi.",
    },
    {
      icon: "🤝",
      title: "Networking",
      text: "Butun O'zbekistondan treyderlar, dasturchilar, tadbirkorlar va investorlar. Bu yerda hamkor, jamoa va ish topishadi.",
    },
    {
      icon: "🍚",
      title: "Crypto Osh uchrashuvlari",
      text: "Meetup va osh atrofidagi uchrashuvlarimiz e'lonlarini guruh a'zolari birinchi bo'lib oladi. Kurs, gaydlar va havolalar zakrepda.",
    },
  ],

  chatTitle: "Tahlil shunday ko'rinadi",
  chatGroup: "Crypto Osh · hamjamiyat",
  chatMembers: "ekspertlar onlayn",
  chatLabel: "Yozishma namunasi",
  chat: [
    {
      who: "Aziz",
      role: "member",
      text: "Do'stlar, tanishim yangi tokenga chaqiryapti, oy oxirigacha x10 va'da qilishyapti. Kimdir ko'rdimi?",
      time: "19:12",
    },
    {
      who: "Ekspert",
      role: "expert",
      text: "Ko'rdim. Tokenlarning 60% jamoada, birinchi razlok uch oydan keyin, audit yo'q. Men kirmasdim. Juda xohlasangiz, faqat yo'qotsangiz ham achinmaydigan summaga.",
      time: "19:20",
    },
    {
      who: "Nilufar",
      role: "member",
      text: "Yana loyiha sayti ikki hafta oldin ro'yxatdan o'tgan. Tahlil uchun rahmat!",
      time: "19:24",
    },
    {
      who: "Ekspert",
      role: "expert",
      text: "Bugun 20:00 da istalgan loyiha tokenomikasini besh daqiqada o'zingiz qanday tekshirishni ko'rsataman 👇",
      time: "19:31",
    },
  ],

  expertsTitle: "Guruh ekspertlari",
  expertsIntro: "O'zbekistonda blokcheynni rivojlantirayotgan mutaxassislar, dasturchilar va tadbirkorlar. Ular guruhda chiqish qiladi, loyihalarni tahlil qiladi va a'zolarning savollariga javob beradi.",
  expertsLink: "Barcha blokcheyn odamlari",
  weekTitle: "Ekspertlar jadvali, har kuni 20:00 da",

  priceTitle: "Oyiga 12 000 so'm. Nega bunchalik arzon",
  priceIntro: "Kripta haqida halol javoblar kurslarga millionlab to'laydiganlar uchungina emas, hamma uchun ochiq bo'lishini istaymiz.",
  math: [
    { value: "≈ 400 so'm", label: "kuniga" },
    { value: "30", label: "oyiga ekspert bilan oqshom" },
    { value: "144 000 so'm", label: "butun yilga, skam token bilan bitta xatodan kam" },
  ],
  includedTitle: "Obunaga kiradi",
  included: [
    "Yopiq Telegram guruhiga kirish",
    "Har kuni 20:00 da ekspert",
    "A'zolar olib kelgan loyihalar tahlili",
    "Ekspertlarga to'g'ridan-to'g'ri savol",
    "Zakrep: kurs, gaydlar, foydali havolalar",
    "Crypto Osh uchrashuv va meetup e'lonlari",
  ],

  stepsTitle: "Qanday qo'shilish mumkin",
  steps: [
    { title: "«Guruhga qo'shilish» tugmasini bosing", text: "Telegram'da taps.uz botimiz ochiladi." },
    { title: "Obunani to'lang", text: "Oyiga 12 000 so'm, to'g'ridan-to'g'ri Telegram'da." },
    { title: "Guruhga kiring", text: "O'zingizni tanishtiring, zakrepni ko'ring va birinchi savolingizni bering." },
  ],

  faqTitle: "Ko'p beriladigan savollar",
  faq: [
    {
      q: "Men yangi boshlovchiman. Tushunarli bo'ladimi?",
      a: "Ha. Guruh aynan yolg'iz o'zingiz tushunib yurmasligingiz uchun. Eng oddiy savollarni ham berish mumkin: birinchi USDT ni qanday olish, qayerda saqlash, firibgarlarga qanday tushmaslik.",
    },
    {
      q: "Guruh bepul kanaldan nimasi bilan farq qiladi?",
      a: "Kanalda yangiliklar va kursni chop etamiz, uni faqat o'qish mumkin. Guruhda jonli muhokama bor: ekspertlar har oqshom chiqadi, loyihalarni tahlil qiladi va savollaringizga javob beradi.",
    },
    {
      q: "Signal berasizmi yoki nima sotib olishni maslahat berasizmi?",
      a: "Yo'q. Bu yerda signal va pullik «yopiq kirish»lar yo'q. Ekspertlar fikr va tajribasini bo'lishadi, nimaga qarash kerakligini ko'rsatadi, qaror esa doim sizda.",
    },
    {
      q: "Qanday to'lanadi?",
      a: "Telegram'da taps.uz boti orqali, so'mda. To'lovdan so'ng bot darhol o'zi guruhga kirishni ochadi.",
    },
    {
      q: "O'z loyiham haqida gapirsam bo'ladimi?",
      a: "Ha, uni tahlilga olib keling. Faqat halol fikrga tayyor bo'ling: reklama va nakrutkani o'tkazmaymiz.",
    },
  ],

  finalTitle: "Kripta haqidagi keyingi savolingizni ekspertlarga bering",
  finalText: "Oyiga 12 000 so'm, va siz bozor bilan yolg'iz emassiz.",
  disclaimer: "Guruhdagi ekspertlar fikri investitsiya tavsiyasi emas. Sarmoya bo'yicha qarorni o'zingiz qabul qilasiz.",
};

const en: CommunityPage = {
  nav: "Community",
  seoTitle: "Telegram group with blockchain experts for 12,000 UZS a month",
  seoDescription:
    "The private Crypto Osh Telegram group: an expert every evening at 20:00, blockchain project reviews, answers to your questions and networking. 12,000 UZS a month.",
  eyebrow: "Private Crypto Osh Telegram group",
  title: "Before you put money into a project, ask people who have been in blockchain for years",
  lead: "Our Telegram group brings together blockchain specialists, traders, investors and Web3 developers from Uzbekistan. We review projects and tokens together, experts say what they really think, with no ads and no “signals”, and you ask your own questions directly.",
  priceLabel: "Subscription",
  price: "12,000 UZS / month",
  priceNote: "≈ 400 UZS a day, less than a cup of tea",
  join: "Join the group",
  more: "What's inside",
  trust: ["An expert every evening at 20:00", "No ads, scams or “signals”", "Join through a Telegram bot"],

  painTitle: "Sound familiar?",
  painIntro: "Doing crypto alone means constant doubt. The group is there so you settle it with knowledge, not guesswork.",
  pains: [
    {
      icon: "🤔",
      title: "A “promising new project” every day",
      text: "Bloggers promise 10x, chats praise a token. How do you tell a real project from a nice wrapper around someone else's profit?",
    },
    {
      icon: "🙊",
      title: "No one to really ask",
      text: "Open chats are full of ads and bots, friends aren't into it, paid courses sell a dream. You need an honest answer from a practitioner.",
    },
    {
      icon: "💸",
      title: "One mistake costs more than a year of membership",
      text: "A scam token, a fake P2P exchanger, a leveraged wipe-out. Usually one question to someone who knows would have prevented it.",
    },
  ],

  insideTitle: "What happens in the group",
  insideIntro: "It isn't a channel you just read. It's a place where people discuss and answer.",
  inside: [
    {
      icon: "🔍",
      title: "Blockchain project reviews",
      text: "Bring a project or token you've been offered. Together we look at the team, tokenomics, unlocks, audits and real use.",
    },
    {
      icon: "🎙",
      title: "An expert every evening at 20:00",
      text: "A post, a voice note or a short live on the day's topic: market, law and NAPP, Web3, AI, security. Schedule below.",
    },
    {
      icon: "💬",
      title: "Opinions, not news",
      text: "News is everywhere. Here experts say what they make of it and what they would do themselves, and they argue with each other.",
    },
    {
      icon: "❓",
      title: "Your questions, answered directly",
      text: "How to buy USDT safely, where to keep it, how taxes work, whether a project is worth it. Ask, and people who do this answer.",
    },
    {
      icon: "🤝",
      title: "Networking",
      text: "Traders, developers, founders and investors from all over Uzbekistan. People find partners, teams and jobs here.",
    },
    {
      icon: "🍚",
      title: "Crypto Osh meetups",
      text: "Group members hear first about meetups and our gatherings over plov. Rates, guides and links sit in the pinned post.",
    },
  ],

  chatTitle: "This is what a review looks like",
  chatGroup: "Crypto Osh · community",
  chatMembers: "experts online",
  chatLabel: "Sample conversation",
  chat: [
    {
      who: "Aziz",
      role: "member",
      text: "Friends, someone I know is inviting me into a new token, they promise 10x by the end of the month. Anyone looked at it?",
      time: "19:12",
    },
    {
      who: "Expert",
      role: "expert",
      text: "I did. The team holds 60% of the tokens, the first unlock is in three months, no audit. I wouldn't go in. If you really want to, only with money you can afford to lose.",
      time: "19:20",
    },
    {
      who: "Nilufar",
      role: "member",
      text: "Also, the project's website was registered two weeks ago. Thanks for the review!",
      time: "19:24",
    },
    {
      who: "Expert",
      role: "expert",
      text: "Tonight at 20:00 I'll show how to check any project's tokenomics yourself in five minutes 👇",
      time: "19:31",
    },
  ],

  expertsTitle: "The group's experts",
  expertsIntro: "Specialists, developers and entrepreneurs who build blockchain in Uzbekistan. They speak in the group, review projects and answer members' questions.",
  expertsLink: "All blockchain people",
  weekTitle: "Expert schedule, every day at 20:00",

  priceTitle: "12,000 UZS a month. Why so little",
  priceIntro: "We want honest answers about crypto to be open to everyone, not only to people who pay millions for courses.",
  math: [
    { value: "≈ 400 UZS", label: "a day" },
    { value: "30", label: "evenings with an expert each month" },
    { value: "144,000 UZS", label: "for a whole year, less than one scam-token mistake" },
  ],
  includedTitle: "The subscription includes",
  included: [
    "Access to the private Telegram group",
    "An expert every day at 20:00",
    "Reviews of projects members bring",
    "Direct questions to the experts",
    "Pinned post: rates, guides, useful links",
    "Crypto Osh meetup announcements",
  ],

  stepsTitle: "How to join",
  steps: [
    { title: "Tap “Join the group”", text: "Our taps.uz bot opens in Telegram." },
    { title: "Pay for the subscription", text: "12,000 UZS a month, right in Telegram." },
    { title: "Enter the group", text: "Say hello, read the pinned post and ask your first question." },
  ],

  faqTitle: "Questions",
  faq: [
    {
      q: "I'm a beginner. Will I follow?",
      a: "Yes. The group exists so you don't have to figure it out alone. Ask the simplest things: how to buy your first USDT, where to keep it, how not to get scammed.",
    },
    {
      q: "How is the group different from the free channel?",
      a: "The channel publishes news and rates, and you can only read it. The group is a live discussion: experts speak every evening, review projects and answer your questions.",
    },
    {
      q: "Do you give signals or tell people what to buy?",
      a: "No. There are no signals or paid “private entries” here. Experts share opinions and experience and show what to look at; the decision is always yours.",
    },
    {
      q: "How do I pay?",
      a: "Through the taps.uz bot right in Telegram, in UZS. Right after payment the bot opens access to the group automatically.",
    },
    {
      q: "Can I talk about my own project?",
      a: "Yes, bring it for a review. Just be ready for honest feedback: we don't let ads or hype through.",
    },
  ],

  finalTitle: "Ask your next crypto question to the experts",
  finalText: "12,000 UZS a month, and you're not alone with the market.",
  disclaimer: "Expert opinions in the group are not investment advice. You make your own investment decisions.",
};

export const communityPage: Record<Locale, CommunityPage> = { uz, ru, en };
