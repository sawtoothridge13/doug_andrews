import './globals.css';
import Providers from '@/components/Providers';
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
        <Providers>
          <nav className="p-4">
            <Link href="/" className="mr-4">
              Home
            </Link>
            <Link href="/concerts" className="mr-4">
              Concerts
            </Link>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
