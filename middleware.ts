import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const allCookies = request.cookies.getAll();
    
    // Check for any valid admin auth cookie
    const hasAdminAuth = allCookies.some(
      (cookie) =>
        cookie.name === 'distro365_admin_session' ||
        cookie.name === 'distro365_admin_token' ||
        cookie.name === 'sb-admin-auth-token' ||
        (cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'))
    );

    if (!hasAdminAuth) {
      console.log('[Middleware] Unauthorized access attempt to:', pathname, '-> Redirecting to /admin/login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
