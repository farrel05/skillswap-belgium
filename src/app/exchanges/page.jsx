'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const STATUS_LABELS = {
  pending:   { label: 'En attente', color: '#F59E0B', bg: '#FEF3C7' },
  accepted:  { label: 'Accepté',    color: '#10B981', bg: '#D1FAE5' },
  rejected:  { label: 'Refusé',     color: '#EF4444', bg: '#FEE2E2' },
  completed: { label: 'Terminé',    color: '#6C63FF', bg: '#EEF0FF' },
};

export default function ExchangesPage() {
  const router = useRouter();
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

    const { data: sent } = await supabase
      .from('exchanges')
      .select('*, skillswap_profiles!exchanges_provider_id_fkey(*)')
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false });

    setReceived(recv || []);
    setSent(sent || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('exchanges').update({ status }).eq('id', id);
    loadData();
  };

  const ExchangeCard = ({ exchange, type }) => {
    const profile = type === 'received'
      ? exchange.skillswap_profiles
      : exchange.skillswap_profiles;
    const statusInfo = STATUS_LABELS[exchange.status] || STATUS_LABELS.pending;

    return (
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', flexShrink: 0 }}>
              {profile?.full_name?.[0] || '?'}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>{profile?.full_name || 'Utilisateur'}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{profile?.location || profile?.region || 'Belgique'}</div>
            </div>
          </div>
          <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: '600', background: statusInfo.bg, color: statusInfo.color }}>
            {statusInfo.label}
          </span>
        </div>

        {exchange.message && (
          <p style={{ fontSize: '13px', color: 'var(--text-2)', background: 'var(--bg)', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', lineHeight: '1.6' }}>
            💬 {exchange.message}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
            ⏱️ {exchange.hours}h · {new Date(exchange.created_at).toLocaleDateString('fr-BE')}
          </span>

          {type === 'received' && exchange.status === 'pending' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => updateStatus(exchange.id, 'accepted')}
                style={{ padding: '7px 16px', borderRadius: '8px', background: '#10B981', color: 'white', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                ✓ Accepter
              </button>
              <button onClick={() => updateStatus(exchange.id, 'rejected')}
                style={{ padding: '7px 16px', borderRadius: '8px', background: 'white', color: '#EF4444', border: '1px solid #EF4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                ✕ Refuser
              </button>
            </div>
          )}

          {type === 'received' && exchange.status === 'accepted' && (
            <button onClick={() => updateStatus(exchange.id, 'completed')}
              style={{ padding: '7px 16px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              ✓ Marquer terminé
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Chargement...</div>;

  const current = tab === 'received' ? received : sent;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔄</div>
          <span style={{ fontWeight: '700', color: 'var(--text-1)' }}>SkillSwap</span>
        </Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[['/dashboard', '🏠 Dashboard'], ['/explore', '🔍 Explorer'], ['/profile', '👤 Profil'], ['/exchanges', '🤝 Échanges']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: '13px', color: href === '/exchanges' ? 'var(--primary)' : 'var(--text-2)', textDecoration: 'none', fontWeight: href === '/exchanges' ? '600' : '400' }}>{label}</Link>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>🤝 Mes Échanges</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
          {[
            { key: 'received', label: `Reçus (${received.length})` },
            { key: 'sent', label: `Envoyés (${sent.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '8px 20px', borderRadius: '9px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', background: tab === t.key ? 'var(--primary)' : 'transparent', color: tab === t.key ? 'white' : 'var(--text-2)', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {current.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-3)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤝</div>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Aucun échange {tab === 'received' ? 'reçu' : 'envoyé'}</p>
            <Link href="/explore" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>Explorer les profils →</Link>
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
