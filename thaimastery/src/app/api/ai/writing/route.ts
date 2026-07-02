import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { correctWriting } from "@/lib/ai";

const schema = z.object({
  text: z.string().min(1).max(2000),
  locale: z.enum(["en", "fr", "de"]).default("en"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rl = rateLimit(`ai:${session.user.id}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const correction = await correctWriting(parsed.data.text, parsed.data.locale);
  return NextResponse.json({ correction });
}
