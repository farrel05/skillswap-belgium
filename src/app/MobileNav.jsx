'use client';
import Link from 'next/link';
import { useLang } from './LanguageContext';
import { t } from './i18n';

export default function MobileNav({ active }) {
  const { lang } = useLang();
  const items = [
    { href: '/dashboard', emoji: '🏠', key: 'nav.dashboard' },
    { href: '/explore',   emoji: '🔍', key: 'nav.explore'   },
    { href: '/profile',   emoji: '👤', key: 'nav.profile'   },
    { href: '/exchanges', emoji: '🤝', key: 'nav.exchanges'  },
  ];
  return (
    <div className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-items">
        {items.map(item => (
          <Link key={item.href} href={item.href} className={`mobile-nav-item ${active === item.href ? 'active' : ''}`}>
            <span className="nav-emoji">{item.emoji}</span>
            <span className="nav-lbl">{t(item.key, lang).replace(/^[^ ]+ /, '')}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
