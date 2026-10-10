// Telegram bot that lets people into the community group only after they
// introduce themselves.
//
// Flow (the group's invite link has "join requests" on and the bot is an
// admin there):
// 1. Someone taps "Request to join" → Telegram sends us chat_join_request and
//    the bot writes to them privately asking for a short introduction.
// 2. They answer the bot → we approve the pending request and post the
//    introduction in the group, so members see who joined.
//
// Stateless: a pending join request on Telegram's side is the only state.
//
// Settings (Vercel → Settings → Environment Variables, never in the repo):
//   TELEGRAM_BOT_TOKEN       token from @BotFather
//   TELEGRAM_GROUP_ID        numeric id like -1001234567890 (or "@username"
//                            for a public group)
// After deploy, open /api/telegram?setup once to point the bot at this site.
// While TELEGRAM_GROUP_ID is empty, adding the bot to a group as an admin
// makes it post that group's id there.

import { createHash } from "node:crypto";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

// Crypto osh group. Not a secret; empty until the bot reports it (see above).
const GROUP_ID = "";

const MIN_INTRO = 40; // characters
const MAX_INTRO = 1500;

type User = { id: number; first_name: string; last_name?: string; username?: string; is_bot?: boolean };
type Chat = { id: number; type: string; username?: string };
type Update = {
  my_chat_member?: { chat: Chat; new_chat_member: { status: string } };
  message?: { chat: Chat; from?: User; text?: string };
  chat_join_request?: { chat: Chat; from: User; user_chat_id: number };
};

const env = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN || "";
  return {
    token,
    group: process.env.TELEGRAM_GROUP_ID || GROUP_ID,
    // Telegram echoes this in a header on every webhook call, proving the call
    // came from Telegram. Derived from the token so there is one less setting.
    secret: token ? createHash("sha256").update(`webhook:${token}`).digest("hex") : "",
  };
};

async function tg(method: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${env().token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as { ok: boolean; description?: string; result?: unknown };
}

const say = (chatId: number, text: string) => tg("sendMessage", { chat_id: chatId, text, disable_web_page_preview: true });

function isOurGroup(chat: Chat): boolean {
  const g = env().group;
  return g.startsWith("@") ? chat.username?.toLowerCase() === g.slice(1).toLowerCase() : String(chat.id) === g;
}

const ASK =
  "Assalomu alaykum! Crypto Osh guruhiga xush kelibsiz 👋\n" +
  "Guruhga qo'shilish uchun shu yerga o'zingiz haqingizda bir-ikki gap yozing: ismingiz, qayerdansiz, nima bilan shug'ullanasiz va kriptoga qanday aloqangiz bor.\n\n" +
  "Здравствуйте! Добро пожаловать в Crypto Osh 👋\n" +
  "Чтобы вступить в группу, напишите сюда пару предложений о себе: как вас зовут, откуда вы, чем занимаетесь и как связаны с крипто.";

const TOO_SHORT =
  "Biroz batafsilroq yozing, iltimos: ism, shahar, kasb va kriptoga qiziqishingiz.\n\n" +
  "Пожалуйста, чуть подробнее: имя, город, чем занимаетесь и что интересно в крипто.";

const TOO_LONG = "Juda uzun, qisqaroq yozing.\n\nСлишком длинно, напишите покороче.";

const NO_REQUEST = () =>
  "Guruhga qo'shilish so'rovingiz topilmadi. Avval guruhga so'rov yuboring" +
  (site.contacts.group ? `: ${site.contacts.group}` : ".") +
  "\n\nЗаявка на вступление не найдена. Сначала подайте заявку в группу" +
  (site.contacts.group ? `: ${site.contacts.group}` : ".");

const WELCOME = "Rahmat! Siz guruhga qabul qilindingiz 🎉\n\nСпасибо! Вы приняты в группу 🎉";

async function handle(u: Update) {
  // Setup helper: tell the owner the group's id, which Telegram apps hide.
  const added = u.my_chat_member;
  if (added) {
    if (!env().group && added.new_chat_member.status === "administrator" && added.chat.type !== "private")
      await say(added.chat.id, `TELEGRAM_GROUP_ID = ${added.chat.id}\n\nВпишите это в Vercel → Settings → Environment Variables и сделайте Redeploy.`);
    return;
  }
  if (!env().group) return;

  const req = u.chat_join_request;
  if (req) {
    if (isOurGroup(req.chat) && !req.from.is_bot) await say(req.user_chat_id, ASK);
    return;
  }

  const m = u.message;
  if (!m || m.chat.type !== "private" || !m.from || m.from.is_bot) return;
  const text = (m.text || "").trim();
  if (!text || text.startsWith("/")) return void (await say(m.chat.id, ASK));
  if (text.length < MIN_INTRO) return void (await say(m.chat.id, TOO_SHORT));
  if (text.length > MAX_INTRO) return void (await say(m.chat.id, TOO_LONG));

  const approved = await tg("approveChatJoinRequest", { chat_id: env().group, user_id: m.from.id });
  if (!approved.ok) return void (await say(m.chat.id, NO_REQUEST()));

  // Post the introduction with a clickable mention of the newcomer. Plain
  // text plus an entity, so nothing the user wrote is parsed as markup.
  const name = [m.from.first_name, m.from.last_name].filter(Boolean).join(" ");
  const head = "👋 Yangi a'zo / Новый участник: ";
  const tail = m.from.username ? ` (@${m.from.username})` : "";
  await tg("sendMessage", {
    chat_id: env().group,
    text: `${head}${name}${tail}\n\n${text}`,
    entities: [{ type: "text_mention", offset: head.length, length: name.length, user: m.from }],
  });
  await say(m.chat.id, WELCOME);
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

// One-time setup: /api/telegram?setup. Safe to open by anyone: it can only
// point the bot at this site's own webhook.
export async function GET(request: Request) {
  const { token, secret } = env();
  if (!token) return new Response("Не задан TELEGRAM_BOT_TOKEN", { status: 503 });
  if (!new URL(request.url).searchParams.has("setup")) return new Response("not found", { status: 404 });
  const res = await tg("setWebhook", {
    url: `${site.url}/api/telegram`,
    secret_token: secret,
    allowed_updates: ["message", "chat_join_request", "my_chat_member"],
  });
  return new Response(res.ok ? "Готово: бот подключён." : `Ошибка: ${res.description}`, {
    status: res.ok ? 200 : 502,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
