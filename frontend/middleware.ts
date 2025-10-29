import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Nếu là route google-auth-callback thì xóa header COOP
  if (request.nextUrl.pathname.startsWith('/google-auth-callback')) {
    const response = NextResponse.next();
    response.headers.delete('Cross-Origin-Opener-Policy');
    response.headers.delete('Cross-Origin-Embedder-Policy');
    return response;
  }

  // ...existing code...
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  if (subdomain === 'dashboard') {
    const url = request.nextUrl.clone();
    if (url.pathname === '/') {
      url.pathname = '/dashboard';
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}

// Cấu hình matcher để middleware chỉ chạy trên các route cần thiết
export const config = {
  matcher: [
    '/google-auth-callback',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
