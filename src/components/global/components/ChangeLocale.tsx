import {Button} from '@/components/shadcn/button'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/shadcn/popover'
import {languages} from '@/config/global'
import {Locale} from '@/types/global'
import {useLingui} from '@lingui/react/macro'
import {CheckIcon, GlobeIcon} from '@phosphor-icons/react'
import {usePathname, useRouter} from 'next/navigation'
import {useState} from 'react'

export function ChangeLocale() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [_locale, setLocale] = useState<Locale>(pathname?.split('/')[1] as Locale)
  const {i18n} = useLingui()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-0 hover:bg-blue-50 p-1 w-fit">
          <GlobeIcon className="size-5 text-blue-700" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={10} className="w-56 p-0">
        <div className="p-2">
          {Object.keys(languages).map((locale) => {
            return (
              <button
                key={locale}
                className="w-full px-4 py-2.5 text-left hover:bg-neutral-100 transition-colors flex items-center gap-3 justify-between rounded-md"
                onClick={() => {
                  i18n.activate(locale)
                  setOpen(false)
                  const pathNameWithoutLocale = pathname?.split('/')?.slice(2) ?? []
                  const newPath = `/${locale}/${pathNameWithoutLocale.join('/')}`
                  setLocale(locale as Locale)

                  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`

                  router.replace(newPath, {scroll: false})
                }}
              >
                <span className="text-sm text-neutral-700">{i18n._(languages[locale as keyof typeof languages])}</span>
                {locale === i18n.locale && <CheckIcon className="size-4" />}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
