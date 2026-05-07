'use client';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Link from 'next/link';
import { useLang } from '../LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from '../MobileNav';

const S = `
  .nav-link{font-size:13px;color:#4B4869;text-decoration:none;font-weight:500;transition:color .2s}
  .nav-link:hover{color:#6C63FF}
  .contact-input{width:100%;padding:12px 16px;border-radius:12px;border:1.5px solid #E8E6FF;font-size:14px;outline:none;font-family:inherit;color:#1A1635;background:#F8F7FF;transition:all .2s}
  .contact-input:focus{border-color:#6C63FF;background:white;box-shadow:0 0 0 4px rgba(108,99,255,.08)}
  .contact-input::placeholder{color:#9290B0}
  .send-btn{width:100%;padding:14px;border-radius:14px;background:linear-gradient(135deg,#6C63FF,#4F46E5);color:white;border:none;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 6px 20px rgba(108,99,255,.35);transition:all .2s}
  .send-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 28px rgba(108,99,255,.5)}
  .send-btn:disabled{background:#E8E6FF;color:#9290B0;box-shadow:none;cursor:not-allowed}
  .info-card{background:white;border:1px solid #E8E6FF;border-radius:16px;padding:20px;display:flex;align-items:center;gap:14px;transition:all .2s}
  .info-card:hover{border-color:#6C63FF;transform:translateY(-2px);box-shadow:0 8px 24px rgba(108,99,255,.1)}
  @media(max-width:1024px){
    .contact-grid{grid-template-columns:1fr !important}
    .page-inner{padding:24px 16px 80px !important}
  }
`;

const LABELS = {
  fr: {
    title: 'Contactez-nous',
    sub: 'Une question ? Un problème ? On vous répond sous 24h.',
    name: 'Nom complet',
    email: 'Adresse email',
    subject: 'Sujet',
    subjects: ['Question générale', 'Problème technique', 'Paiement / Crédits', 'Signaler un utilisateur', 'Partenariat', 'Autre'],
    message: 'Message',
    messagePlaceholder: 'Décrivez votre demande...',
    send: 'Envoyer le message →',
    sending: 'Envoi en cours...',
    success: 'Message envoyé ! Nous vous répondrons sous 24h. ✅',
    error: 'Erreur lors de l\'envoi. Réessayez.',
    info: 'Informations',
    emailLabel: 'Email',
    responseTime: 'Temps de réponse',
    responseValue: 'Sous 24h',
    hours: 'Disponibilité',
    hoursValue: 'Lun–Ven, 9h–18h',
    location: 'Localisation',
    locationValue: 'Belgique 🇧🇪',
  },
  nl: {
    title: 'Contacteer ons',
    sub: 'Een vraag? Een probleem? We antwoorden binnen 24u.',
    name: 'Volledige naam',
    email: 'E-mailadres',
    subject: 'Onderwerp',
    subjects: ['Algemene vraag', 'Technisch probleem', 'Betaling / Credits', 'Gebruiker melden', 'Partnerschap', 'Andere'],
    message: 'Bericht',
    messagePlaceholder: 'Beschrijf uw verzoek...',
    send: 'Bericht verzenden →',
    sending: 'Verzenden...',
    success: 'Bericht verzonden! We antwoorden binnen 24u. ✅',
    error: 'Fout bij verzenden. Probeer opnieuw.',
    info: 'Informatie',
    emailLabel: 'E-mail',
    responseTime: 'Reactietijd',
    responseValue: 'Binnen 24u',
    hours: 'Beschikbaarheid',
    hoursValue: 'Ma–Vr, 9u–18u',
    location: 'Locatie',
    locationValue: 'België 🇧🇪',
  },
  en: {
    title: 'Contact us',
    sub: 'A question? A problem? We reply within 24h.',
    name: 'Full name',
    email: 'Email address',
    subject: 'Subject',
    subjects: ['General question', 'Technical issue', 'Payment / Credits', 'Report a user', 'Partnership', 'Other'],
    message: 'Message',
    messagePlaceholder: 'Describe your request...',
    send: 'Send message →',
    sending: 'Sending...',
    success: 'Message sent! We\'ll reply within 24h. ✅',
    error: 'Error sending. Please try again.',
    info: 'Information',
    emailLabel: 'Email',
    responseTime: 'Response time',
    responseValue: 'Within 24h',
    hours: 'Availability',
    hoursValue: 'Mon–Fri, 9am–6pm',
    location: 'Location',
    locationValue: 'Belgium 🇧🇪',
  },
};

export default function ContactPage() {
  const { lang } = useLang();
  const L = LABELS[lang] || LABELS.fr;

  useEffect(() => {
    emailjs.init('XDyz7DlO_8jJQUK71');
  }, []);

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setError('');

    try {
      await emailjs.send(
        'service_oa2cnb9',
        'template_pc4eeln',
        {
          from_name:  form.name,
          from_email: form.email,
          subject:    form.subject || 'Contact général',
          message:    form.message,
          reply_to:   form.email,
        }
      );
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setError(L.error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width:'100%', padding:'12px 16px', borderRadius:'12px', border:'1.5px solid #E8E6FF', fontSize:'14px', outline:'none', fontFamily:'inherit', color:'#1A1635', background:'#F8F7FF', transition:'all .2s' };

  return (
    <div style={{ minHeight:'100vh', background:'#F8F7FF', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{S}</style>

      {/* Navbar */}
      <nav className="desktop-nav" style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid #E8E6FF', padding:'0 32px', alignItems:'center', justifyContent:'space-between', height:'68px', position:'sticky', top:0, zIndex:100 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🔄</div>
          <span style={{ fontWeight:800, fontSize:'17px', background:'linear-gradient(135deg,#6C63FF,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap Belgium</span>
        </Link>
        <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
          <LanguageSwitcher />
          <Link href="/" className="nav-link">← {lang==='fr'?'Accueil':lang==='nl'?'Startpagina':'Home'}</Link>
        </div>
      </nav>

      <MobileNav active="" />

      <div className="page-inner" style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 24px 60px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ fontSize:'56px', marginBottom:'16px' }}>✉️</div>
          <h1 style={{ fontSize:'32px', fontWeight:800, color:'#1A1635', letterSpacing:'-1px', marginBottom:'10px' }}>{L.title}</h1>
          <p style={{ fontSize:'16px', color:'#9290B0' }}>{L.sub}</p>
        </div>

        <div className="contact-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:'24px' }}>

          {/* Infos */}
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'24px', marginBottom:'4px' }}>
              <h2 style={{ fontSize:'15px', fontWeight:700, color:'#1A1635', marginBottom:'16px' }}>📋 {L.info}</h2>
              {[
                { icon:'📧', label:L.emailLabel, value:'contact@skillswap-belgium.com' },
                { icon:'⏱️', label:L.responseTime, value:L.responseValue },
                { icon:'🕐', label:L.hours, value:L.hoursValue },
                { icon:'📍', label:L.location, value:L.locationValue },
              ].map((item, i) => (
                <div key={i} className="info-card" style={{ marginBottom:'10px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'#EEF0FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize:'11px', fontWeight:600, color:'#9290B0', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'2px' }}>{item.label}</div>
                    <div style={{ fontSize:'13px', fontWeight:600, color:'#1A1635' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Liens utiles */}
            <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'20px' }}>
              <h2 style={{ fontSize:'14px', fontWeight:700, color:'#1A1635', marginBottom:'12px' }}>🔗 Liens utiles</h2>
              {[
                { href:'/legal', label: lang==='fr'?'CGU & Confidentialité':lang==='nl'?'Gebruiksvoorwaarden':'Terms & Privacy', icon:'📋' },
                { href:'/credits', label: lang==='fr'?'Acheter des crédits':lang==='nl'?'Credits kopen':'Buy credits', icon:'⏱️' },
                { href:'/explore', label: lang==='fr'?'Explorer les profils':lang==='nl'?'Profielen verkennen':'Explore profiles', icon:'🔍' },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 0', textDecoration:'none', borderBottom: i < 2 ? '1px solid #F8F7FF' : 'none', color:'#4B4869', fontSize:'13px', fontWeight:500, transition:'color .2s' }}>
                  <span>{item.icon}</span>
                  {item.label}
                  <span style={{ marginLeft:'auto', color:'#9290B0' }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'28px' }}>
            <h2 style={{ fontSize:'16px', fontWeight:700, color:'#1A1635', marginBottom:'20px' }}>
              💬 {lang==='fr'?'Envoyer un message':lang==='nl'?'Stuur een bericht':'Send a message'}
            </h2>

            {success ? (
              <div style={{ textAlign:'center', padding:'40px 20px' }}>
                <div style={{ fontSize:'56px', marginBottom:'16px' }}>🎉</div>
                <p style={{ fontSize:'15px', fontWeight:700, color:'#1A1635', marginBottom:'8px' }}>{L.success}</p>
                <button onClick={() => setSuccess(false)}
                  style={{ marginTop:'16px', padding:'10px 24px', borderRadius:'12px', background:'linear-gradient(135deg,#6C63FF,#4F46E5)', color:'white', border:'none', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                  {lang==='fr'?'Nouveau message':lang==='nl'?'Nieuw bericht':'New message'}
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div className="contact-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{L.name} *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jean Dupont" style={inputStyle} className="contact-input" />
                  </div>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{L.email} *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="vous@exemple.com" style={inputStyle} className="contact-input" />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{L.subject}</label>
                  <select value={form.subject} onChange={e => set('subject', e.target.value)} style={inputStyle} className="contact-input">
                    <option value="">— {lang==='fr'?'Choisir un sujet':lang==='nl'?'Kies een onderwerp':'Choose a subject'} —</option>
                    {L.subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize:'12px', fontWeight:600, color:'#4B4869', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{L.message} *</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)}
                    placeholder={L.messagePlaceholder} rows={5}
                    style={{ ...inputStyle, resize:'vertical', lineHeight:1.6 }} className="contact-input" />
                  <div style={{ fontSize:'11px', color:'#9290B0', textAlign:'right', marginTop:'4px' }}>{form.message.length}/1000</div>
                </div>

                {error && (
                  <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', color:'#991B1B', padding:'12px 16px', borderRadius:'12px', fontSize:'13px' }}>⚠️ {error}</div>
                )}

                <button onClick={handleSubmit} disabled={loading || !form.name || !form.email || !form.message} className="send-btn">
                  {loading ? L.sending : L.send}
                </button>

                <p style={{ fontSize:'12px', color:'#9290B0', textAlign:'center' }}>
                  {lang==='fr'?'Ou écrivez directement à':lang==='nl'?'Of schrijf direct naar':'Or write directly to'}{' '}
                  <a href="mailto:contact@skillswap-belgium.com" style={{ color:'#6C63FF', fontWeight:600 }}>contact@skillswap-belgium.com</a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}