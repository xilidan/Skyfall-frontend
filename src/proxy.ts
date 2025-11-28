import Negotiator from 'negotiator'
import {cookies} from 'next/headers'
import {NextResponse, type NextRequest} from 'next/server'
import linguiConfig from '../lingui.config'
import type {Locale} from './types/global'

const {locales} = linguiConfig as {locales: Locale[]}
const DEFAULT_LOCALE = (locales?.[0] ?? 'en') as Locale

export async function proxy(request: NextRequest) {
  const url = new URL(request.url)
  const {pathname} = url

  if (pathname.startsWith('/api') || pathname.startsWith('/docs')) return NextResponse.next()

  const currentLocaleFromPath = locales.find((loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) as
    | Locale
    | undefined

  const cookieStore = await cookies()
  const localeFromCookie = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined

  const resolvedLocale =
    currentLocaleFromPath ?? localeFromCookie ?? getReferrerLocale(request.headers) ?? getRequestLocale(request.headers)

  const redirectTo = (nextPath: string) => {
    const nextURL = new URL(request.url)
    nextURL.pathname = nextPath
    return NextResponse.redirect(nextURL)
  }

  if (!currentLocaleFromPath) {
    const response = redirectTo(`/${resolvedLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`)
    response.cookies.set('NEXT_LOCALE', resolvedLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return response
  }

  const isLoginPage =
    pathname === `/${resolvedLocale}/auth/login` || pathname === `/${resolvedLocale}/auth/registration`
  const isAuthPage = pathname.includes('/auth/')

  const accessToken = (await cookies()).get('accessToken')

  if (isLoginPage && !accessToken) {
    return NextResponse.next()
  }

  if (accessToken && isLoginPage) {
    return redirectTo(`/${resolvedLocale}`)
  }

  if (!accessToken) {
    return redirectTo(`/${resolvedLocale}/auth/login`)
  }

  if (accessToken && isAuthPage && !isLoginPage) {
    return redirectTo(`/${resolvedLocale}`)
  }

  const response = NextResponse.next()
  if (currentLocaleFromPath && currentLocaleFromPath !== localeFromCookie) {
    response.cookies.set('NEXT_LOCALE', currentLocaleFromPath, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return response
}

function getRequestLocale(requestHeaders: Headers): Locale {
  const langHeader = requestHeaders.get('accept-language') || undefined
  const negotiator = new Negotiator({headers: {'accept-language': langHeader}})
  const preferred = negotiator.languages(locales.slice())
  return (preferred?.[0] ?? DEFAULT_LOCALE) as Locale
}

function getReferrerLocale(requestHeaders: Headers): Locale | undefined {
  const referer = requestHeaders.get('referer')
  if (!referer) return undefined
  try {
    const refUrl = new URL(referer)
    const refPath = refUrl.pathname || '/'
    const refLocale = locales.find((loc) => refPath === `/${loc}` || refPath.startsWith(`/${loc}/`)) as
      | Locale
      | undefined
    return refLocale
  } catch {
    return undefined
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)'],
}
