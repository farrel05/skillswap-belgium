'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function MobileNav({ active }) {
  const [unreadMsg, setUnreadMsg] = useState(0);
  const [unreadExch, setUnreadExch] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Messages non lus
      const { count: msgCount } = await supabase
        .from('skillswap_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);
      setUnreadMsg(msgCount || 0);

      // Échanges en attente
      const { count: exchCount } = await supabase
        .from('exchanges')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', user.id)
        .eq('status', 'pending');
      setUnreadExch(exchCount || 0);
    };
    load();
  }, []);

  const items = [
    { href: '/dashboard', emoji: '🏠', label: 'Dashboard' },
    { href: '/explore',   emoji: '🔍', label: 'Explorer'  },
    { href: '/messages',  emoji: '💬', label: 'Messages',  badge: unreadMsg  },
    { href: '/profile',   emoji: '👤', label: 'Mon profil' },
    { href: '/exchanges', emoji: '🤝', label: 'Échanges',  badge: unreadExch },
  ];

  return (
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
  );
}
