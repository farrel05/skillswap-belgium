'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLang } from '../../LanguageContext';

function SuccessContent() {
  const router = useRouter();
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(timer); router.push('/dashboard'); }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const labels = {
    fr: { title: 'Paiement réussi ! 🎉', sub: 'Vos crédits ont été ajoutés à votre compte', redirect: 'Redirection dans', btn: 'Aller au dashboard →', msg: 'Vous pouvez maintenant envoyer des messages !' },
    nl: { title: 'Betaling geslaagd! 🎉', sub: 'Uw credits zijn toegevoegd aan uw account', redirect: 'Doorsturen in', btn: 'Naar dashboard →', msg: 'U kunt nu berichten sturen!' },
    en: { title: 'Payment successful! 🎉', sub: 'Your credits have been added to your account', redirect: 'Redirecting in', btn: 'Go to dashboard →', msg: 'You can now send messages!' },
  };
  const L = labels[lang] || labels.fr;

  return (
    <div style={{ minHeight:'100vh', background:'#F8F7FF', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Plus Jakarta Sans',sans-serif", padding:'20px' }}>
      <div style={{ background:'white', borderRadius:'28px', border:'1px solid #E8E6FF', padding:'56px 48px', textAlign:'center', maxWidth:'480px', width:'100%', boxShadow:'0 20px 60px rgba(108,99,255,.1)' }}>
        <div style={{ fontSize:'72px', marginBottom:'20px' }}>🎉</div>
        <h1 style={{ fontSize:'28px', fontWeight:800, color:'#1A1635', marginBottom:'12px', letterSpacing:'-0.5px' }}>{L.title}</h1>
        <p style={{ fontSize:'16px', color:'#4B4869', marginBottom:'8px' }}>{L.sub}</p>
        <p style={{ fontSize:'14px', color:'#10B981', fontWeight:600, marginBottom:'32px' }}>✓ {L.msg}</p>

        <div style={{ background:'#EEF0FF', borderRadius:'14px', padding:'16px', marginBottom:'28px' }}>
          <p style={{ fontSize:'13px', color:'#6C63FF', fontWeight:600 }}>
            {L.redirect} <strong>{seconds}s</strong>...
          </p>
        </div>

        <Link href="/dashboard" style={{ display:'block', padding:'14px 32px', borderRadius:'14px', background:'linear-gradient(135deg,#6C63FF,#4F46E5)', color:'white', textDecoration:'none', fontWeight:700, fontSize:'15px', boxShadow:'0 6px 20px rgba(108,99,255,.35)' }}>
          {L.btn}
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense fallback={<div>Chargement...</div>}><SuccessContent /></Suspense>;
}
