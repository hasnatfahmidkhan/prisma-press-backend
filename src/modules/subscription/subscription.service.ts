import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

class Subscription {
  createCheckoutSession = async (userId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: {
          id: userId,
        },
        include: {
          subscription: true,
        },
      });

      // old customer
      let stripeCustomerId = user.subscription?.stripeCustomerId;

      if (!stripeCustomerId) {
        // new customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user.id,
          },
        });
        stripeCustomerId = customer.id;
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: config.stripe_price_id as string,
            quantity: 1,
          },
        ],
        mode: "subscription",
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        success_url: `${config.app_url}/payment?success=true`,
        cancel_url: `${config.app_url}/payment?success=false`,
        metadata: {
          userId: user.id,
        },
      });
      return session.url;
    });

    return {
      paymentUrl: transactionResult,
    };
  };

  handleWebhook = async (payload: Buffer, signature: string) => {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe_webhook_secret_key,
    );

    // handle event
    switch (event.type) {
      // Occurs when a Checkout Session has been successfully completed.
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      // Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
      case "customer.subscription.updated":
        break;

      // Occurs whenever a customer’s subscription ends.
      case "customer.subscription.deleted":
        break;

      default:
        // Unexpected event type
        console.log(`No event matched. Unhandled event type ${event.type}.`);
        break;
    }
  };
}

const getPeriodEnd = (stripeSubcription: Stripe.Subscription) => {
  const currentPeriodEndInMiliseconds =
    stripeSubcription.items.data[0]?.current_period_end!;

  const currentPeriodEnd = new Date(currentPeriodEndInMiliseconds * 1000);
  return currentPeriodEnd;
};

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId!;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    throw new Error("Webhook failed");
  }

  const stripeSubcription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const currentPeriodEnd = getPeriodEnd(stripeSubcription);

  await prisma.subscription.upsert({
    where: {
      id: userId,
    },
    create: {
      userId,
      stripeCustomerId,
      status: "ACTIVE",
      stripeSubscriptionId,
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodEnd,
      status: "ACTIVE",
    },
  });
};

export const subscriptionService = new Subscription();
