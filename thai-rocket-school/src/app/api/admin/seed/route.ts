import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runSeed } from "@/lib/seed";
import { rateLimit, clientKey } from "@/lib/rate-limit";

// One-time (idempotent) database seed, triggered by visiting this URL with
// the correct secret — no terminal required. Meant for environments where
// the database can only be reached from the deployed app itself (e.g. no
// local network access to a managed Postgres provider).
//
// Usage: https://<your-app>/api/admin/seed?secret=<SEED_SECRET>

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function page(title: string, body: string, ok: boolean) {
  return `<!doctype html><html><body style="font-family:system-ui,sans-serif;background:#0a0d1c;color:#e8ecf6;padding:40px 20px;max-width:560px;margin:0 auto">
    <h1 style="color:${ok ? "#34d399" : "#f87171"}">${title}</h1>
    <p style="line-height:1.6">${body}</p>
  </body></html>`;
}

export async function GET(req: Request) {
  const secret = process.env.SEED_SECRET;
  if (!secret) {
    return new NextResponse(
      page("Not configured", "SEED_SECRET is not set on this deployment. Add it in Vercel → Settings → Environment Variables, then redeploy.", false),
      { status: 503, headers: { "Content-Type": "text/html" } },
    );
  }

  const rl = rateLimit(clientKey(req, "seed"), { limit: 10, windowMs: 60_000 });
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

  try {
    const summary = await runSeed(prisma);
    return new NextResponse(
      page(
        "Seed complete ✔",
        `${summary.courses} courses, ${summary.levels} levels and ${summary.achievements} achievements are now in the database. Demo accounts: <code>admin@thairocketschool.com</code> / <code>admin1234!</code> and <code>demo@thairocketschool.com</code> / <code>demo1234!</code>. This page is safe to re-run — it will not duplicate data. Remove <code>SEED_SECRET</code> from your environment variables once you're done.`,
        true,
      ),
      { status: 200, headers: { "Content-Type": "text/html" } },
    );
  } catch (err) {
    console.error("[seed] failed:", err);
    return new NextResponse(
      page("Seed failed", `An error occurred — check the deployment logs for details. ${err instanceof Error ? err.message : ""}`, false),
      { status: 500, headers: { "Content-Type": "text/html" } },
    );
  }
}
