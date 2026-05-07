import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // clé service role (pas anon)
);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, credits } = session.metadata;

    // Ajouter les crédits à l'utilisateur
    const { data: profile } = await supabase
      .from('skillswap_profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    const newCredits = (profile?.credits || 0) + parseInt(credits);

    await supabase
      .from('skillswap_profiles')
      .update({ credits: newCredits })
      .eq('id', userId);

    // Créer une notification
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'credits_added',
      title: `${credits} crédits ajoutés ! 🎉`,
      body: `Votre achat a été confirmé. Vous pouvez maintenant envoyer des messages.`,
      link: '/messages',
    });

    console.log(`✅ ${credits} crédits ajoutés à ${userId}`);
  }

  return NextResponse.json({ received: true });
}
