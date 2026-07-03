import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runSeed } from "@/lib/seed";
import { checkAdminSecret, page } from "@/lib/admin-auth";

// One-time (idempotent) database seed, triggered by visiting this URL with
// the correct secret — no terminal required. Meant for environments where
// the database can only be reached from the deployed app itself (e.g. no
// local network access to a managed Postgres provider).
//
// Usage: https://<your-app>/api/admin/seed?secret=<ADMIN_SECRET>

export async function GET(req: Request) {
  const denied = checkAdminSecret(req, "seed");
  if (denied) return denied;

  try {
    const summary = await runSeed(prisma);
    return new NextResponse(
      page(
        "Seed complete ✔",
        `${summary.courses} courses, ${summary.levels} levels and ${summary.achievements} achievements are now in the database. Demo accounts: <code>admin@thairocketschool.com</code> / <code>admin1234!</code> and <code>demo@thairocketschool.com</code> / <code>demo1234!</code>. This page is safe to re-run — it will not duplicate data.`,
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
