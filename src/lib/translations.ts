import {I18n} from '@lingui/core'
import {msg} from '@lingui/core/macro'

/**
 * Simple translation function that can be imported and used across components
 * @param i18n - The i18n instance
 * @param text - The text to translate (using msg template literal)
 * @returns The translated text
 */
export function t(i18n: I18n, text: string) {
  return i18n._(msg`${text}`)
}

/**
 * Alternative translation function that takes the i18n instance and returns a function
 * that can be used multiple times with the same instance
 * @param i18n - The i18n instance
 * @returns A function that translates text
 */
export function createTranslator(i18n: I18n) {
  return (text: string) => i18n._(msg`${text}`)
}
