'use client';
import Link from 'next/link';

const FEATURES = [
  { icon: '🤝', title: 'Échangez vos compétences', desc: 'Offrez ce que vous savez faire, recevez ce dont vous avez besoin' },
  { icon: '⏱️', title: 'Système de crédit-temps', desc: '1 heure offerte = 1 heure reçue. Simple et équitable' },
  { icon: '🇧🇪', title: 'Réseau belge', desc: 'Connectez-vous avec des professionnels près de chez vous' },
  { icon: '⭐', title: 'Évaluations vérifiées', desc: 'Système de confiance basé sur les avis de la communauté' },
];

const CATEGORIES = [
  { icon: '💻', name: 'Tech & Dev' },
  { icon: '🎨', name: 'Design' },
  { icon: '📊', name: 'Marketing' },
  { icon: '📝', name: 'Rédaction' },
  { icon: '🧮', name: 'Comptabilité' },
  { icon: '📸', name: 'Photo & Vidéo' },
  { icon: '🗣️', name: 'Langues' },
  { icon: '🏋️', name: 'Coaching' },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Navbar */}
      <nav style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px'
          }}>🔄</div>
          <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--text-1)' }}>SkillSwap</span>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '10px' }}>Belgium</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/auth" style={{
            padding: '8px 20px',
            borderRadius: '10px',
            border: '1.5px solid var(--primary)',
            color: 'var(--primary)',
            fontWeight: '500',
            fontSize: '14px',
            textDecoration: 'none',
          }}>Se connecter</Link>
          <Link href="/auth?mode=register" style={{
            padding: '8px 20px',
            borderRadius: '10px',
            background: 'var(--primary)',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(108,99,255,0.3)',
          }}>Commencer</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '24px',
        }}>🇧🇪 Plateforme belge d'échange de compétences</div>

        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          color: 'var(--text-1)',
          lineHeight: '1.2',
          marginBottom: '20px',
        }}>
          Échangez vos talents,<br />
          <span style={{ color: 'var(--primary)' }}>développez votre business</span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'var(--text-2)',
          lineHeight: '1.7',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px',
        }}>
          Connectez-vous avec des freelances et entrepreneurs belges. 
          Offrez vos compétences, recevez celles dont vous avez besoin. 
          Sans argent, juste du temps.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth?mode=register" style={{
            padding: '14px 32px',
            borderRadius: '12px',
            background: 'var(--primary)',
            color: 'white',
            fontWeight: '700',
            fontSize: '16px',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
          }}>🚀 Rejoindre gratuitement</Link>
          <Link href="/explore" style={{
            padding: '14px 32px',
            borderRadius: '12px',
            background: 'var(--surface)',
            color: 'var(--text-1)',
            fontWeight: '600',
            fontSize: '16px',
            textDecoration: 'none',
            border: '1.5px solid var(--border)',
          }}>👀 Explorer les profils</Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '40px',
          justifyContent: 'center',
          marginTop: '60px',
          flexWrap: 'wrap',
        }}>
          {[
            { value: '500+', label: 'Membres actifs' },
            { value: '1 200+', label: 'Échanges réalisés' },
            { value: '3', label: 'Régions belges' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories */}
      <section style={{ padding: '60px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Toutes les compétences</h2>
          <p style={{ color: 'var(--text-3)', marginBottom: '36px' }}>Des centaines de compétences disponibles en Belgique</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} style={{
                background: 'var(--bg)',
                border: '1.5px solid var(--border)',
                borderRadius: '14px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-1)' }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>
            Comment ça fonctionne ?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        background: 'var(--primary)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
          Prêt à échanger vos compétences ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '32px' }}>
          Rejoignez la communauté SkillSwap Belgium — 5 crédits offerts à l'inscription !
        </p>
        <Link href="/auth?mode=register" style={{
          padding: '14px 40px',
          borderRadius: '12px',
          background: 'white',
          color: 'var(--primary)',
          fontWeight: '700',
          fontSize: '16px',
          textDecoration: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}>Commencer gratuitement →</Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>
          🇧🇪 SkillSwap Belgium — FR · NL · EN
        </p>
      </footer>
    </div>
  );
}
