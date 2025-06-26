import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /investments)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/signup", "/forgot-password"]

  // Check if the path is public
  const isPublicPath = publicPaths.includes(path)

  // Get the token from cookies (if you're using cookies for auth)
  // For now, we'll just allow all paths since we're using localStorage

  // If it's a public path, continue
  if (isPublicPath) {
    return NextResponse.next()
  }

  // For all other paths, continue (since we handle auth in components)
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
