import { NextRequest, NextResponse } from 'next/server'
import { getUrl } from "./lib/get-url";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token");
  const pathname = request.nextUrl.pathname;

  // Rotas de autenticação
  const authRoutes = ['/auth/signin', '/auth/register', '/signin']
  const protectedRoutes = ['/dashboard', '/transactions', '/budgets', '/reports', '/settings', '/wallets']

  // Se está logado e tenta acessar rota de auth, redireciona para dashboard
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL(getUrl('/dashboard')))
  }

  // Se não está logado e tenta acessar rota protegida, redireciona para login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL(getUrl('/auth/signin')))
  }

  // Redirecionar página raiz para dashboard se logado, senão para login
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL(getUrl('/dashboard')))
  }
  
  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL(getUrl('/auth/signin')))
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
