import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { emails } from "@/lib/email";

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "forgot"), { limit: 5, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase().trim() } });
  // Always answer 200 to avoid account enumeration.
  if (user) {
    const token = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expires: new Date(Date.now() + 60 * 60 * 1000) },
    });
    void emails.passwordReset(user.email, token);
  }
  return NextResponse.json({ ok: true });
}
