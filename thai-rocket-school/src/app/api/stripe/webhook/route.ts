import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { emails } from "@/lib/email";
import { formatPrice } from "@/lib/utils";
import type { Plan } from "@prisma/client";

// Stripe webhooks: verified with the signing secret, idempotent on session id.
export async function POST(req: Request) {
  if (!stripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = stripe().webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const cs = event.data.object;
      const userId = cs.metadata?.userId;
      const plan = cs.metadata?.plan as Plan | undefined;
      if (!userId || !plan) break;

      const user = await prisma.user.update({ where: { id: userId }, data: { plan } });

      await prisma.payment.upsert({
        where: { stripeSessionId: cs.id },
        update: { status: "paid" },
        create: {
          userId,
          amount: cs.amount_total ?? 0,
          currency: cs.currency ?? "eur",
          plan,
          stripeSessionId: cs.id,
        },
      });

      if (plan !== "LIFETIME" && cs.subscription) {
        await prisma.subscription.upsert({
          where: { userId },
          update: { plan, status: "active", stripeSubscriptionId: String(cs.subscription) },
          create: { userId, plan, status: "active", stripeSubscriptionId: String(cs.subscription) },
        });
      }

      void emails.paymentReceipt(
        user.email,
        user.name ?? "there",
        plan.toLowerCase(),
        formatPrice(cs.amount_total ?? 0, user.locale, (cs.currency ?? "eur").toUpperCase()),
      );
      break;
    }

    case "checkout.session.expired": {
      // Abandoned cart automation.
      const cs = event.data.object;
      const userId = cs.metadata?.userId;
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user && user.plan === "FREE") void emails.abandonedCart(user.email, user.name ?? "there");
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const userId = sub.metadata?.userId;
      if (!userId) break;
      const active = sub.status === "active" || sub.status === "trialing";
      await prisma.subscription.updateMany({
        where: { userId },
        data: {
          status: sub.status,
          currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : undefined,
        },
      });
      if (!active && event.type === "customer.subscription.deleted") {
        await prisma.user.update({ where: { id: userId }, data: { plan: "FREE" } });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
