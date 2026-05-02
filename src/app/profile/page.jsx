'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '../LanguageContext';
import { t } from '../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from '../MobileNav';

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

export default function ProfilePage() {
  const router = useRouter();
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ title: '', description: '', categoryIndex: 0, levelIndex: 1 });
  const [profileForm, setProfileForm] = useState({ full_name: '', bio: '', location: '', region: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth'); return; }
    setUser(user);
    const { data: profile } = await supabase.from('skillswap_profiles').select('*').eq('id', user.id).single();
    if (profile) {
      setProfile(profile);
      setProfileForm({ full_name: profile.full_name || '', bio: profile.bio || '', location: profile.location || '', region: profile.region || '' });
    }
    const { data: offered } = await supabase.from('skills_offered').select('*').eq('user_id', user.id);
    setSkillsOffered(offered || []);
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from('skillswap_profiles').update(profileForm).eq('id', user.id);
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

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🔄</div>
      <p style={{ color: '#9290B0', fontWeight: 500 }}>{t('common.loading', lang)}</p>
    </div>
  );

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E8E6FF', fontSize: '14px', outline: 'none', fontFamily: 'inherit', color: '#1A1635', background: '#F8F7FF', transition: 'border 0.2s' };

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
            ['/dashboard', t('nav.dashboard', lang), false],
            ['/explore',   t('nav.explore', lang),   false],
            ['/profile',   t('nav.profile', lang),   true],
            ['/exchanges', t('nav.exchanges', lang),  false],
          ].map(([href, label, active]) => (
            <Link key={href} href={href} style={{ fontSize: '13px', color: active ? '#6C63FF' : '#4B4869', textDecoration: 'none', fontWeight: active ? 700 : 500 }}>{label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LanguageSwitcher />
          <div style={{ background: '#EEF0FF', color: '#6C63FF', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, border: '1px solid #E8E6FF' }}>
            ⏱️ {profile?.credits || 0} {t('explore.credits', lang)}
          </div>
        </div>
      </nav>

      <MobileNav active="/profile" />
      <div className="page-wrap-sm">

        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1A1635', letterSpacing: '-0.5px' }}>{t('profile.title', lang)}</h1>

        {/* Infos générales */}
        <div style={{ background: 'white', border: '1px solid #E8E6FF', borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1635', marginBottom: '20px' }}>{t('profile.general', lang)}</h2>
          <div className="grid-profile-form">
            {[
              { label: t('profile.fullName', lang), field: 'full_name', placeholder: 'Jean Dupont' },
              { label: t('profile.city', lang),     field: 'location',  placeholder: 'Bruxelles' },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B4869', display: 'block', marginBottom: '6px' }}>{label}</label>
                <input value={profileForm[field]} onChange={e => setProfileForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder} style={inputStyle} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B4869', display: 'block', marginBottom: '6px' }}>{t('profile.bio', lang)}</label>
            <textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
              placeholder={t('profile.bioPlaceholder', lang)} rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B4869', display: 'block', marginBottom: '8px' }}>{t('profile.region', lang)}</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => setProfileForm(f => ({ ...f, region: r }))}
                  style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: `1.5px solid ${profileForm.region === r ? '#6C63FF' : '#E8E6FF'}`, background: profileForm.region === r ? '#6C63FF' : 'white', color: profileForm.region === r ? 'white' : '#4B4869', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                  {r === 'Bruxelles' ? '🏙️' : r === 'Wallonie' ? '🌿' : '🌊'} {r}
                </button>
              ))}
            </div>
          </div>

          <button onClick={saveProfile} disabled={saving}
            style={{ marginTop: '20px', padding: '10px 28px', borderRadius: '12px', background: saved ? '#10B981' : 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(108,99,255,0.3)', transition: 'all 0.2s' }}>
            {saving ? t('profile.saving', lang) : saved ? t('profile.saved', lang) : t('profile.save', lang)}
          </button>
        </div>

        {/* Compétences offertes */}
        <div style={{ background: 'white', border: '1px solid #E8E6FF', borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1635' }}>{t('profile.skillsOffered', lang)}</h2>
            <button onClick={() => setShowAddSkill(v => !v)}
              style={{ padding: '8px 18px', borderRadius: '10px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('profile.addSkill', lang)}
            </button>
          </div>

          {showAddSkill && (
            <div style={{ background: '#F8F7FF', border: '1px solid #E8E6FF', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B4869', display: 'block', marginBottom: '4px' }}>{t('profile.skillTitle', lang)}</label>
                  <input value={newSkill.title} onChange={e => setNewSkill(s => ({ ...s, title: e.target.value }))}
                    placeholder={t('profile.skillTitlePlaceholder', lang)}
                    style={{ ...inputStyle, fontSize: '13px', padding: '9px 12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B4869', display: 'block', marginBottom: '4px' }}>{t('profile.level', lang)}</label>
                  <select value={newSkill.levelIndex} onChange={e => setNewSkill(s => ({ ...s, levelIndex: Number(e.target.value) }))}
                    style={{ ...inputStyle, fontSize: '13px', padding: '9px 12px' }}>
                    {levels.map((l, i) => <option key={i} value={i}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B4869', display: 'block', marginBottom: '6px' }}>{t('profile.category', lang)}</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {categories.map((c, i) => (
                    <button key={i} onClick={() => setNewSkill(s => ({ ...s, categoryIndex: i }))}
                      style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, border: `1.5px solid ${newSkill.categoryIndex === i ? '#6C63FF' : '#E8E6FF'}`, background: newSkill.categoryIndex === i ? '#6C63FF' : 'white', color: newSkill.categoryIndex === i ? 'white' : '#4B4869', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B4869', display: 'block', marginBottom: '4px' }}>{t('profile.description', lang)}</label>
                <textarea value={newSkill.description} onChange={e => setNewSkill(s => ({ ...s, description: e.target.value }))}
                  placeholder={t('profile.bioPlaceholder', lang)} rows={2}
                  style={{ ...inputStyle, fontSize: '13px', padding: '9px 12px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={addSkill}
                  style={{ padding: '9px 22px', borderRadius: '10px', background: 'linear-gradient(135deg,#6C63FF,#4F46E5)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {t('profile.confirm', lang)}
                </button>
                <button onClick={() => setShowAddSkill(false)}
                  style={{ padding: '9px 22px', borderRadius: '10px', background: 'white', color: '#4B4869', border: '1px solid #E8E6FF', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {t('profile.cancel', lang)}
                </button>
              </div>
            </div>
          )}

          {skillsOffered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9290B0', fontSize: '14px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎯</div>
              {t('profile.noSkills', lang)}
            </div>
          ) : (
            <div className="grid-skills-2">
              {skillsOffered.map((s, i) => (
                <div key={i} style={{ background: '#F8F7FF', border: '1px solid #E8E6FF', borderRadius: '12px', padding: '14px', position: 'relative' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1635', marginBottom: '6px' }}>{s.title}</div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', background: '#EEF0FF', color: '#6C63FF', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>{s.category}</span>
                    <span style={{ fontSize: '11px', color: '#9290B0' }}>{s.level}</span>
                  </div>
                  <button onClick={() => deleteSkill(s.id)}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#9290B0', lineHeight: 1 }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
