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

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const sig = event.headers["stripe-signature"];

  // Netlify può codificare il body in base64 per payload binari
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  switch (stripeEvent.type) {
    case "checkout.session.completed": {
      const session = stripeEvent.data.object;
      const userId = session.metadata?.user_id;
      const piano = session.metadata?.piano;

      if (userId && piano) {
        const { error } = await supabase
          .from("utenti")
          .update({ piano, stripe_customer_id: session.customer ?? null })
          .eq("id", userId);

        if (error) {
          console.error("Supabase update piano failed:", error);
          return { statusCode: 500, body: "DB update failed" };
        }
        console.log(`Piano aggiornato: user=${userId} piano=${piano}`);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = stripeEvent.data.object;
      if (sub.status === "active" && sub.metadata?.piano) {
        await supabase
          .from("utenti")
          .update({ piano: sub.metadata.piano })
          .eq("stripe_customer_id", sub.customer);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = stripeEvent.data.object;
      if (sub.customer) {
        const { error } = await supabase
          .from("utenti")
          .update({ piano: "gratuito" })
          .eq("stripe_customer_id", sub.customer);

        if (error) console.error("Supabase downgrade failed:", error);
        else console.log(`Downgrade a gratuito: customer=${sub.customer}`);
      }
      break;
    }

    case "invoice.payment_failed": {
      const inv = stripeEvent.data.object;
      console.warn(`Pagamento fallito: customer=${inv.customer} amount=${inv.amount_due}`);
      break;
    }

    default:
      break;
  }

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ received: true }),
  };
}
