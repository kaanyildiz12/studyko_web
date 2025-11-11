import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login without authentication
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Check if user is authenticated
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token && pathname.startsWith('/admin')) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // For API routes, return 401 if not authenticated
    if (!token && pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
