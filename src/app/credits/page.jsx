'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '../LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from '../MobileNav';
import NotificationBell from '../NotificationBell';

const PACKS = [
  {
    id: 'starter',
    credits: 10,
    price: 2.99,
    label: { fr: 'Starter', nl: 'Starter', en: 'Starter' },
    desc: { fr: 'Pour commencer', nl: 'Om te beginnen', en: 'To get started' },
    icon: '🥉',
    popular: false,
    priceId: 'price_starter', // remplacé par vrai ID Stripe
  },
  {
    id: 'pro',
    credits: 50,
    price: 9.99,
    label: { fr: 'Pro', nl: 'Pro', en: 'Pro' },
    desc: { fr: 'Le plus populaire', nl: 'Meest populair', en: 'Most popular' },
    icon: '🥈',
    popular: true,
    priceId: 'price_pro',
  },
  {
    id: 'expert',
    credits: 100,
    price: 17.99,
    label: { fr: 'Expert', nl: 'Expert', en: 'Expert' },
    desc: { fr: 'Meilleure valeur', nl: 'Beste waarde', en: 'Best value' },
    icon: '🥇',
    popular: false,
    priceId: 'price_expert',
  },
];

const S = `
  .nav-link{font-size:13px;color:#4B4869;text-decoration:none;font-weight:500;transition:color .2s}
  .nav-link:hover,.nav-link.active{color:#6C63FF;font-weight:700}
  .pack-card{background:white;border:2px solid #E8E6FF;border-radius:24px;padding:32px 28px;cursor:pointer;transition:all .3s;position:relative;text-align:center}
  .pack-card:hover{border-color:#6C63FF;transform:translateY(-6px);box-shadow:0 20px 60px rgba(108,99,255,.15)}
  .pack-card.popular{border-color:#6C63FF;box-shadow:0 8px 40px rgba(108,99,255,.2)}
  .pack-card.selected{border-color:#6C63FF;background:#F8F7FF;box-shadow:0 0 0 4px rgba(108,99,255,.15)}
  .popular-badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#6C63FF,#EC4899);color:white;padding:5px 18px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap}
  .buy-btn{width:100%;padding:15px;border-radius:14px;background:linear-gradient(135deg,#6C63FF,#4F46E5);color:white;border:none;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s;box-shadow:0 6px 20px rgba(108,99,255,.35)}
  .buy-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px rgba(108,99,255,.5)}
  .buy-btn:disabled{background:#E8E6FF;color:#9290B0;box-shadow:none;cursor:not-allowed}
  .feature-item{display:flex;align-items:center;gap:10px;font-size:13px;color:#4B4869}
  @media(max-width:1024px){
    .packs-grid{grid-template-columns:1fr !important}
    .page-inner{padding:20px 16px 80px !important}
  }
`;

export default function CreditsPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [selected, setSelected] = useState('pro');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useState(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth'); return; }
      supabase.from('skillswap_profiles').select('*').eq('id', user.id).single().then(({ data }) => setProfile(data));
    });
  });

  const handleBuy = async (pack) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packId: pack.id,
          credits: pack.credits,
          price: pack.price,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.assign(url);
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    fr: {
      title: 'Acheter des crédits',
      sub: 'Chaque message envoyé coûte 1 crédit',
      current: 'Crédits actuels',
      perCredit: '€/crédit',
      buyBtn: 'Acheter maintenant →',
      loading: 'Redirection...',
      features: ['Paiement sécurisé Stripe', 'Crédits ajoutés instantanément', 'Pas d\'abonnement'],
      faq1: 'Comment fonctionnent les crédits ?',
      faq1a: 'Chaque message envoyé dans une conversation coûte 1 crédit. Les crédits n\'expirent jamais.',
      faq2: 'Le paiement est-il sécurisé ?',
      faq2a: 'Oui, tous les paiements sont traités par Stripe, leader mondial du paiement en ligne.',
    },
    nl: {
      title: 'Credits kopen',
      sub: 'Elk verzonden bericht kost 1 credit',
      current: 'Huidige credits',
      perCredit: '€/credit',
      buyBtn: 'Nu kopen →',
      loading: 'Doorsturen...',
      features: ['Beveiligde betaling via Stripe', 'Credits direct toegevoegd', 'Geen abonnement'],
      faq1: 'Hoe werken credits?',
      faq1a: 'Elk bericht in een gesprek kost 1 credit. Credits verlopen nooit.',
      faq2: 'Is de betaling veilig?',
      faq2a: 'Ja, alle betalingen worden verwerkt door Stripe, wereldleider in online betalingen.',
    },
    en: {
      title: 'Buy credits',
      sub: 'Each message sent costs 1 credit',
      current: 'Current credits',
      perCredit: '€/credit',
      buyBtn: 'Buy now →',
      loading: 'Redirecting...',
      features: ['Secure Stripe payment', 'Credits added instantly', 'No subscription'],
      faq1: 'How do credits work?',
      faq1a: 'Each message in a conversation costs 1 credit. Credits never expire.',
      faq2: 'Is payment secure?',
      faq2a: 'Yes, all payments are processed by Stripe, the world leader in online payments.',
    },
  };
  const L = labels[lang] || labels.fr;

  return (
    <div style={{ minHeight:'100vh', background:'#F8F7FF', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{S}</style>

      {/* Navbar */}
      <nav className="desktop-nav" style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid #E8E6FF', padding:'0 32px', alignItems:'center', justifyContent:'space-between', height:'68px', position:'sticky', top:0, zIndex:100 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'17px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
        </Link>
        <div style={{ display:'flex', gap:'28px' }}>
          {[
            ['/dashboard', '🏠 Dashboard', false],
            ['/explore',   '🔍 Explorer',  false],
            ['/profile',   '👤 Mon profil', false],
            ['/exchanges', '🤝 Échanges',  false],
            ['/messages',  '💬 Messages',  false],
          ].map(([href,label,active]) => (
            <Link key={href} href={href} className={`nav-link ${active?'active':''}`}>{label}</Link>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <NotificationBell />
          <LanguageSwitcher />
          <div style={{ background:'#EEF0FF', color:'#6C63FF', padding:'8px 18px', borderRadius:'20px', fontSize:'13px', fontWeight:700, border:'1px solid #E8E6FF' }}>
            ⏱️ {profile?.credits || 0} crédits
          </div>
        </div>
      </nav>

      <MobileNav active="/credits" />

      <div className="page-inner" style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 24px 60px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'#EEF0FF', color:'#6C63FF', padding:'8px 20px', borderRadius:'30px', fontSize:'13px', fontWeight:700, marginBottom:'20px', border:'1px solid #E8E6FF' }}>
            ⏱️ {L.current} : <strong>{profile?.credits || 0}</strong>
          </div>
          <h1 style={{ fontSize:'36px', fontWeight:800, color:'#1A1635', letterSpacing:'-1px', marginBottom:'10px' }}>{L.title}</h1>
          <p style={{ fontSize:'16px', color:'#9290B0' }}>{L.sub}</p>
        </div>

        {/* Packs */}
        <div className="packs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px', marginBottom:'48px' }}>
          {PACKS.map(pack => (
            <div key={pack.id}
              className={`pack-card ${pack.popular?'popular':''} ${selected===pack.id?'selected':''}`}
              onClick={() => setSelected(pack.id)}>
              {pack.popular && <div className="popular-badge">⭐ {lang==='fr'?'Le plus populaire':lang==='nl'?'Meest populair':'Most popular'}</div>}

              <div style={{ fontSize:'48px', marginBottom:'16px' }}>{pack.icon}</div>
              <div style={{ fontSize:'20px', fontWeight:800, color:'#1A1635', marginBottom:'4px' }}>{pack.label[lang]}</div>
              <div style={{ fontSize:'13px', color:'#9290B0', marginBottom:'20px' }}>{pack.desc[lang]}</div>

              {/* Prix */}
              <div style={{ marginBottom:'20px' }}>
                <div style={{ fontSize:'42px', fontWeight:900, color:'#1A1635', letterSpacing:'-2px', lineHeight:1 }}>
                  {pack.price}€
                </div>
                <div style={{ fontSize:'13px', color:'#9290B0', marginTop:'4px' }}>
                  {(pack.price / pack.credits).toFixed(2)}{L.perCredit}
                </div>
              </div>

              {/* Crédits */}
              <div style={{ background: pack.popular ? '#EEF0FF' : '#F8F7FF', borderRadius:'14px', padding:'16px', marginBottom:'24px' }}>
                <div style={{ fontSize:'32px', fontWeight:900, background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  {pack.credits}
                </div>
                <div style={{ fontSize:'13px', color:'#9290B0', fontWeight:600 }}>crédits</div>
              </div>

              <button onClick={(e) => { e.stopPropagation(); handleBuy(pack); }}
                disabled={loading}
                className="buy-btn"
                style={{ background: pack.popular ? 'linear-gradient(135deg,#6C63FF,#EC4899)' : 'linear-gradient(135deg,#6C63FF,#4F46E5)' }}>
                {loading ? L.loading : L.buyBtn}
              </button>
            </div>
          ))}
        </div>

        {/* Sécurité */}
        <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'24px', marginBottom:'32px', textAlign:'center' }}>
          <div style={{ display:'flex', justifyContent:'center', gap:'32px', flexWrap:'wrap' }}>
            {L.features.map((f, i) => (
              <div key={i} className="feature-item">
                <span style={{ color:'#10B981', fontSize:'16px' }}>✓</span>
                {f}
              </div>
            ))}
          </div>
          <div style={{ marginTop:'16px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', color:'#9290B0', fontSize:'12px' }}>
            <span>🔒</span>
            <span>Powered by <strong style={{ color:'#6C63FF' }}>Stripe</strong> — Paiement 100% sécurisé</span>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {[
            [L.faq1, L.faq1a],
            [L.faq2, L.faq2a],
          ].map(([q, a], i) => (
            <div key={i} style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'16px', padding:'20px' }}>
              <div style={{ fontSize:'14px', fontWeight:700, color:'#1A1635', marginBottom:'8px' }}>❓ {q}</div>
              <div style={{ fontSize:'13px', color:'#4B4869', lineHeight:1.6 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
