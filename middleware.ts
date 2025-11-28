import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas /admin/* excepto /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session');

    if (!session) {
      // Redirigir al login si no hay sesión
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verificar que la sesión sea válida
      JSON.parse(session.value);
    } catch {
      // Session inválida, redirigir al login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
