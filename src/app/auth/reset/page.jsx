'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLang } from '../../LanguageContext';
import { t } from '../../i18n';
import LanguageSwitcher from '../../LanguageSwitcher';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8F7FF; }
  :root { --p:#6C63FF;--p2:#4F46E5;--pl:#EEF0FF;--s:#EC4899;--b:#E8E6FF;--t1:#1A1635;--t2:#4B4869;--t3:#9290B0; }
  .auth-input { width:100%;padding:12px 16px;border-radius:12px;border:1.5px solid var(--b);font-size:14px;outline:none;font-family:inherit;background:#F8F7FF;color:var(--t1);transition:all .2s; }
  .auth-input:focus { border-color:var(--p);background:white;box-shadow:0 0 0 4px rgba(108,99,255,.1); }
  .auth-input::placeholder { color:var(--t3); }
  .pw-wrap { position:relative; }
  .pw-wrap .auth-input { padding-right:44px; }
  .pw-eye { position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--t3);font-size:16px;padding:0;display:flex;align-items:center;transition:color .2s; }
  .pw-eye:hover { color:var(--p); }
  .submit-btn { width:100%;padding:14px;border-radius:14px;background:linear-gradient(135deg,var(--p),var(--p2));color:white;border:none;font-weight:700;font-size:15px;cursor:pointer;font-family:inherit;box-shadow:0 6px 20px rgba(108,99,255,.4);transition:all .2s; }
  .submit-btn:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 10px 28px rgba(108,99,255,.5); }
  .submit-btn:disabled { background:#E8E6FF;color:var(--t3);box-shadow:none;cursor:not-allowed; }
  .strength-bar { height:4px;border-radius:4px;transition:all .3s; }
`;

function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { label: '', color: '' },
    { label: 'Très faible', color: '#EF4444' },
    { label: 'Faible', color: '#F97316' },
    { label: 'Moyen', color: '#F59E0B' },
    { label: 'Fort', color: '#10B981' },
    { label: 'Très fort', color: '#6C63FF' },
  ];
  return { score, ...levels[score] };
}

function ResetForm() {
  const router = useRouter();
  const { lang } = useLang();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);

  const pwStrength = getPasswordStrength(password);

  const labels = {
    fr: {
      title: 'Nouveau mot de passe',
      sub: 'Choisissez un mot de passe sécurisé pour votre compte',
      pw: 'Nouveau mot de passe',
      confirm: 'Confirmer le mot de passe',
      btn: 'Mettre à jour →',
      success: 'Mot de passe mis à jour ! Redirection...',
      mismatch: 'Les mots de passe ne correspondent pas.',
      tooShort: 'Minimum 6 caractères.',
      invalid: 'Lien invalide ou expiré. Recommencez.',
      backLogin: '← Retour à la connexion',
      successTitle: 'Mot de passe mis à jour ! 🎉',
      successSub: 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
      goLogin: 'Se connecter →',
    },
    nl: {
      title: 'Nieuw wachtwoord',
      sub: 'Kies een veilig wachtwoord voor uw account',
      pw: 'Nieuw wachtwoord',
      confirm: 'Wachtwoord bevestigen',
      btn: 'Bijwerken →',
      success: 'Wachtwoord bijgewerkt! Doorsturen...',
      mismatch: 'Wachtwoorden komen niet overeen.',
      tooShort: 'Minimaal 6 tekens.',
      invalid: 'Ongeldige of verlopen link. Probeer opnieuw.',
      backLogin: '← Terug naar inloggen',
      successTitle: 'Wachtwoord bijgewerkt! 🎉',
      successSub: 'U kunt nu inloggen met uw nieuwe wachtwoord.',
      goLogin: 'Inloggen →',
    },
    en: {
      title: 'New password',
      sub: 'Choose a secure password for your account',
      pw: 'New password',
      confirm: 'Confirm password',
      btn: 'Update →',
      success: 'Password updated! Redirecting...',
      mismatch: "Passwords don't match.",
      tooShort: 'Minimum 6 characters.',
      invalid: 'Invalid or expired link. Please try again.',
      backLogin: '← Back to login',
      successTitle: 'Password updated! 🎉',
      successSub: 'You can now log in with your new password.',
      goLogin: 'Sign in →',
    },
  };
  const L = labels[lang] || labels.fr;

  useEffect(() => {
    // Vérifier qu'on a bien une session de reset valide
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setValidSession(true);
    });
  }, []);

  const handleReset = async () => {
    if (password.length < 6) { setError(L.tooShort); return; }
    if (password !== confirm) { setError(L.mismatch); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(L.invalid);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2500);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#F8F7FF', fontFamily:"'Plus Jakarta Sans',sans-serif", padding:'20px' }}>
      <style>{styles}</style>

      {/* Language switcher */}
      <div style={{ position:'fixed', top:'20px', right:'24px' }}>
        <LanguageSwitcher />
      </div>

      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'32px' }}>
        <div style={{ width:'40px', height:'40px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>🔄</div>
        <span style={{ fontWeight:800, fontSize:'19px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
      </div>

      <div style={{ width:'100%', maxWidth:'420px', background:'white', borderRadius:'24px', border:'1px solid #E8E6FF', boxShadow:'0 20px 60px rgba(108,99,255,.1)', padding:'40px' }}>

        {success ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'56px', marginBottom:'16px' }}>🎉</div>
            <h2 style={{ fontSize:'22px', fontWeight:800, color:'#1A1635', marginBottom:'8px' }}>{L.successTitle}</h2>
            <p style={{ fontSize:'14px', color:'#9290B0', marginBottom:'28px' }}>{L.successSub}</p>
            <button onClick={() => router.push('/auth')} className="submit-btn">{L.goLogin}</button>
          </div>
        ) : (
          <>
            <div style={{ textAlign:'center', marginBottom:'28px' }}>
              <div style={{ fontSize:'48px', marginBottom:'12px' }}>🔑</div>
              <h2 style={{ fontSize:'22px', fontWeight:800, color:'#1A1635', marginBottom:'8px' }}>{L.title}</h2>
              <p style={{ fontSize:'14px', color:'#9290B0' }}>{L.sub}</p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

              {/* Nouveau mot de passe */}
              <div>
                <label style={{ fontSize:'13px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'8px' }}>{L.pw}</label>
                <div className="pw-wrap">
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••" className="auth-input" />
                  <button className="pw-eye" onClick={() => setShowPw(v => !v)} type="button">
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Barre de force */}
                {password && (
                  <div style={{ marginTop:'8px' }}>
                    <div style={{ display:'flex', gap:'4px' }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="strength-bar" style={{ flex:1, background: i <= pwStrength.score ? pwStrength.color : '#E8E6FF' }} />
                      ))}
                    </div>
                    <div style={{ fontSize:'11px', color:pwStrength.color, fontWeight:600, marginTop:'4px' }}>{pwStrength.label}</div>
                  </div>
                )}
              </div>

              {/* Confirmer mot de passe */}
              <div>
                <label style={{ fontSize:'13px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'8px' }}>{L.confirm}</label>
                <div className="pw-wrap">
                  <input type={showConfirm ? 'text' : 'password'} value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    onKeyDown={e => e.key === 'Enter' && handleReset()}
                    className={`auth-input ${confirm && confirm !== password ? 'error' : ''}`}
                    style={{ borderColor: confirm && confirm !== password ? '#EF4444' : undefined }} />
                  <button className="pw-eye" onClick={() => setShowConfirm(v => !v)} type="button">
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <div style={{ fontSize:'12px', color:'#EF4444', marginTop:'4px', fontWeight:500 }}>⚠️ {L.mismatch}</div>
                )}
                {confirm && confirm === password && password.length >= 6 && (
                  <div style={{ fontSize:'12px', color:'#10B981', marginTop:'4px', fontWeight:500 }}>✓ {lang === 'fr' ? 'Mots de passe identiques' : lang === 'nl' ? 'Wachtwoorden komen overeen' : 'Passwords match'}</div>
                )}
              </div>

              {error && (
                <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', color:'#991B1B', padding:'12px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:500 }}>⚠️ {error}</div>
              )}

              <button onClick={handleReset}
                disabled={loading || password.length < 6 || password !== confirm}
                className="submit-btn">
                {loading ? t('common.loading', lang) : L.btn}
              </button>

              <button onClick={() => router.push('/auth')}
                style={{ background:'none', border:'none', color:'#9290B0', fontSize:'13px', cursor:'pointer', fontFamily:'inherit', textAlign:'center' }}>
                {L.backLogin}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPage() {
  return <Suspense fallback={<div>Chargement...</div>}><ResetForm /></Suspense>;
}