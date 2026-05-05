'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from './LanguageContext';
import { t } from './i18n';
import { supabase } from '@/lib/supabase';

export default function MobileNav({ active }) {
  const { lang } = useLang();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnread = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { count } = await supabase
        .from('skillswap_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);
      setUnreadCount(count || 0);
    };
    loadUnread();
  }, []);

  const items = [
    { href: '/dashboard', emoji: '🏠', key: 'nav.dashboard' },
    { href: '/explore',   emoji: '🔍', key: 'nav.explore'   },
    { href: '/messages',  emoji: '💬', key: 'messages'      },
    { href: '/profile',   emoji: '👤', key: 'nav.profile'   },
    { href: '/exchanges', emoji: '🤝', key: 'nav.exchanges'  },
  ];

  return (
    <div className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-items">
        {items.map(item => (
          <Link key={item.href} href={item.href} className={`mobile-nav-item ${active === item.href ? 'active' : ''}`} style={{ position: 'relative' }}>
            <span className="nav-emoji">{item.emoji}</span>
            <span className="nav-lbl">
              {item.href === '/messages' ? 'Messages' : t(item.key, lang).replace(/^[^ ]+ /, '')}
            </span>
            {item.href === '/messages' && unreadCount > 0 && (
              <span style={{ position:'absolute', top:'4px', right:'8px', background:'#EF4444', color:'white', borderRadius:'50%', width:'14px', height:'14px', fontSize:'8px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
