import { requireNodeEnvVar } from "../server/utils";


export enum PaymentPlanId {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum SubscriptionStatus {
  PastDue = "past_due",
  CancelAtPeriodEnd = "cancel_at_period_end",
  Active = "active",
  Deleted = "deleted",
}

export interface PaymentPlan {
  /**
   * Returns the id under which this payment plan is identified on your payment processor.
   *
   * E.g. price id on Stripe, or variant id on LemonSqueezy.
   */
  getPaymentProcessorPlanId: () => string;
  effect: PaymentPlanEffect;
}

export type PaymentPlanEffect =
  | { kind: "subscription" }
  | { kind: "credits"; amount: number };

export const paymentPlans = {
  [PaymentPlanId.Small]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_SMALL_PRICE_ID"),
    effect: { kind: "credits", amount: 1 },
  },
  [PaymentPlanId.Medium]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_MEDIUM_PRICE_ID"),
    effect: { kind: "credits", amount: 5 },
  },
  [PaymentPlanId.Large]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_LARGE_PRICE_ID"),
    effect: { kind: "credits", amount: 10 },
  },
} as const satisfies Record<PaymentPlanId, PaymentPlan>;

export function prettyPaymentPlanName(planId: PaymentPlanId): string {
  const planToName: Record<PaymentPlanId, string> = {
    [PaymentPlanId.Small]: "1GB",
    [PaymentPlanId.Medium]: "5GB",
    [PaymentPlanId.Large]: "10GB",
  };
  return planToName[planId];
}

export function parsePaymentPlanId(planId: string): PaymentPlanId {
  if ((Object.values(PaymentPlanId) as string[]).includes(planId)) {
    return planId as PaymentPlanId;
  } else {
    throw new Error(`Invalid PaymentPlanId: ${planId}`);
  }
}

export function getSubscriptionPaymentPlanIds(): PaymentPlanId[] {
  return Object.values(PaymentPlanId).filter(
    (planId) => paymentPlans[planId].effect.kind === "credits",
  );
}



/**
 * Returns Open SaaS `PaymentPlanId` for some payment provider's plan ID.
 * 
 * Different payment providers track plan ID in different ways.
 * e.g. Stripe price ID, Polar product ID...
 */
export function getPaymentPlanIdByPaymentProcessorPlanId(
  paymentProcessorPlanId: string,
): PaymentPlanId {
  for (const [planId, plan] of Object.entries(paymentPlans)) {
    if (plan.getPaymentProcessorPlanId() === paymentProcessorPlanId) {
      return planId as PaymentPlanId;
    }
  }

  throw new Error(
    `Unknown payment processor plan ID: ${paymentProcessorPlanId}`,
  );
}
