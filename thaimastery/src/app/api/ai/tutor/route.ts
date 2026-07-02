import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { tutorReply } from "@/lib/ai";

const schema = z.object({
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) })).max(30),
  locale: z.enum(["en", "fr", "de"]).default("en"),
  scenario: z.string().max(200).default("everyday conversation"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rl = rateLimit(`ai:${session.user.id}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const reply = await tutorReply(parsed.data.history, parsed.data.locale, parsed.data.scenario);
  return NextResponse.json({ reply });
}
