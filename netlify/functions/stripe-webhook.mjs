import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    console.error("stripe-webhook: variabili d'ambiente mancanti");
    return { statusCode: 503, body: "Config error" };
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });
  const sig = event.headers["stripe-signature"];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const userId = session.metadata?.user_id;
    const piano = session.metadata?.piano;

    if (userId && piano) {
      const { error } = await supabase
        .from("utenti")
        .update({
          piano,
          stripe_customer_id: session.customer ?? null,
        })
        .eq("id", userId);

      if (error) {
        console.error("Supabase update failed:", error);
        return { statusCode: 500, body: "DB update failed" };
      }

      console.log(`Piano aggiornato: user=${userId} piano=${piano}`);
    }
  }

  if (stripeEvent.type === "customer.subscription.deleted") {
    const sub = stripeEvent.data.object;
    const customerId = sub.customer;

    if (customerId) {
      const { error } = await supabase
        .from("utenti")
        .update({ piano: "gratuito" })
        .eq("stripe_customer_id", customerId);

      if (error) {
        console.error("Supabase downgrade failed:", error);
      } else {
        console.log(`Piano downgrade a gratuito: customer=${customerId}`);
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
}
