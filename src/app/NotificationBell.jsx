'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLang } from './LanguageContext';

const NOTIF_ICONS = {
  exchange_received: '🤝',
  exchange_accepted: '✅',
  exchange_rejected: '❌',
  new_message:       '💬',
  review_received:   '⭐',
};

const NOTIF_COLORS = {
  exchange_received: '#6C63FF',
  exchange_accepted: '#10B981',
  exchange_rejected: '#EF4444',
  new_message:       '#EC4899',
  review_received:   '#F59E0B',
};

const S = `
  .bell-wrap { position: relative; }

  .bell-btn {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(108,99,255,0.08); border: 1.5px solid rgba(108,99,255,0.15);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 18px; transition: all .2s; position: relative;
    flex-shrink: 0;
  }
  .bell-btn:hover { background: rgba(108,99,255,0.15); border-color: rgba(108,99,255,0.3); transform: scale(1.05); }
  .bell-btn.dark { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); }
  .bell-btn.dark:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.2); }

  .bell-badge {
    position: absolute; top: -5px; right: -5px;
    background: #EF4444; color: white;
    border-radius: 50%; min-width: 18px; height: 18px;
    font-size: 10px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid white;
    animation: badgePop .3s cubic-bezier(.175,.885,.32,1.275);
    padding: 0 3px;
  }

  @keyframes badgePop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }
  @keyframes bellShake {
    0%,100% { transform: rotate(0); }
    15%     { transform: rotate(12deg); }
    30%     { transform: rotate(-10deg); }
    45%     { transform: rotate(8deg); }
    60%     { transform: rotate(-6deg); }
    75%     { transform: rotate(4deg); }
  }
  .bell-btn.has-notif { animation: bellShake 1s ease 0.5s; }

  /* Dropdown */
  .notif-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0;
    width: 360px; background: white;
    border-radius: 20px; border: 1px solid #E8E6FF;
    box-shadow: 0 20px 60px rgba(108,99,255,0.15);
    z-index: 500; overflow: hidden;
    animation: dropIn .2s ease;
  }
  .notif-dropdown.dark {
    background: #1A1A2E; border-color: rgba(255,255,255,0.1);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .notif-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 20px 12px;
    border-bottom: 1px solid #E8E6FF;
  }
  .notif-header.dark { border-color: rgba(255,255,255,0.08); }

  .notif-list { max-height: 380px; overflow-y: auto; }
  .notif-list::-webkit-scrollbar { width: 4px; }
  .notif-list::-webkit-scrollbar-track { background: transparent; }
  .notif-list::-webkit-scrollbar-thumb { background: #E8E6FF; border-radius: 4px; }

  .notif-item {
    display: flex; gap: 12px; padding: 14px 20px;
    cursor: pointer; transition: background .15s; border-bottom: 1px solid #F8F7FF;
    position: relative;
  }
  .notif-item:hover { background: #F8F7FF; }
  .notif-item.unread { background: #F0EFFE; }
  .notif-item.unread:hover { background: #E8E4FD; }
  .notif-item.dark { border-color: rgba(255,255,255,0.04); }
  .notif-item.dark:hover { background: rgba(255,255,255,0.04); }
  .notif-item.dark.unread { background: rgba(108,99,255,0.12); }

  .notif-dot {
    position: absolute; right: 16px; top: 50%;
    transform: translateY(-50%);
    width: 8px; height: 8px; border-radius: 50%;
    background: #6C63FF;
  }

  .notif-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }

  .notif-footer {
    padding: 12px 20px;
    border-top: 1px solid #E8E6FF;
    text-align: center;
  }
  .notif-footer.dark { border-color: rgba(255,255,255,0.08); }

  .mark-all-btn {
    background: none; border: none; cursor: pointer;
    font-size: 12px; color: #6C63FF; font-weight: 600;
    font-family: inherit; padding: 4px 8px; border-radius: 6px;
    transition: background .15s;
  }
  .mark-all-btn:hover { background: #EEF0FF; }

  .time-label { font-size: 11px; color: #9290B0; white-space: nowrap; }

  @media(max-width:1024px) {
    .notif-dropdown { width: calc(100vw - 32px); right: -80px; }
  }
`;

function timeAgo(date, lang) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return lang === 'fr' ? "À l'instant" : lang === 'nl' ? 'Zojuist' : 'Just now';
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return lang === 'fr' ? `Il y a ${m}min` : lang === 'nl' ? `${m}min geleden` : `${m}min ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return lang === 'fr' ? `Il y a ${h}h` : lang === 'nl' ? `${h}u geleden` : `${h}h ago`;
  }
  const d = Math.floor(diff / 86400);
  return lang === 'fr' ? `Il y a ${d}j` : lang === 'nl' ? `${d}d geleden` : `${d}d ago`;
}

export default function NotificationBell({ dark = false }) {
  const router = useRouter();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const loadNotifications = useCallback(async (userId) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);
    setNotifications(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let channel = null;

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) return;
      setUser(u);
      loadNotifications(u.id);

      // Realtime — channel unique pour éviter conflits StrictMode
      const channelName = 'notif-bell-' + u.id + '-' + Date.now();
      channel = supabase.channel(channelName);
      channel
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${u.id}`,
        }, (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          if (navigator?.vibrate) navigator.vibrate(200);
        })
        .subscribe();
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [loadNotifications]);

  // Fermer en cliquant dehors
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAsRead = async (notif) => {
    if (!notif.read) {
      await supabase.from('notifications').update({ read: true }).eq('id', notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    if (notif.link) {
      setOpen(false);
      router.push(notif.link);
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ read: true })
      .eq('user_id', user.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = async () => {
    if (!user) return;
    await supabase.from('notifications').delete().eq('user_id', user.id);
    setNotifications([]);
  };

  const labels = {
    fr: { title: 'Notifications', markAll: 'Tout marquer lu', noNotif: 'Aucune notification', noNotifSub: 'Vous êtes à jour !', clear: 'Tout effacer' },
    nl: { title: 'Meldingen', markAll: 'Alles als gelezen markeren', noNotif: 'Geen meldingen', noNotifSub: 'U bent up-to-date!', clear: 'Alles wissen' },
    en: { title: 'Notifications', markAll: 'Mark all read', noNotif: 'No notifications', noNotifSub: 'You\'re all caught up!', clear: 'Clear all' },
  };
  const L = labels[lang] || labels.fr;

  return (
    <>
      <style>{S}</style>
      <div className="bell-wrap" ref={dropdownRef}>

        {/* Bouton cloche */}
        <button
          className={`bell-btn ${dark ? 'dark' : ''} ${unreadCount > 0 ? 'has-notif' : ''}`}
          onClick={() => setOpen(v => !v)}
          title={L.title}
        >
          🔔
          {unreadCount > 0 && (
            <span className="bell-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div className={`notif-dropdown ${dark ? 'dark' : ''}`}>

            {/* Header */}
            <div className={`notif-header ${dark ? 'dark' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: dark ? 'white' : '#1A1635' }}>{L.title}</span>
                {unreadCount > 0 && (
                  <span style={{ background: '#6C63FF', color: 'white', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {unreadCount > 0 && (
                  <button className="mark-all-btn" onClick={markAllRead}
                    style={{ color: dark ? '#a5a0ff' : '#6C63FF' }}>
                    {L.markAll}
                  </button>
                )}
                {notifications.length > 0 && (
                  <button className="mark-all-btn" onClick={clearAll}
                    style={{ color: '#EF4444' }}>
                    🗑️
                  </button>
                )}
              </div>
            </div>

            {/* Liste */}
            <div className="notif-list">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#9290B0' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                </div>
              ) : notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: dark ? 'white' : '#1A1635', marginBottom: '4px' }}>{L.noNotif}</p>
                  <p style={{ fontSize: '12px', color: '#9290B0' }}>{L.noNotifSub}</p>
                </div>
              ) : (
                notifications.map((notif, i) => (
                  <div key={notif.id}
                    className={`notif-item ${!notif.read ? 'unread' : ''} ${dark ? 'dark' : ''}`}
                    onClick={() => markAsRead(notif)}>

                    {/* Icône colorée */}
                    <div className="notif-icon"
                      style={{ background: `${NOTIF_COLORS[notif.type]}20`, border: `1px solid ${NOTIF_COLORS[notif.type]}30` }}>
                      {NOTIF_ICONS[notif.type] || '🔔'}
                    </div>

                    {/* Contenu */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: !notif.read ? 700 : 500, color: dark ? 'white' : '#1A1635', marginBottom: '2px', lineHeight: 1.4 }}>
                        {notif.title}
                      </div>
                      {notif.body && (
                        <div style={{ fontSize: '12px', color: '#9290B0', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {notif.body}
                        </div>
                      )}
                      <div className="time-label" style={{ marginTop: '4px' }}>
                        {timeAgo(notif.created_at, lang)}
                      </div>
                    </div>

                    {/* Point non lu */}
                    {!notif.read && <div className="notif-dot" />}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={`notif-footer ${dark ? 'dark' : ''}`}>
                <span style={{ fontSize: '12px', color: '#9290B0' }}>
                  {notifications.length} {lang === 'fr' ? 'notification(s)' : lang === 'nl' ? 'melding(en)' : 'notification(s)'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}