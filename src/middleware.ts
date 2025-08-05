import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest) => {
  // Clean up error=undefined parameters in SignIn URL
  if (req.nextUrl.pathname === '/SignIn') {
    const error = req.nextUrl.searchParams.get('error')
    
    // If error parameter exists and is undefined/null/empty, remove it
    if (error === 'undefined' || error === 'null' || error === '') {
      const url = req.nextUrl.clone()
      url.searchParams.delete('error')
      return NextResponse.redirect(url)
    }
  }
  
  // Continue with default auth middleware behavior
  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}