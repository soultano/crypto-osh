# Crypto Osh

Сайт сообщества и ассоциации криптоэнтузиастов Узбекистана «Крипто Ош».
Три языка: русский (`/ru`), узбекский (`/uz`), английский (`/en`).

Страницы: главная, «О нас» (история, основатель, миссия), «Бизнесу» (оффер под ключ от 29 млн сум), «Видео» (библиотека воспоминаний), «Аукцион» (почётная порция).

## Стек

- Next.js 16 (App Router), React 19, TypeScript. Все страницы статически пререндерятся.
- Без CSS-фреймворков и сторонних скриптов: минимум зависимостей, нет трекеров.
- Фото в `public/photos` пережаты в WebP, EXIF/GPS удалены, номер машины обрезан.

## Локально

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Где править

| Что | Файл |
| --- | --- |
| Тексты RU / UZ / EN | `content/ru.ts`, `content/uz.ts`, `content/en.ts` |
| Аукцион «Почётная порция»: дата, место, цены, ставки, `open` | `lib/auction.ts`, тексты в `content/auction.ts` |
| Видео (YouTube ID и подписи) | `lib/site.ts` → `videos` |
| Фото | `public/photos`, пути в `lib/site.ts` → `photos` |
| Контакты, домен | переменные окружения (см. ниже) |
| Цвета и стиль | `app/globals.css` (`:root`) |
| Заголовки безопасности, CSP | `next.config.ts` |

## Переменные окружения (Vercel → Settings → Environment Variables)

| Переменная | Пример |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://cryptoosh.uz` (по умолчанию) |
| `NEXT_PUBLIC_TELEGRAM_URL` | `https://t.me/Soultanov` (по умолчанию) |
| `NEXT_PUBLIC_INSTAGRAM_URL` | `https://www.instagram.com/uzsoul/` (по умолчанию) |
| `NEXT_PUBLIC_PHONE` | `+998901234567` |

Значения по умолчанию уже прописаны в `lib/site.ts`, переменные нужны только чтобы их поменять. Пустой телефон скрывает кнопку звонка. Секретов в проекте нет и быть не должно.

## Деплой на Vercel

1. vercel.com → **Add New → Project** → импортировать репозиторий `soultano/crypto-osh`.
2. Framework определится сам (Next.js). Переменные окружения можно не добавлять → **Deploy**.
3. **Settings → Domains** → добавить `cryptoosh.uz` и `www.cryptoosh.uz` (www настроить как редирект на `cryptoosh.uz`).

## DNS у регистратора (billur.com)

billur.com → домен `cryptoosh.uz` → управление DNS. Удалить старые A/CNAME для `@` и `www` (если есть парковка регистратора) и добавить:

| Тип | Имя | Значение |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Vercel может показать в Settings → Domains свои значения для конкретного проекта: если они отличаются, используйте их. SSL-сертификат Vercel выпустит автоматически после того, как DNS обновится.

## Безопасность

- Строгий CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP — в `next.config.ts`.
- YouTube подгружается только по клику и с домена `youtube-nocookie.com`; iframe в sandbox.
- Нет форм и сбора персональных данных, нет сторонней аналитики.
- `npm audit` перед каждым обновлением зависимостей.

© Crypto Osh. Основатель: открытое сообщество и ассоциация криптоэнтузиастов Узбекистана в лице Тахира Султанова.
