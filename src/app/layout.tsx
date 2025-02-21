'use client';

import './globals.css';
import AdminButton from '@/components/AdminButton';
import Providers from '@/components/Providers';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <nav className="p-4">
            <Link href="/" className="mr-4">
              Home
            </Link>
            <Link href="/concerts" className="mr-4">
              Concerts
            </Link>
          </nav>
          <div className="relative min-h-screen">
            {children}
            <AdminButton />
          </div>
        </Providers>
      </body>
    </html>
  );
}
