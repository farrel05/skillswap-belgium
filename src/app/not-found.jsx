'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glows */}
      <div style={{ position:'absolute', width:'500px', height:'500px', background:'rgba(108,99,255,0.12)', borderRadius:'50%', filter:'blur(120px)', top:'-100px', left:'-100px', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:'400px', height:'400px', background:'rgba(236,72,153,0.08)', borderRadius:'50%', filter:'blur(120px)', bottom:'-100px', right:'-100px', pointerEvents:'none' }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '500px' }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginBottom:'40px' }}>
          <div style={{ width:'40px', height:'40px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'18px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap Belgium</span>
        </div>

        {/* 404 */}
        <div style={{
          fontSize: '120px',
          fontWeight: 900,
          lineHeight: 1,
          marginBottom: '16px',
          background: 'linear-gradient(135deg,#6C63FF,#EC4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-4px',
        }}>
          404
        </div>

        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '12px' }}>
          Page introuvable
        </h1>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '36px' }}>
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>

        {/* Buttons */}
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/" style={{
            padding: '13px 28px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg,#6C63FF,#4F46E5)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 0 30px rgba(108,99,255,0.3)',
            transition: 'all .2s',
          }}>
            🏠 Retour à l&apos;accueil
          </Link>
          <Link href="/dashboard" style={{
            padding: '13px 28px',
            borderRadius: '50px',
            background: 'rgba(255,255,255,0.08)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            📊 Dashboard
          </Link>
        </div>

        {/* Links */}
        <div style={{ marginTop:'32px', display:'flex', gap:'20px', justifyContent:'center', flexWrap:'wrap' }}>
          {[
            { href:'/explore',   label:'Explorer' },
            { href:'/exchanges', label:'Échanges' },
            { href:'/messages',  label:'Messages' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              transition: 'color .2s',
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
