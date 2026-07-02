import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emails } from "@/lib/email";
import { utcDay } from "@/lib/utils";

// Daily reminder emails — call from a scheduler (Vercel Cron, GitHub Actions…)
// with: Authorization: Bearer <CRON_SECRET>
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("authorization");
  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const today = utcDay();
  // Users with an active streak who haven't practised yet today.
  const users = await prisma.user.findMany({
    where: {
      streak: { gt: 0 },
      OR: [{ lastActivityDate: { lt: today } }, { lastActivityDate: null }],
    },
    take: 500,
  });

  await Promise.allSettled(
    users.map((u) => emails.dailyReminder(u.email, u.name ?? "there", u.streak)),
  );

  return NextResponse.json({ sent: users.length });
}
