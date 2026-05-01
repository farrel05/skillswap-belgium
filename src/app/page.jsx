'use client';
import Link from 'next/link';

const FEATURES = [
  { icon: '🎯', title: 'Créez votre profil', desc: 'Ajoutez vos compétences et ce que vous recherchez en échange.' },
  { icon: '🔍', title: 'Trouvez un match', desc: 'Notre algorithme vous suggère les meilleurs profils compatibles.' },
  { icon: '🤝', title: 'Échangez', desc: '1 heure offerte = 1 crédit reçu. Simple, équitable, transparent.' },
  { icon: '⭐', title: 'Évaluez', desc: 'Laissez un avis et construisez votre réputation dans la communauté.' },
];

const CATEGORIES = [
  { icon: '💻', name: 'Tech & Dev', count: '120+' },
  { icon: '🎨', name: 'Design', count: '85+' },
  { icon: '📊', name: 'Marketing', count: '94+' },
  { icon: '📝', name: 'Rédaction', count: '67+' },
  { icon: '🧮', name: 'Comptabilité', count: '45+' },
  { icon: '📸', name: 'Photo & Vidéo', count: '58+' },
  { icon: '🗣️', name: 'Langues', count: '72+' },
  { icon: '🏋️', name: 'Coaching', count: '39+' },
];

const TESTIMONIALS = [
  { name: 'Sophie M.', role: 'Designer UX · Bruxelles', text: 'J\'ai échangé mes skills Figma contre du développement React. Incroyable !', avatar: 'S', color: '#6C63FF' },
  { name: 'Thomas D.', role: 'Dev Full-Stack · Liège', text: 'SkillSwap m\'a permis de trouver un expert comptable sans débourser un centime.', avatar: 'T', color: '#10B981' },
  { name: 'Astrid V.', role: 'Marketing · Gand', text: 'La communauté est top, les échanges sont vraiment professionnels.', avatar: 'A', color: '#F59E0B' },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F7FF', fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        :root {
          --p: #6C63FF; --p2: #4F46E5; --pl: #EEF0FF;
          --s: #EC4899; --a: #10B981;
          --bg: #F8F7FF; --surf: #FFFFFF;
          --b: #E8E6FF; --t1: #1A1635; --t2: #4B4869; --t3: #9290B0;
        }
        .nav-link { color: var(--t2); font-weight: 500; font-size: 14px; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: var(--p); }
        .btn-outline { padding: 9px 22px; border-radius: 10px; border: 1.5px solid var(--p); color: var(--p); font-weight: 600; font-size: 13px; cursor: pointer; background: transparent; font-family: inherit; transition: all 0.2s; }
        .btn-outline:hover { background: var(--pl); }
        .btn-primary { padding: 10px 24px; border-radius: 10px; background: linear-gradient(135deg, var(--p), var(--p2)); color: white; font-weight: 700; font-size: 13px; cursor: pointer; border: none; font-family: inherit; box-shadow: 0 4px 14px rgba(108,99,255,0.4); transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(108,99,255,0.5); }
        .btn-hero-p { padding: 15px 36px; border-radius: 14px; background: linear-gradient(135deg, var(--p), var(--p2)); color: white; border: none; font-weight: 700; font-size: 16px; cursor: pointer; font-family: inherit; box-shadow: 0 8px 28px rgba(108,99,255,0.4); transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-hero-p:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(108,99,255,0.5); }
        .btn-hero-s { padding: 15px 36px; border-radius: 14px; background: white; color: var(--t1); border: 1.5px solid var(--b); font-weight: 600; font-size: 16px; cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-hero-s:hover { border-color: var(--p); color: var(--p); }
        .profile-card { background: white; border: 1px solid var(--b); border-radius: 20px; padding: 24px; transition: all 0.3s; position: relative; overflow: hidden; }
        .profile-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--p), var(--s)); opacity: 0; transition: opacity 0.3s; }
        .profile-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(108,99,255,0.15); }
        .profile-card:hover::before { opacity: 1; }
        .feat-card { background: var(--bg); border: 1px solid var(--b); border-radius: 18px; padding: 28px; transition: all 0.2s; }
        .feat-card:hover { border-color: var(--p); background: var(--pl); transform: translateY(-3px); }
        .cat-card { background: white; border: 1px solid var(--b); border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .cat-card:hover { border-color: var(--p); background: var(--pl); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(108,99,255,0.12); }
        .test-card { background: white; border: 1px solid var(--b); border-radius: 20px; padding: 28px; transition: all 0.2s; }
        .test-card:hover { box-shadow: 0 12px 40px rgba(108,99,255,0.1); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        .gradient-text { background: linear-gradient(135deg, var(--p) 0%, var(--s) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .stat-val { font-size: 32px; font-weight: 800; background: linear-gradient(135deg, var(--p), var(--s)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .btn-card { padding: 9px 18px; border-radius: 10px; background: linear-gradient(135deg, var(--p), var(--p2)); color: white; border: none; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .btn-card:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(108,99,255,0.4); }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E8E6FF', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6C63FF, #EC4899)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 12px rgba(108,99,255,0.35)' }}>🔄</div>
          <span style={{ fontWeight: 800, fontSize: '19px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillSwap</span>
          <span style={{ fontSize: '10px', background: '#EEF0FF', color: '#6C63FF', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>Belgium</span>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/explore" className="nav-link">Explorer</Link>
          <a href="#how" className="nav-link">Comment ça marche</a>
          <a href="#categories" className="nav-link">Catégories</a>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/auth" className="btn-outline">Se connecter</Link>
          <Link href="/auth?mode=register" className="btn-primary">Commencer →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 40px 80px', textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EEF0FF', color: '#6C63FF', padding: '9px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: 700, marginBottom: '32px', border: '1px solid #E8E6FF' }}>
          <span style={{ width: '7px', height: '7px', background: '#10B981', borderRadius: '50%' }} className="pulse"></span>
          🇧🇪 La plateforme belge d'échange de compétences
        </div>
        <h1 style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.12, marginBottom: '24px', letterSpacing: '-2px', color: '#1A1635' }}>
          Échangez vos talents,<br />
          <span className="gradient-text">développez votre business</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#4B4869', lineHeight: 1.75, marginBottom: '44px', maxWidth: '580px', margin: '0 auto 44px' }}>
          Connectez-vous avec des freelances et entrepreneurs belges. Offrez vos compétences, recevez celles dont vous avez besoin. Sans argent, juste du temps.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth?mode=register" className="btn-hero-p">🚀 Rejoindre gratuitement</Link>
          <Link href="/explore" className="btn-hero-s">👀 Explorer les profils</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '56px', justifyContent: 'center', marginTop: '72px', flexWrap: 'wrap', padding: '36px 40px', background: 'white', borderRadius: '24px', border: '1px solid #E8E6FF', boxShadow: '0 8px 40px rgba(108,99,255,0.08)' }}>
          {[['500+', 'Membres actifs'], ['1 200+', 'Échanges réalisés'], ['3', 'Régions belges'], ['4.9★', 'Note moyenne']].map(([v, l], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="stat-val">{v}</div>
              <div style={{ fontSize: '13px', color: '#9290B0', marginTop: '4px', fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" style={{ padding: '80px 40px', background: 'white', borderTop: '1px solid #E8E6FF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6C63FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>CATÉGORIES</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '10px' }}>Toutes les compétences</h2>
            <p style={{ fontSize: '16px', color: '#4B4869' }}>Des centaines de compétences disponibles en Belgique</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="cat-card">
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cat.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1635', marginBottom: '4px' }}>{cat.name}</div>
                <div style={{ fontSize: '12px', color: '#9290B0' }}>{cat.count} membres</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 40px', background: '#F8F7FF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6C63FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>FONCTIONNEMENT</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '10px' }}>Comment ça fonctionne ?</h2>
            <p style={{ fontSize: '16px', color: '#4B4869' }}>Simple, équitable et 100% belge</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card">
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #6C63FF, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '18px', boxShadow: '0 6px 16px rgba(108,99,255,0.3)' }}>{f.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6C63FF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Étape {i + 1}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#1A1635' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#4B4869', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 40px', background: 'white', borderTop: '1px solid #E8E6FF' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6C63FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>TÉMOIGNAGES</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>Ils nous font confiance</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="test-card">
                <div style={{ fontSize: '28px', color: '#6C63FF', marginBottom: '16px' }}>"</div>
                <p style={{ fontSize: '15px', color: '#4B4869', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E8E6FF' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: t.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1635' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#9290B0' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 40px', textAlign: 'center', background: 'linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '42px', fontWeight: 800, color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>Prêt à échanger vos compétences ?</h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.8)', marginBottom: '40px' }}>Rejoignez la communauté SkillSwap Belgium — 5 crédits offerts à l'inscription !</p>
          <Link href="/auth?mode=register" style={{ padding: '16px 48px', borderRadius: '14px', background: 'white', color: '#6C63FF', fontWeight: 800, fontSize: '16px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 28px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}>
            Commencer gratuitement →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 40px', background: '#1A1635', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔄</div>
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'white' }}>SkillSwap Belgium</span>
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>🇧🇪 FR · NL · EN · © 2026 SkillSwap Belgium</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Confidentialité', 'CGU', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
