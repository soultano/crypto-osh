// Daily crypto news for the «Yangiliklar» tab.
//
// 1. Reads RSS feeds of the biggest international crypto outlets.
// 2. Groups stories that several outlets covered: the more outlets wrote
//    about it in the last day and a half, the more popular we consider it
//    (feeds don't publish view counts, so coverage is the proxy).
// 3. Asks Claude to pick the 3–5 most important ones and write them in
//    Uzbek, Russian and English in our tone of voice (scripts/news/tone.md),
//    each with "what it means for Uzbekistan".
// 4. Writes content/articles/<slug>.json and lists the new slugs in
//    news-new.json for the Telegram step.
//
// Run: ANTHROPIC_API_KEY=... node scripts/news/generate.mts
// Env: NEWS_MIN (default 3), NEWS_MAX (default 5), NEWS_DRY_RUN=1 to only
// print the ranked candidates without calling Claude.

import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const articlesDir = path.join(root, "content", "articles");
const tonePath = path.join(root, "scripts", "news", "tone.md");
const outList = path.join(root, "news-new.json");

const MIN = clampInt(process.env.NEWS_MIN, 3, 1, 10);
const MAX = clampInt(process.env.NEWS_MAX, 5, MIN, 10);
const WINDOW_HOURS = 36;
const MODEL = "claude-opus-5-5";

const feeds: { name: string; url: string }[] = [
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { name: "Cointelegraph", url: "https://cointelegraph.com/rss" },
  { name: "The Block", url: "https://www.theblock.co/rss.xml" },
  { name: "Decrypt", url: "https://decrypt.co/feed" },
  { name: "Bitcoin Magazine", url: "https://bitcoinmagazine.com/.rss/full/" },
  { name: "CryptoSlate", url: "https://cryptoslate.com/feed/" },
  { name: "Blockworks", url: "https://blockworks.co/feed" },
  { name: "The Defiant", url: "https://thedefiant.io/api/feed" },
  { name: "CryptoNews", url: "https://cryptonews.com/news/feed/" },
  { name: "BeInCrypto", url: "https://beincrypto.com/feed/" },
  { name: "Bitcoin.com News", url: "https://news.bitcoin.com/feed/" },
  { name: "U.Today", url: "https://u.today/rss" },
];

type FeedItem = { source: string; title: string; link: string; date: number; text: string };
type Cluster = { id: number; items: FeedItem[]; sources: Set<string>; latest: number; score: number };

function clampInt(v: string | undefined, def: number, min: number, max: number): number {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
}

// ---------- RSS ----------

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(Number.parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
}

function cleanLink(raw: string): string {
  try {
    const u = new URL(decode(raw));
    if (u.protocol !== "https:" && u.protocol !== "http:") return "";
    u.protocol = "https:";
    for (const k of [...u.searchParams.keys()]) if (k.startsWith("utm_")) u.searchParams.delete(k);
    u.hash = "";
    return u.toString();
  } catch {
    return "";
  }
}

async function readFeed(feed: { name: string; url: string }): Promise<FeedItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { "user-agent": "CryptoOshNewsBot/1.0 (+https://cryptoosh.uz)", accept: "application/rss+xml, application/xml, text/xml" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(String(res.status));
    const xml = await res.text();
    const items: FeedItem[] = [];
    for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)) {
      const it = m[0];
      const title = decode(tag(it, "title"));
      const link = cleanLink(tag(it, "link") || tag(it, "guid"));
      const date = Date.parse(decode(tag(it, "pubDate") || tag(it, "dc:date")));
      const body = decode(tag(it, "content:encoded")) || decode(tag(it, "description"));
      if (!title || !link || Number.isNaN(date)) continue;
      items.push({ source: feed.name, title, link, date, text: body.slice(0, 1200) });
    }
    console.log(`${feed.name}: ${items.length}`);
    return items;
  } catch (e) {
    console.warn(`${feed.name}: skipped (${(e as Error).message})`);
    return [];
  }
}

// ---------- popularity: how many outlets covered the same story ----------

const stop = new Set(
  "the a an and or but of to in on for with as at by from is are was were be been its it this that these those after over into amid about says say said new will could would may might can than more most first just now up down out off how why what who when where which via vs per has have had not no yes report reports week today daily price prices market markets crypto cryptocurrency".split(
    " ",
  ),
);

const same: Record<string, string> = { btc: "bitcoin", eth: "ethereum", ether: "ethereum", etfs: "etf", stablecoins: "stablecoin" };

function words(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[’']/g, "")
      .split(/[^a-z0-9$.%]+/)
      .map((w) => w.replace(/^\.+|\.+$/g, ""))
      .map((w) => same[w] ?? w)
      .filter((w) => w.length >= 3 && !stop.has(w)),
  );
}

function similar(a: Set<string>, b: Set<string>): boolean {
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  const union = a.size + b.size - shared;
  return shared >= 3 || (shared >= 2 && union > 0 && shared / union >= 0.2);
}

function cluster(items: FeedItem[]): Cluster[] {
  const clusters: (Cluster & { words: Set<string>[] })[] = [];
  for (const it of items.sort((a, b) => b.date - a.date)) {
    const w = words(it.title);
    const hit = clusters.find((c) => c.words.some((cw) => similar(cw, w)));
    if (hit) {
      hit.items.push(it);
      hit.words.push(w);
      hit.sources.add(it.source);
      hit.latest = Math.max(hit.latest, it.date);
    } else {
      clusters.push({ id: clusters.length + 1, items: [it], words: [w], sources: new Set([it.source]), latest: it.date, score: 0 });
    }
  }
  const now = Date.now();
  for (const c of clusters) {
    const ageH = (now - c.latest) / 3.6e6;
    c.score = c.sources.size * 10 + c.items.length * 2 - ageH / 3;
  }
  return clusters.sort((a, b) => b.score - a.score);
}

// ---------- existing articles ----------

type Article = {
  slug: string;
  date: string;
  tags: string[];
  sources: { name: string; url: string }[];
  uz: Text;
  ru: Text;
  en: Text;
};
type Text = { title: string; summary: string; body: string[]; take: string };

function existing(): Article[] {
  if (!fs.existsSync(articlesDir)) return [];
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(articlesDir, f), "utf8")) as Article;
      } catch {
        return null;
      }
    })
    .filter((a): a is Article => !!a);
}

// ---------- Claude ----------

const textSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "body", "take"],
  properties: {
    title: { type: "string", description: "Headline, up to ~90 characters, no clickbait." },
    summary: { type: "string", description: "One or two sentences: what happened. Used as the meta description." },
    body: { type: "array", items: { type: "string" }, description: "2–4 short paragraphs with the facts and numbers." },
    take: { type: "string", description: "2–4 sentences: what this means for people in Uzbekistan." },
  },
} as const;

const outputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["articles"],
  properties: {
    articles: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["cluster_id", "slug", "tags", "uz", "ru", "en"],
        properties: {
          cluster_id: { type: "integer" },
          slug: { type: "string", description: "Latin lowercase words joined by hyphens, 3–8 words, from the English title." },
          tags: { type: "array", items: { type: "string" }, description: "2–4 lowercase tags, e.g. bitcoin, etf, regulation." },
          uz: textSchema,
          ru: textSchema,
          en: textSchema,
        },
      },
    },
  },
} as const;

type Out = { articles: ({ cluster_id: number; slug: string; tags: string[] } & Record<"uz" | "ru" | "en", Text>)[] };

function validText(t: Text | undefined): t is Text {
  return !!t && typeof t.title === "string" && t.title.length > 5 && typeof t.summary === "string" && Array.isArray(t.body) && t.body.length > 0 && typeof t.take === "string" && t.take.length > 10;
}

async function write(candidates: Cluster[], recentTitles: string[], tone: string): Promise<Out> {
  const client = new Anthropic();
  const list = candidates
    .map((c) => {
      const lines = c.items
        .slice(0, 4)
        .map((it) => `  - [${it.source}] ${it.title} (${new Date(it.date).toISOString()})\n    ${it.link}\n    ${it.text.slice(0, 700)}`)
        .join("\n");
      return `#${c.id} · outlets: ${c.sources.size} (${[...c.sources].join(", ")})\n${lines}`;
    })
    .join("\n\n");

  const system = `You write the daily crypto news for Crypto Osh (cryptoosh.uz), a community of crypto people in Uzbekistan. Follow this tone of voice guide exactly; it is written in Russian by the founder:\n\n${tone}`;

  const user = `Today is ${new Date().toISOString().slice(0, 10)}. Below are today's candidate stories from international crypto media, grouped by story. "outlets" is how many different outlets covered it: that is our measure of popularity.

Pick the ${MIN}–${MAX} most important and most talked-about stories about crypto, blockchain or web3 (prefer stories with more outlets; skip pure price-prediction pieces, paid press releases and minor token promos). Write each one in Uzbek (Latin script), Russian and English, using only facts from the candidate texts.

Do not repeat these stories we already published recently:
${recentTitles.map((t) => `- ${t}`).join("\n") || "- (none)"}

Candidates:

${list}`;

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    thinking: { type: "adaptive" },
    output_config: { effort: "high", format: { type: "json_schema", schema: outputSchema } },
    system,
    messages: [{ role: "user", content: user }],
  });
  const msg = await stream.finalMessage();
  if (msg.stop_reason === "refusal") throw new Error("Claude declined the request");
  if (msg.stop_reason === "max_tokens") throw new Error("Claude ran out of output tokens");
  const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  console.log(`tokens: in ${msg.usage.input_tokens}, out ${msg.usage.output_tokens}`);
  return JSON.parse(text) as Out;
}

// ---------- main ----------

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 8)
    .join("-");
}

function tashkentDate(d = new Date()): { day: string; iso: string } {
  const t = new Date(d.getTime() + 5 * 3.6e6);
  const day = t.toISOString().slice(0, 10);
  return { day, iso: `${t.toISOString().slice(0, 19)}+05:00` };
}

async function main() {
  const old = existing();
  const usedLinks = new Set(old.flatMap((a) => a.sources.map((s) => s.url)));
  const recentTitles = old
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 40)
    .map((a) => a.en.title);

  const since = Date.now() - WINDOW_HOURS * 3.6e6;
  const items = (await Promise.all(feeds.map(readFeed))).flat().filter((it) => it.date >= since && it.date <= Date.now() + 3.6e6 && !usedLinks.has(it.link));
  const ranked = cluster(items).slice(0, 25);
  console.log(`\n${items.length} fresh items, top stories:`);
  for (const c of ranked.slice(0, 10)) console.log(`  #${c.id} [${c.sources.size} outlets] ${c.items[0].title}`);
  if (ranked.length < MIN) throw new Error("Too few fresh stories in the feeds; nothing published.");
  if (process.env.NEWS_DRY_RUN === "1") return;

  const tone = fs.readFileSync(tonePath, "utf8");
  const out = await write(ranked, recentTitles, tone);
  const { day, iso } = tashkentDate();
  fs.mkdirSync(articlesDir, { recursive: true });
  const taken = new Set(old.map((a) => a.slug));
  const created: string[] = [];

  for (const a of out.articles.slice(0, MAX)) {
    const c = ranked.find((x) => x.id === a.cluster_id);
    if (!c || !validText(a.uz) || !validText(a.ru) || !validText(a.en)) {
      console.warn(`skipped malformed article for #${a.cluster_id}`);
      continue;
    }
    let slug = `${day}-${slugify(a.slug) || slugify(a.en.title)}`.slice(0, 110).replace(/-+$/, "");
    for (let i = 2; taken.has(slug); i++) slug = `${slug}-${i}`;
    taken.add(slug);

    const seen = new Set<string>();
    const sources = c.items
      .filter((it) => !seen.has(it.source) && seen.add(it.source))
      .slice(0, 4)
      .map((it) => ({ name: it.source, url: it.link }));
    const article: Article = {
      slug,
      date: iso,
      tags: a.tags.map((t) => slugify(t)).filter(Boolean).slice(0, 4),
      sources,
      uz: a.uz,
      ru: a.ru,
      en: a.en,
    };
    fs.writeFileSync(path.join(articlesDir, `${slug}.json`), `${JSON.stringify(article, null, 2)}\n`);
    created.push(slug);
    console.log(`+ ${slug}`);
  }

  if (created.length < MIN) console.warn(`Only ${created.length} articles written (wanted ${MIN}–${MAX}).`);
  fs.writeFileSync(outList, JSON.stringify(created));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
