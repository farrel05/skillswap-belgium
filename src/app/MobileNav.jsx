'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import NotificationBell from './NotificationBell';

export default function MobileNav({ active }) {
  const [unreadMsg, setUnreadMsg] = useState(0);
  const [unreadExch, setUnreadExch] = useState(0);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count: msgCount } = await supabase
        .from('skillswap_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);
      setUnreadMsg(msgCount || 0);

      const { count: exchCount } = await supabase
        .from('exchanges')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', user.id)
        .eq('status', 'pending');
      setUnreadExch(exchCount || 0);

      const { data: p } = await supabase
        .from('skillswap_profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
      setCredits(p?.credits || 0);
    };
    load();
  }, []);

  const items = [
    { href: '/dashboard', emoji: '🏠', label: 'Dashboard' },
    { href: '/explore',   emoji: '🔍', label: 'Explorer'  },
    { href: '/messages',  emoji: '💬', label: 'Messages',  badge: unreadMsg  },
    { href: '/profile',   emoji: '👤', label: 'Profil'     },
    { href: '/exchanges', emoji: '🤝', label: 'Échanges',  badge: unreadExch },
  ];

  return (
    <>
      {/* Barre top mobile avec crédits + cloche */}
      <div style={{
        display: 'none',
        position: 'sticky', top: 0, zIndex: 99,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E8E6FF',
        padding: '8px 16px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }} className="mobile-top-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'28px', height:'28px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'15px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ background:'#EEF0FF', color:'#6C63FF', padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:700, border:'1px solid #E8E6FF' }}>
            ⏱️ {credits}
          </div>
          <NotificationBell />
        </div>
      </div>

      {/* Nav bottom */}
      <div className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-items">
          {items.map(item => (
            <Link key={item.href} href={item.href}
              className={`mobile-nav-item ${active === item.href ? 'active' : ''}`}
              style={{ position: 'relative' }}>
              <span className="nav-emoji">{item.emoji}</span>
              <span className="nav-lbl">{item.label}</span>
              {item.badge > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '6px',
                  background: '#EF4444', color: 'white',
                  borderRadius: '50%', width: '14px', height: '14px',
                  fontSize: '8px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1.5px solid white'
                }}>
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
