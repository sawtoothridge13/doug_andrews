import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Get the pathname
    const path = req.nextUrl.pathname;

    // Get if user is admin from token
    const isAdmin = req.nextauth.token?.isAdmin;

    // Protect admin routes
    if (path.startsWith('/admin') && !isAdmin) {
      // Redirect non-admins to login
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Require authentication for all protected routes
    },
    pages: {
      signIn: '/login',
    },
  },
);

export const config = {
  matcher: ['/admin/:path*'], // Protect all routes under /admin
};
