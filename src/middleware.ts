import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hasMockSession = request.cookies.get('mock-session')?.value === 'true'

  // 1. Safe guard check: if Supabase keys are missing, run simulated login protection
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (url.pathname.startsWith('/admin')) {
      if (url.pathname === '/admin/login') {
        if (hasMockSession) {
          url.pathname = '/admin/dashboard'
          return NextResponse.redirect(url)
        }
      } else {
        if (!hasMockSession) {
          url.pathname = '/admin/login'
          return NextResponse.redirect(url)
        }
      }
    }
    return NextResponse.next()
  }

  // 2. Real Supabase Auth Protection when keys are provided
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthorized = !!user || hasMockSession

  if (url.pathname.startsWith('/admin')) {
    if (url.pathname === '/admin/login') {
      if (isAuthorized) {
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      }
    } else {
      if (!isAuthorized) {
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - all images/assets in public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
