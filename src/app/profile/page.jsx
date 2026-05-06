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

const CATEGORIES_I18N = {
  fr: ['Tech / Dev', 'Design', 'Marketing', 'Rédaction', 'Comptabilité', 'Photo / Vidéo', 'Langues', 'Coaching', 'Autre'],
  nl: ['Tech / Dev', 'Design', 'Marketing', 'Schrijven', 'Boekhouding', 'Foto / Video', 'Talen', 'Coaching', 'Andere'],
  en: ['Tech / Dev', 'Design', 'Marketing', 'Writing', 'Accounting', 'Photo / Video', 'Languages', 'Coaching', 'Other'],
};
const CATEGORIES_DB = ['Tech / Dev', 'Design', 'Marketing', 'Rédaction', 'Comptabilité', 'Photo / Vidéo', 'Langues', 'Coaching', 'Autre'];
const LEVELS_I18N = {
  fr: ['Débutant', 'Intermédiaire', 'Expert'],
  nl: ['Beginner', 'Gemiddeld', 'Expert'],
  en: ['Beginner', 'Intermediate', 'Expert'],
};
const LEVELS_DB = ['Débutant', 'Intermédiaire', 'Expert'];
const REGIONS = ['Bruxelles', 'Wallonie', 'Flandre'];
const BANNER_GRADIENTS = [
  'linear-gradient(135deg,#6C63FF,#EC4899)',
  'linear-gradient(135deg,#10B981,#3B82F6)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#8B5CF6,#06B6D4)',
  'linear-gradient(135deg,#EC4899,#F97316)',
  'linear-gradient(135deg,#1A1635,#6C63FF)',
];

const S = `
  .nav-link{font-size:13px;color:#4B4869;text-decoration:none;font-weight:500;transition:color .2s}
  .nav-link:hover,.nav-link.active{color:#6C63FF;font-weight:700}
  .tab-nav{display:flex;border-bottom:2px solid #E8E6FF;margin-bottom:28px;gap:0}
  .tab-item{padding:14px 24px;font-size:14px;font-weight:600;color:#9290B0;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;transition:all .2s;background:none;border-top:none;border-left:none;border-right:none;font-family:inherit;white-space:nowrap}
  .tab-item:hover{color:#6C63FF}
  .tab-item.active{color:#6C63FF;border-bottom-color:#6C63FF}
  .field-input{width:100%;padding:11px 14px;border-radius:10px;border:1.5px solid #E8E6FF;font-size:14px;outline:none;font-family:inherit;color:#1A1635;background:#F8F7FF;transition:all .2s}
  .field-input:focus{border-color:#6C63FF;background:white;box-shadow:0 0 0 4px rgba(108,99,255,.08)}
  .field-input::placeholder{color:#9290B0}
  .skill-card{background:#F8F7FF;border:1.5px solid #E8E6FF;border-radius:14px;padding:16px;position:relative;transition:all .2s}
  .skill-card:hover{border-color:#6C63FF;transform:translateY(-2px);box-shadow:0 8px 24px rgba(108,99,255,.1)}
  .review-card{background:white;border:1px solid #E8E6FF;border-radius:16px;padding:20px;transition:all .2s}
  .review-card:hover{box-shadow:0 8px 24px rgba(108,99,255,.08)}
  .banner-opt{width:32px;height:32px;border-radius:8px;cursor:pointer;border:3px solid transparent;transition:all .2s;flex-shrink:0}
  .banner-opt:hover{transform:scale(1.1)}
  .banner-opt.selected{border-color:white;box-shadow:0 0 0 2px #6C63FF}
  .avatar-ring{width:96px;height:96px;border-radius:50%;border:4px solid white;box-shadow:0 4px 16px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:36px;color:white;position:relative;overflow:hidden;cursor:pointer;flex-shrink:0}
  .avatar-overlay{position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;font-size:20px}
  .avatar-ring:hover .avatar-overlay{opacity:1}
  .stat-box{background:white;border:1px solid #E8E6FF;border-radius:14px;padding:16px 20px;text-align:center;flex:1}
  .stat-val{font-size:24px;font-weight:800;background:linear-gradient(135deg,#6C63FF,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .level-badge{font-size:11px;padding:3px 10px;border-radius:20px;font-weight:700}
  .save-btn{padding:11px 28px;border-radius:12px;border:none;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:all .2s}
  .save-btn:hover:not(:disabled){transform:translateY(-1px)}
  .save-btn:disabled{opacity:.6;cursor:not-allowed}
  .page-wrap{max-width:900px;margin:0 auto;padding:0 24px 40px}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .grid-skills{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
  @media(max-width:1024px){
    .page-wrap{padding:0 16px 80px}
    .grid-2{grid-template-columns:1fr}
    .grid-skills{grid-template-columns:1fr}
    .tab-item{padding:12px 14px;font-size:13px}
  }
`;

export default function ProfilePage() {
  const router = useRouter();
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [newSkill, setNewSkill] = useState({ title: '', description: '', categoryIndex: 0, levelIndex: 1 });
  const [profileForm, setProfileForm] = useState({ full_name: '', bio: '', location: '', region: '' });

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  const loadData = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { router.push('/auth'); return; }
    setUser(u);
    const { data: p } = await supabase.from('skillswap_profiles').select('*').eq('id', u.id).single();
    if (p) {
      setProfile(p);
      setProfileForm({ full_name: p.full_name || '', bio: p.bio || '', location: p.location || '', region: p.region || '' });
      setBannerIndex(p.banner_index || 0);
    }
    const { data: offered } = await supabase.from('skills_offered').select('*').eq('user_id', u.id);
    setSkillsOffered(offered || []);
    const { data: exch } = await supabase
      .from('exchanges')
      .select('*, skillswap_profiles!exchanges_requester_id_fkey(*), skillswap_profiles!exchanges_provider_id_fkey(*)')
      .or(`requester_id.eq.${u.id},provider_id.eq.${u.id}`)
      .order('created_at', { ascending: false });
    setExchanges(exch || []);
    const { data: rev } = await supabase
      .from('reviews')
      .select('*, skillswap_profiles!reviews_reviewer_id_fkey(*)')
      .eq('reviewed_id', u.id)
      .order('created_at', { ascending: false });
    setReviews(rev || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from('skillswap_profiles').update({ ...profileForm, banner_index: bannerIndex }).eq('id', user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addSkill = async () => {
    if (!newSkill.title) return;
    const category = CATEGORIES_DB[newSkill.categoryIndex];
    const level = LEVELS_DB[newSkill.levelIndex];
    await supabase.from('skills_offered').insert({ title: newSkill.title, description: newSkill.description, category, level, user_id: user.id });
    setNewSkill({ title: '', description: '', categoryIndex: 0, levelIndex: 1 });
    setShowAddSkill(false);
    loadData();
  };

  const deleteSkill = async (id) => {
    await supabase.from('skills_offered').delete().eq('id', id);
    setSkillsOffered(prev => prev.filter(s => s.id !== id));
  };

  const categories = CATEGORIES_I18N[lang] || CATEGORIES_I18N.fr;
  const levels = LEVELS_I18N[lang] || LEVELS_I18N.fr;
  const initials = profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : user?.email?.[0]?.toUpperCase() || '?';
  const completedExchanges = exchanges.filter(e => e.status === 'completed').length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length).toFixed(1) : '—';

  const tabs = [
    { key: 'info',      label: lang==='fr'?'👤 Infos':lang==='nl'?'👤 Info':'👤 Info' },
    { key: 'skills',    label: lang==='fr'?'🎯 Compétences':lang==='nl'?'🎯 Vaardigheden':'🎯 Skills' },
    { key: 'exchanges', label: lang==='fr'?'🤝 Échanges':lang==='nl'?'🤝 Uitwisselingen':'🤝 Exchanges' },
    { key: 'reviews',   label: lang==='fr'?'⭐ Avis':lang==='nl'?'⭐ Beoordelingen':'⭐ Reviews' },
  ];

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:'16px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{S}</style>
      <div style={{ width:'48px', height:'48px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' }}>👤</div>
      <p style={{ color:'#9290B0', fontWeight:500 }}>{t('common.loading', lang)}</p>
    </div>
  );

  const inputStyle = { width:'100%', padding:'11px 14px', borderRadius:'10px', border:'1.5px solid #E8E6FF', fontSize:'14px', outline:'none', fontFamily:'inherit', color:'#1A1635', background:'#F8F7FF', transition:'all .2s' };

  return (
    <div style={{ minHeight:'100vh', background:'#F8F7FF', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{S}</style>

      <nav className="desktop-nav" style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid #E8E6FF', padding:'0 32px', alignItems:'center', justifyContent:'space-between', height:'68px', position:'sticky', top:0, zIndex:100 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'17px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
        </Link>
        <div style={{ display:'flex', gap:'28px' }}>
          {[
            ['/dashboard', t('nav.dashboard',lang), false],
            ['/explore',   t('nav.explore',lang),   false],
            ['/profile',   t('nav.profile',lang),   true],
            ['/exchanges', t('nav.exchanges',lang),  false],
            ['/messages',  t('nav.messages',lang),   false],
          ].map(([href,label,active]) => (
            <Link key={href} href={href} className={`nav-link ${active?'active':''}`}>{label}</Link>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <NotificationBell />
          <LanguageSwitcher />
          <div style={{ background:'#EEF0FF', color:'#6C63FF', padding:'8px 18px', borderRadius:'20px', fontSize:'13px', fontWeight:700, border:'1px solid #E8E6FF' }}>
            ⏱️ {profile?.credits || 0} {t('explore.credits', lang)}
          </div>
        </div>
      </nav>

      <MobileNav active="/profile" />

      <div className="page-wrap" style={{ paddingTop:0 }}>
        <div style={{ position:'relative', marginBottom:'80px' }}>
          <div style={{ height:'180px', background:BANNER_GRADIENTS[bannerIndex], borderRadius:'0 0 24px 24px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', background:'rgba(255,255,255,.08)', borderRadius:'50%' }}></div>
            <div style={{ position:'absolute', bottom:'-60px', left:'-30px', width:'150px', height:'150px', background:'rgba(255,255,255,.06)', borderRadius:'50%' }}></div>
          </div>
          <div style={{ position:'absolute', bottom:'-60px', left:'24px', display:'flex', alignItems:'flex-end', gap:'16px' }}>
            <div className="avatar-ring" style={{ background:BANNER_GRADIENTS[bannerIndex] }}>
              {initials}
              <div className="avatar-overlay">📷</div>
            </div>
            <div style={{ paddingBottom:'8px' }}>
              <h1 style={{ fontSize:'22px', fontWeight:800, color:'#1A1635', marginBottom:'2px' }}>{profile?.full_name || 'Mon profil'}</h1>
              <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' }}>
                {profile?.region && <span style={{ fontSize:'12px', color:'#9290B0' }}>📍 {profile.region}</span>}
                {profile?.location && <span style={{ fontSize:'12px', color:'#9290B0' }}>· {profile.location}</span>}
              </div>
            </div>
          </div>
          <div style={{ position:'absolute', bottom:'-60px', right:'0', display:'flex', gap:'10px' }}>
            {[
              { val: skillsOffered.length, label: lang==='fr'?'Compétences':lang==='nl'?'Vaardigheden':'Skills' },
              { val: completedExchanges,   label: lang==='fr'?'Échanges':lang==='nl'?'Uitwisselingen':'Exchanges' },
              { val: avgRating,            label: lang==='fr'?'Note moy.':lang==='nl'?'Gem. score':'Avg rating' },
            ].map((s, i) => (
              <div key={i} className="stat-box">
                <div className="stat-val">{s.val}</div>
                <div style={{ fontSize:'11px', color:'#9290B0', fontWeight:600, marginTop:'2px', whiteSpace:'nowrap' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tab-nav" style={{ overflowX:'auto' }}>
          {tabs.map(tab => (
            <button key={tab.key} className={`tab-item ${activeTab===tab.key?'active':''}`} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'24px' }}>
              <h2 style={{ fontSize:'15px', fontWeight:700, color:'#1A1635', marginBottom:'16px' }}>🎨 {lang==='fr'?'Personnalisation':lang==='nl'?'Aanpassing':'Customization'}</h2>
              <div style={{ marginBottom:'8px', fontSize:'13px', color:'#4B4869', fontWeight:600 }}>{lang==='fr'?'Couleur de bannière':lang==='nl'?'Bannerkleur':'Banner color'}</div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {BANNER_GRADIENTS.map((g, i) => (
                  <div key={i} className={`banner-opt ${bannerIndex===i?'selected':''}`} style={{ background:g }} onClick={() => setBannerIndex(i)} />
                ))}
              </div>
            </div>
            <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'24px' }}>
              <h2 style={{ fontSize:'15px', fontWeight:700, color:'#1A1635', marginBottom:'20px' }}>👤 {t('profile.general', lang)}</h2>
              <div className="grid-2" style={{ marginBottom:'16px' }}>
                {[
                  { label: t('profile.fullName', lang), field:'full_name', placeholder:'Jean Dupont' },
                  { label: t('profile.city', lang),     field:'location',  placeholder:'Bruxelles' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</label>
                    <input value={profileForm[field]} onChange={e => setProfileForm(f => ({ ...f, [field]: e.target.value }))} placeholder={placeholder} style={inputStyle} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{t('profile.bio', lang)}</label>
                <textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} placeholder={t('profile.bioPlaceholder', lang)} rows={4} style={{ ...inputStyle, resize:'vertical', lineHeight:1.6 }} />
                <div style={{ fontSize:'11px', color:'#9290B0', textAlign:'right', marginTop:'4px' }}>{profileForm.bio.length}/300</div>
              </div>
              <div style={{ marginBottom:'24px' }}>
                <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{t('profile.region', lang)}</label>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {REGIONS.map(r => (
                    <button key={r} onClick={() => setProfileForm(f => ({ ...f, region: r }))}
                      style={{ padding:'9px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:600, border:`1.5px solid ${profileForm.region===r?'#6C63FF':'#E8E6FF'}`, background:profileForm.region===r?'#6C63FF':'white', color:profileForm.region===r?'white':'#4B4869', cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}>
                      {r==='Bruxelles'?'🏙️':r==='Wallonie'?'🌿':'🌊'} {r}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={saveProfile} disabled={saving} className="save-btn"
                style={{ background:saved?'#10B981':'linear-gradient(135deg,#6C63FF,#4F46E5)', color:'white', boxShadow:saved?'0 4px 14px rgba(16,185,129,.3)':'0 4px 14px rgba(108,99,255,.3)' }}>
                {saving?'⏳ '+t('profile.saving',lang):saved?'✅ '+t('profile.saved',lang):'✓ '+t('profile.save',lang)}
              </button>

              {/* Déconnexion mobile */}
              <button onClick={handleLogout}
                style={{ marginTop:'12px', width:'100%', padding:'12px', borderRadius:'12px', background:'#FEF2F2', border:'1px solid #FECACA', color:'#EF4444', fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all .2s' }}>
                ↩ {t('nav.logout', lang)}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                <div>
                  <h2 style={{ fontSize:'15px', fontWeight:700, color:'#1A1635', marginBottom:'2px' }}>{t('profile.skillsOffered', lang)}</h2>
                  <p style={{ fontSize:'12px', color:'#9290B0' }}>{skillsOffered.length} {lang==='fr'?'compétence(s)':lang==='nl'?'vaardigheid(en)':'skill(s)'}</p>
                </div>
                <button onClick={() => setShowAddSkill(v => !v)}
                  style={{ padding:'9px 20px', borderRadius:'10px', background:showAddSkill?'#F8F7FF':'linear-gradient(135deg,#6C63FF,#4F46E5)', color:showAddSkill?'#6C63FF':'white', border:showAddSkill?'1.5px solid #E8E6FF':'none', fontSize:'13px', fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all .2s' }}>
                  {showAddSkill?'✕ Annuler':t('profile.addSkill',lang)}
                </button>
              </div>
              {showAddSkill && (
                <div style={{ background:'#F8F7FF', border:'1.5px solid #6C63FF', borderRadius:'16px', padding:'20px', marginBottom:'20px' }}>
                  <h3 style={{ fontSize:'14px', fontWeight:700, color:'#1A1635', marginBottom:'16px' }}>✨ {lang==='fr'?'Nouvelle compétence':lang==='nl'?'Nieuwe vaardigheid':'New skill'}</h3>
                  <div className="grid-2" style={{ marginBottom:'14px' }}>
                    <div>
                      <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'6px' }}>{t('profile.skillTitle',lang)} *</label>
                      <input value={newSkill.title} onChange={e => setNewSkill(s=>({...s,title:e.target.value}))} placeholder={t('profile.skillTitlePlaceholder',lang)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'6px' }}>{t('profile.level',lang)}</label>
                      <select value={newSkill.levelIndex} onChange={e => setNewSkill(s=>({...s,levelIndex:Number(e.target.value)}))} style={inputStyle}>
                        {levels.map((l,i) => <option key={i} value={i}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom:'14px' }}>
                    <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'8px' }}>{t('profile.category',lang)} *</label>
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      {categories.map((c,i) => (
                        <button key={i} onClick={() => setNewSkill(s=>({...s,categoryIndex:i}))}
                          style={{ padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:600, border:`1.5px solid ${newSkill.categoryIndex===i?'#6C63FF':'#E8E6FF'}`, background:newSkill.categoryIndex===i?'#6C63FF':'white', color:newSkill.categoryIndex===i?'white':'#4B4869', cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom:'16px' }}>
                    <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'6px' }}>{t('profile.description',lang)}</label>
                    <textarea value={newSkill.description} onChange={e => setNewSkill(s=>({...s,description:e.target.value}))} placeholder={t('profile.bioPlaceholder',lang)} rows={2} style={{...inputStyle,resize:'vertical'}} />
                  </div>
                  <button onClick={addSkill} style={{ padding:'10px 24px', borderRadius:'10px', background:'linear-gradient(135deg,#6C63FF,#4F46E5)', color:'white', border:'none', fontSize:'13px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                    ✓ {t('profile.confirm',lang)}
                  </button>
                </div>
              )}
              {skillsOffered.length === 0 ? (
                <div style={{ textAlign:'center', padding:'48px 20px' }}>
                  <div style={{ fontSize:'48px', marginBottom:'12px' }}>🎯</div>
                  <p style={{ fontSize:'15px', fontWeight:700, color:'#1A1635', marginBottom:'6px' }}>{t('profile.noSkills',lang)}</p>
                </div>
              ) : (
                <div className="grid-skills">
                  {skillsOffered.map((s,i) => {
                    const lc = {'Débutant':'#10B981','Intermédiaire':'#F59E0B','Expert':'#6C63FF'};
                    return (
                      <div key={i} className="skill-card">
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                          <div style={{ fontSize:'14px', fontWeight:700, color:'#1A1635', flex:1, marginRight:'8px' }}>{s.title}</div>
                          <button onClick={() => deleteSkill(s.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9290B0', fontSize:'14px', padding:'0', flexShrink:0 }} onMouseOver={e=>e.target.style.color='#EF4444'} onMouseOut={e=>e.target.style.color='#9290B0'}>✕</button>
                        </div>
                        <div style={{ display:'flex', gap:'6px', alignItems:'center', flexWrap:'wrap' }}>
                          <span style={{ fontSize:'11px', background:'#EEF0FF', color:'#6C63FF', padding:'3px 10px', borderRadius:'20px', fontWeight:600 }}>{s.category}</span>
                          <span className="level-badge" style={{ background:`${lc[s.level]||'#9290B0'}20`, color:lc[s.level]||'#9290B0' }}>{s.level}</span>
                        </div>
                        {s.description && <p style={{ fontSize:'12px', color:'#4B4869', marginTop:'8px', lineHeight:1.5 }}>{s.description}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'exchanges' && (
          <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'15px', fontWeight:700, color:'#1A1635' }}>🤝 {t('exchanges.title',lang)}</h2>
              <div style={{ display:'flex', gap:'8px' }}>
                <span style={{ fontSize:'12px', background:'#F0FDF4', color:'#166534', padding:'4px 12px', borderRadius:'20px', fontWeight:600 }}>{exchanges.filter(e=>e.status==='accepted').length} actifs</span>
                <span style={{ fontSize:'12px', background:'#EEF0FF', color:'#6C63FF', padding:'4px 12px', borderRadius:'20px', fontWeight:600 }}>{completedExchanges} terminés</span>
              </div>
            </div>
            {exchanges.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px' }}>
                <div style={{ fontSize:'48px', marginBottom:'12px' }}>🤝</div>
                <p style={{ fontSize:'15px', fontWeight:700, color:'#1A1635', marginBottom:'6px' }}>{t('exchanges.noExchanges',lang)}</p>
                <Link href="/explore" style={{ color:'#6C63FF', textDecoration:'none', fontWeight:600, fontSize:'14px' }}>{t('exchanges.explore',lang)}</Link>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {exchanges.map((exch,i) => {
                  const other = exch.requester_id===user?.id ? exch['skillswap_profiles!exchanges_provider_id_fkey'] : exch['skillswap_profiles!exchanges_requester_id_fkey'];
                  const sc = {pending:'#F59E0B',accepted:'#10B981',rejected:'#EF4444',completed:'#6C63FF'};
                  const sb = {pending:'#FEF3C7',accepted:'#D1FAE5',rejected:'#FEE2E2',completed:'#EEF0FF'};
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 16px', background:'#F8F7FF', borderRadius:'14px', border:'1px solid #E8E6FF' }}>
                      <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#6C63FF,#EC4899)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'16px', flexShrink:0 }}>{other?.full_name?.[0]||'?'}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:'14px', fontWeight:700, color:'#1A1635' }}>{other?.full_name||'Utilisateur'}</div>
                        <div style={{ fontSize:'12px', color:'#9290B0' }}>{new Date(exch.created_at).toLocaleDateString('fr-BE')}</div>
                      </div>
                      <span style={{ fontSize:'11px', padding:'4px 12px', borderRadius:'20px', fontWeight:600, background:sb[exch.status], color:sc[exch.status], flexShrink:0 }}>{t(`exchanges.${exch.status}`,lang)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'15px', fontWeight:700, color:'#1A1635' }}>⭐ {lang==='fr'?'Avis reçus':lang==='nl'?'Ontvangen beoordelingen':'Reviews received'}</h2>
              {reviews.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ fontSize:'24px', fontWeight:800, background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{avgRating}</span>
                  <div>
                    <div style={{ display:'flex', gap:'2px' }}>
                      {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize:'14px', color:i<=Math.round(parseFloat(avgRating))?'#F59E0B':'#E8E6FF' }}>★</span>)}
                    </div>
                    <div style={{ fontSize:'11px', color:'#9290B0' }}>{reviews.length} avis</div>
                  </div>
                </div>
              )}
            </div>
            {reviews.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px' }}>
                <div style={{ fontSize:'48px', marginBottom:'12px' }}>⭐</div>
                <p style={{ fontSize:'15px', fontWeight:700, color:'#1A1635', marginBottom:'6px' }}>{lang==='fr'?'Aucun avis pour le moment':lang==='nl'?'Nog geen beoordelingen':'No reviews yet'}</p>
                <p style={{ fontSize:'13px', color:'#9290B0' }}>{lang==='fr'?'Complétez des échanges pour recevoir des avis':lang==='nl'?'Voltooi uitwisselingen om beoordelingen te ontvangen':'Complete exchanges to receive reviews'}</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                {reviews.map((rev,i) => (
                  <div key={i} className="review-card">
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#6C63FF,#EC4899)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'14px' }}>
                          {rev['skillswap_profiles!reviews_reviewer_id_fkey']?.full_name?.[0]||'?'}
                        </div>
                        <div>
                          <div style={{ fontSize:'13px', fontWeight:700, color:'#1A1635' }}>{rev['skillswap_profiles!reviews_reviewer_id_fkey']?.full_name||'Utilisateur'}</div>
                          <div style={{ fontSize:'11px', color:'#9290B0' }}>{new Date(rev.created_at).toLocaleDateString('fr-BE')}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:'2px' }}>
                        {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize:'14px', color:i<=(rev.rating||0)?'#F59E0B':'#E8E6FF' }}>★</span>)}
                      </div>
                    </div>
                    {rev.comment && <p style={{ fontSize:'13px', color:'#4B4869', lineHeight:1.65, fontStyle:'italic' }}>{rev.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
