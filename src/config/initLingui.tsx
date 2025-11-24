import {setI18n} from '@lingui/react/server'
import {Locale} from '../types/global'
import {getI18nInstance} from './i18'

export type PageLangParam = {
  params: Promise<{lang: string}>
}

export function initLingui(lang: string) {
  // Cast to Locale since we know it's one of our supported locales
  const typedLang = lang as Locale
  const i18n = getI18nInstance(typedLang)
  setI18n(i18n)
  return i18n
}
