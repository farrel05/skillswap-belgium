'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['Tous', 'Tech / Dev', 'Design', 'Marketing', 'Rédaction', 'Comptabilité', 'Photo / Vidéo', 'Langues', 'Coaching'];
const REGIONS = ['Toutes', 'Bruxelles', 'Wallonie', 'Flandre'];

export default function ExplorePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [region, setRegion] = useState('Toutes');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [search, category, region, profiles]);

  const loadProfiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);

    const { data } = await supabase
      .from('skillswap_profiles')
      .select('*, skills_offered(*)')
      .order('created_at', { ascending: false });

    setProfiles(data || []);
    setFiltered(data || []);
    setLoading(false);
  };

  const filterProfiles = () => {
    let result = [...profiles];
    if (currentUser) result = result.filter(p => p.id !== currentUser.id);
    if (search) result = result.filter(p =>
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.bio?.toLowerCase().includes(search.toLowerCase()) ||
      p.skills_offered?.some(s => s.title?.toLowerCase().includes(search.toLowerCase()))
    );
    if (region !== 'Toutes') result = result.filter(p => p.region === region);
    if (category !== 'Tous') result = result.filter(p =>
      p.skills_offered?.some(s => s.category === category)
    );
    setFiltered(result);
  };

  const requestExchange = async (providerId) => {
    if (!currentUser) { router.push('/auth'); return; }
    const { error } = await supabase.from('exchanges').insert({
      requester_id: currentUser.id,
      provider_id: providerId,
      hours: 1,
      status: 'pending',
      message: 'Bonjour, je souhaite échanger nos compétences !'
    });
    if (!error) alert('Demande d\'échange envoyée ! ✅');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔄</div>
          <span style={{ fontWeight: '700', color: 'var(--text-1)' }}>SkillSwap</span>
        </Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[['/dashboard', '🏠 Dashboard'], ['/explore', '🔍 Explorer'], ['/profile', '👤 Profil'], ['/exchanges', '🤝 Échanges']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: '13px', color: href === '/explore' ? 'var(--primary)' : 'var(--text-2)', textDecoration: 'none', fontWeight: href === '/explore' ? '600' : '400' }}>{label}</Link>
          ))}
        </div>
        {currentUser ? (
          <Link href="/profile" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Mon profil →</Link>
        ) : (
          <Link href="/auth" style={{ padding: '8px 20px', borderRadius: '10px', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Se connecter</Link>
        )}
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>🔍 Explorer les profils</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>{filtered.length} profil{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>
        </div>

        {/* Filtres */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Rechercher une compétence, un nom..."
            style={{ width: '100%', padding: '11px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '14px', outline: 'none', fontFamily: 'inherit', marginBottom: '16px' }} />

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '8px', fontWeight: '500' }}>RÉGION</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {REGIONS.map(r => (
                  <button key={r} onClick={() => setRegion(r)}
                    style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', border: `1.5px solid ${region === r ? 'var(--primary)' : 'var(--border)'}`, background: region === r ? 'var(--primary)' : 'white', color: region === r ? 'white' : 'var(--text-2)', cursor: 'pointer', fontWeight: '500' }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '8px', fontWeight: '500' }}>COMPÉTENCE</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', border: `1.5px solid ${category === c ? 'var(--primary)' : 'var(--border)'}`, background: category === c ? 'var(--primary)' : 'white', color: category === c ? 'white' : 'var(--text-2)', cursor: 'pointer' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grille de profils */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-3)' }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-3)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Aucun profil trouvé</p>
            <p style={{ fontSize: '14px' }}>Essayez d'autres filtres</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {filtered.map((p, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform 0.2s' }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', flexShrink: 0 }}>
                    {p.full_name?.[0] || '?'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.full_name || 'Anonyme'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{p.location || p.region || 'Belgique'}</div>
                  </div>
                </div>

                {/* Bio */}
                {p.bio && (
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.6', marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.bio}
                  </p>
                )}

                {/* Skills */}
                {p.skills_offered?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {p.skills_offered.slice(0, 3).map((s, j) => (
                      <span key={j} style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '10px', fontWeight: '500' }}>
                        {s.title}
                      </span>
                    ))}
                    {p.skills_offered.length > 3 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>+{p.skills_offered.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>
                    ⏱️ {p.credits} crédits
                  </span>
                  <button onClick={() => requestExchange(p.id)}
                    style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Demander →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
