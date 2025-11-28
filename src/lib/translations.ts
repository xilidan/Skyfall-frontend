import {I18n} from '@lingui/core'
import {msg} from '@lingui/core/macro'

export function t(i18n: I18n, text: string) {
  return i18n._(msg`${text}`)
}

export function createTranslator(i18n: I18n) {
  return (text: string) => i18n._(msg`${text}`)
}
