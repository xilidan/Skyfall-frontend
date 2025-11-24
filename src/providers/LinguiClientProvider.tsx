'use client'

import {Locale} from '@/types/global'
import {type Messages, setupI18n} from '@lingui/core'
import {I18nProvider} from '@lingui/react'
import {useState} from 'react'

type Props = {
  children: React.ReactNode
  initialLocale: Locale
  initialMessages: Messages
}

export function LinguiClientProvider({children, initialLocale, initialMessages}: Props) {
  const [i18n] = useState(() => {
    return setupI18n({
      locale: initialLocale,
      messages: {[initialLocale]: initialMessages},
    })
  })
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
