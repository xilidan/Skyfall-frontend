'use client'
import {languages} from '@/config/global'
import {Locale} from '@/types/global'
import {useLingui} from '@lingui/react/macro'
import {usePathname, useRouter} from 'next/navigation'
import React, {useState} from 'react'
import {Select, SelectItem} from './SelectWithSheet'

export function LocaleSelect(props: React.ComponentPropsWithRef<typeof Select>) {
  const {t, i18n} = useLingui()

  const router = useRouter()
  const pathname = usePathname()

  const [locale, setLocale] = useState<Locale>(pathname?.split('/')[1] as Locale)

  return (
    <Select
      {...props}
      selectedKey={locale}
      onSelectionChange={(key) => {
        const pathNameWithoutLocale = pathname?.split('/')?.slice(2) ?? []
        const newPath = `/${key}/${pathNameWithoutLocale.join('/')}`
        i18n.activate(key as string)
        setLocale(key as Locale)
        
        // Set cookie to persist locale preference
        document.cookie = `NEXT_LOCALE=${key}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
        
        router.replace(newPath, {scroll: false})
      }}
      size="sm"
      aria-label={t`Language`}
    >
      {Object.keys(languages).map((locale) => {
        return (
          <SelectItem key={locale} id={locale}>
            {i18n._(languages[locale as keyof typeof languages])}
          </SelectItem>
        )
      })}
    </Select>
  )
}
