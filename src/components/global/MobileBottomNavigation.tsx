'use client'
import {Trans, useLingui} from '@lingui/react/macro'
import {Building, Heart, Home, ListIcon} from 'lucide-react'
import {interpolateAs} from 'next/dist/shared/lib/router/utils/interpolate-as'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {ParsedUrlQuery} from 'querystring'
import {useEffect, useRef} from 'react'
import {Link as RACLink, Toolbar, composeRenderProps} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {UnstyledLink} from '../shared/UnstyledLink'

export function MobileBottomNavigation() {
  const {t} = useLingui()
  const containerRef = useRef<React.ComponentRef<'div'>>(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const ro = new window.ResizeObserver(() => {
      document.documentElement.style.setProperty('--app-bottom-nav-height', `${container.clientHeight}px`)
    })
    ro.observe(container)
    return () => {
      ro.unobserve(container)
      document.documentElement.style.removeProperty('--app-bottom-nav-height')
    }
  }, [])
  return (
    <div
      ref={containerRef}
      className="sticky inset-x-0 bottom-0 z-100 flex shrink-0 flex-col justify-start bg-white bg-clip-padding pb-[env(safe-area-inset-bottom,0px)] shadow-mdupward"
    >
      <Toolbar className="flex h-[56px] items-center *:min-w-0 *:flex-1 *:shrink-0">
        <AppBottomNavLink href="/" icon={<Home />}>
          <Trans>Home</Trans>
        </AppBottomNavLink>

        <AppBottomNavLink href="/property/favourite" icon={<Heart />}>
          <Trans>Favourites</Trans>
        </AppBottomNavLink>

        <AppBottomNavLink href="/seller" icon={<ListIcon />}>
          <Trans>My listings</Trans>
        </AppBottomNavLink>

        <AppBottomNavLink href="/seller/create-property" icon={<Building />}>
          <Trans>List your land</Trans>
        </AppBottomNavLink>
      </Toolbar>
    </div>
  )
}

function AppBottomNavLink({
  icon,
  ...props
}: React.ComponentPropsWithRef<typeof RACLink> & {
  icon: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPath = interpolateAs(
    pathname,
    pathname.split('?')[0]!,
    searchParams.toString() as unknown as ParsedUrlQuery,
  ).result
  return (
    <UnstyledLink
      {...props}
      aria-current={props.href === currentPath ? 'page' : undefined}
      className={composeRenderProps(props.className, (className) =>
        twMerge(
          'group transition',
          'text-neutral-400 hover:text-neutral-500',
          'aria-[current=page]:text-primary-600 aria-[current=page]:hover:text-primary-700',
          className,
        ),
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <div className="flex flex-col gap-1">
          <span className="flex justify-center text-[25px]/[25px] font-normal">{icon}</span>

          <span className="truncate text-center text-[11px]/[13px] font-medium group-aria-[current=page]:font-semibold">
            {children}
          </span>
        </div>
      ))}
    </UnstyledLink>
  )
}
