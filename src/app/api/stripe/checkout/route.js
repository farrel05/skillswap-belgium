import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PACKS = {
  starter: { credits: 10,  price: 299,  name: '10 crédits SkillSwap'  },
  pro:     { credits: 50,  price: 999,  name: '50 crédits SkillSwap'  },
  expert:  { credits: 100, price: 1799, name: '100 crédits SkillSwap' },
};

export async function POST(req) {
  try {
    const { packId, userId, userEmail } = await req.json();
    const pack = PACKS[packId];
    if (!pack) return NextResponse.json({ error: 'Pack invalide' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'bancontact'],
      mode: 'payment',
      customer_email: userEmail,
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: pack.price, // en centimes
          product_data: {
            name: pack.name,
            description: `${pack.credits} crédits pour envoyer des messages sur SkillSwap Belgium`,
            images: ['https://skillswap-belgium.vercel.app/logo.png'],
          },
        },
        quantity: 1,
      }],
      metadata: {
        userId,
        credits: pack.credits.toString(),
        packId,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/credits`,
      locale: 'fr',
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}