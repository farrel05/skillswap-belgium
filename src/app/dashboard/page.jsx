'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '../LanguageContext';
import { t } from '../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from '../MobileNav';



export default function DashboardPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth'); return; }
    setUser(user);
    const { data: profile } = await supabase.from('skillswap_profiles').select('*').eq('id', user.id).single();
    setProfile(profile);
    const { data: skills } = await supabase.from('skills_offered').select('*').eq('user_id', user.id);
    setSkills(skills || []);
    const { data: allProfiles } = await supabase.from('skillswap_profiles').select('*').neq('id', user.id).limit(4);
    setMatches(allProfiles || []);
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  const firstName = profile?.full_name?.split(' ')[0] || '';
  const initials = profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : user?.email?.[0]?.toUpperCase() || '?';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      
      <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🔄</div>
      <p style={{ color: '#9290B0', fontWeight: 500 }}>{t('common.loading', lang)}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7FF', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      

      {/* Navbar */}
      <nav className="desktop-nav" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E8E6FF', padding: '0 32px', alignItems: 'center', justifyContent: 'space-between', height: '68px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔄</div>
          <span style={{ fontWeight: 800, fontSize: '17px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillSwap</span>
        </Link>
        <div style={{ display: 'flex', gap: '28px' }}>
          {[
            ['/dashboard', t('nav.dashboard', lang), true],
            ['/explore', t('nav.explore', lang), false],
            ['/profile', t('nav.profile', lang), false],
            ['/exchanges', t('nav.exchanges', lang), false],
          ].map(([href, label, active]) => (
            <Link key={href} href={href} className={`nav-link ${active ? 'active' : ''}`}>{label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <LanguageSwitcher />
          <div style={{ background: '#EEF0FF', color: '#6C63FF', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, border: '1px solid #E8E6FF' }}>
            ⏱️ {profile?.credits || 0} {t('explore.credits', lang)}
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>{initials}</div>
          <button onClick={handleLogout} className="logout-btn">↩ {t('nav.logout', lang)}</button>
        </div>
      </nav>

      <MobileNav active="/dashboard" />
      <div className="page-wrap">

        {/* Welcome */}
        <div className="welcome-row">
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1A1635', marginBottom: '4px', letterSpacing: '-0.5px' }}>
              {t('dashboard.hello', lang)} {firstName} 👋
            </h1>
            <p style={{ color: '#9290B0', fontSize: '14px' }}>{t('dashboard.subtitle', lang)}</p>
          </div>
          <Link href="/profile" className="btn-full-mobile">
            {t('dashboard.addSkill', lang)}
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid-kpi">
          {[
            { icon: '⏱️', label: t('dashboard.credits', lang), value: profile?.credits || 0, sub: t('dashboard.creditsUsable', lang), accent: true },
            { icon: '🎯', label: t('dashboard.skillsOffered', lang), value: skills.length, sub: t('dashboard.skillsVisible', lang), accent: false },
            { icon: '🤝', label: t('dashboard.exchanges', lang), value: 0, sub: t('dashboard.thisMonth', lang), accent: false },
            { icon: '⭐', label: t('dashboard.rating', lang), value: '—', sub: t('dashboard.outOf5', lang), accent: false },
          ].map((kpi, i) => (
            <div key={i} className={`kpi-card ${kpi.accent ? 'accent' : ''}`}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{kpi.icon}</div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: kpi.accent ? 'white' : '#1A1635', marginBottom: '4px' }}>{kpi.value}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: kpi.accent ? 'rgba(255,255,255,0.9)' : '#1A1635', marginBottom: '3px' }}>{kpi.label}</div>
              <div style={{ fontSize: '12px', color: kpi.accent ? 'rgba(255,255,255,0.6)' : '#9290B0' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid-2col">

          {/* Actions rapides */}
          <div style={{ background: 'white', border: '1px solid #E8E6FF', borderRadius: '20px', padding: '28px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1635', marginBottom: '20px' }}>{t('dashboard.quickActions', lang)}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/profile', icon: '➕', label: t('dashboard.addSkillAction', lang), color: '#EEF0FF' },
                { href: '/explore', icon: '🔍', label: t('dashboard.findProfile', lang), color: '#F0FDF4' },
                { href: '/exchanges', icon: '🤝', label: t('dashboard.myExchanges', lang), color: '#FFF7ED' },
              ].map((action, i) => (
                <Link key={i} href={action.href} className="action-card">
                  <div className="action-icon" style={{ background: action.color }}>
                    <span style={{ fontSize: '18px' }}>{action.icon}</span>
                  </div>
                  {action.label}
                  <span style={{ marginLeft: 'auto', color: '#9290B0', fontSize: '16px' }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Profils suggérés */}
          <div style={{ background: 'white', border: '1px solid #E8E6FF', borderRadius: '20px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1635' }}>{t('dashboard.suggested', lang)}</h2>
              <Link href="/explore" style={{ fontSize: '13px', color: '#6C63FF', textDecoration: 'none', fontWeight: 600 }}>{t('dashboard.seeAll', lang)}</Link>
            </div>
            {matches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
                <p style={{ fontSize: '14px', color: '#9290B0' }}>{t('dashboard.noProfiles', lang)}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {matches.map((m, i) => {
                  const colors = ['linear-gradient(135deg,#6C63FF,#EC4899)', 'linear-gradient(135deg,#10B981,#3B82F6)', 'linear-gradient(135deg,#F59E0B,#EF4444)', 'linear-gradient(135deg,#8B5CF6,#EC4899)'];
                  return (
                    <div key={i} className="profile-mini">
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: colors[i % 4], color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>
                        {m.full_name?.[0] || '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1635', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.full_name || 'Anonyme'}</div>
                        <div style={{ fontSize: '12px', color: '#9290B0' }}>{m.region || t('common.belgium', lang)}</div>
                      </div>
                      <div style={{ fontSize: '12px', background: '#EEF0FF', color: '#6C63FF', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, flexShrink: 0 }}>⏱️ {m.credits}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mes compétences */}
        <div style={{ background: 'white', border: '1px solid #E8E6FF', borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1635' }}>{t('dashboard.mySkills', lang)}</h2>
            <Link href="/profile" style={{ padding: '8px 18px', borderRadius: '10px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>{t('dashboard.addSkill', lang)}</Link>
          </div>
          {skills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1635', marginBottom: '8px' }}>{t('dashboard.noSkills', lang)}</p>
              <p style={{ fontSize: '14px', color: '#9290B0', marginBottom: '20px' }}>{t('profile.noSkills', lang)}</p>
              <Link href="/profile" style={{ padding: '11px 28px', borderRadius: '12px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>{t('dashboard.addFirstSkill', lang)}</Link>
            </div>
          ) : (
            <div className="grid-skills">
              {skills.map((s, i) => (
                <div key={i} style={{ background: '#F8F7FF', border: '1px solid #E8E6FF', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1635', marginBottom: '6px' }}>{s.title}</div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="skill-chip">{s.category}</span>
                    <span style={{ fontSize: '11px', color: '#9290B0' }}>{s.level}</span>
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
