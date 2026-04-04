import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has('analytics_auth')

  if (pathname.startsWith('/analytics/login')) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/analytics', request.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/analytics/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/analytics', '/analytics/:path*'],
}
