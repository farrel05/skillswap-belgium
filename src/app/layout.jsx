import './globals.css';
import { LanguageProvider } from './LanguageContext';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: 'SkillSwap Belgium — Échangez vos compétences',
  description: 'Connectez-vous avec des professionnels belges, échangez vos expertises et progressez ensemble — sans débourser un centime. FR · NL · EN',
  keywords: 'compétences, échange, belgique, freelance, skills, swap, bruxelles, wallonie, flandre',
  authors: [{ name: 'SkillSwap Belgium' }],
  metadataBase: new URL('https://skillswap-belgium.com'),
  openGraph: {
    title: 'SkillSwap Belgium — Échangez vos compétences',
    description: 'Plateforme #1 d\'échange de compétences en Belgique. 500+ membres · FR · NL · EN',
    url: 'https://skillswap-belgium.com',
    siteName: 'SkillSwap Belgium',
    images: [
      {
        url: '/opengraph-image.svg',
        width: 1200,
        height: 630,
        alt: 'SkillSwap Belgium',
      },
    ],
    locale: 'fr_BE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillSwap Belgium',
    description: 'Échangez vos compétences avec des professionnels belges 🇧🇪',
    images: ['/opengraph-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={jakarta.className}>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
