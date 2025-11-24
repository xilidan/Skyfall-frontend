'use client'
import {useApiQuery} from '@/server/api'
import {Trans} from '@lingui/react/macro'
import {Loader2Icon} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {Activity, useEffect, useState} from 'react'
import {Button} from '../shadcn/button'
import {Badge} from '../shared/Badge'
import {LocaleSelect} from '../shared/LocaleSelect'
import {ChangeLocale} from './components/ChangeLocale'
import {UserProfilePopover} from './components/UserProfilePopover'

export function Header({device}: {device: {type?: string | undefined}}) {
  const router = useRouter()
  const meR = useApiQuery(['getMe'])
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-30 w-full backdrop-blur-xl supports-backdrop-filter:bg-white/60 p-2 transition-all duration-300 ${
        isScrolled ? 'border-b border-gray-200/50' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative flex items-center">
          <Link href="/" className="group flex items-center no-underline select-none">
            <div className="relative shrink-0">
              <Image
                src="/static/buy-logo.png"
                alt="Dala Market Logo"
                width={64}
                height={64}
                className="rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-semibold text-blue-700 tracking-tight">Dala.kz</span>
              <span className="text-xs text-gray-500 font-normal">
                <Trans>Tourism Land Marketplace</Trans>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/"
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              <Trans>Home</Trans>
            </Link>

            <Link
              href="/property"
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              <Trans>Explore</Trans>
            </Link>

            <Link
              href={meR.data ? '/seller/create-property' : '/auth/login'}
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              <Trans>List your land</Trans>
            </Link>

            <Link
              href="#"
              aria-disabled
              className="text-sm font-medium text-gray-500 cursor-not-allowed hover:text-gray-600 transition-colors duration-200 flex items-center gap-2"
            >
              <Trans>Rent</Trans>
              <Badge variant="info" size="sm" className="text-xs text-gray-500">
                <Trans>Coming soon</Trans>
              </Badge>
            </Link>
          </nav>

          <div className="flex items-center gap-1 ml-auto">
            <Activity mode={device?.type === 'mobile' ? 'visible' : 'hidden'}>
              <LocaleSelect className="size-9 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300" />
            </Activity>

            <Activity mode={device?.type === 'mobile' ? 'hidden' : 'visible'}>
              <ChangeLocale />
            </Activity>

            {(() => {
              if (meR.isLoading) {
                return <Loader2Icon className="size-4 animate-spin" />
              }

              if (meR.data) {
                return <UserProfilePopover userInfo={meR.data} />
              }

              return (
                <Button
                  onClick={() => {
                    router.push('/auth/login')
                  }}
                >
                  <Trans>Sign in</Trans>
                </Button>
              )
            })()}
          </div>
        </div>
      </div>
    </header>
  )
}
