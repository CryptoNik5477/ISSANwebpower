import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { emails } from "@/lib/email";

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "register"), { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });
  }

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", details: parsed.error.flatten() }, { status: 400 });
  }
  const { name, email, password, locale, referralCode } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    return NextResponse.json({ error: "email_exists" }, { status: 409 });
  }

  const referrer = referralCode
    ? await prisma.user.findUnique({ where: { referralCode }, select: { id: true } })
    : null;

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      locale,
      referredById: referrer?.id ?? null,
    },
  });

  // Fire-and-forget emails — never block registration on the mail provider.
  void emails.welcome(user.email, user.name ?? "there");

  return NextResponse.json({ ok: true }, { status: 201 });
}
