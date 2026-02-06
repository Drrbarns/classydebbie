import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes (except admin login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for Supabase auth cookies
    // Supabase stores session in cookies with name pattern sb-<ref>-auth-token
    const allCookies = request.cookies.getAll();
    const authCookie = allCookies.find(c => c.name.includes('auth-token'));

    if (!authCookie) {
      // No auth cookie - redirect to admin login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Cookie exists, let the client-side auth check handle role verification
    // This prevents serving admin pages to completely unauthenticated users
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
