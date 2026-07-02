import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

/** Path prefixes (after the locale segment) that require authentication. */
const PROTECTED = ["/dashboard", "/courses", "/learn", "/exam", "/certificates", "/leaderboard", "/settings", "/admin"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Strip locale prefix to test protection rules.
  const withoutLocale = pathname.replace(/^\/(en|fr|de)(?=\/|$)/, "") || "/";
  const needsAuth = PROTECTED.some((p) => withoutLocale === p || withoutLocale.startsWith(`${p}/`));

  if (needsAuth) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const locale = pathname.match(/^\/(en|fr|de)(?=\/|$)/)?.[1] ?? routing.defaultLocale;
      const url = new URL(`/${locale}/login`, req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (withoutLocale.startsWith("/admin") && token.role !== "ADMIN") {
      const locale = pathname.match(/^\/(en|fr|de)(?=\/|$)/)?.[1] ?? routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
  }

  return intl(req);
}

export const config = {
  // Run on everything except API routes, Next internals and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
