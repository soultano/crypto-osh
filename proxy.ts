import { NextResponse, type NextRequest } from "next/server";

// The bare domain opens in Uzbek. A saved language choice (set by the
// language switcher) wins; otherwise only a browser whose first language
// is Russian gets the Russian version.
const LANG_COOKIE = "lang";
const known = ["uz", "ru", "en"];

function pick(request: NextRequest): string {
  const saved = request.cookies.get(LANG_COOKIE)?.value;
  if (saved && known.includes(saved)) return saved;
  const first = (request.headers.get("accept-language") || "").split(",")[0].trim().toLowerCase();
  if (first.startsWith("ru")) return "ru";
  return "uz";
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = `/${pick(request)}`;
  const res = NextResponse.redirect(url, 307);
  res.headers.set("Vary", "Accept-Language, Cookie");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = { matcher: "/" };
