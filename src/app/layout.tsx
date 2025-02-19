import './globals.css';
// You might need to use a different font since American Typewriter isn't available on Google Fonts
// Consider alternatives like 'Special Elite' which has a similar feel
import { Special_Elite } from 'next/font/google';
import Link from 'next/link';

const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={specialElite.className}>
        <nav className="p-4">
          <Link href="/" className="mr-4">
            Home
          </Link>
          <Link href="/concerts">Concerts</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
