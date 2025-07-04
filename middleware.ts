import { NextRequest, NextResponse } from 'next/server'
import { getUrl } from "./lib/get-url";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token");
  const pathname = request.nextUrl.pathname;

  if (pathname === "/signin" && token) {
    return NextResponse.redirect(new URL(getUrl('/dashboard')))
  }

  if (pathname.includes("/dashboard") && !token) {
    return NextResponse.redirect(new URL(getUrl('/signin')))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
