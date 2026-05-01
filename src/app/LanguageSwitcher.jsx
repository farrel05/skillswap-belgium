'use client';
import { useLang } from './LanguageContext';

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'nl', label: 'NL' },
  { code: 'en', label: 'EN' },
];

export default function LanguageSwitcher({ compact = false }) {
  const { lang, changeLang } = useLang();

  return (
    <div style={{ display: 'flex', gap: compact ? '3px' : '4px' }}>
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => changeLang(l.code)}
          style={{
            padding: compact ? '4px 8px' : '6px 12px',
            borderRadius: '8px',
            border: `1.5px solid ${lang === l.code ? '#6C63FF' : '#E8E6FF'}`,
            background: lang === l.code ? '#6C63FF' : 'white',
            color: lang === l.code ? 'white' : '#9290B0',
            fontSize: compact ? '10px' : '11px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s',
            letterSpacing: '0.5px',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}