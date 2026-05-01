'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['Tous', 'Tech / Dev', 'Design', 'Marketing', 'Rédaction', 'Comptabilité', 'Photo / Vidéo', 'Langues', 'Coaching'];
const REGIONS = ['Toutes', 'Bruxelles', 'Wallonie', 'Flandre'];
const AVATAR_COLORS = [
  'linear-gradient(135deg,#6C63FF,#EC4899)',
  'linear-gradient(135deg,#10B981,#3B82F6)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#8B5CF6,#06B6D4)',
  'linear-gradient(135deg,#EC4899,#F97316)',
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; background: #F8F7FF; }
  :root { --p:#6C63FF;--p2:#4F46E5;--pl:#EEF0FF;--s:#EC4899;--b:#E8E6FF;--t1:#1A1635;--t2:#4B4869;--t3:#9290B0; }
  .nav-link { font-size: 13px; color: var(--t2); text-decoration: none; font-weight: 500; transition: color 0.2s; }
  .nav-link:hover,.nav-link.active { color: var(--p); font-weight: 700; }
  .filter-btn { padding: 7px 16px; border-radius: 20px; font-size: 12px; border: 1.5px solid var(--b); background: white; color: var(--t2); cursor: pointer; font-family: inherit; font-weight: 500; transition: all 0.2s; }
  .filter-btn:hover { border-color: var(--p); color: var(--p); }
  .filter-btn.active { background: var(--p); color: white; border-color: var(--p); font-weight: 700; box-shadow: 0 4px 12px rgba(108,99,255,0.3); }
  .profile-card { background: white; border: 1px solid var(--b); border-radius: 20px; padding: 24px; transition: all 0.3s; position: relative; overflow: hidden; }
  .profile-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--p), var(--s)); opacity: 0; transition: opacity 0.3s; }
  .profile-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(108,99,255,0.12); }
  .profile-card:hover::before { opacity: 1; }
  .skill-tag { font-size: 11px; padding: 4px 12px; border-radius: 20px; font-weight: 600; }
  .btn-request { padding: 9px 20px; border-radius: 10px; background: linear-gradient(135deg, var(--p), var(--p2)); color: white; border: none; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .btn-request:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(108,99,255,0.4); }
  .search-input { width: 100%; padding: 14px 20px 14px 48px; border-radius: 14px; border: 1.5px solid var(--b); font-size: 14px; outline: none; font-family: inherit; background: white; color: var(--t1); transition: all 0.2s; }
  .search-input:focus { border-color: var(--p); box-shadow: 0 0 0 4px rgba(108,99,255,0.1); }
  .search-input::placeholder { color: var(--t3); }
`;

export default function ExplorePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [region, setRegion] = useState('Toutes');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => { loadProfiles(); }, []);
  useEffect(() => { filterProfiles(); }, [search, category, region, profiles]);

  const loadProfiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    const { data } = await supabase.from('skillswap_profiles').select('*, skills_offered(*)').order('created_at', { ascending: false });
    setProfiles(data || []);
    setFiltered(data || []);
    setLoading(false);
  };

  const filterProfiles = () => {
    let result = [...profiles];
    if (currentUser) result = result.filter(p => p.id !== currentUser.id);
    if (search) result = result.filter(p => p.full_name?.toLowerCase().includes(search.toLowerCase()) || p.bio?.toLowerCase().includes(search.toLowerCase()) || p.skills_offered?.some(s => s.title?.toLowerCase().includes(search.toLowerCase())));
    if (region !== 'Toutes') result = result.filter(p => p.region === region);
    if (category !== 'Tous') result = result.filter(p => p.skills_offered?.some(s => s.category === category));
    setFiltered(result);
  };

  const requestExchange = async (providerId) => {
    if (!currentUser) { router.push('/auth'); return; }
    const { error } = await supabase.from('exchanges').insert({ requester_id: currentUser.id, provider_id: providerId, hours: 1, status: 'pending', message: 'Bonjour, je souhaite échanger nos compétences !' });
    if (!error) alert('Demande d\'échange envoyée ! ✅');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7FF', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{styles}</style>

      {/* Navbar */}
      <nav style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E8E6FF', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔄</div>
          <span style={{ fontWeight: 800, fontSize: '17px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillSwap</span>
        </Link>
        <div style={{ display: 'flex', gap: '28px' }}>
          {[['/dashboard','🏠 Dashboard',false],['/explore','🔍 Explorer',true],['/profile','👤 Profil',false],['/exchanges','🤝 Échanges',false]].map(([href,label,active]) => (
            <Link key={href} href={href} className={`nav-link ${active?'active':''}`}>{label}</Link>
          ))}
        </div>
        {currentUser ? (
          <Link href="/profile" style={{ padding: '9px 20px', borderRadius: '10px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>Mon profil →</Link>
        ) : (
          <Link href="/auth" style={{ padding: '9px 20px', borderRadius: '10px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>Se connecter</Link>
        )}
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1A1635', marginBottom: '6px', letterSpacing: '-0.5px' }}>🔍 Explorer les profils</h1>
          <p style={{ color: '#9290B0', fontSize: '14px' }}>{filtered.length} profil{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''} en Belgique</p>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', border: '1px solid #E8E6FF', borderRadius: '20px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(108,99,255,0.06)' }}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une compétence, un nom, une ville..." className="search-input" />
          </div>
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9290B0', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>RÉGION</div>
              <div style={{ display: 'flex', gap: '7px' }}>
                {REGIONS.map(r => <button key={r} onClick={() => setRegion(r)} className={`filter-btn ${region === r ? 'active' : ''}`}>{r}</button>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9290B0', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>COMPÉTENCE</div>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => <button key={c} onClick={() => setCategory(c)} className={`filter-btn ${category === c ? 'active' : ''}`}>{c}</button>)}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9290B0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
            <p>Chargement des profils...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px', border: '1px solid #E8E6FF' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#1A1635', marginBottom: '8px' }}>Aucun profil trouvé</p>
            <p style={{ fontSize: '14px', color: '#9290B0' }}>Essayez d'autres filtres ou élargissez votre recherche</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px' }}>
            {filtered.map((p, i) => (
              <div key={i} className="profile-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: AVATAR_COLORS[i % 5], color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', flexShrink: 0 }}>
                    {p.full_name?.[0] || '?'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#1A1635', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.full_name || 'Anonyme'}</div>
                    <div style={{ fontSize: '12px', color: '#9290B0', marginTop: '2px' }}>📍 {p.location || p.region || 'Belgique'}</div>
                  </div>
                </div>

                {p.bio && (
                  <p style={{ fontSize: '13px', color: '#4B4869', lineHeight: 1.65, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.bio}
                  </p>
                )}

                {p.skills_offered?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    {p.skills_offered.slice(0, 3).map((s, j) => {
                      const tagStyles = [
                        { bg: '#EEF0FF', color: '#4F46E5' },
                        { bg: '#F0FDF4', color: '#166534' },
                        { bg: '#FEF3C7', color: '#92400E' },
                      ];
                      const ts = tagStyles[j % 3];
                      return <span key={j} className="skill-tag" style={{ background: ts.bg, color: ts.color }}>{s.title}</span>;
                    })}
                    {p.skills_offered.length > 3 && <span style={{ fontSize: '12px', color: '#9290B0', alignSelf: 'center' }}>+{p.skills_offered.length - 3}</span>}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #E8E6FF' }}>
                  <div style={{ fontSize: '13px', background: '#EEF0FF', color: '#6C63FF', padding: '6px 14px', borderRadius: '20px', fontWeight: 700 }}>
                    ⏱️ {p.credits} crédits
                  </div>
                  <button onClick={() => requestExchange(p.id)} className="btn-request">Demander →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
