'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['Tech / Dev', 'Design', 'Marketing', 'Rédaction', 'Comptabilité', 'Photo / Vidéo', 'Langues', 'Coaching', 'Autre'];
const REGIONS = ['Bruxelles', 'Wallonie', 'Flandre'];

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', bio: '',
    region: '', category: '', location: ''
  });

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('Email et mot de passe requis.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) setError('Email ou mot de passe incorrect.');
    else router.push('/dashboard');
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.fullName) { setError('Champs obligatoires manquants.'); return; }
    if (form.password.length < 6) { setError('Mot de passe minimum 6 caractères.'); return; }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.fullName } }
    });

    if (error) { setError(error.message); }
    else if (data.user) {
      await supabase.from('skillswap_profiles').insert({
        id: data.user.id, email: form.email,
        full_name: form.fullName, bio: form.bio,
        region: form.region, location: form.location,
        credits: 5
      });
      setSuccess('Compte créé ! 5 crédits offerts 🎉 Vérifiez votre email.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      {/* Left panel */}
      <div style={{
        width: '420px', background: 'var(--primary)',
        padding: '48px 40px', display: 'flex', flexDirection: 'column',
        gap: '32px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🔄</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '18px', color: 'white' }}>SkillSwap</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Belgium</div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '12px' }}>
            Échangez vos compétences
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7' }}>
            Rejoignez la communauté de professionnels belges qui échangent leurs talents.
          </p>
        </div>

        {[
          { icon: '🎁', text: '5 crédits offerts à l\'inscription' },
          { icon: '🔒', text: 'Profils vérifiés et sécurisés' },
          { icon: '🇧🇪', text: 'Réseau 100% belge — FR/NL/EN' },
          { icon: '⭐', text: 'Système d\'évaluations transparent' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '440px', background: 'white', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                style={{
                  flex: 1, padding: '16px', fontSize: '14px', fontWeight: '500',
                  border: 'none', background: mode === m ? 'var(--primary-light)' : 'white',
                  color: mode === m ? 'var(--primary)' : 'var(--text-3)',
                  borderBottom: mode === m ? '2px solid var(--primary)' : 'none',
                  cursor: 'pointer',
                }}>
                {m === 'login' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'login' ? (
              <>
                <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Bon retour 👋</h2>
                <Field label="Email" type="email" value={form.email} onChange={v => handleChange('email', v)} placeholder="vous@exemple.com" />
                <Field label="Mot de passe" type="password" value={form.password} onChange={v => handleChange('password', v)} placeholder="••••••••" onEnter={handleLogin} />
                {error && <ErrorMsg msg={error} />}
                <SubmitBtn onClick={handleLogin} loading={loading} label="Se connecter →" />
                <p style={{ fontSize: '13px', color: 'var(--text-3)', textAlign: 'center' }}>
                  Pas de compte ? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }} onClick={() => setMode('register')}>Créer un compte gratuit</span>
                </p>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Créer votre compte 🚀</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '-8px' }}>5 crédits offerts à l'inscription !</p>
                <Field label="Nom complet *" value={form.fullName} onChange={v => handleChange('fullName', v)} placeholder="Jean Dupont" />
                <Field label="Email *" type="email" value={form.email} onChange={v => handleChange('email', v)} placeholder="vous@exemple.com" />
                <Field label="Mot de passe * (min. 6 car.)" type="password" value={form.password} onChange={v => handleChange('password', v)} placeholder="••••••••" />
                <Field label="Ville" value={form.location} onChange={v => handleChange('location', v)} placeholder="Bruxelles, Liège..." />

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', display: 'block', marginBottom: '8px' }}>Région</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {REGIONS.map(r => (
                      <button key={r} onClick={() => handleChange('region', r)}
                        style={{
                          flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px',
                          border: `1.5px solid ${form.region === r ? 'var(--primary)' : 'var(--border)'}`,
                          background: form.region === r ? 'var(--primary)' : 'white',
                          color: form.region === r ? 'white' : 'var(--text-2)',
                          cursor: 'pointer', fontWeight: '500',
                        }}>{r}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', display: 'block', marginBottom: '8px' }}>Votre principale compétence</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {CATEGORIES.map(c => (
                      <button key={c} onClick={() => handleChange('category', c)}
                        style={{
                          padding: '6px 12px', borderRadius: '20px', fontSize: '12px',
                          border: `1.5px solid ${form.category === c ? 'var(--primary)' : 'var(--border)'}`,
                          background: form.category === c ? 'var(--primary)' : 'white',
                          color: form.category === c ? 'white' : 'var(--text-2)',
                          cursor: 'pointer',
                        }}>{c}</button>
                    ))}
                  </div>
                </div>

                {error && <ErrorMsg msg={error} />}
                {success && <div style={{ background: '#D1FAE5', color: '#065F46', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>✅ {success}</div>}
                <SubmitBtn onClick={handleRegister} loading={loading} label="Créer mon compte gratuit →" />
                <p style={{ fontSize: '13px', color: 'var(--text-3)', textAlign: 'center' }}>
                  Déjà un compte ? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }} onClick={() => setMode('login')}>Se connecter</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, onEnter }) {
  return (
    <div>
      <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={e => e.key === 'Enter' && onEnter && onEnter()}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: '10px',
          border: '1.5px solid var(--border)', fontSize: '14px',
          outline: 'none', fontFamily: 'inherit', background: 'var(--bg)',
          color: 'var(--text-1)',
        }} />
    </div>
  );
}

function ErrorMsg({ msg }) {
  return <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>⚠️ {msg}</div>;
}

function SubmitBtn({ onClick, loading, label }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{
        width: '100%', padding: '13px', borderRadius: '12px',
        background: loading ? 'var(--border)' : 'var(--primary)',
        color: loading ? 'var(--text-3)' : 'white',
        border: 'none', fontWeight: '700', fontSize: '15px',
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: loading ? 'none' : '0 4px 14px rgba(108,99,255,0.3)',
        fontFamily: 'inherit',
      }}>
      {loading ? '⏳ Chargement...' : label}
    </button>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AuthForm />
    </Suspense>
  );
}
