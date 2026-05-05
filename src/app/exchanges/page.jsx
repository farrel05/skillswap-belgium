'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '../LanguageContext';
import { t } from '../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from '../MobileNav';
import NotificationBell from '../NotificationBell';

const S = `
  .page-wrap-800{max-width:800px;margin:0 auto;padding:36px 24px}
  @media(max-width:1024px){ .page-wrap-800{padding:20px 16px} }

  /* Modal */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
  .modal-box{background:white;border-radius:24px;padding:36px;width:100%;max-width:460px;box-shadow:0 40px 80px rgba(0,0,0,.2);animation:modalIn .3s ease}
  @keyframes modalIn{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}

  /* Stars */
  .star-btn{font-size:32px;cursor:pointer;transition:transform .15s;background:none;border:none;padding:4px;line-height:1}
  .star-btn:hover{transform:scale(1.2)}
  .star-btn.active{filter:drop-shadow(0 0 6px #F59E0B)}

  /* Review textarea */
  .review-input{width:100%;padding:12px 16px;border-radius:12px;border:1.5px solid #E8E6FF;font-size:14px;outline:none;font-family:inherit;resize:vertical;transition:border .2s;background:#F8F7FF;color:#1A1635}
  .review-input:focus{border-color:#6C63FF;background:white;box-shadow:0 0 0 4px rgba(108,99,255,.08)}
  .review-input::placeholder{color:#9290B0}

  .submit-review-btn{width:100%;padding:13px;border-radius:14px;background:linear-gradient(135deg,#6C63FF,#4F46E5);color:white;border:none;font-weight:700;font-size:15px;cursor:pointer;font-family:inherit;box-shadow:0 6px 20px rgba(108,99,255,.35);transition:all .2s}
  .submit-review-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 28px rgba(108,99,255,.5)}
  .submit-review-btn:disabled{background:#E8E6FF;color:#9290B0;box-shadow:none;cursor:not-allowed}
`;

export default function ExchangesPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('received');
  const [reviews, setReviews] = useState({}); // exchange_id -> review déjà donné
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null); // { exchange, otherUser }
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const loadData = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { router.push('/auth'); return; }
    setUser(u);

    const { data: recv } = await supabase
      .from('exchanges')
      .select('*, skillswap_profiles!exchanges_requester_id_fkey(*)')
      .eq('provider_id', u.id)
      .order('created_at', { ascending: false });

    const { data: sentData } = await supabase
      .from('exchanges')
      .select('*, skillswap_profiles!exchanges_provider_id_fkey(*)')
      .eq('requester_id', u.id)
      .order('created_at', { ascending: false });

    setReceived(recv || []);
    setSent(sentData || []);

    // Charger les avis déjà donnés par l'utilisateur
    const { data: myReviews } = await supabase
      .from('reviews')
      .select('exchange_id, rating')
      .eq('reviewer_id', u.id);

    const reviewMap = {};
    (myReviews || []).forEach(r => { reviewMap[r.exchange_id] = r.rating; });
    setReviews(reviewMap);

    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const updateStatus = async (id, status) => {
    await supabase.from('exchanges').update({ status }).eq('id', id);
    loadData();
  };

  const openReviewModal = (exchange, otherProfile) => {
    setReviewTarget({ exchange, otherProfile });
    setRating(0);
    setComment('');
    setHoverRating(0);
    setReviewSuccess(false);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!rating || !reviewTarget) return;
    setSubmitting(true);

    const otherUserId = reviewTarget.exchange.requester_id === user.id
      ? reviewTarget.exchange.provider_id
      : reviewTarget.exchange.requester_id;

    const { error } = await supabase.from('reviews').insert({
      reviewer_id: user.id,
      reviewed_id: otherUserId,
      exchange_id: reviewTarget.exchange.id,
      rating,
      comment: comment.trim() || null,
    });

    if (!error) {
      setReviewSuccess(true);
      setReviews(prev => ({ ...prev, [reviewTarget.exchange.id]: rating }));
      setTimeout(() => setShowReviewModal(false), 2000);
    }
    setSubmitting(false);
  };

  const getStatusInfo = (status) => ({
    pending:   { label: t('exchanges.pending', lang),   color: '#F59E0B', bg: '#FEF3C7' },
    accepted:  { label: t('exchanges.accepted', lang),  color: '#10B981', bg: '#D1FAE5' },
    rejected:  { label: t('exchanges.rejected', lang),  color: '#EF4444', bg: '#FEE2E2' },
    completed: { label: t('exchanges.completed', lang), color: '#6C63FF', bg: '#EEF0FF' },
  }[status] || { label: t('exchanges.pending', lang), color: '#F59E0B', bg: '#FEF3C7' });

  const ExchangeCard = ({ exchange, type }) => {
    const profile = exchange.skillswap_profiles;
    const statusInfo = getStatusInfo(exchange.status);
    const alreadyReviewed = reviews[exchange.id];

    return (
      <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'16px', padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:'linear-gradient(135deg,#6C63FF,#EC4899)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:'700', flexShrink:0 }}>
              {profile?.full_name?.[0] || '?'}
            </div>
            <div>
              <div style={{ fontSize:'14px', fontWeight:'700', color:'#1A1635' }}>{profile?.full_name || 'Utilisateur'}</div>
              <div style={{ fontSize:'12px', color:'#9290B0' }}>{profile?.location || profile?.region || t('common.belgium', lang)}</div>
            </div>
          </div>
          <span style={{ fontSize:'11px', padding:'4px 12px', borderRadius:'20px', fontWeight:'600', background:statusInfo.bg, color:statusInfo.color, flexShrink:0 }}>
            {statusInfo.label}
          </span>
        </div>

        {exchange.message && (
          <p style={{ fontSize:'13px', color:'#4B4869', background:'#F8F7FF', padding:'10px 14px', borderRadius:'8px', marginBottom:'14px', lineHeight:'1.6' }}>
            💬 {exchange.message}
          </p>
        )}

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'8px' }}>
          <span style={{ fontSize:'12px', color:'#9290B0' }}>
            ⏱️ {exchange.hours}{t('common.hours', lang)} · {new Date(exchange.created_at).toLocaleDateString('fr-BE')}
          </span>

          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {/* Accepter/Refuser */}
            {type === 'received' && exchange.status === 'pending' && (
              <>
                <button onClick={() => updateStatus(exchange.id, 'accepted')}
                  style={{ padding:'7px 16px', borderRadius:'8px', background:'#10B981', color:'white', border:'none', fontSize:'12px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit' }}>
                  {t('exchanges.accept', lang)}
                </button>
                <button onClick={() => updateStatus(exchange.id, 'rejected')}
                  style={{ padding:'7px 16px', borderRadius:'8px', background:'white', color:'#EF4444', border:'1px solid #EF4444', fontSize:'12px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit' }}>
                  {t('exchanges.reject', lang)}
                </button>
              </>
            )}

            {/* Marquer terminé + Chat */}
            {type === 'received' && exchange.status === 'accepted' && (
              <>
                <button onClick={() => updateStatus(exchange.id, 'completed')}
                  style={{ padding:'7px 16px', borderRadius:'8px', background:'#6C63FF', color:'white', border:'none', fontSize:'12px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit' }}>
                  {t('exchanges.complete', lang)}
                </button>
                <a href={`/messages?exchange=${exchange.id}`}
                  style={{ padding:'7px 16px', borderRadius:'8px', background:'#10B981', color:'white', textDecoration:'none', fontSize:'12px', fontWeight:'600', display:'flex', alignItems:'center', gap:'4px' }}>
                  💬 Chat
                </a>
              </>
            )}

            {/* Chat pour envoyés acceptés */}
            {exchange.status === 'accepted' && type === 'sent' && (
              <a href={`/messages?exchange=${exchange.id}`}
                style={{ padding:'7px 16px', borderRadius:'8px', background:'#10B981', color:'white', textDecoration:'none', fontSize:'12px', fontWeight:'600', display:'flex', alignItems:'center', gap:'4px' }}>
                💬 Chat
              </a>
            )}

            {/* Laisser un avis sur échange terminé */}
            {exchange.status === 'completed' && (
              alreadyReviewed ? (
                <div style={{ display:'flex', alignItems:'center', gap:'4px', padding:'7px 14px', borderRadius:'8px', background:'#FEF3C7', fontSize:'12px', fontWeight:'600', color:'#92400E' }}>
                  {'★'.repeat(alreadyReviewed)} {lang==='fr'?'Avis donné':lang==='nl'?'Beoordeling gegeven':'Review given'}
                </div>
              ) : (
                <button onClick={() => openReviewModal(exchange, profile)}
                  style={{ padding:'7px 16px', borderRadius:'8px', background:'linear-gradient(135deg,#F59E0B,#F97316)', color:'white', border:'none', fontSize:'12px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'4px' }}>
                  ⭐ {lang==='fr'?'Laisser un avis':lang==='nl'?'Beoordeling geven':'Leave a review'}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:'16px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{S}</style>
      <div style={{ width:'48px', height:'48px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' }}>🔄</div>
      <p style={{ color:'#9290B0', fontWeight:500 }}>{t('common.loading', lang)}</p>
    </div>
  );

  const current = tab === 'received' ? received : sent;

  return (
    <div style={{ minHeight:'100vh', background:'#F8F7FF', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{S}</style>

      {/* Modal avis */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowReviewModal(false)}>
          <div className="modal-box">
            {reviewSuccess ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:'56px', marginBottom:'16px' }}>🎉</div>
                <h3 style={{ fontSize:'20px', fontWeight:800, color:'#1A1635', marginBottom:'8px' }}>
                  {lang==='fr'?'Avis envoyé !':lang==='nl'?'Beoordeling verzonden!':'Review submitted!'}
                </h3>
                <p style={{ fontSize:'14px', color:'#9290B0' }}>
                  {lang==='fr'?'Merci pour votre retour':lang==='nl'?'Bedankt voor uw feedback':'Thank you for your feedback'}
                </p>
              </div>
            ) : (
              <>
                <div style={{ textAlign:'center', marginBottom:'24px' }}>
                  <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'linear-gradient(135deg,#6C63FF,#EC4899)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'22px', margin:'0 auto 12px' }}>
                    {reviewTarget?.otherProfile?.full_name?.[0] || '?'}
                  </div>
                  <h3 style={{ fontSize:'18px', fontWeight:800, color:'#1A1635', marginBottom:'4px' }}>
                    {lang==='fr'?'Noter':lang==='nl'?'Beoordeel':' Rate'} {reviewTarget?.otherProfile?.full_name || 'cet utilisateur'}
                  </h3>
                  <p style={{ fontSize:'13px', color:'#9290B0' }}>
                    {lang==='fr'?'Comment s\'est passé cet échange ?':lang==='nl'?'Hoe verliep deze uitwisseling?':'How was this exchange?'}
                  </p>
                </div>

                {/* Étoiles */}
                <div style={{ display:'flex', justifyContent:'center', gap:'4px', marginBottom:'20px' }}>
                  {[1,2,3,4,5].map(i => (
                    <button key={i} className={`star-btn ${i <= (hoverRating || rating) ? 'active' : ''}`}
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(i)}>
                      {i <= (hoverRating || rating) ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>

                {/* Label rating */}
                {rating > 0 && (
                  <div style={{ textAlign:'center', marginBottom:'16px' }}>
                    <span style={{ fontSize:'13px', fontWeight:700, color:['','#EF4444','#F97316','#F59E0B','#10B981','#6C63FF'][rating] }}>
                      {lang==='fr'
                        ? ['','Mauvais','Passable','Bien','Très bien','Excellent !'][rating]
                        : lang==='nl'
                        ? ['','Slecht','Matig','Goed','Heel goed','Uitstekend!'][rating]
                        : ['','Bad','Fair','Good','Very good','Excellent!'][rating]}
                    </span>
                  </div>
                )}

                {/* Commentaire */}
                <div style={{ marginBottom:'20px' }}>
                  <label style={{ fontSize:'13px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'8px' }}>
                    {lang==='fr'?'Commentaire (optionnel)':lang==='nl'?'Opmerking (optioneel)':'Comment (optional)'}
                  </label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)}
                    placeholder={lang==='fr'?'Décrivez votre expérience...':lang==='nl'?'Beschrijf uw ervaring...':'Describe your experience...'}
                    rows={3} className="review-input" maxLength={300} />
                  <div style={{ fontSize:'11px', color:'#9290B0', textAlign:'right', marginTop:'4px' }}>{comment.length}/300</div>
                </div>

                <button onClick={submitReview} disabled={!rating || submitting} className="submit-review-btn">
                  {submitting ? '⏳ ...' : lang==='fr'?'Envoyer mon avis →':lang==='nl'?'Beoordeling verzenden →':'Submit review →'}
                </button>

                <button onClick={() => setShowReviewModal(false)}
                  style={{ width:'100%', marginTop:'10px', padding:'10px', background:'none', border:'none', color:'#9290B0', fontSize:'13px', cursor:'pointer', fontFamily:'inherit' }}>
                  {lang==='fr'?'Annuler':lang==='nl'?'Annuleren':'Cancel'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="desktop-nav" style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid #E8E6FF', padding:'0 32px', alignItems:'center', justifyContent:'space-between', height:'68px', position:'sticky', top:0, zIndex:100 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'17px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
        </Link>
        <div style={{ display:'flex', gap:'28px' }}>
          {[
            ['/dashboard', t('nav.dashboard',lang), false],
            ['/explore',   t('nav.explore',lang),   false],
            ['/profile',   t('nav.profile',lang),   false],
            ['/exchanges', t('nav.exchanges',lang),  true],
            ['/messages',  t('nav.messages',lang),   false],
          ].map(([href,label,active]) => (
            <Link key={href} href={href} style={{ fontSize:'13px', color:active?'#6C63FF':'#4B4869', textDecoration:'none', fontWeight:active?700:500 }}>{label}</Link>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <NotificationBell />
          <LanguageSwitcher />
        </div>
      </nav>

      <MobileNav active="/exchanges" />

      <div className="page-wrap-800">
        <h1 style={{ fontSize:'26px', fontWeight:800, color:'#1A1635', marginBottom:'28px', letterSpacing:'-0.5px' }}>
          {t('exchanges.title', lang)}
        </h1>

        <div style={{ display:'flex', background:'white', border:'1px solid #E8E6FF', borderRadius:'12px', padding:'4px', marginBottom:'24px', width:'fit-content' }}>
          {[
            { key:'received', label:`${t('exchanges.received',lang)} (${received.length})` },
            { key:'sent',     label:`${t('exchanges.sent',lang)} (${sent.length})` },
          ].map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              style={{ padding:'8px 20px', borderRadius:'9px', border:'none', fontSize:'13px', fontWeight:'600', cursor:'pointer', background:tab===item.key?'#6C63FF':'transparent', color:tab===item.key?'white':'#9290B0', fontFamily:'inherit', transition:'all 0.15s' }}>
              {item.label}
            </button>
          ))}
        </div>

        {current.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', background:'white', borderRadius:'20px', border:'1px solid #E8E6FF' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>🤝</div>
            <p style={{ fontSize:'16px', fontWeight:'700', color:'#1A1635', marginBottom:'8px' }}>{t('exchanges.noExchanges', lang)}</p>
            <Link href="/explore" style={{ color:'#6C63FF', textDecoration:'none', fontWeight:'600', fontSize:'14px' }}>{t('exchanges.explore', lang)}</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {current.map((exchange, i) => (
              <ExchangeCard key={i} exchange={exchange} type={tab} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}