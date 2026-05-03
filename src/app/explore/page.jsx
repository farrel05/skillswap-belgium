'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '../LanguageContext';
import { t } from '../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from '../MobileNav';

const CATEGORIES_I18N = {
  fr: ['Tous','Tech / Dev','Design','Marketing','Rédaction','Comptabilité','Photo / Vidéo','Langues','Coaching'],
  nl: ['Allen','Tech / Dev','Design','Marketing','Schrijven','Boekhouding','Foto / Video','Talen','Coaching'],
  en: ['All','Tech / Dev','Design','Marketing','Writing','Accounting','Photo / Video','Languages','Coaching'],
};
const CATEGORIES_DB = ['Tous','Tech / Dev','Design','Marketing','Rédaction','Comptabilité','Photo / Vidéo','Langues','Coaching'];
const REGIONS = ['Toutes','Bruxelles','Wallonie','Flandre'];
const AVATAR_COLORS = ['linear-gradient(135deg,#6C63FF,#EC4899)','linear-gradient(135deg,#10B981,#3B82F6)','linear-gradient(135deg,#F59E0B,#EF4444)','linear-gradient(135deg,#8B5CF6,#06B6D4)','linear-gradient(135deg,#EC4899,#F97316)'];

const S = `
  .nav-link{font-size:13px;color:#4B4869;text-decoration:none;font-weight:500;transition:color .2s}
  .nav-link:hover,.nav-link.active{color:#6C63FF;font-weight:700}
  .filter-btn{padding:7px 16px;border-radius:20px;font-size:12px;border:1.5px solid #E8E6FF;background:white;color:#4B4869;cursor:pointer;font-family:inherit;font-weight:500;transition:all .2s}
  .filter-btn:hover{border-color:#6C63FF;color:#6C63FF}
  .filter-btn.active{background:#6C63FF;color:white;border-color:#6C63FF;font-weight:700;box-shadow:0 4px 12px rgba(108,99,255,.3)}
  .profile-card{background:white;border:1px solid #E8E6FF;border-radius:20px;padding:24px;transition:all .3s;position:relative;overflow:hidden}
  .profile-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#6C63FF,#EC4899);opacity:0;transition:opacity .3s}
  .profile-card:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(108,99,255,.12)}
  .profile-card:hover::before{opacity:1}
  .skill-tag{font-size:11px;padding:4px 12px;border-radius:20px;font-weight:600}
  .btn-request{padding:9px 20px;border-radius:10px;background:linear-gradient(135deg,#6C63FF,#4F46E5);color:white;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
  .btn-request:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(108,99,255,.4)}
  .search-input{width:100%;padding:14px 20px 14px 48px;border-radius:14px;border:1.5px solid #E8E6FF;font-size:14px;outline:none;font-family:inherit;background:white;color:#1A1635;transition:all .2s}
  .search-input:focus{border-color:#6C63FF;box-shadow:0 0 0 4px rgba(108,99,255,.1)}
  .search-input::placeholder{color:#9290B0}
  .page-wrap{max-width:1200px;margin:0 auto;padding:40px 32px}
  .grid-3col{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
  @media(max-width:1024px){
    .page-wrap{padding:20px 16px}
    .grid-3col{grid-template-columns:1fr}
  }
`;

export default function ExplorePage() {
  const router = useRouter();
  const { lang } = useLang();
  const [profiles, setProfiles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [region, setRegion] = useState('Toutes');
  const [currentUser, setCurrentUser] = useState(null);

  const loadProfiles = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    const { data } = await supabase.from('skillswap_profiles').select('*, skills_offered(*)').order('created_at', { ascending: false });
    setProfiles(data || []);
    setFiltered(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadProfiles(); }, [loadProfiles]);

  useEffect(() => {
    let result = [...profiles];
    const categoryDB = CATEGORIES_DB[categoryIndex];
    if (currentUser) result = result.filter(p => p.id !== currentUser.id);
    if (search) result = result.filter(p =>
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.bio?.toLowerCase().includes(search.toLowerCase()) ||
      p.skills_offered?.some(s => s.title?.toLowerCase().includes(search.toLowerCase()))
    );
    if (region !== 'Toutes') result = result.filter(p => p.region === region);
    if (categoryDB !== 'Tous') result = result.filter(p => p.skills_offered?.some(s => s.category === categoryDB));
    setFiltered(result);
  }, [search, categoryIndex, region, profiles, currentUser]);

  const requestExchange = async (providerId) => {
    if (!currentUser) { router.push('/auth'); return; }
    const { error } = await supabase.from('exchanges').insert({ requester_id: currentUser.id, provider_id: providerId, hours: 1, status: 'pending', message: 'Bonjour, je souhaite échanger nos compétences !' });
    if (!error) alert('Demande d\'échange envoyée ! ✅');
  };

  const categories = CATEGORIES_I18N[lang] || CATEGORIES_I18N.fr;

  return (
    <div style={{ minHeight:'100vh', background:'#F8F7FF', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{S}</style>

      <nav className="desktop-nav" style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid #E8E6FF', padding:'0 32px', alignItems:'center', justifyContent:'space-between', height:'68px', position:'sticky', top:0, zIndex:100 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'17px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
        </Link>
        <div style={{ display:'flex', gap:'28px' }}>
          {[['/dashboard',t('nav.dashboard',lang),false],['/explore',t('nav.explore',lang),true],['/profile',t('nav.profile',lang),false],['/exchanges',t('nav.exchanges',lang),false]].map(([href,label,active]) => (
            <Link key={href} href={href} className={`nav-link ${active?'active':''}`}>{label}</Link>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <LanguageSwitcher />
          {currentUser
            ? <Link href="/profile" style={{ padding:'9px 20px', borderRadius:'10px', background:'linear-gradient(135deg,#6C63FF,#4F46E5)', color:'white', textDecoration:'none', fontSize:'13px', fontWeight:700 }}>{t('nav.profile',lang)} →</Link>
            : <Link href="/auth" style={{ padding:'9px 20px', borderRadius:'10px', background:'linear-gradient(135deg,#6C63FF,#4F46E5)', color:'white', textDecoration:'none', fontSize:'13px', fontWeight:700 }}>{t('nav.login',lang)}</Link>
          }
        </div>
      </nav>

      <MobileNav active="/explore" />

      <div className="page-wrap">
        <div style={{ marginBottom:'36px' }}>
          <h1 style={{ fontSize:'32px', fontWeight:800, color:'#1A1635', marginBottom:'6px', letterSpacing:'-0.5px' }}>{t('explore.title', lang)}</h1>
          <p style={{ color:'#9290B0', fontSize:'14px' }}>{filtered.length} {t('explore.profiles',lang)}{filtered.length>1?'s':''} {t('explore.subtitle',lang)}</p>
        </div>

        <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'24px', marginBottom:'32px', boxShadow:'0 4px 20px rgba(108,99,255,.06)' }}>
          <div style={{ position:'relative', marginBottom:'20px' }}>
            <span style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', fontSize:'18px' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('explore.search',lang)} className="search-input" />
          </div>
          <div style={{ display:'flex', gap:'28px', flexWrap:'wrap' }}>
            <div>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#9290B0', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'10px' }}>{t('explore.region',lang)}</div>
              <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                {REGIONS.map((r, i) => (
                  <button key={r} onClick={() => setRegion(r)} className={`filter-btn ${region===r?'active':''}`}>
                    {i===0 ? t('explore.allRegions',lang) : r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#9290B0', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'10px' }}>{t('explore.skill',lang)}</div>
              <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                {categories.map((c, i) => (
                  <button key={c} onClick={() => setCategoryIndex(i)} className={`filter-btn ${categoryIndex===i?'active':''}`}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'80px', color:'#9290B0' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>⏳</div>
            <p>{t('common.loading', lang)}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px', background:'white', borderRadius:'20px', border:'1px solid #E8E6FF' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>👥</div>
            <p style={{ fontSize:'18px', fontWeight:700, color:'#1A1635', marginBottom:'8px' }}>{t('explore.noResults',lang)}</p>
            <p style={{ fontSize:'14px', color:'#9290B0' }}>{t('explore.noResultsSub',lang)}</p>
          </div>
        ) : (
          <div className="grid-3col">
            {filtered.map((p, i) => (
              <div key={i} className="profile-card">
                <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px' }}>
                  <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:AVATAR_COLORS[i%5], color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'20px', flexShrink:0 }}>{p.full_name?.[0]||'?'}</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:'15px', fontWeight:800, color:'#1A1635', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.full_name||'Anonyme'}</div>
                    <div style={{ fontSize:'12px', color:'#9290B0', marginTop:'2px' }}>📍 {p.location||p.region||t('common.belgium',lang)}</div>
                  </div>
                </div>
                {p.bio && <p style={{ fontSize:'13px', color:'#4B4869', lineHeight:1.65, marginBottom:'14px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.bio}</p>}
                {p.skills_offered?.length > 0 && (
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'18px' }}>
                    {p.skills_offered.slice(0,3).map((s,j) => {
                      const ts = [{bg:'#EEF0FF',color:'#4F46E5'},{bg:'#F0FDF4',color:'#166534'},{bg:'#FEF3C7',color:'#92400E'}][j%3];
                      return <span key={j} className="skill-tag" style={{ background:ts.bg, color:ts.color }}>{s.title}</span>;
                    })}
                    {p.skills_offered.length > 3 && <span style={{ fontSize:'12px', color:'#9290B0', alignSelf:'center' }}>+{p.skills_offered.length-3}</span>}
                  </div>
                )}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'16px', borderTop:'1px solid #E8E6FF' }}>
                  <div style={{ fontSize:'13px', background:'#EEF0FF', color:'#6C63FF', padding:'6px 14px', borderRadius:'20px', fontWeight:700 }}>⏱️ {p.credits} {t('explore.credits',lang)}</div>
                  <button onClick={() => requestExchange(p.id)} className="btn-request">{t('explore.request',lang)}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
