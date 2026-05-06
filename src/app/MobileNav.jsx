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
      const { count: m } = await supabase.from('skillswap_messages').select('*',{count:'exact',head:true}).eq('receiver_id',user.id).eq('read',false);
      setUnreadMsg(m || 0);
      const { count: e } = await supabase.from('exchanges').select('*',{count:'exact',head:true}).eq('provider_id',user.id).eq('status','pending');
      setUnreadExch(e || 0);
      const { data: p } = await supabase.from('skillswap_profiles').select('credits').eq('id',user.id).single();
      setCredits(p?.credits || 0);
    };
    load();
  }, []);

  const items = [
    { href:'/dashboard', icon:'🏠', label:'Home'     },
    { href:'/explore',   icon:'🔍', label:'Explorer' },
    { href:'/messages',  icon:'💬', label:'Messages', badge: unreadMsg  },
    { href:'/profile',   icon:'👤', label:'Profil'   },
    { href:'/exchanges', icon:'🤝', label:'Échanges', badge: unreadExch },
  ];

  return (
    <>
      {/* Barre top mobile */}
      <div className="mobile-top-bar" style={{
        display:'none', position:'sticky', top:0, zIndex:99,
        background:'rgba(255,255,255,0.97)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid #E8E6FF', padding:'10px 16px',
        alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'30px', height:'30px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'16px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ background:'#EEF0FF', color:'#6C63FF', padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:700, border:'1px solid #E8E6FF' }}>
            ⏱️ {credits}
          </div>
          <NotificationBell />
        </div>
      </div>

      {/* Nav bottom optimisée */}
      <div style={{
        display:'none', position:'fixed', bottom:0, left:0, right:0,
        height:'60px', background:'white', borderTop:'1px solid #E8E6FF',
        zIndex:200, boxShadow:'0 -4px 20px rgba(108,99,255,.08)',
      }} className="mobile-bottom-nav">
        <div style={{ display:'flex', alignItems:'center', height:'100%' }}>
          {items.map(item => (
            <Link key={item.href} href={item.href}
              style={{
                flex:1, display:'flex', flexDirection:'column', alignItems:'center',
                justifyContent:'center', gap:'3px', textDecoration:'none',
                position:'relative', padding:'6px 4px',
                transition:'all .15s',
              }}>
              {/* Indicateur actif */}
              {active === item.href && (
                <div style={{
                  position:'absolute', top:'4px', left:'50%', transform:'translateX(-50%)',
                  width:'20px', height:'3px', borderRadius:'2px',
                  background:'linear-gradient(90deg,#6C63FF,#EC4899)',
                }} />
              )}
              {/* Badge */}
              {item.badge > 0 && (
                <div style={{
                  position:'absolute', top:'6px', right:'calc(50% - 14px)',
                  background:'#EF4444', color:'white', borderRadius:'50%',
                  width:'14px', height:'14px', fontSize:'8px', fontWeight:700,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  border:'1.5px solid white',
                }}>
                  {item.badge > 9 ? '9+' : item.badge}
                </div>
              )}
              {/* Icône */}
              <span style={{
                fontSize:'22px',
                transform: active === item.href ? 'scale(1.15)' : 'scale(1)',
                transition:'transform .15s',
                marginTop:'4px',
              }}>{item.icon}</span>
              {/* Label */}
              <span style={{
                fontSize:'9px',
                fontWeight: active === item.href ? 700 : 500,
                color: active === item.href ? '#6C63FF' : '#9290B0',
                fontFamily:"'Plus Jakarta Sans',sans-serif",
              }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
