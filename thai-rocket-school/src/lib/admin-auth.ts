// Shared guard for one-off admin utility routes (/api/admin/*) that are
// triggered by visiting a URL rather than from the authenticated admin UI —
// used when the database or a third-party API is only reachable from the
// deployed app itself. Gated by a single ADMIN_SECRET env var.

import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { rateLimit, clientKey } from "./rate-limit";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function page(title: string, body: string, ok: boolean, extraHead = ""): string {
  return `<!doctype html><html><head>${extraHead}</head><body style="font-family:system-ui,sans-serif;background:#0a0d1c;color:#e8ecf6;padding:40px 20px;max-width:560px;margin:0 auto">
    <h1 style="color:${ok ? "#34d399" : "#f87171"}">${title}</h1>
    <div style="line-height:1.6">${body}</div>
  </body></html>`;
}

/** Returns an error NextResponse if the request isn't authorized, or null if it's clear to proceed. */
export function checkAdminSecret(req: Request, scope: string): NextResponse | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return new NextResponse(
      page("Not configured", "ADMIN_SECRET is not set on this deployment. Add it in Vercel → Settings → Environment Variables, then redeploy.", false),
      { status: 503, headers: { "Content-Type": "text/html" } },
    );
  }

  const rl = rateLimit(clientKey(req, scope), { limit: 20, windowMs: 60_000 });
  if (!rl.ok) {
    return new NextResponse(page("Too many attempts", "Please wait a minute and try again.", false), {
      status: 429,
      headers: { "Content-Type": "text/html" },
    });
  }

  const provided = new URL(req.url).searchParams.get("secret") ?? "";
  if (!provided || !safeEqual(provided, secret)) {
    return new NextResponse(page("Unauthorized", "The secret is missing or incorrect.", false), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  return null;
}
