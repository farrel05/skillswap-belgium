'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; background: #F8F7FF; }
  :root { --p:#6C63FF;--p2:#4F46E5;--pl:#EEF0FF;--s:#EC4899;--a:#10B981;--b:#E8E6FF;--t1:#1A1635;--t2:#4B4869;--t3:#9290B0; }
  .nav-link { font-size: 13px; color: var(--t2); text-decoration: none; font-weight: 500; transition: color 0.2s; }
  .nav-link:hover { color: var(--p); }
  .nav-link.active { color: var(--p); font-weight: 700; }
  .kpi-card { background: white; border: 1px solid var(--b); border-radius: 20px; padding: 24px; transition: all 0.2s; }
  .kpi-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(108,99,255,0.1); }
  .kpi-card.accent { background: linear-gradient(135deg, var(--p), var(--p2)); border-color: transparent; }
  .action-card { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 14px; background: #F8F7FF; border: 1px solid var(--b); text-decoration: none; color: var(--t1); font-size: 14px; font-weight: 600; transition: all 0.2s; }
  .action-card:hover { border-color: var(--p); background: var(--pl); transform: translateX(4px); }
  .action-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .profile-mini { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; background: #F8F7FF; border: 1px solid var(--b); transition: all 0.2s; }
  .profile-mini:hover { border-color: var(--p); background: var(--pl); }
  .skill-chip { font-size: 12px; background: var(--pl); color: var(--p); padding: 5px 14px; border-radius: 20px; font-weight: 600; }
  .logout-btn { background: none; border: none; cursor: pointer; font-size: 13px; color: var(--t3); font-family: inherit; padding: 8px 14px; border-radius: 8px; transition: all 0.2s; }
  .logout-btn:hover { background: #FEF2F2; color: #EF4444; }
`;

export default function DashboardPage() {
  const router = useRouter();
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

  const firstName = profile?.full_name?.split(' ')[0] || 'là';
  const initials = profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : user?.email?.[0]?.toUpperCase() || '?';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{navStyles}</style>
      <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🔄</div>
      <p style={{ color: '#9290B0', fontWeight: 500 }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7FF', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{navStyles}</style>

      {/* Navbar */}
      <nav style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E8E6FF', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔄</div>
          <span style={{ fontWeight: 800, fontSize: '17px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillSwap</span>
        </Link>
        <div style={{ display: 'flex', gap: '28px' }}>
          {[['/dashboard', '🏠 Dashboard', true], ['/explore', '🔍 Explorer', false], ['/profile', '👤 Profil', false], ['/exchanges', '🤝 Échanges', false]].map(([href, label, active]) => (
            <Link key={href} href={href} className={`nav-link ${active ? 'active' : ''}`}>{label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: '#EEF0FF', color: '#6C63FF', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, border: '1px solid #E8E6FF' }}>
            ⏱️ {profile?.credits || 0} crédits
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>{initials}</div>
          <button onClick={handleLogout} className="logout-btn">↩ Déco</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 32px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1A1635', marginBottom: '4px', letterSpacing: '-0.5px' }}>
              Bonjour {firstName} 👋
            </h1>
            <p style={{ color: '#9290B0', fontSize: '14px' }}>Voici votre tableau de bord SkillSwap Belgium</p>
          </div>
          <Link href="/profile" style={{ padding: '11px 24px', borderRadius: '12px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 700, boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}>
            + Ajouter une compétence
          </Link>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { icon: '⏱️', label: 'Crédits disponibles', value: profile?.credits || 0, sub: 'Utilisables pour des échanges', accent: true },
            { icon: '🎯', label: 'Compétences offertes', value: skills.length, sub: 'Visible par la communauté', accent: false },
            { icon: '🤝', label: 'Échanges réalisés', value: 0, sub: 'Ce mois-ci', accent: false },
            { icon: '⭐', label: 'Note moyenne', value: '—', sub: 'Sur 5 étoiles', accent: false },
          ].map((kpi, i) => (
            <div key={i} className={`kpi-card ${kpi.accent ? 'accent' : ''}`}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{kpi.icon}</div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: kpi.accent ? 'white' : '#1A1635', marginBottom: '4px' }}>{kpi.value}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: kpi.accent ? 'rgba(255,255,255,0.9)' : '#1A1635', marginBottom: '3px' }}>{kpi.label}</div>
              <div style={{ fontSize: '12px', color: kpi.accent ? 'rgba(255,255,255,0.6)' : '#9290B0' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* Actions rapides */}
          <div style={{ background: 'white', border: '1px solid #E8E6FF', borderRadius: '20px', padding: '28px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1635', marginBottom: '20px' }}>⚡ Actions rapides</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/profile', icon: '➕', label: 'Ajouter une compétence', color: '#EEF0FF', iconColor: '#6C63FF' },
                { href: '/explore', icon: '🔍', label: 'Trouver un profil compatible', color: '#F0FDF4', iconColor: '#10B981' },
                { href: '/exchanges', icon: '🤝', label: 'Voir mes échanges', color: '#FFF7ED', iconColor: '#F59E0B' },
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
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1635' }}>💡 Profils suggérés</h2>
              <Link href="/explore" style={{ fontSize: '13px', color: '#6C63FF', textDecoration: 'none', fontWeight: 600 }}>Voir tout →</Link>
            </div>
            {matches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
                <p style={{ fontSize: '14px', color: '#9290B0' }}>Aucun profil pour l'instant</p>
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
                        <div style={{ fontSize: '12px', color: '#9290B0' }}>{m.region || 'Belgique'}</div>
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
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1635' }}>🎯 Mes compétences offertes</h2>
            <Link href="/profile" style={{ padding: '8px 18px', borderRadius: '10px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>+ Ajouter</Link>
          </div>
          {skills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1635', marginBottom: '8px' }}>Aucune compétence ajoutée</p>
              <p style={{ fontSize: '14px', color: '#9290B0', marginBottom: '20px' }}>Ajoutez vos compétences pour être visible par la communauté</p>
              <Link href="/profile" style={{ padding: '11px 28px', borderRadius: '12px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>Ajouter ma première compétence →</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
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
