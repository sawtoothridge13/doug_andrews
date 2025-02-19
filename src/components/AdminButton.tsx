'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminButton() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;

  return (
    <Link
      href={isAdmin ? '/admin' : '/login'}
      className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg transition-colors ${
        isAdmin ? 'bg-white hover:bg-gray-100' : 'bg-gray-100 hover:bg-gray-200'
      }`}
      aria-label={isAdmin ? 'Admin Dashboard' : 'Login'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isAdmin ? 'black' : 'gray'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        {/* Door frame */}
        <path d="M4 21V3h16v18" strokeWidth="2" />
        {/* Left door */}
        <path d="M6 21V7h5.5v14" />
        {/* Right door */}
        <path d="M18 21V7h-5.5v14" />
        {/* Door details - horizontal planks */}
        <path d="M6 11h5.5M12.5 11H18" strokeWidth="1" />
        <path d="M6 15h5.5M12.5 15H18" strokeWidth="1" />
        {/* Decorative swinging hinges */}
        <path d="M11.5 8c0 .5-.5 1-1 1M12.5 8c0 .5.5 1 1 1" strokeWidth="1" />
      </svg>
    </Link>
  );
}
