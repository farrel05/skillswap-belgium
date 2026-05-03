'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLang } from '../LanguageContext';
import { t } from '../i18n';
import LanguageSwitcher from '../LanguageSwitcher';

const CATEGORIES = {
  fr: ['Tech / Dev', 'Design', 'Marketing', 'Rédaction', 'Comptabilité', 'Photo / Vidéo', 'Langues', 'Coaching', 'Autre'],
  nl: ['Tech / Dev', 'Design', 'Marketing', 'Schrijven', 'Boekhouding', 'Foto / Video', 'Talen', 'Coaching', 'Andere'],
  en: ['Tech / Dev', 'Design', 'Marketing', 'Writing', 'Accounting', 'Photo / Video', 'Languages', 'Coaching', 'Other'],
};
const REGIONS = ['Bruxelles', 'Wallonie', 'Flandre'];

const FEATURES = {
  fr: [
    { icon: '🎁', title: '5 crédits offerts', desc: 'Commencez à échanger immédiatement' },
    { icon: '🔒', title: 'Profils vérifiés', desc: 'Communauté sécurisée et de confiance' },
    { icon: '🇧🇪', title: 'Réseau 100% belge', desc: 'FR · NL · EN — 3 régions couvertes' },
    { icon: '⭐', title: 'Évaluations transparentes', desc: 'Système de réputation vérifié' },
  ],
  nl: [
    { icon: '🎁', title: '5 credits gratis', desc: 'Begin meteen met uitwisselen' },
    { icon: '🔒', title: 'Geverifieerde profielen', desc: 'Veilige en betrouwbare community' },
    { icon: '🇧🇪', title: '100% Belgisch netwerk', desc: 'FR · NL · EN — 3 regio\'s gedekt' },
    { icon: '⭐', title: 'Transparante beoordelingen', desc: 'Geverifieerd reputatiesysteem' },
  ],
  en: [
    { icon: '🎁', title: '5 free credits', desc: 'Start exchanging immediately' },
    { icon: '🔒', title: 'Verified profiles', desc: 'Safe and trusted community' },
    { icon: '🇧🇪', title: '100% Belgian network', desc: 'FR · NL · EN — 3 regions covered' },
    { icon: '⭐', title: 'Transparent reviews', desc: 'Verified reputation system' },
  ],
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; }
  :root {
    --p: #6C63FF; --p2: #4F46E5; --pl: #EEF0FF;
    --s: #EC4899; --a: #10B981;
    --b: #E8E6FF; --t1: #1A1635; --t2: #4B4869; --t3: #9290B0;
  }
  .auth-input { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid var(--b); font-size: 14px; outline: none; font-family: inherit; background: #F8F7FF; color: var(--t1); transition: all 0.2s; }
  .auth-input:focus { border-color: var(--p); background: white; box-shadow: 0 0 0 4px rgba(108,99,255,0.1); }
  .auth-input::placeholder { color: var(--t3); }
  .tab-btn { flex: 1; padding: 14px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .opt-btn { padding: 8px 16px; border-radius: 20px; font-size: 12px; border: 1.5px solid var(--b); background: white; color: var(--t2); cursor: pointer; font-family: inherit; font-weight: 500; transition: all 0.2s; }
  .opt-btn:hover { border-color: var(--p); color: var(--p); }
  .opt-btn.active { background: var(--p); color: white; border-color: var(--p); font-weight: 700; }
  .submit-btn { width: 100%; padding: 14px; border-radius: 14px; background: linear-gradient(135deg, var(--p), var(--p2)); color: white; border: none; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; box-shadow: 0 6px 20px rgba(108,99,255,0.4); transition: all 0.2s; }
  .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(108,99,255,0.5); }
  .submit-btn:disabled { background: #E8E6FF; color: var(--t3); box-shadow: none; cursor: not-allowed; }
  .feature-item { display: flex; gap: 14px; align-items: flex-start; }
  .feature-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .auth-left-panel { display: flex; }
  @media(max-width:1024px) {
    .auth-left-panel { display: none !important; }
  }
`;

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLang();
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ email: '', password: '', fullName: '', bio: '', region: '', category: '', location: '' });

  const set = (field, value) => { setForm(f => ({ ...f, [field]: value })); setError(''); };

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError(t('auth.missingFields', lang)); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) setError(t('auth.wrongCredentials', lang));
    else router.push('/dashboard');
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.fullName) { setError(t('auth.missingFields', lang)); return; }
    if (form.password.length < 6) { setError(t('auth.minPassword', lang)); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.fullName } } });
    if (error) { setError(error.message); }
    else if (data.user) {
      await supabase.from('skillswap_profiles').insert({ id: data.user.id, email: form.email, full_name: form.fullName, bio: form.bio, region: form.region, location: form.location, credits: 5 });
      setSuccess(t('auth.successRegister', lang));
    }
    setLoading(false);
  };

  const features = FEATURES[lang] || FEATURES.fr;
  const categories = CATEGORIES[lang] || CATEGORIES.fr;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{styles}</style>

      {/* Left panel - caché sur mobile */}
      <div className="auth-left-panel" style={{ width: '480px', background: 'linear-gradient(145deg, #6C63FF 0%, #4F46E5 100%)', padding: '56px 48px', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '64px' }}>
            <div style={{ width: '42px', height: '42px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🔄</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '20px', color: 'white' }}>SkillSwap</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Belgium</div>
            </div>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '16px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
            {t('home.title1', lang)}<br />{t('home.title2', lang)}
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '48px' }}>
            {t('home.subtitle', lang)}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {features.map((item, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon">{item.icon}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>🇧🇪 © 2026 SkillSwap Belgium</p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8F7FF', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px' }}>
          <LanguageSwitcher />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px 40px' }}>
          <div style={{ width: '100%', maxWidth: '460px' }}>
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E8E6FF', boxShadow: '0 20px 60px rgba(108,99,255,0.1)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #E8E6FF' }}>
                {[['login', t('auth.login', lang)], ['register', t('auth.register', lang)]].map(([m, label]) => (
                  <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }} className="tab-btn"
                    style={{ background: mode === m ? '#EEF0FF' : 'white', color: mode === m ? '#6C63FF' : '#9290B0', borderBottom: mode === m ? '2px solid #6C63FF' : 'none' }}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ padding: '32px' }}>
                {mode === 'login' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1635', marginBottom: '6px' }}>{t('auth.welcome', lang)}</h2>
                      <p style={{ fontSize: '14px', color: '#9290B0' }}>SkillSwap Belgium</p>
                    </div>
                    <Field label={t('auth.email', lang)} type="email" value={form.email} onChange={v => set('email', v)} placeholder="vous@exemple.com" />
                    <Field label={t('auth.password', lang)} type="password" value={form.password} onChange={v => set('password', v)} placeholder="••••••••" onEnter={handleLogin} />
                    {error && <ErrorMsg msg={error} />}
                    <button onClick={handleLogin} disabled={loading} className="submit-btn">
                      {loading ? t('common.loading', lang) : t('auth.loginBtn', lang)}
                    </button>
                    <p style={{ fontSize: '13px', color: '#9290B0', textAlign: 'center' }}>
                      {t('auth.noAccount', lang)}{' '}
                      <span style={{ color: '#6C63FF', cursor: 'pointer', fontWeight: 700 }} onClick={() => setMode('register')}>{t('auth.createFree', lang)}</span>
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1635', marginBottom: '4px' }}>{t('auth.createAccount', lang)}</h2>
                      <p style={{ fontSize: '14px', color: '#9290B0' }}>{t('auth.free', lang)}</p>
                    </div>
                    <Field label={`${t('auth.fullName', lang)} *`} value={form.fullName} onChange={v => set('fullName', v)} placeholder="Jean Dupont" />
                    <Field label={`${t('auth.email', lang)} *`} type="email" value={form.email} onChange={v => set('email', v)} placeholder="vous@exemple.com" />
                    <Field label={`${t('auth.password', lang)} *`} type="password" value={form.password} onChange={v => set('password', v)} placeholder="••••••••" />
                    <Field label={t('auth.city', lang)} value={form.location} onChange={v => set('location', v)} placeholder="Bruxelles, Liège, Gand..." />
                    <div>
                      <Label text={t('auth.region', lang)} />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        {REGIONS.map(r => (
                          <button key={r} onClick={() => set('region', r)} className={`opt-btn ${form.region === r ? 'active' : ''}`}>
                            {r === 'Bruxelles' ? '🏙️' : r === 'Wallonie' ? '🌿' : '🌊'} {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label text={t('auth.skill', lang)} />
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {categories.map(c => (
                          <button key={c} onClick={() => set('category', c)} className={`opt-btn ${form.category === c ? 'active' : ''}`}>{c}</button>
                        ))}
                      </div>
                    </div>
                    {error && <ErrorMsg msg={error} />}
                    {success && <SuccessMsg msg={success} />}
                    <button onClick={handleRegister} disabled={loading} className="submit-btn">
                      {loading ? t('common.loading', lang) : t('auth.registerBtn', lang)}
                    </button>
                    <p style={{ fontSize: '13px', color: '#9290B0', textAlign: 'center' }}>
                      {t('auth.alreadyAccount', lang)}{' '}
                      <span style={{ color: '#6C63FF', cursor: 'pointer', fontWeight: 700 }} onClick={() => setMode('login')}>{t('auth.signIn', lang)}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Label = ({ text }) => <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B4869', display: 'block' }}>{text}</label>;

const Field = ({ label, type = 'text', value, onChange, placeholder, onEnter }) => (
  <div>
    <Label text={label} />
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      onKeyDown={e => e.key === 'Enter' && onEnter?.()}
      className="auth-input" style={{ marginTop: '8px' }} />
  </div>
);

const ErrorMsg = ({ msg }) => (
  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 500 }}>⚠️ {msg}</div>
);

const SuccessMsg = ({ msg }) => (
  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 500 }}>✅ {msg}</div>
);

export default function AuthPage() {
  return <Suspense fallback={<div>Chargement...</div>}><AuthForm /></Suspense>;
}
