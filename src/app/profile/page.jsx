'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['Tech / Dev', 'Design', 'Marketing', 'Rédaction', 'Comptabilité', 'Photo / Vidéo', 'Langues', 'Coaching', 'Autre'];
const LEVELS = ['Débutant', 'Intermédiaire', 'Expert'];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ title: '', description: '', category: '', level: 'Intermédiaire' });
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

    const { data: wanted } = await supabase.from('skills_wanted').select('*').eq('user_id', user.id);
    setSkillsWanted(wanted || []);

    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from('skillswap_profiles').update(profileForm).eq('id', user.id);
    setSaving(false);
    alert('Profil sauvegardé ✅');
  };

  const addSkill = async () => {
    if (!newSkill.title || !newSkill.category) return;
    await supabase.from('skills_offered').insert({ ...newSkill, user_id: user.id });
    setNewSkill({ title: '', description: '', category: '', level: 'Intermédiaire' });
    setShowAddSkill(false);
    loadData();
  };

  const deleteSkill = async (id) => {
    await supabase.from('skills_offered').delete().eq('id', id);
    setSkillsOffered(prev => prev.filter(s => s.id !== id));
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Chargement...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔄</div>
          <span style={{ fontWeight: '700', color: 'var(--text-1)' }}>SkillSwap</span>
        </Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['/dashboard', '/explore', '/exchanges'].map((href, i) => (
            <Link key={i} href={href} style={{ fontSize: '13px', color: 'var(--text-2)', textDecoration: 'none' }}>
              {[' Dashboard', 'Explorer', 'Échanges'][i]}
            </Link>
          ))}
        </div>
        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
          ⏱️ {profile?.credits || 0} crédits
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>👤 Mon Profil</h1>

        {/* Infos générales */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Informations générales</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Nom complet', field: 'full_name', placeholder: 'Jean Dupont' },
              { label: 'Ville', field: 'location', placeholder: 'Bruxelles' },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>{label}</label>
                <input value={profileForm[field]} onChange={e => setProfileForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>Bio</label>
            <textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Décrivez votre parcours et vos compétences..."
              rows={3}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', display: 'block', marginBottom: '8px' }}>Région</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Bruxelles', 'Wallonie', 'Flandre'].map(r => (
                <button key={r} onClick={() => setProfileForm(f => ({ ...f, region: r }))}
                  style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', border: `1.5px solid ${profileForm.region === r ? 'var(--primary)' : 'var(--border)'}`, background: profileForm.region === r ? 'var(--primary)' : 'white', color: profileForm.region === r ? 'white' : 'var(--text-2)', cursor: 'pointer' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button onClick={saveProfile} disabled={saving}
            style={{ marginTop: '20px', padding: '10px 24px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {saving ? '⏳ Sauvegarde...' : '✓ Sauvegarder'}
          </button>
        </div>

        {/* Compétences offertes */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700' }}>🎯 Compétences offertes</h2>
            <button onClick={() => setShowAddSkill(v => !v)}
              style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              + Ajouter
            </button>
          </div>

          {showAddSkill && (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-2)', display: 'block', marginBottom: '4px' }}>Titre *</label>
                  <input value={newSkill.title} onChange={e => setNewSkill(s => ({ ...s, title: e.target.value }))} placeholder="Ex: Développement React"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-2)', display: 'block', marginBottom: '4px' }}>Niveau</label>
                  <select value={newSkill.level} onChange={e => setNewSkill(s => ({ ...s, level: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: 'white' }}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-2)', display: 'block', marginBottom: '4px' }}>Catégorie *</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setNewSkill(s => ({ ...s, category: c }))}
                      style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', border: `1.5px solid ${newSkill.category === c ? 'var(--primary)' : 'var(--border)'}`, background: newSkill.category === c ? 'var(--primary)' : 'white', color: newSkill.category === c ? 'white' : 'var(--text-2)', cursor: 'pointer' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-2)', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea value={newSkill.description} onChange={e => setNewSkill(s => ({ ...s, description: e.target.value }))} placeholder="Décrivez votre compétence..." rows={2}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={addSkill}
                  style={{ padding: '9px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✓ Ajouter
                </button>
                <button onClick={() => setShowAddSkill(false)}
                  style={{ padding: '9px 20px', borderRadius: '8px', background: 'white', color: 'var(--text-2)', border: '1px solid var(--border)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Annuler
                </button>
              </div>
            </div>
          )}

          {skillsOffered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-3)', fontSize: '14px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎯</div>
              Ajoutez vos compétences pour être visible par la communauté
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {skillsOffered.map((s, i) => (
                <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', position: 'relative' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px' }}>{s.category}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{s.level}</span>
                  </div>
                  <button onClick={() => deleteSkill(s.id)}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--text-3)' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
