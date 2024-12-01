import { NextRequest, NextResponse } from 'next/server';
import { cookiesParse } from './utils/cookies';

export async function middleware(request: NextRequest) {
  try {
    // If the user is not authenticated

    // Allow access to /api/register and /api/login
    if (
      request.nextUrl.pathname.startsWith('/api/register') ||
      request.nextUrl.pathname.startsWith('/api/login')
    ) {
      return NextResponse.next(); // Allow access to these routes
    }


    // Create a new response and attach user info to a custom header
  } catch (error: any) {
    console.error('Middleware error:', error.message);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

// Define middleware configuration
export const config = {
  matcher: ['/api/:path*'], // Match all API routes
};
