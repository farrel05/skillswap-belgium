import './globals.css';

export const metadata = {
  title: 'SkillSwap Belgium',
  description: 'Échangez vos compétences avec des professionnels belges',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
