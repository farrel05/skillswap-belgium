'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '../LanguageContext';
import { t } from '../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from '../MobileNav';
import NotificationBell from '../NotificationBell';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .dash-wrap { background: #0D0D14 !important; min-height: 100vh; color: white; font-family: 'Plus Jakarta Sans', sans-serif; }

  /* dash-nav : display géré par globals.css — PAS de display:flex ici */
  .dash-nav { background: rgba(13,13,20,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 0 32px; align-items: center; justify-content: space-between; height: 68px; position: sticky; top: 0; z-index: 100; }
  .dash-nav-link { font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; font-weight: 500; transition: color .2s; }
  .dash-nav-link:hover, .dash-nav-link.active { color: white; font-weight: 600; }
  .logout-btn { background: none; border: none; cursor: pointer; font-size: 13px; color: rgba(255,255,255,0.4); font-family: inherit; padding: 8px 14px; border-radius: 8px; transition: all .2s; }
  .logout-btn:hover { background: rgba(239,68,68,0.1); color: #EF4444; }

  .kpi-card { border-radius: 20px; padding: 24px; transition: all .3s; position: relative; overflow: hidden; }
  .kpi-card:hover { transform: translateY(-4px); }
  .kpi-accent { background: linear-gradient(135deg, #6C63FF, #4F46E5); border: none; }
  .kpi-default { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
  .kpi-default:hover { background: rgba(255,255,255,0.07); border-color: rgba(108,99,255,0.3); box-shadow: 0 20px 40px rgba(108,99,255,0.1); }

  .action-card { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); text-decoration: none; color: white; font-size: 14px; font-weight: 600; transition: all .2s; }
  .action-card:hover { background: rgba(108,99,255,0.12); border-color: rgba(108,99,255,0.3); transform: translateX(4px); }
  .action-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }

  .profile-mini { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); transition: all .2s; }
  .profile-mini:hover { background: rgba(108,99,255,0.1); border-color: rgba(108,99,255,0.3); }

  .skill-chip { font-size: 12px; background: rgba(108,99,255,0.2); color: #a5a0ff; padding: 4px 12px; border-radius: 20px; font-weight: 600; border: 1px solid rgba(108,99,255,0.2); }
  .dash-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; }

  .grid-kpi { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
  .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .grid-skills { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
  .page-wrap { max-width: 1200px; margin: 0 auto; padding: 32px; }
  .welcome-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
  .add-btn { padding: 11px 24px; border-radius: 50px; background: linear-gradient(135deg,#6C63FF,#4F46E5); color: white; text-decoration: none; font-size: 14px; font-weight: 700; box-shadow: 0 0 30px rgba(108,99,255,0.3); white-space: nowrap; transition: all .2s; }
  .add-btn:hover { box-shadow: 0 0 50px rgba(108,99,255,0.5); transform: translateY(-1px); }
  .first-skill-btn { display: inline-block; padding: 11px 28px; border-radius: 50px; background: linear-gradient(135deg,#6C63FF,#4F46E5); color: white; text-decoration: none; font-size: 14px; font-weight: 700; transition: all .2s; }
  .first-skill-btn:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(108,99,255,.4); }
  .glow-dot { width: 6px; height: 6px; background: #10B981; border-radius: 50%; box-shadow: 0 0 8px #10B981; display: inline-block; }

  @media(max-width:1024px){
    .grid-kpi { grid-template-columns: repeat(2,1fr); }
    .grid-2col { grid-template-columns: 1fr; }
    .grid-skills { grid-template-columns: repeat(2,1fr); }
    .welcome-row { flex-direction: column; align-items: flex-start; gap: 12px; }
    .page-wrap { padding: 20px 16px 80px; }
    .add-btn { width: 100%; text-align: center; display: block; }
    .first-skill-btn { width: 100%; text-align: center; display: block; box-sizing: border-box; }
  }
`;
export default function DashboardPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { router.push('/auth'); return; }
    setUser(u);
    const { data: p } = await supabase.from('skillswap_profiles').select('*').eq('id', u.id).single();
    setProfile(p);
    const { data: s } = await supabase.from('skills_offered').select('*').eq('user_id', u.id);
    setSkills(s || []);
    const { data: all } = await supabase.from('skillswap_profiles').select('*').neq('id', u.id).limit(4);
    setMatches(all || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };
  const firstName = profile?.full_name?.split(' ')[0] || '';
  const initials = profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : user?.email?.[0]?.toUpperCase() || '?';
  const BANNER_GRADIENTS = ['linear-gradient(135deg,#6C63FF,#EC4899)','linear-gradient(135deg,#10B981,#3B82F6)','linear-gradient(135deg,#F59E0B,#EF4444)','linear-gradient(135deg,#8B5CF6,#06B6D4)','linear-gradient(135deg,#EC4899,#F97316)','linear-gradient(135deg,#1A1635,#6C63FF)'];
  const bannerGrad = BANNER_GRADIENTS[profile?.banner_index || 0];

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0D0D14', flexDirection:'column', gap:'16px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{S}</style>
      <div style={{ width:'52px', height:'52px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px' }}>🔄</div>
      <p style={{ color:'rgba(255,255,255,0.4)', fontWeight:500 }}>{t('common.loading', lang)}</p>
    </div>
  );

  return (
    <div className="dash-wrap">
      <style>{S}</style>

      {/* Navbar desktop — cachée mobile via globals.css .dash-nav { display:none } */}
      <nav className="dash-nav">
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
          <div style={{ width:'34px', height:'34px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'17px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'17px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
        </Link>
        <div style={{ display:'flex', gap:'28px' }}>
          {[
            ['/dashboard', t('nav.dashboard',lang), true],
            ['/explore',   t('nav.explore',lang),   false],
            ['/profile',   t('nav.profile',lang),   false],
            ['/exchanges', t('nav.exchanges',lang),  false],
            ['/messages',  t('nav.messages',lang),   false],
          ].map(([href,label,active]) => (
            <Link key={href} href={href} className={`dash-nav-link ${active?'active':''}`}>{label}</Link>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <NotificationBell dark />
          <LanguageSwitcher />
          <Link href="/credits" style={{ background:'rgba(108,99,255,0.15)', color:'#a5a0ff', padding:'7px 16px', borderRadius:'20px', fontSize:'13px', fontWeight:700, border:'1px solid rgba(108,99,255,0.2)', textDecoration:'none', display:'flex', alignItems:'center', gap:'4px', transition:'all .2s' }}>
            ⏱️ {profile?.credits || 0} crédits
          </Link>
          <Link href="/profile" style={{ width:'36px', height:'36px', borderRadius:'50%', background:bannerGrad, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'13px', textDecoration:'none', boxShadow:'0 0 12px rgba(108,99,255,.4)' }}>{initials}</Link>
          <button onClick={handleLogout} className="logout-btn">↩ {t('nav.logout', lang)}</button>
        </div>
      </nav>

      <MobileNav active="/dashboard" />

      <div className="page-wrap">
        <div className="welcome-row">
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
              <span className="glow-dot"></span>
              <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:600, letterSpacing:'1px', textTransform:'uppercase' }}>
                {lang==='fr'?'En ligne':lang==='nl'?'Online':'Online'}
              </span>
            </div>
            <h1 style={{ fontSize:'30px', fontWeight:900, color:'white', marginBottom:'4px', letterSpacing:'-1px' }}>
              {t('dashboard.hello', lang)} {firstName} 👋
            </h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px' }}>{t('dashboard.subtitle', lang)}</p>
          </div>
          <Link href="/profile" className="add-btn">{t('dashboard.addSkill', lang)}</Link>
        </div>

        <div className="grid-kpi">
          {[
            { icon:'⏱️', label:t('dashboard.credits',lang), value:profile?.credits||0, sub:t('dashboard.creditsUsable',lang), accent:true },
            { icon:'🎯', label:t('dashboard.skillsOffered',lang), value:skills.length, sub:t('dashboard.skillsVisible',lang), accent:false },
            { icon:'🤝', label:t('dashboard.exchanges',lang), value:0, sub:t('dashboard.thisMonth',lang), accent:false },
            { icon:'⭐', label:t('dashboard.rating',lang), value:'—', sub:t('dashboard.outOf5',lang), accent:false },
          ].map((kpi, i) => (
            <div key={i} className={`kpi-card ${kpi.accent?'kpi-accent':'kpi-default'}`}>
              <div style={{ fontSize:'26px', marginBottom:'12px' }}>{kpi.icon}</div>
              <div style={{ fontSize:'32px', fontWeight:900, color:'white', marginBottom:'4px', letterSpacing:'-1px' }}>{kpi.value}</div>
              <div style={{ fontSize:'13px', fontWeight:700, color:kpi.accent?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.8)', marginBottom:'2px' }}>{kpi.label}</div>
              <div style={{ fontSize:'12px', color:kpi.accent?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.35)' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid-2col">
          <div className="dash-card">
            <h2 style={{ fontSize:'16px', fontWeight:800, color:'white', marginBottom:'16px' }}>{t('dashboard.quickActions', lang)}</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {[
                { href:'/profile',   icon:'➕', label:t('dashboard.addSkillAction',lang), bg:'rgba(108,99,255,0.15)' },
                { href:'/explore',   icon:'🔍', label:t('dashboard.findProfile',lang),    bg:'rgba(16,185,129,0.15)' },
                { href:'/exchanges', icon:'🤝', label:t('dashboard.myExchanges',lang),    bg:'rgba(245,158,11,0.15)' },
                { href:'/messages',  icon:'💬', label:t('nav.messages',lang),             bg:'rgba(236,72,153,0.15)' },
              ].map((action, i) => (
                <Link key={i} href={action.href} className="action-card">
                  <div className="action-icon" style={{ background:action.bg }}><span>{action.icon}</span></div>
                  {action.label}
                  <span style={{ marginLeft:'auto', color:'rgba(255,255,255,0.3)' }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="dash-card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'16px', fontWeight:800, color:'white' }}>{t('dashboard.suggested', lang)}</h2>
              <Link href="/explore" style={{ fontSize:'12px', color:'#a5a0ff', textDecoration:'none', fontWeight:600 }}>{t('dashboard.seeAll', lang)}</Link>
            </div>
            {matches.length === 0 ? (
              <div style={{ textAlign:'center', padding:'28px' }}>
                <div style={{ fontSize:'36px', marginBottom:'10px' }}>👥</div>
                <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)' }}>{t('dashboard.noProfiles', lang)}</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {matches.map((m, i) => {
                  const colors = ['linear-gradient(135deg,#6C63FF,#EC4899)','linear-gradient(135deg,#10B981,#3B82F6)','linear-gradient(135deg,#F59E0B,#EF4444)','linear-gradient(135deg,#8B5CF6,#EC4899)'];
                  return (
                    <div key={i} className="profile-mini">
                      <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:colors[i%4], color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'13px', flexShrink:0 }}>{m.full_name?.[0]||'?'}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:'13px', fontWeight:700, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.full_name||'Anonyme'}</div>
                        <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>{m.region||t('common.belgium',lang)}</div>
                      </div>
                      <div style={{ fontSize:'11px', background:'rgba(108,99,255,0.2)', color:'#a5a0ff', padding:'3px 10px', borderRadius:'20px', fontWeight:700, flexShrink:0 }}>⏱️ {m.credits}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="dash-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
            <h2 style={{ fontSize:'16px', fontWeight:800, color:'white' }}>{t('dashboard.mySkills', lang)}</h2>
            <Link href="/profile" style={{ padding:'7px 16px', borderRadius:'20px', background:'rgba(108,99,255,0.15)', color:'#a5a0ff', textDecoration:'none', fontSize:'12px', fontWeight:700, border:'1px solid rgba(108,99,255,0.2)' }}>{t('dashboard.addSkill', lang)}</Link>
          </div>
          {skills.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px' }}>
              <div style={{ fontSize:'48px', marginBottom:'14px' }}>🎯</div>
              <p style={{ fontSize:'15px', fontWeight:700, color:'white', marginBottom:'6px' }}>{t('dashboard.noSkills', lang)}</p>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)', marginBottom:'20px' }}>{t('profile.noSkills', lang)}</p>
              <Link href="/profile" className="first-skill-btn">{t('dashboard.addFirstSkill', lang)}</Link>
            </div>
          ) : (
            <div className="grid-skills">
              {skills.map((s, i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'14px' }}>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'white', marginBottom:'6px' }}>{s.title}</div>
                  <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                    <span className="skill-chip">{s.category}</span>
                    <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)' }}>{s.level}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}