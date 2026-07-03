import type { Plan } from "@prisma/client";

export interface PricingPlan {
  id: Exclude<Plan, "FREE">;
  /** Amount in cents (EUR). */
  amount: number;
  interval: "month" | "year" | null; // null → one-time payment
  /** i18n key suffix under `pricing.plans.*` */
  key: "monthly" | "yearly" | "lifetime";
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  { id: "MONTHLY", amount: 1490, interval: "month", key: "monthly" },
  { id: "YEARLY", amount: 8900, interval: "year", key: "yearly", popular: true },
  { id: "LIFETIME", amount: 19900, interval: null, key: "lifetime" },
];

export function planById(id: string): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.id === id);
}
