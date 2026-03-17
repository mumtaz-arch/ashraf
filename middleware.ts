import { NextRequest, NextResponse } from "next/server"

const locales = ["id", "en"]
const defaultLocale = "id"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Skip internal Next.js files and assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/uploads") || pathname === "/favicon.ico") {
    return NextResponse.next()
  }

  // 2. Protect /api/admin routes (Exclude from i18n segment check)
  if (pathname.startsWith("/api/admin")) {
    // Allow login/logout endpoints without session
    if (pathname.startsWith("/api/admin/auth/")) {
      return NextResponse.next()
    }

    const session = request.cookies.get("admin_session")?.value
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // 3. Skip other API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // 4. Handle i18n routing for standard pages
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    const locale = defaultLocale
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
    )
  }

  // 5. Admin Page Protection
  const segments = pathname.split("/")
  // pathname format: /:locale/admin/... -> segments: ["", ":locale", "admin", ...]
  const isAdminPath = segments[2] === "admin"
  const isLoginPage = segments[3] === "login"

  if (isAdminPath && !isLoginPage) {
    const session = request.cookies.get("admin_session")?.value
    if (!session) {
      const locale = segments[1]
      const loginUrl = new URL(`/${locale}/admin/login`, request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  // Match all paths except those static assets usually ignored
  matcher: ["/((?!_next/static|_next/image|uploads|assets|favicon.ico|sw.js).*)"],
}
