// Unex Payments publishes its office rate as a post in its public Telegram
// channel, once a day:
//
//   💸 Актуальный курс на сегодня.
//   Покупка USD₮ — 11 990 uzs      (Unex buys USDT from you)
//   Продажа USD₮ — 12 120 uzs      (Unex sells USDT to you)
//
// The channel's public web preview (t.me/s/<channel>) is plain HTML that
// needs no bot, key or login. This finds the newest post with both numbers.

export const UNEX_CHANNEL = "unexpayment";

export type ChannelRate = { buy: number; sell: number; at: string; post: string };

const strip = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const num = (s: string) => Number(s.replace(/[\s  ]/g, "").replace(",", "."));

// The two prices from the Russian half of a post; the Uzbek half as a fallback.
export function parseRatePost(text: string): { buy: number; sell: number } | null {
  const grab = (re: RegExp) => {
    const m = text.match(re);
    return m ? num(m[1]) : NaN;
  };
  const N = "(\\d[\\d\\s\\u00a0\\u202f]*(?:[.,]\\d+)?)";
  // "Покупка USD₮ — 11 990" is what Unex pays you; "Продажа" is what you pay.
  let theyBuy = grab(new RegExp(`Покупка\\s+USD\\S*\\s*[—–-]\\s*${N}`, "i"));
  let theySell = grab(new RegExp(`Продажа\\s+USD\\S*\\s*[—–-]\\s*${N}`, "i"));
  if (!(theyBuy > 0 && theySell > 0)) {
    theyBuy = grab(new RegExp(`USD\\S*\\s+sotib\\s+olish\\s*[—–-]\\s*${N}`, "i"));
    theySell = grab(new RegExp(`USD\\S*\\s+sotish\\s*[—–-]\\s*${N}`, "i"));
  }
  if (!(theyBuy > 0 && theySell > 0)) return null;
  // On the site, buy = what a customer pays for 1 USDT (the higher number),
  // sell = what a customer gets for it. Taking max/min keeps this right even
  // if the channel ever swaps the wording.
  return { buy: Math.max(theyBuy, theySell), sell: Math.min(theyBuy, theySell) };
}

// Every post on the preview page, oldest first, with its text and time.
export function channelPosts(html: string): { post: string; text: string; at: string }[] {
  const out: { post: string; text: string; at: string }[] = [];
  const blocks = html.split(/(?=<div class="tgme_widget_message_wrap)/);
  for (const b of blocks) {
    const post = b.match(/data-post="([^"]+)"/)?.[1];
    const body = b.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    const at = b.match(/<time[^>]*datetime="([^"]+)"/)?.[1];
    if (post && body && at) out.push({ post, text: strip(body), at: new Date(at).toISOString() });
  }
  return out;
}

export function latestRate(html: string): ChannelRate | null {
  const posts = channelPosts(html);
  for (let i = posts.length - 1; i >= 0; i--) {
    const r = parseRatePost(posts[i].text);
    if (r) return { ...r, at: posts[i].at, post: posts[i].post };
  }
  return null;
}
