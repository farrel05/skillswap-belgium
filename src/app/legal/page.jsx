'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '../LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from '../MobileNav';

const S = `
  .nav-link{font-size:13px;color:#4B4869;text-decoration:none;font-weight:500;transition:color .2s}
  .nav-link:hover{color:#6C63FF}
  .legal-section{margin-bottom:32px}
  .legal-section h2{font-size:18px;font-weight:700;color:#1A1635;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #E8E6FF}
  .legal-section h3{font-size:15px;font-weight:700;color:#1A1635;margin:16px 0 8px}
  .legal-section p{font-size:14px;color:#4B4869;line-height:1.8;margin-bottom:10px}
  .legal-section ul{font-size:14px;color:#4B4869;line-height:1.8;padding-left:20px;margin-bottom:10px}
  .legal-section li{margin-bottom:6px}
  .tab-btn{padding:10px 24px;border-radius:10px;border:none;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}
  .tab-btn.active{background:linear-gradient(135deg,#6C63FF,#4F46E5);color:white;box-shadow:0 4px 14px rgba(108,99,255,.3)}
  .tab-btn:not(.active){background:#F8F7FF;color:#4B4869;border:1px solid #E8E6FF}
  @media(max-width:1024px){
    .legal-card{padding:24px 16px !important}
    .legal-tabs{flex-direction:column !important}
    .tab-btn{width:100%;text-align:center}
  }
`;

const CGU = {
  fr: {
    title: "Conditions Générales d'Utilisation",
    updated: "Dernière mise à jour : Mai 2026",
    sections: [
      {
        title: "1. Présentation de la plateforme",
        content: `SkillSwap Belgium (accessible sur skillswap-belgium.com) est une plateforme d'échange de compétences entre professionnels belges. Elle permet aux utilisateurs de proposer leurs expertises et d'en découvrir d'autres, en utilisant un système de crédits virtuels pour faciliter les échanges.`
      },
      {
        title: "2. Acceptation des conditions",
        content: `En accédant à SkillSwap Belgium, vous acceptez pleinement et entièrement les présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser la plateforme immédiatement.`
      },
      {
        title: "3. Inscription et compte utilisateur",
        content: `Pour utiliser SkillSwap Belgium, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion. Tout accès non autorisé doit être signalé immédiatement. SkillSwap Belgium se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU.`
      },
      {
        title: "4. Système de crédits",
        content: `SkillSwap Belgium utilise un système de crédits virtuels. 5 crédits sont offerts à l'inscription. Des crédits supplémentaires peuvent être achetés via notre plateforme de paiement sécurisée (Stripe). Chaque message envoyé dans une conversation coûte 1 crédit. Les crédits ne sont pas remboursables et n'ont pas de valeur monétaire. Ils n'expirent pas.`
      },
      {
        title: "5. Paiements",
        content: `Les paiements sont traités par Stripe, une solution sécurisée conforme PCI DSS. Nous acceptons les cartes de crédit/débit et Bancontact. Conformément à la législation belge, une facture électronique peut être fournie sur demande. Les prix sont indiqués en EUR toutes taxes comprises.`
      },
      {
        title: "6. Comportement des utilisateurs",
        content: `Les utilisateurs s'engagent à ne pas publier de contenu illégal, offensant, trompeur ou portant atteinte aux droits de tiers. Il est interdit d'utiliser la plateforme à des fins commerciales non autorisées, de harceler d'autres utilisateurs, ou de tenter de contourner les mesures de sécurité.`
      },
      {
        title: "7. Propriété intellectuelle",
        content: `Le contenu de SkillSwap Belgium (logo, design, code) est protégé par le droit belge de la propriété intellectuelle. Les utilisateurs conservent la propriété de leur contenu mais accordent à SkillSwap Belgium une licence non exclusive pour l'afficher sur la plateforme.`
      },
      {
        title: "8. Limitation de responsabilité",
        content: `SkillSwap Belgium est une plateforme de mise en relation. Nous ne sommes pas responsables de la qualité des échanges entre utilisateurs, des litiges entre utilisateurs, ni des dommages indirects résultant de l'utilisation de la plateforme.`
      },
      {
        title: "9. Droit applicable",
        content: `Les présentes CGU sont soumises au droit belge. Tout litige sera soumis aux tribunaux compétents de Bruxelles, Belgique.`
      },
      {
        title: "10. Contact",
        content: `Pour toute question : contact@skillswap-belgium.com`
      }
    ]
  },
  en: {
    title: "Terms of Service",
    updated: "Last updated: May 2026",
    sections: [
      { title: "1. Platform Overview", content: "SkillSwap Belgium (skillswap-belgium.com) is a skill exchange platform for Belgian professionals, using a virtual credit system to facilitate exchanges." },
      { title: "2. Acceptance", content: "By using SkillSwap Belgium, you fully accept these Terms of Service." },
      { title: "3. Account", content: "You must provide accurate information when creating an account. You are responsible for keeping your credentials secure." },
      { title: "4. Credits System", content: "5 credits are offered at registration. Additional credits can be purchased. Each message costs 1 credit. Credits are non-refundable and never expire." },
      { title: "5. Payments", content: "Payments are processed securely by Stripe. We accept credit/debit cards and Bancontact. Prices are in EUR inclusive of taxes." },
      { title: "6. User Conduct", content: "Users must not post illegal, offensive or misleading content. Harassment is strictly prohibited." },
      { title: "7. Intellectual Property", content: "SkillSwap Belgium content is protected by Belgian intellectual property law." },
      { title: "8. Liability", content: "SkillSwap Belgium is a matching platform and is not responsible for the quality of exchanges between users." },
      { title: "9. Governing Law", content: "These terms are governed by Belgian law. Disputes shall be submitted to the courts of Brussels." },
      { title: "10. Contact", content: "Questions: contact@skillswap-belgium.com" }
    ]
  }
};

const PRIVACY = {
  fr: {
    title: "Politique de Confidentialité",
    updated: "Dernière mise à jour : Mai 2026",
    sections: [
      {
        title: "1. Responsable du traitement",
        content: `SkillSwap Belgium (skillswap-belgium.com) est responsable du traitement de vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation belge.`
      },
      {
        title: "2. Données collectées",
        content: `Nous collectons : votre adresse email, nom complet, ville, région, photo de profil (optionnelle), compétences, historique des échanges, messages (chiffrés), données de paiement (traitées par Stripe — nous ne stockons pas vos données bancaires).`
      },
      {
        title: "3. Finalités du traitement",
        content: `Vos données sont utilisées pour : créer et gérer votre compte, faciliter les échanges entre utilisateurs, traiter les paiements, envoyer des notifications liées à votre activité, améliorer nos services, respecter nos obligations légales.`
      },
      {
        title: "4. Base légale",
        content: `Le traitement est basé sur : l'exécution du contrat (utilisation de la plateforme), votre consentement (marketing), nos obligations légales (paiements, fiscalité).`
      },
      {
        title: "5. Partage des données",
        content: `Nous ne vendons jamais vos données. Nous partageons uniquement avec : Supabase (hébergement base de données — serveurs en Europe), Stripe (traitement des paiements), Vercel (hébergement du site).`
      },
      {
        title: "6. Conservation des données",
        content: `Vos données sont conservées tant que votre compte est actif. Après suppression de compte : 30 jours pour les données personnelles, 7 ans pour les données de facturation (obligation légale belge).`
      },
      {
        title: "7. Vos droits (RGPD)",
        content: `Vous avez le droit d'accéder à vos données, de les rectifier, de les supprimer (droit à l'oubli), de limiter le traitement, à la portabilité, et de vous opposer au traitement. Pour exercer ces droits : contact@skillswap-belgium.com`
      },
      {
        title: "8. Cookies",
        content: `Nous utilisons uniquement des cookies essentiels au fonctionnement de la plateforme (authentification, préférences de langue). Aucun cookie publicitaire ou de tracking tiers.`
      },
      {
        title: "9. Sécurité",
        content: `Vos données sont protégées par chiffrement SSL/TLS, authentification sécurisée via Supabase, et accès restreint aux données (Row Level Security).`
      },
      {
        title: "10. Contact & Réclamations",
        content: `Pour toute question : contact@skillswap-belgium.com. Vous pouvez également introduire une réclamation auprès de l'Autorité de Protection des Données belge (APD) : www.autoriteprotectiondonnees.be`
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: May 2026",
    sections: [
      { title: "1. Data Controller", content: "SkillSwap Belgium processes your personal data in compliance with GDPR and Belgian law." },
      { title: "2. Data Collected", content: "We collect: email, name, city, region, skills, exchange history, messages, payment data (processed by Stripe)." },
      { title: "3. Purpose", content: "Your data is used to manage your account, facilitate exchanges, process payments, and improve our services." },
      { title: "4. Legal Basis", content: "Processing is based on contract performance, your consent, and legal obligations." },
      { title: "5. Data Sharing", content: "We never sell your data. We only share with Supabase (EU servers), Stripe, and Vercel." },
      { title: "6. Retention", content: "Data kept while account is active. After deletion: 30 days for personal data, 7 years for billing data." },
      { title: "7. Your Rights", content: "You have the right to access, rectify, delete, and port your data. Contact: contact@skillswap-belgium.com" },
      { title: "8. Cookies", content: "We only use essential cookies for authentication and language preferences. No advertising cookies." },
      { title: "9. Security", content: "Your data is protected by SSL/TLS encryption and Supabase Row Level Security." },
      { title: "10. Contact", content: "Questions: contact@skillswap-belgium.com — Complaints: www.autoriteprotectiondonnees.be" }
    ]
  }
};

export default function LegalPage() {
  const { lang } = useLang();
  const [activeDoc, setActiveDoc] = useState('cgu');
  const l = lang === 'nl' ? 'fr' : lang; // NL fallback to FR

  const doc = activeDoc === 'cgu' ? CGU[l] || CGU.fr : PRIVACY[l] || PRIVACY.fr;

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
          <Link href="/" className="nav-link">← {lang==='fr'?'Retour':lang==='nl'?'Terug':'Back'}</Link>
        </div>
      </nav>

      <MobileNav active="" />

      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'40px 24px 80px' }}>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'32px', flexWrap:'wrap' }}>
          <button className={`tab-btn ${activeDoc==='cgu'?'active':''}`} onClick={() => setActiveDoc('cgu')}>
            📋 {lang==='fr'?'CGU':lang==='nl'?'Gebruiksvoorwaarden':'Terms of Service'}
          </button>
          <button className={`tab-btn ${activeDoc==='privacy'?'active':''}`} onClick={() => setActiveDoc('privacy')}>
            🔒 {lang==='fr'?'Politique de confidentialité':lang==='nl'?'Privacybeleid':'Privacy Policy'}
          </button>
        </div>

        {/* Document */}
        <div style={{ background:'white', border:'1px solid #E8E6FF', borderRadius:'20px', padding:'40px' }}>
          <h1 style={{ fontSize:'26px', fontWeight:800, color:'#1A1635', marginBottom:'8px', letterSpacing:'-0.5px' }}>{doc.title}</h1>
          <p style={{ fontSize:'13px', color:'#9290B0', marginBottom:'32px' }}>{doc.updated}</p>

          {doc.sections.map((section, i) => (
            <div key={i} className="legal-section">
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign:'center', marginTop:'24px', fontSize:'13px', color:'#9290B0' }}>
          🇧🇪 SkillSwap Belgium · skillswap-belgium.com · contact@skillswap-belgium.com
        </div>
      </div>
    </div>
  );
}
