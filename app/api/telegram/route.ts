// Crypto Osh Telegram bot. The community group is paid now (12 000 UZS a
// month through the taps.uz bot), so this bot no longer lets anyone in: it
// never approves join requests. Whoever writes to it privately gets the
// paid subscription link instead.
//
// Settings (Vercel → Settings → Environment Variables, never in the repo):
//   TELEGRAM_BOT_TOKEN       token from @BotFather
//   TELEGRAM_WEBHOOK_SECRET  any random string, 20+ letters and digits
// After deploy, open /api/telegram?setup=<TELEGRAM_WEBHOOK_SECRET> once to
// point the bot at this URL. TELEGRAM_GROUP_ID is no longer used.

import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type User = { id: number; is_bot?: boolean };
type Chat = { id: number; type: string };
type Update = { message?: { chat: Chat; from?: User; text?: string } };

const env = () => ({
  token: process.env.TELEGRAM_BOT_TOKEN || "",
  secret: process.env.TELEGRAM_WEBHOOK_SECRET || "",
});

async function tg(method: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${env().token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as { ok: boolean; description?: string; result?: unknown };
}

const say = (chatId: number, text: string) => tg("sendMessage", { chat_id: chatId, text, disable_web_page_preview: true });

const JOIN = () =>
  "Assalomu alaykum! Crypto Osh hamjamiyatiga obuna orqali qo'shilasiz: oyiga 12 000 so'm. Har kuni soat 20:00 da ekspert, savol-javob va networking" +
  (site.contacts.community ? `:\n${site.contacts.community}` : ".") +
  "\n\nЗдравствуйте! В комьюнити Crypto Osh вступают по подписке: 12 000 сум в месяц. Каждый день в 20:00 эксперт, вопросы и нетворкинг" +
  (site.contacts.community ? `:\n${site.contacts.community}` : ".");

async function handle(u: Update) {
  const m = u.message;
  if (!m || m.chat.type !== "private" || !m.from || m.from.is_bot) return;
  await say(m.chat.id, JOIN());
}

export async function POST(request: Request) {
  const { token, secret } = env();
  if (!token || !secret) return new Response("not configured", { status: 503 });
  if (request.headers.get("x-telegram-bot-api-secret-token") !== secret) return new Response("forbidden", { status: 403 });
  try {
    await handle((await request.json()) as Update);
  } catch (e) {
    console.error("telegram update failed", e);
  }
  // Always 200, otherwise Telegram keeps retrying the same update.
  return Response.json({ ok: true });
}

// One-time setup: /api/telegram?setup=<TELEGRAM_WEBHOOK_SECRET>
export async function GET(request: Request) {
  const { token, secret } = env();
  if (!token || !secret) return new Response("Не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_WEBHOOK_SECRET", { status: 503 });
  const url = new URL(request.url);
  if (url.searchParams.get("setup") !== secret) return new Response("forbidden", { status: 403 });
  const res = await tg("setWebhook", {
    url: `${url.origin}/api/telegram`,
    secret_token: secret,
    allowed_updates: ["message"],
    drop_pending_updates: true,
  });
  return new Response(res.ok ? "Готово: бот подключён." : `Ошибка: ${res.description}`, {
    status: res.ok ? 200 : 502,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
