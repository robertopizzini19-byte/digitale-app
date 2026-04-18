import Stripe from "stripe";

const PRICE_IDS = {
  professionista: process.env.STRIPE_PRICE_PROFESSIONISTA,
  impresa: process.env.STRIPE_PRICE_IMPRESA,
};

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return { statusCode: 503, body: JSON.stringify({ error: "Stripe non configurato" }) };
  }

  let piano, userId, email, returnUrl;
  try {
    ({ piano, userId, email, returnUrl } = JSON.parse(event.body ?? "{}"));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Body JSON non valido" }) };
  }

  if (!piano || !userId || !email || !returnUrl) {
    return { statusCode: 400, body: JSON.stringify({ error: "Parametri mancanti" }) };
  }

  const priceId = PRICE_IDS[piano];
  if (!priceId) {
    return { statusCode: 400, body: JSON.stringify({ error: `Piano non riconosciuto: ${piano}` }) };
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { user_id: userId, piano },
      success_url: `${returnUrl}?upgrade=ok&piano=${piano}`,
      cancel_url: `${returnUrl}/upgrade?canceled=1`,
      locale: "it",
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { user_id: userId, piano },
        trial_period_days: 14,
      },
    });

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message ?? "Errore Stripe" }),
    };
  }
}
