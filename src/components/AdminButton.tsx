'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminButton() {
  const { data: session } = useSession();

  if (!session?.user?.isAdmin) return null;

  return (
    <Link
      href="/admin"
      className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      aria-label="Admin Dashboard"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        {/* Outhouse structure */}
        <path d="M6 21V7l6-4 6 4v14H6z" />
        {/* Door */}
        <path d="M9 21V11h6v10" />
        {/* Roof peak */}
        <path d="M12 3l-8 5h16l-8-5z" />
        {/* Moon cutout */}
        <path d="M14 15h-1v-1h1z" />
      </svg>
    </Link>
  );
}
