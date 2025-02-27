import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // Protect the /dashboard route
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    // Redirect to the homepage if the token is missing
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to continue if the token exists or the route is not protected
  return NextResponse.next();
}

// Specify the routes to apply the middleware to
export const config = {
  matcher: ['/dashboard/:path*'], // Apply middleware to all routes under /dashboard
};
