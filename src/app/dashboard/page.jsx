'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth'); return; }
    setUser(user);

    const { data: profile } = await supabase.from('skillswap_profiles').select('*').eq('id', user.id).single();
    setProfile(profile);

    const { data: skills } = await supabase.from('skills_offered').select('*').eq('user_id', user.id);
    setSkills(skills || []);

    // Charger quelques profils pour les suggestions
    const { data: allProfiles } = await supabase.from('skillswap_profiles').select('*').neq('id', user.id).limit(4);
    setMatches(allProfiles || []);

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🔄</div>
      <p style={{ color: 'var(--text-2)' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{
        background: 'white', borderBottom: '1px solid var(--border)',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '60px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔄</div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-1)' }}>SkillSwap</span>
          </Link>
          {[
            { href: '/dashboard', label: '🏠 Dashboard' },
            { href: '/explore', label: '🔍 Explorer' },
            { href: '/profile', label: '👤 Mon profil' },
            { href: '/exchanges', label: '🤝 Échanges' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ fontSize: '13px', color: 'var(--text-2)', textDecoration: 'none', fontWeight: '500' }}>{item.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
            ⏱️ {profile?.credits || 0} crédits
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text-3)' }}>↩ Déconnexion</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Bienvenue */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
            Bonjour {profile?.full_name?.split(' ')[0] || 'là'} 👋
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>Voici votre tableau de bord SkillSwap</p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: '⏱️', label: 'Crédits disponibles', value: profile?.credits || 0, color: 'var(--primary)' },
            { icon: '🎯', label: 'Compétences offertes', value: skills.length, color: 'var(--accent)' },
            { icon: '🤝', label: 'Échanges réalisés', value: 0, color: 'var(--secondary)' },
            { icon: '⭐', label: 'Note moyenne', value: '—', color: '#F59E0B' },
          ].map((kpi, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{kpi.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: kpi.color, marginBottom: '4px' }}>{kpi.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Actions rapides */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>⚡ Actions rapides</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/profile', icon: '➕', label: 'Ajouter une compétence', color: 'var(--primary)' },
                { href: '/explore', icon: '🔍', label: 'Trouver un profil', color: 'var(--accent)' },
                { href: '/exchanges', icon: '🤝', label: 'Voir mes échanges', color: 'var(--secondary)' },
              ].map((action, i) => (
                <Link key={i} href={action.href} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '10px',
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  textDecoration: 'none', color: 'var(--text-1)', fontSize: '14px', fontWeight: '500',
                }}>
                  <span style={{ fontSize: '18px' }}>{action.icon}</span>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Suggestions de profils */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>💡 Profils suggérés</h2>
            {matches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)', fontSize: '14px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
                Aucun profil pour l'instant.<br />Invitez des collègues !
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {matches.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', background: 'var(--bg)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                      {m.full_name?.[0] || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.full_name || 'Anonyme'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{m.region || 'Belgique'}</div>
                    </div>
                    <div style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '10px', fontWeight: '500' }}>
                      {m.credits} crédits
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mes compétences */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700' }}>🎯 Mes compétences offertes</h2>
            <Link href="/profile" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>+ Ajouter</Link>
          </div>
          {skills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)', fontSize: '14px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
              Aucune compétence ajoutée.<br />
              <Link href="/profile" style={{ color: 'var(--primary)', fontWeight: '600' }}>Ajoutez votre première compétence →</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {skills.map((s, i) => (
                <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{s.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
