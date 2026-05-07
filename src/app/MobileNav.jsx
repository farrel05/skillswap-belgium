'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import NotificationBell from './NotificationBell';

export default function MobileNav() {
  const pathname = usePathname();
  const [unreadMsg, setUnreadMsg] = useState(0);
  const [unreadExch, setUnreadExch] = useState(0);
  const [credits, setCredits] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Profil + crédits
      const { data: p } = await supabase
        .from('skillswap_profiles')
        .select('credits, full_name')
        .eq('id', user.id)
        .single();
      setCredits(p?.credits || 0);
      setUserName(p?.full_name?.split(' ')[0] || '');

      // Messages non lus
      const { count: m } = await supabase
        .from('skillswap_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);
      setUnreadMsg(m || 0);

      // Échanges en attente
      const { count: e } = await supabase
        .from('exchanges')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', user.id)
        .eq('status', 'pending');
      setUnreadExch(e || 0);
    };

    load();

    // Realtime crédits
    const channel = supabase
      .channel('mobile-nav-credits-' + Date.now())
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'skillswap_profiles',
      }, (payload) => {
        if (payload.new?.credits !== undefined) {
          setCredits(payload.new.credits);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [pathname]); // Recharge à chaque changement de page

  // Titre de la page active
  const pageTitles = {
    '/dashboard': '🏠 Dashboard',
    '/explore':   '🔍 Explorer',
    '/messages':  '💬 Messages',
    '/profile':   '👤 Mon profil',
    '/exchanges': '🤝 Échanges',
    '/credits':   '⏱️ Crédits',
    '/legal':     '📋 Légal',
    '/contact':   '✉️ Contact',
  };
  const pageTitle = pageTitles[pathname] || '🔄 SkillSwap';

  const items = [
    { href: '/dashboard', icon: '🏠', label: 'Home'     },
    { href: '/explore',   icon: '🔍', label: 'Explorer' },
    { href: '/messages',  icon: '💬', label: 'Messages', badge: unreadMsg  },
    { href: '/profile',   icon: '👤', label: 'Profil'   },
    { href: '/exchanges', icon: '🤝', label: 'Échanges', badge: unreadExch },
  ];

  // Cacher sur home et auth
  if (pathname === '/' || pathname?.startsWith('/auth')) return null;

  return (
    <>
      {/* ── BARRE TOP MOBILE ── */}
      <div style={{
        display: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E8E6FF',
        padding: '10px 16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(108,99,255,0.06)',
      }} className="mobile-top-bar">

        {/* Gauche : Logo + page title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>🔄</div>
          </Link>
          <span style={{ fontWeight: 700, fontSize: '14px', color: '#1A1635' }}>{pageTitle}</span>
        </div>

        {/* Droite : Crédits + Cloche */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/credits" style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'linear-gradient(135deg,rgba(108,99,255,0.12),rgba(236,72,153,0.08))',
            color: '#6C63FF', padding: '6px 14px', borderRadius: '20px',
            fontSize: '13px', fontWeight: 700,
            border: '1px solid rgba(108,99,255,0.2)',
            textDecoration: 'none', transition: 'all .2s',
          }}>
            ⏱️ <span>{credits}</span>
          </Link>
          <NotificationBell />
        </div>
      </div>

      {/* ── NAV BOTTOM MOBILE ── */}
      <div style={{
        display: 'none',
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: '62px',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #E8E6FF',
        zIndex: 200,
        boxShadow: '0 -4px 20px rgba(108,99,255,0.08)',
      }} className="mobile-bottom-nav">
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {items.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                textDecoration: 'none',
                position: 'relative',
                padding: '6px 4px',
                transition: 'all .15s',
              }}>
                {/* Indicateur actif */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: '20%', right: '20%',
                    height: '3px',
                    borderRadius: '0 0 3px 3px',
                    background: 'linear-gradient(90deg,#6C63FF,#EC4899)',
                  }} />
                )}

                {/* Badge */}
                {item.badge > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: 'calc(50% - 16px)',
                    background: '#EF4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '15px', height: '15px',
                    fontSize: '8px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(239,68,68,0.4)',
                  }}>
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}

                {/* Icône */}
                <span style={{
                  fontSize: '22px',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform .2s cubic-bezier(0.34,1.56,0.64,1)',
                  filter: isActive ? 'drop-shadow(0 2px 4px rgba(108,99,255,0.4))' : 'none',
                  marginTop: '4px',
                }}>{item.icon}</span>

                {/* Label */}
                <span style={{
                  fontSize: '9px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#6C63FF' : '#9290B0',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: isActive ? '0.2px' : '0',
                }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
