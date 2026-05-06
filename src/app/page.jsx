'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
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
  { name: 'Sophie M.', role: { fr: 'Designer UX · Bruxelles', nl: 'UX Designer · Brussel', en: 'UX Designer · Brussels' }, text: { fr: 'J\'ai échangé mes skills Figma contre du React. Incroyable !', nl: 'Ik ruilde Figma voor React. Ongelooflijk!', en: 'I traded Figma for React skills. Incredible!' }, avatar: 'S', color: '#6C63FF' },
  { name: 'Thomas D.', role: { fr: 'Dev Full-Stack · Liège', nl: 'Full-Stack Dev · Luik', en: 'Full-Stack Dev · Liège' }, text: { fr: 'J\'ai trouvé un expert comptable sans débourser un centime.', nl: 'Ik vond een accountant zonder een cent uit te geven.', en: 'Found an accountant without spending a cent.' }, avatar: 'T', color: '#10B981' },
  { name: 'Astrid V.', role: { fr: 'Marketing · Gand', nl: 'Marketing · Gent', en: 'Marketing · Ghent' }, text: { fr: 'La communauté est top, les échanges sont vraiment pros.', nl: 'De community is geweldig, echt professioneel.', en: 'The community is top, truly professional.' }, avatar: 'A', color: '#F59E0B' },
];

export default function HomePage() {
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
  const [activeWord, setActiveWord] = useState(0);
  const words = lang === 'fr' ? ['compétences', 'talents', 'expertises', 'savoir-faire']
    : lang === 'nl' ? ['vaardigheden', 'talenten', 'expertise', 'kennis']
    : ['skills', 'talents', 'expertise', 'know-how'];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setActiveWord(w => (w + 1) % words.length), 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .glow { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
        .btn-primary { padding: 14px 32px; border-radius: 50px; background: linear-gradient(135deg,#6C63FF,#EC4899); color: white; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all .3s; box-shadow: 0 0 40px rgba(108,99,255,.4); border: none; cursor: pointer; font-family: inherit; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(108,99,255,.6); }
        .btn-secondary { padding: 14px 32px; border-radius: 50px; background: rgba(255,255,255,.08); color: white; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all .3s; border: 1px solid rgba(255,255,255,.15); }
        .btn-secondary:hover { background: rgba(255,255,255,.14); transform: translateY(-2px); }
        .word-rotate { display: inline-block; background: linear-gradient(135deg,#6C63FF,#EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .stat-card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 20px; padding: 20px 24px; text-align: center; transition: all .3s; }
        .stat-card:hover { background: rgba(255,255,255,.07); border-color: rgba(108,99,255,.3); transform: translateY(-4px); }
        .cat-card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 16px; padding: 20px; text-align: center; transition: all .3s; cursor: pointer; }
        .cat-card:hover { background: rgba(108,99,255,.15); border-color: rgba(108,99,255,.4); transform: translateY(-6px); }
        .step-card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 20px; padding: 28px; transition: all .3s; position: relative; overflow: hidden; }
        .step-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#6C63FF,#EC4899); opacity:0; transition:opacity .3s; }
        .step-card:hover { background: rgba(255,255,255,.07); transform: translateY(-4px); }
        .step-card:hover::before { opacity:1; }
        .test-card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 20px; padding: 28px; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(108,99,255,.15); border: 1px solid rgba(108,99,255,.3); color: #a5a0ff; padding: 8px 18px; border-radius: 50px; font-size: 13px; font-weight: 600; }
        .section-tag { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6C63FF; margin-bottom: 12px; display: block; }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        /* ── RESPONSIVE MOBILE ── */
        @media(max-width:768px){
          .home-nav { display: none !important; }
          .home-mobile-header { display: flex !important; }
          .hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
          .hero-btns { flex-direction: column !important; }
          .hero-btns a, .hero-btns button { width: 100% !important; justify-content: center !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 12px !important; }
          .cat-grid { grid-template-columns: repeat(2,1fr) !important; gap: 12px !important; }
          .steps-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .test-grid { grid-template-columns: 1fr !important; }
          section { padding: 60px 20px !important; }
          .cta-title { font-size: 32px !important; }
          footer { flex-direction: column !important; text-align: center !important; gap: 16px !important; padding: 24px 20px !important; }
        }
        @media(max-width:480px){
          .hero-title { font-size: 28px !important; }
          .cat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Glows */}
      <div className="glow" style={{ width:'600px', height:'600px', background:'rgba(108,99,255,.15)', top:'-200px', left:'-200px' }} />
      <div className="glow" style={{ width:'500px', height:'500px', background:'rgba(236,72,153,.1)', top:'-100px', right:'-150px' }} />

      {/* Navbar desktop */}
      <nav className="home-nav" style={{ position:'sticky', top:0, zIndex:100, padding:'0 40px', height:'70px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(10,10,15,.8)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'18px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
          <span style={{ fontSize:'10px', background:'rgba(108,99,255,.2)', color:'#a5a0ff', padding:'2px 10px', borderRadius:'20px', fontWeight:700, border:'1px solid rgba(108,99,255,.3)' }}>Belgium</span>
        </div>
        <div style={{ display:'flex', gap:'32px', alignItems:'center' }}>
          <a href="#how" style={{ color:'rgba(255,255,255,.6)', textDecoration:'none', fontSize:'14px', fontWeight:500 }}>{t('home.howTitle', lang)}</a>
          <Link href="/explore" style={{ color:'rgba(255,255,255,.6)', textDecoration:'none', fontSize:'14px', fontWeight:500 }}>{t('nav.explore', lang).replace('🔍 ','')}</Link>
        </div>
        <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
          <LanguageSwitcher />
          <Link href="/auth" style={{ padding:'8px 20px', borderRadius:'50px', background:'rgba(255,255,255,.08)', color:'white', fontSize:'13px', fontWeight:600, textDecoration:'none', border:'1px solid rgba(255,255,255,.15)' }}>{t('nav.login', lang)}</Link>
          <Link href="/auth?mode=register" className="btn-primary" style={{ padding:'10px 22px', fontSize:'13px' }}>{t('nav.register', lang)} →</Link>
        </div>
      </nav>

      {/* Mobile header */}
      <div className="home-mobile-header mobile-top-header" style={{ display:'none', background:'rgba(10,10,15,.95)', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'30px', height:'30px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'15px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <LanguageSwitcher compact />
          <Link href="/auth?mode=register" className="btn-primary" style={{ padding:'7px 14px', fontSize:'12px' }}>{t('nav.register', lang)}</Link>
        </div>
      </div>

      {/* Hero */}
      <section style={{ padding:'100px 40px 80px', maxWidth:'1200px', margin:'0 auto', position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:'60px' }}>
          <div className="badge" style={{ marginBottom:'28px' }}>
            <span style={{ width:'7px', height:'7px', background:'#10B981', borderRadius:'50%', display:'inline-block', boxShadow:'0 0 8px #10B981' }}></span>
            {t('home.badge', lang)}
          </div>
          <h1 className="hero-title" style={{ fontSize:'68px', fontWeight:900, lineHeight:1.05, letterSpacing:'-3px', marginBottom:'28px' }}>
            {t('home.title1', lang)}<br />
            <span className="word-rotate">{mounted ? words[activeWord] : words[0]}</span>
          </h1>
          <p style={{ fontSize:'18px', color:'rgba(255,255,255,.55)', lineHeight:1.75, marginBottom:'44px', maxWidth:'560px', margin:'0 auto 44px' }}>
            {t('home.subtitle', lang)}
          </p>
          <div className="hero-btns" style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth?mode=register" className="btn-primary" style={{ fontSize:'16px', padding:'16px 36px' }}>{t('home.joinBtn', lang)}</Link>
            <Link href="/explore" className="btn-secondary" style={{ fontSize:'16px', padding:'16px 36px' }}>{t('home.exploreBtn', lang)} →</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
          {[['500+', t('home.membersLabel',lang)],['1 200+', t('home.exchangesLabel',lang)],['3', t('home.regionsLabel',lang)],['4.9★', t('home.ratingLabel',lang)]].map(([v,label],i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize:'32px', fontWeight:900, background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:'4px' }}>{v}</div>
              <div style={{ fontSize:'13px', color:'rgba(255,255,255,.5)', fontWeight:500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding:'80px 40px', maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <span className="section-tag">CATÉGORIES</span>
          <h2 style={{ fontSize:'42px', fontWeight:800, letterSpacing:'-1.5px', marginBottom:'12px' }}>{t('home.catTitle', lang)}</h2>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:'16px' }}>{t('home.catSub', lang)}</p>
        </div>
        <div className="cat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="cat-card">
              <div style={{ fontSize:'36px', marginBottom:'12px' }}>{cat.icon}</div>
              <div style={{ fontSize:'14px', fontWeight:700, color:'white', marginBottom:'4px' }}>{cat.name[lang]||cat.name.fr}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,.4)' }}>{cat.count} {t('home.catMembers',lang)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding:'80px 40px', maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'56px' }}>
          <span className="section-tag">FONCTIONNEMENT</span>
          <h2 style={{ fontSize:'42px', fontWeight:800, letterSpacing:'-1.5px', marginBottom:'12px' }}>{t('home.howTitle', lang)}</h2>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:'16px' }}>{t('home.howSub', lang)}</p>
        </div>
        <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }}>
          {[
            { icon:'🎯', step:'step1', desc:'step1d', n:'01' },
            { icon:'🔍', step:'step2', desc:'step2d', n:'02' },
            { icon:'🤝', step:'step3', desc:'step3d', n:'03' },
            { icon:'⭐', step:'step4', desc:'step4d', n:'04' },
          ].map((f,i) => (
            <div key={i} className="step-card">
              <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(108,99,255,.6)', letterSpacing:'2px', marginBottom:'16px' }}>{f.n}</div>
              <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:'linear-gradient(135deg,rgba(108,99,255,.3),rgba(236,72,153,.3))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', marginBottom:'16px', border:'1px solid rgba(108,99,255,.2)' }}>{f.icon}</div>
              <h3 style={{ fontSize:'16px', fontWeight:700, marginBottom:'8px', color:'white' }}>{t(`home.${f.step}`,lang)}</h3>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,.5)', lineHeight:1.65 }}>{t(`home.${f.desc}`,lang)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding:'80px 40px', maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'56px' }}>
          <span className="section-tag">TÉMOIGNAGES</span>
          <h2 style={{ fontSize:'42px', fontWeight:800, letterSpacing:'-1.5px' }}>{t('home.testTitle',lang)}</h2>
        </div>
        <div className="test-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' }}>
          {TESTIMONIALS.map((test,i) => (
            <div key={i} className="test-card">
              <div style={{ fontSize:'40px', color:'rgba(108,99,255,.4)', marginBottom:'16px', lineHeight:1 }}>"</div>
              <p style={{ fontSize:'15px', color:'rgba(255,255,255,.7)', lineHeight:1.75, marginBottom:'24px', fontStyle:'italic' }}>{test.text[lang]||test.text.fr}</p>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:test.color, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'16px' }}>{test.avatar}</div>
                <div>
                  <div style={{ fontSize:'14px', fontWeight:700, color:'white' }}>{test.name}</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,.4)' }}>{test.role[lang]||test.role.fr}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'100px 40px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div className="glow" style={{ width:'800px', height:'400px', background:'rgba(108,99,255,.2)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'pulse 4s ease-in-out infinite' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:'700px', margin:'0 auto' }}>
          <span className="section-tag">REJOINDRE</span>
          <h2 className="cta-title" style={{ fontSize:'54px', fontWeight:900, letterSpacing:'-2px', marginBottom:'20px', lineHeight:1.1 }}>{t('home.ctaTitle',lang)}</h2>
          <p style={{ fontSize:'18px', color:'rgba(255,255,255,.55)', marginBottom:'40px' }}>{t('home.ctaSub',lang)}</p>
          <Link href="/auth?mode=register" className="btn-primary" style={{ fontSize:'17px', padding:'18px 48px' }}>{t('home.ctaBtn',lang)}</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding:'32px 40px', borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'30px', height:'30px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>🔄</div>
          <span style={{ fontWeight:700, fontSize:'14px', color:'rgba(255,255,255,.8)' }}>SkillSwap Belgium</span>
        </div>
        <p style={{ fontSize:'13px', color:'rgba(255,255,255,.3)' }}>🇧🇪 FR · NL · EN · © 2026</p>
        <div style={{ display:'flex', gap:'20px' }}>
          {['Confidentialité','CGU','Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize:'13px', color:'rgba(255,255,255,.35)', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
