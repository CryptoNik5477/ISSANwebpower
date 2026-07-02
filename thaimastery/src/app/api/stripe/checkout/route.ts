import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { planById } from "@/config/pricing";
import { checkoutSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!stripeConfigured()) return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });

  const rl = rateLimit(`checkout:${session.user.id}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const plan = planById(parsed.data.plan);
  if (!plan) return NextResponse.json({ error: "invalid_plan" }, { status: 400 });

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

  // Reuse or create the Stripe customer.
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe().customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const locale = parsed.data.locale;
  const base = siteUrl();

  const checkout = await stripe().checkout.sessions.create({
    customer: customerId,
    mode: plan.interval ? "subscription" : "payment",
    allow_promotion_codes: true, // coupon / promo code support
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: plan.amount,
          product_data: {
            name: `ThaiMastery ${plan.key[0].toUpperCase()}${plan.key.slice(1)}`,
            description: "Full access to all Thai courses, AI practice and certificates.",
          },
          ...(plan.interval ? { recurring: { interval: plan.interval } } : {}),
        },
      },
    ],
    metadata: { userId: user.id, plan: plan.id },
    subscription_data: plan.interval ? { metadata: { userId: user.id, plan: plan.id } } : undefined,
    success_url: `${base}/${locale}/dashboard?checkout=success`,
    cancel_url: `${base}/${locale}/#pricing`,
  });

  return NextResponse.json({ url: checkout.url });
}
