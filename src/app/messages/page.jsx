'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '../LanguageContext';
import { t } from '../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from '../MobileNav';
import NotificationBell from '../NotificationBell';

const S = `
  .nav-link{font-size:13px;color:#4B4869;text-decoration:none;font-weight:500;transition:color .2s}
  .nav-link:hover,.nav-link.active{color:#6C63FF;font-weight:700}
  .conv-item{display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;border-radius:14px;transition:all .2s;position:relative}
  .conv-item:hover{background:#F8F7FF}
  .conv-item.active{background:#EEF0FF}
  .conv-avatar{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:white;flex-shrink:0}
  .conv-name{font-size:14px;font-weight:700;color:#1A1635;margin-bottom:2px}
  .conv-preview{font-size:12px;color:#9290B0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:160px}
  .unread-badge{background:#6C63FF;color:white;border-radius:50%;width:18px;height:18px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;position:absolute;bottom:14px;right:16px}
  .msg-bubble{max-width:70%;padding:10px 14px;border-radius:18px;font-size:14px;line-height:1.5;word-break:break-word}
  .msg-sent{background:linear-gradient(135deg,#6C63FF,#4F46E5);color:white;border-bottom-right-radius:4px;margin-left:auto}
  .msg-recv{background:white;color:#1A1635;border:1px solid #E8E6FF;border-bottom-left-radius:4px}
  .msg-time{font-size:10px;color:#9290B0;margin-top:4px}
  .chat-input{width:100%;padding:12px 16px;border-radius:14px;border:1.5px solid #E8E6FF;font-size:14px;outline:none;font-family:inherit;background:white;resize:none;transition:border .2s}
  .chat-input:focus{border-color:#6C63FF;box-shadow:0 0 0 4px rgba(108,99,255,.08)}
  .send-btn{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#6C63FF,#4F46E5);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;box-shadow:0 4px 12px rgba(108,99,255,.3)}
  .send-btn:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(108,99,255,.4)}
  .send-btn:disabled{background:#E8E6FF;box-shadow:none;cursor:not-allowed}
  .credits-badge{background:#EEF0FF;color:#6C63FF;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;border:1px solid #E8E6FF}
  .page-wrap{display:grid;grid-template-columns:320px 1fr;height:calc(100vh - 68px)}
  .sidebar{border-right:1px solid #E8E6FF;background:white;overflow-y:auto;padding:16px}
  .chat-area{display:flex;flex-direction:column;background:#F8F7FF}
  .chat-messages{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:12px}
  .chat-footer{padding:16px 24px;background:white;border-top:1px solid #E8E6FF}
  .chat-header{padding:16px 24px;background:white;border-bottom:1px solid #E8E6FF;display:flex;align-items:center;justify-content:space-between}
  .empty-state{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#9290B0}
  @media(max-width:1024px){
    .page-wrap{grid-template-columns:1fr;height:auto}
    .sidebar{display:none}
    .sidebar.show{display:block;height:100vh}
  }
`;

const AVATAR_COLORS = [
  'linear-gradient(135deg,#6C63FF,#EC4899)',
  'linear-gradient(135deg,#10B981,#3B82F6)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#8B5CF6,#06B6D4)',
];

export default function MessagesPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);

  const loadData = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { router.push('/auth'); return; }
    setUser(u);
    const { data: p } = await supabase.from('skillswap_profiles').select('*').eq('id', u.id).single();
    setProfile(p);
    const { data: exch } = await supabase
      .from('exchanges')
      .select('*, skillswap_profiles!exchanges_requester_id_fkey(*), skillswap_profiles!exchanges_provider_id_fkey(*)')
      .or(`requester_id.eq.${u.id},provider_id.eq.${u.id}`)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });
    setExchanges(exch || []);
    const { data: unread } = await supabase
      .from('skillswap_messages')
      .select('exchange_id')
      .eq('receiver_id', u.id)
      .eq('read', false);
    const counts = {};
    (unread || []).forEach(m => { counts[m.exchange_id] = (counts[m.exchange_id] || 0) + 1; });
    setUnreadCounts(counts);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const loadMessages = useCallback(async (exchangeId) => {
    const { data } = await supabase
      .from('skillswap_messages')
      .select('*')
      .eq('exchange_id', exchangeId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
    if (user) {
      await supabase.from('skillswap_messages').update({ read: true }).eq('exchange_id', exchangeId).eq('receiver_id', user.id);
      setUnreadCounts(prev => ({ ...prev, [exchangeId]: 0 }));
    }
  }, [user]);

  useEffect(() => {
    if (!selectedExchange) return;
    loadMessages(selectedExchange.id);
    const channel = supabase.channel(`messages-${selectedExchange.id}`);
    channel.on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'skillswap_messages',
      filter: `exchange_id=eq.${selectedExchange.id}`,
    }, (payload) => { setMessages(prev => [...prev, payload.new]); });
    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedExchange, loadMessages]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedExchange || sending) return;
    if ((profile?.credits || 0) <= 0) {
      alert('Crédits insuffisants !');
      return;
    }
    setSending(true);
    const otherProfile = getOtherProfile(selectedExchange);
    const { error } = await supabase.from('skillswap_messages').insert({
      exchange_id: selectedExchange.id,
      sender_id: user.id,
      receiver_id: otherProfile?.id,
      content: newMessage.trim(),
    });
    if (!error) {
      setNewMessage('');
      setProfile(prev => ({ ...prev, credits: (prev?.credits || 1) - 1 }));
    } else {
      alert('Erreur: ' + error.message);
    }
    setSending(false);
  };

  const getOtherProfile = (exchange) => {
    if (!user) return null;
    return exchange.requester_id === user.id
      ? exchange['skillswap_profiles!exchanges_provider_id_fkey']
      : exchange['skillswap_profiles!exchanges_requester_id_fkey'];
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:'16px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{S}</style>
      <div style={{ width:'48px', height:'48px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' }}>💬</div>
      <p style={{ color:'#9290B0', fontWeight:500 }}>{t('common.loading', lang)}</p>
    </div>
  );

  const otherProfile = selectedExchange ? getOtherProfile(selectedExchange) : null;
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ minHeight:'100vh', background:'#F8F7FF', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{S}</style>

      {/* Navbar */}
      <nav className="desktop-nav" style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid #E8E6FF', padding:'0 32px', alignItems:'center', justifyContent:'space-between', height:'68px', position:'sticky', top:0, zIndex:100 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'17px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
        </Link>
        <div style={{ display:'flex', gap:'28px' }}>
          {[
            ['/dashboard', t('nav.dashboard', lang), false],
            ['/explore',   t('nav.explore', lang),   false],
            ['/profile',   t('nav.profile', lang),   false],
            ['/exchanges', t('nav.exchanges', lang),  false],
            ['/messages',  t('nav.messages', lang),   true],
          ].map(([href, label, active]) => (
            <Link key={href} href={href} style={{ fontSize:'13px', color:active?'#6C63FF':'#4B4869', textDecoration:'none', fontWeight:active?700:500, position:'relative' }}>
              {label}
              {href === '/messages' && totalUnread > 0 && (
                <span style={{ position:'absolute', top:'-6px', right:'-10px', background:'#EF4444', color:'white', borderRadius:'50%', width:'16px', height:'16px', fontSize:'9px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{totalUnread}</span>
              )}
            </Link>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <NotificationBell />
          <LanguageSwitcher />
          <div className="credits-badge">⏱️ {profile?.credits || 0} crédits</div>
        </div>
      </nav>

      <MobileNav active="/messages" />

      <div className="page-wrap">
        {/* Sidebar */}
        <div className="sidebar">
          <h2 style={{ fontSize:'16px', fontWeight:800, color:'#1A1635', marginBottom:'16px', padding:'0 4px' }}>💬 Messages</h2>
          {exchanges.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 16px', color:'#9290B0' }}>
              <div style={{ fontSize:'40px', marginBottom:'12px' }}>💬</div>
              <p style={{ fontSize:'14px', fontWeight:600, marginBottom:'6px' }}>Aucune conversation</p>
              <p style={{ fontSize:'12px' }}>Acceptez un échange pour commencer à chatter</p>
              <Link href="/exchanges" style={{ display:'inline-block', marginTop:'14px', padding:'8px 18px', borderRadius:'10px', background:'linear-gradient(135deg,#6C63FF,#4F46E5)', color:'white', textDecoration:'none', fontSize:'13px', fontWeight:700 }}>
                Voir mes échanges
              </Link>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
              {exchanges.map((exch, i) => {
                const other = getOtherProfile(exch);
                const unread = unreadCounts[exch.id] || 0;
                return (
                  <div key={i} className={`conv-item ${selectedExchange?.id === exch.id ? 'active' : ''}`}
                    onClick={() => setSelectedExchange(exch)}>
                    <div className="conv-avatar" style={{ background: AVATAR_COLORS[i % 4] }}>
                      {other?.full_name?.[0] || '?'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="conv-name">{other?.full_name || 'Utilisateur'}</div>
                      <div className="conv-preview">{other?.region || t('common.belgium', lang)}</div>
                    </div>
                    {unread > 0 && <div className="unread-badge">{unread}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Zone de chat */}
        <div className="chat-area">
          {!selectedExchange ? (
            <div className="empty-state">
              <div style={{ fontSize:'64px' }}>💬</div>
              <p style={{ fontSize:'18px', fontWeight:700, color:'#1A1635' }}>Sélectionnez une conversation</p>
              <p style={{ fontSize:'14px' }}>Choisissez un échange à gauche pour commencer</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:AVATAR_COLORS[0], color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'16px' }}>
                    {otherProfile?.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:800, color:'#1A1635' }}>{otherProfile?.full_name || 'Utilisateur'}</div>
                    <div style={{ fontSize:'12px', color:'#10B981', fontWeight:600 }}>● Échange accepté</div>
                  </div>
                </div>
                <div className="credits-badge">⏱️ {profile?.credits || 0} crédits · 1 crédit/message</div>
              </div>

              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'40px', color:'#9290B0' }}>
                    <div style={{ fontSize:'40px', marginBottom:'12px' }}>👋</div>
                    <p style={{ fontSize:'14px', fontWeight:600 }}>Démarrez la conversation !</p>
                    <p style={{ fontSize:'12px', marginTop:'4px' }}>Chaque message coûte 1 crédit</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isSent = msg.sender_id === user?.id;
                    return (
                      <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:isSent?'flex-end':'flex-start' }}>
                        <div className={`msg-bubble ${isSent ? 'msg-sent' : 'msg-recv'}`}>{msg.content}</div>
                        <div className="msg-time">{new Date(msg.created_at).toLocaleTimeString('fr-BE', { hour:'2-digit', minute:'2-digit' })}</div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-footer">
                {(profile?.credits || 0) <= 0 ? (
                  <div style={{ textAlign:'center', padding:'12px', background:'#FEF3C7', borderRadius:'12px', border:'1px solid #FDE68A' }}>
                    <p style={{ fontSize:'13px', color:'#92400E', fontWeight:600 }}>⚠️ Crédits insuffisants</p>
                    <p style={{ fontSize:'12px', color:'#92400E', marginTop:'4px' }}>Achetez des crédits pour continuer</p>
                  </div>
                ) : (
                  <div style={{ display:'flex', gap:'10px', alignItems:'flex-end' }}>
                    <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Écrire un message... (1 crédit)" rows={1}
                      className="chat-input" style={{ flex:1 }} />
                    <button onClick={sendMessage} disabled={sending || !newMessage.trim()} className="send-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}