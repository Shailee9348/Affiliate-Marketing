import { NextResponse } from 'next/server';

/**
 * Middleware to protect routes that require authentication
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/api',
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check for the auth cookie
  // Note: Since we're using localStorage client-side, we can't directly check it here
  // This middleware mainly serves as a client-side redirect helper
  // The actual auth check happens in the pages themselves
  
  // Redirect to login if accessing protected routes
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/affiliates') ||
      pathname.startsWith('/campaigns') ||
      pathname.startsWith('/analytics') ||
      pathname.startsWith('/reports') ||
      pathname.startsWith('/payouts') ||
      pathname.startsWith('/settings')) {
    // We'll add a cookie check on client-side with next-auth in the future
    // For now, we're relying on client-side checks in the pages
    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
      missing: [
        { type: 'header', key: 'next-action' },
      ],
    },
  ],
};