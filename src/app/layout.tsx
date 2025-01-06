import './globals.css';
import localFont from 'next/font/local';

const americanTypewriter = localFont({
  src: '../../public/fonts/american-typewriter-regular.woff2',
  variable: '--font-american-typewriter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={americanTypewriter.variable}>
      <body>{children}</body>
    </html>
  );
}
