'use client';
import Link from 'next/link';
import { useLang } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { t } from './i18n';

const CATEGORIES = [
  { icon: '💻', name: { fr: 'Tech & Dev', nl: 'Tech & Dev', en: 'Tech & Dev' }, count: '120+' },
  { icon: '🎨', name: { fr: 'Design', nl: 'Design', en: 'Design' }, count: '85+' },
  { icon: '📊', name: { fr: 'Marketing', nl: 'Marketing', en: 'Marketing' }, count: '94+' },
  { icon: '📝', name: { fr: 'Rédaction', nl: 'Schrijven', en: 'Writing' }, count: '67+' },
  { icon: '🧮', name: { fr: 'Comptabilité', nl: 'Boekhouding', en: 'Accounting' }, count: '45+' },
  { icon: '📸', name: { fr: 'Photo & Vidéo', nl: 'Foto & Video', en: 'Photo & Video' }, count: '58+' },
  { icon: '🗣️', name: { fr: 'Langues', nl: 'Talen', en: 'Languages' }, count: '72+' },
  { icon: '🏋️', name: { fr: 'Coaching', nl: 'Coaching', en: 'Coaching' }, count: '39+' },
];

const TESTIMONIALS = [
  { name: 'Sophie M.', role: { fr: 'Designer UX · Bruxelles', nl: 'UX Designer · Brussel', en: 'UX Designer · Brussels' }, text: { fr: 'J\'ai échangé mes skills Figma contre du développement React. Incroyable !', nl: 'Ik heb mijn Figma-vaardigheden geruild voor React-ontwikkeling. Ongelooflijk!', en: 'I exchanged my Figma skills for React development. Incredible!' }, avatar: 'S', color: '#6C63FF' },
  { name: 'Thomas D.', role: { fr: 'Dev Full-Stack · Liège', nl: 'Full-Stack Dev · Luik', en: 'Full-Stack Dev · Liège' }, text: { fr: 'SkillSwap m\'a permis de trouver un expert comptable sans débourser un centime.', nl: 'SkillSwap heeft me geholpen een accountant te vinden zonder een cent uit te geven.', en: 'SkillSwap helped me find an accountant without spending a cent.' }, avatar: 'T', color: '#10B981' },
  { name: 'Astrid V.', role: { fr: 'Marketing · Gand', nl: 'Marketing · Gent', en: 'Marketing · Ghent' }, text: { fr: 'La communauté est top, les échanges sont vraiment professionnels.', nl: 'De community is geweldig, de uitwisselingen zijn echt professioneel.', en: 'The community is great, the exchanges are truly professional.' }, avatar: 'A', color: '#F59E0B' },
];

const STEPS = [
  { icon: '🎯', step: 'step1', desc: 'step1d' },
  { icon: '🔍', step: 'step2', desc: 'step2d' },
  { icon: '🤝', step: 'step3', desc: 'step3d' },
  { icon: '⭐', step: 'step4', desc: 'step4d' },
];

export default function HomePage() {
  const { lang } = useLang();

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7FF' }}>

      {/* Navbar Desktop */}
      <nav className="desktop-nav" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E8E6FF', padding: '0 40px', alignItems: 'center', justifyContent: 'space-between', height: '70px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🔄</div>
          <span style={{ fontWeight: 800, fontSize: '19px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillSwap</span>
          <span style={{ fontSize: '10px', background: '#EEF0FF', color: '#6C63FF', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>Belgium</span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/explore" style={{ color: '#4B4869', fontWeight: 500, fontSize: '14px', textDecoration: 'none' }}>
            {t('nav.explore', lang).replace('🔍 ', '')}
          </Link>
          <a href="#how" style={{ color: '#4B4869', fontWeight: 500, fontSize: '14px', textDecoration: 'none' }}>
            {t('home.howTitle', lang)}
          </a>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <LanguageSwitcher />
          <Link href="/auth" style={{ padding: '9px 22px', borderRadius: '10px', border: '1.5px solid #6C63FF', color: '#6C63FF', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
            {t('nav.login', lang)}
          </Link>
          <Link href="/auth?mode=register" style={{ padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', fontWeight: 700, fontSize: '13px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}>
            {t('nav.register', lang)} →
          </Link>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="mobile-top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔄</div>
          <span style={{ fontWeight: 800, fontSize: '16px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillSwap</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <LanguageSwitcher compact />
          <Link href="/auth?mode=register" style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', fontWeight: 700, fontSize: '12px', textDecoration: 'none' }}>
            {t('nav.register', lang)}
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section style={{ padding: '80px 40px 60px', textAlign: 'center', maxWidth: '820px', margin: '0 auto' }} className="section-padding">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EEF0FF', color: '#6C63FF', padding: '9px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: 700, marginBottom: '32px', border: '1px solid #E8E6FF' }}>
          <span style={{ width: '7px', height: '7px', background: '#10B981', borderRadius: '50%', animation: 'pulse 2s infinite', display: 'inline-block' }}></span>
          {t('home.badge', lang)}
        </div>
        <h1 className="hero-title" style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.12, marginBottom: '24px', letterSpacing: '-2px', color: '#1A1635' }}>
          {t('home.title1', lang)}<br />
          <span style={{ background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('home.title2', lang)}
          </span>
        </h1>
        <p style={{ fontSize: '18px', color: '#4B4869', lineHeight: 1.75, marginBottom: '44px', maxWidth: '580px', margin: '0 auto 44px' }}>
          {t('home.subtitle', lang)}
        </p>
        <div className="hero-btns" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth?mode=register" style={{ padding: '15px 36px', borderRadius: '14px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 28px rgba(108,99,255,0.4)' }}>
            {t('home.joinBtn', lang)}
          </Link>
          <Link href="/explore" style={{ padding: '15px 36px', borderRadius: '14px', background: 'white', color: '#1A1635', fontWeight: 600, fontSize: '16px', textDecoration: 'none', border: '1.5px solid #E8E6FF' }}>
            {t('home.exploreBtn', lang)}
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-stats" style={{ display: 'flex', gap: '48px', justifyContent: 'center', marginTop: '64px', padding: '36px 40px', background: 'white', borderRadius: '24px', border: '1px solid #E8E6FF', boxShadow: '0 8px 40px rgba(108,99,255,0.08)', flexWrap: 'wrap' }}>
          {[['500+', 'membersLabel'], ['1 200+', 'exchangesLabel'], ['3', 'regionsLabel'], ['4.9★', 'ratingLabel']].map(([v, key], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '30px', fontWeight: 800, background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
              <div style={{ fontSize: '13px', color: '#9290B0', marginTop: '4px', fontWeight: 500 }}>{t(`home.${key}`, lang)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 40px', background: 'white', borderTop: '1px solid #E8E6FF' }} className="section-padding">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6C63FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>CATÉGORIES</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '10px' }}>{t('home.catTitle', lang)}</h2>
            <p style={{ fontSize: '16px', color: '#4B4869' }}>{t('home.catSub', lang)}</p>
          </div>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} style={{ background: '#F8F7FF', border: '1px solid #E8E6FF', borderRadius: '16px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cat.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1635', marginBottom: '4px' }}>{cat.name[lang] || cat.name.fr}</div>
                <div style={{ fontSize: '12px', color: '#9290B0' }}>{cat.count} {t('home.catMembers', lang)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 40px', background: '#F8F7FF' }} className="section-padding">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6C63FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>FONCTIONNEMENT</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '10px' }}>{t('home.howTitle', lang)}</h2>
            <p style={{ fontSize: '16px', color: '#4B4869' }}>{t('home.howSub', lang)}</p>
          </div>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
            {STEPS.map((f, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #E8E6FF', borderRadius: '18px', padding: '28px', transition: 'all 0.2s' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '18px', boxShadow: '0 6px 16px rgba(108,99,255,0.3)' }}>{f.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6C63FF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{t('home.step', lang)} {i + 1}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#1A1635' }}>{t(`home.${f.step}`, lang)}</h3>
                <p style={{ fontSize: '14px', color: '#4B4869', lineHeight: 1.65 }}>{t(`home.${f.desc}`, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 40px', background: 'white', borderTop: '1px solid #E8E6FF' }} className="section-padding">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6C63FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>TÉMOIGNAGES</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>{t('home.testTitle', lang)}</h2>
          </div>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {TESTIMONIALS.map((test, i) => (
              <div key={i} style={{ background: '#F8F7FF', border: '1px solid #E8E6FF', borderRadius: '20px', padding: '28px' }}>
                <div style={{ fontSize: '28px', color: '#6C63FF', marginBottom: '16px' }}></div>
                <p style={{ fontSize: '15px', color: '#4B4869', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>
                  {test.text[lang] || test.text.fr}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E8E6FF' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: test.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>{test.avatar}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1635' }}>{test.name}</div>
                    <div style={{ fontSize: '12px', color: '#9290B0' }}>{test.role[lang] || test.role.fr}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 40px', textAlign: 'center', background: 'linear-gradient(135deg,#6C63FF 0%,#4F46E5 100%)', position: 'relative', overflow: 'hidden' }} className="section-padding">
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '42px', fontWeight: 800, color: 'white', marginBottom: '16px', letterSpacing: '-1px' }} className="hero-title">{t('home.ctaTitle', lang)}</h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.8)', marginBottom: '40px' }}>{t('home.ctaSub', lang)}</p>
          <Link href="/auth?mode=register" style={{ padding: '16px 48px', borderRadius: '14px', background: 'white', color: '#6C63FF', fontWeight: 800, fontSize: '16px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 28px rgba(0,0,0,0.15)' }}>
            {t('home.ctaBtn', lang)}
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
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {['Confidentialité', 'CGU', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        @media(max-width:1024px){
          section { padding: 48px 16px !important; }
          h1 { font-size: 32px !important; letter-spacing: -1px !important; }
          h2 { font-size: 26px !important; }
          .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          footer { padding: 24px 16px !important; flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
