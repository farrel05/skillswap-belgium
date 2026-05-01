'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '../LanguageContext';
import { t } from '../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from '../MobileNav';

export default function ExchangesPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('received');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth'); return; }
    setUser(user);

    const { data: recv } = await supabase
      .from('exchanges')
      .select('*, skillswap_profiles!exchanges_requester_id_fkey(*)')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false });

    const { data: sentData } = await supabase
      .from('exchanges')
      .select('*, skillswap_profiles!exchanges_provider_id_fkey(*)')
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false });

    setReceived(recv || []);
    setSent(sentData || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('exchanges').update({ status }).eq('id', id);
    loadData();
  };

  const getStatusInfo = (status, lang) => ({
    pending:   { label: t('exchanges.pending', lang),   color: '#F59E0B', bg: '#FEF3C7' },
    accepted:  { label: t('exchanges.accepted', lang),  color: '#10B981', bg: '#D1FAE5' },
    rejected:  { label: t('exchanges.rejected', lang),  color: '#EF4444', bg: '#FEE2E2' },
    completed: { label: t('exchanges.completed', lang), color: '#6C63FF', bg: '#EEF0FF' },
  }[status] || { label: t('exchanges.pending', lang), color: '#F59E0B', bg: '#FEF3C7' });

  const ExchangeCard = ({ exchange, type }) => {
    const profile = exchange.skillswap_profiles;
    const statusInfo = getStatusInfo(exchange.status, lang);

    return (
      <div style={{ background: 'white', border: '1px solid #E8E6FF', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', flexShrink: 0 }}>
              {profile?.full_name?.[0] || '?'}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1635' }}>{profile?.full_name || 'Utilisateur'}</div>
              <div style={{ fontSize: '12px', color: '#9290B0' }}>{profile?.location || profile?.region || t('common.belgium', lang)}</div>
            </div>
          </div>
          <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: '600', background: statusInfo.bg, color: statusInfo.color }}>
            {statusInfo.label}
          </span>
        </div>

        {exchange.message && (
          <p style={{ fontSize: '13px', color: '#4B4869', background: '#F8F7FF', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', lineHeight: '1.6' }}>
            💬 {exchange.message}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#9290B0' }}>
            ⏱️ {exchange.hours}{t('common.hours', lang)} · {new Date(exchange.created_at).toLocaleDateString('fr-BE')}
          </span>

          {type === 'received' && exchange.status === 'pending' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => updateStatus(exchange.id, 'accepted')}
                style={{ padding: '7px 16px', borderRadius: '8px', background: '#10B981', color: 'white', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                {t('exchanges.accept', lang)}
              </button>
              <button onClick={() => updateStatus(exchange.id, 'rejected')}
                style={{ padding: '7px 16px', borderRadius: '8px', background: 'white', color: '#EF4444', border: '1px solid #EF4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                {t('exchanges.reject', lang)}
              </button>
            </div>
          )}

          {type === 'received' && exchange.status === 'accepted' && (
            <button onClick={() => updateStatus(exchange.id, 'completed')}
              style={{ padding: '7px 16px', borderRadius: '8px', background: '#6C63FF', color: 'white', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('exchanges.complete', lang)}
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🔄</div>
      <p style={{ color: '#9290B0', fontWeight: 500 }}>{t('common.loading', lang)}</p>
    </div>
  );

  const current = tab === 'received' ? received : sent;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7FF', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

      {/* Navbar */}
      <nav className="desktop-nav" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E8E6FF', padding: '0 32px', alignItems: 'center', justifyContent: 'space-between', height: '68px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔄</div>
          <span style={{ fontWeight: 800, fontSize: '17px', background: 'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillSwap</span>
        </Link>
        <div style={{ display: 'flex', gap: '28px' }}>
          {[
            ['/dashboard', t('nav.dashboard', lang), false],
            ['/explore',   t('nav.explore', lang),   false],
            ['/profile',   t('nav.profile', lang),   false],
            ['/exchanges', t('nav.exchanges', lang),  true],
          ].map(([href, label, active]) => (
            <Link key={href} href={href} style={{ fontSize: '13px', color: active ? '#6C63FF' : '#4B4869', textDecoration: 'none', fontWeight: active ? 700 : 500 }}>{label}</Link>
          ))}
        </div>
        <LanguageSwitcher />
      </nav>

      <MobileNav active="/exchanges" />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '36px 24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1A1635', marginBottom: '28px', letterSpacing: '-0.5px' }}>
          {t('exchanges.title', lang)}
        </h1>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'white', border: '1px solid #E8E6FF', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
          {[
            { key: 'received', label: `${t('exchanges.received', lang)} (${received.length})` },
            { key: 'sent',     label: `${t('exchanges.sent', lang)} (${sent.length})` },
          ].map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              style={{ padding: '8px 20px', borderRadius: '9px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', background: tab === item.key ? '#6C63FF' : 'transparent', color: tab === item.key ? 'white' : '#9290B0', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {item.label}
            </button>
          ))}
        </div>

        {current.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', border: '1px solid #E8E6FF' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤝</div>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#1A1635', marginBottom: '8px' }}>{t('exchanges.noExchanges', lang)}</p>
            <Link href="/explore" style={{ color: '#6C63FF', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>{t('exchanges.explore', lang)}</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {current.map((exchange, i) => (
              <ExchangeCard key={i} exchange={exchange} type={tab} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
