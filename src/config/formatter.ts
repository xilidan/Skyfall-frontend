import {Divisibility, PledgeStatus, PropertyPurpose} from '@/types/global'
import {I18n} from '@lingui/core'
import {msg} from '@lingui/core/macro'
import parsePhoneNumberFromString from 'libphonenumber-js'
import {propertyConfig} from './property'

export function getFormatter(i18n: I18n, _locale = i18n.locale) {
  const locale =
    {
      en: 'en-US',
      ru: 'ru-KZ',
      kk: 'kk-KZ',
      zh: 'zh-Hans-CN',
    }[_locale] ?? _locale
  const dateShortFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
  })
  const dateLongFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  })
  const datetimeShortFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'long',
  })
  const dateMonthYearFormat = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  })
  const datetimeRelativeFormat = new Intl.RelativeTimeFormat(locale, {
    style: 'long',
    numeric: 'auto',
  })
  const dateTimeDurationFormat = new Intl.RelativeTimeFormat(locale, {
    style: 'long',
    numeric: 'always',
  })
  const floatFormat = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const percentFormat = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const kztFormat = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'KZT',
    currencyDisplay: 'code',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const usdFormat = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const eurFormat = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'code',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const cnyFormat = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CNY',
    currencyDisplay: 'code',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const kgFormat = new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'kilogram',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const cmFormat = new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'centimeter',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  return {
    dateShort: (date: Date) => dateShortFormat.format(date),
    dateLong: (date: Date) => dateLongFormat.format(date),
    datetimeShort: (date: Date) => datetimeShortFormat.format(date),
    dateMonthYear: (date: Date) => dateMonthYearFormat.format(date),
    datetimeRelative: (date: Date) => {
      const diffMs = date.getTime() - Date.now()
      if (diffMs < -365 * 24 * 60 * 60 * 1000) {
        return datetimeRelativeFormat.format(Math.round(diffMs / 1000 / 60 / 60 / 24 / 365), 'year')
      }
      if (diffMs < -30 * 24 * 60 * 60 * 1000) {
        return datetimeRelativeFormat.format(Math.round(diffMs / 1000 / 60 / 60 / 24 / 30), 'month')
      }
      if (diffMs < -24 * 60 * 60 * 1000) {
        return datetimeRelativeFormat.format(Math.round(diffMs / 1000 / 60 / 60 / 24), 'day')
      }
      if (diffMs < -60 * 60 * 1000) {
        return datetimeRelativeFormat.format(Math.round(diffMs / 1000 / 60 / 60), 'hour')
      }
      if (diffMs < -60 * 1000) {
        return datetimeRelativeFormat.format(Math.round(diffMs / 1000 / 60), 'minute')
      }
      return i18n.t(msg({message: 'Just now'}))
    },
    dateTimeDuration: (ms: number) => {
      const totalHours = Math.floor(ms / (1000 * 60 * 60))
      const days = Math.floor(totalHours / 24)
      const hours = totalHours % 24

      const ret: string[] = []
      if (days > 0) {
        ret.push(
          dateTimeDurationFormat
            .formatToParts(days, 'day')
            .slice(1)
            .map((part) => part.value)
            .join(''),
        )
      }

      if (hours > 0) {
        ret.push(
          dateTimeDurationFormat
            .formatToParts(hours, 'hour')
            .slice(1)
            .map((part) => part.value)
            .join(''),
        )
      }

      return ret.join(', ')
    },
    float: (value: number) => floatFormat.format(value),
    percent: (value: number) => percentFormat.format(value),
    currency: (amount: number, currencyCode: string) => {
      switch (currencyCode) {
        case 'KZT':
          return kztFormat.format(amount)
        case 'USD':
          return usdFormat.format(amount)
        case 'EUR':
          return eurFormat.format(amount)
        case 'CNY':
          return cnyFormat.format(amount)
        default:
          return `${floatFormat.format(amount)} ${currencyCode}`
      }
    },
    phone: (value: string) => {
      const parsed = parsePhoneNumberFromString(value, 'KZ')
      return parsed && parsed.isValid() ? parsed.format('INTERNATIONAL') : value
    },
    region: (value: string) => {
      const descriptor = (
        propertyConfig.regionMap as Record<
          string,
          (typeof propertyConfig.regionMap)[keyof typeof propertyConfig.regionMap] | undefined
        >
      )[value]
      return descriptor ? i18n.t(descriptor) : value
    },
    area: (value: number | undefined) => {
      if (!value) return undefined
      return `${floatFormat.format(value)} m²`
    },

    PropertyPurpose: (status: PropertyPurpose) =>
      i18n.t(
        {
          commercial: msg({
            context: 'PropertyPurpose',
            message: 'Commercial',
          }),
          dacha: msg({
            context: 'PropertyPurpose',
            message: 'Dacha',
          }),
          farm: msg({
            context: 'PropertyPurpose',
            message: 'Farm',
          }),
          horticulture: msg({
            context: 'PropertyPurpose',
            message: 'Horticulture',
          }),
          individual_housing: msg({
            context: 'PropertyPurpose',
            message: 'Individual Housing',
          }),
          low_rise_residential: msg({
            context: 'PropertyPurpose',
            message: 'Low Rise Residential',
          }),
          other: msg({
            context: 'PropertyPurpose',
            message: 'Other',
          }),
          subsidiary_farming: msg({
            context: 'PropertyPurpose',
            message: 'Subsidiary Farming',
          }),
        }[status] ?? status,
      ),

    PledgeStatus: (pledgeStatus: PledgeStatus) =>
      i18n.t(
        {
          in_pledge: msg({
            context: 'PledgeStatus',
            message: 'In Pledge',
          }),
          not_in_pledge: msg({
            context: 'PledgeStatus',
            message: 'Not in Pledge',
          }),
          not_specified: msg({
            context: 'PledgeStatus',
            message: 'Not Specified',
          }),
        }[pledgeStatus],
      ),

    Divisibility: (divisibility: Divisibility) =>
      i18n.t(
        {
          divisible: msg({
            context: 'Divisibility',
            message: 'Divisible',
          }),
          indivisible: msg({
            context: 'Divisibility',
            message: 'Indivisible',
          }),
          not_specified: msg({
            context: 'Divisibility',
            message: 'Not Specified',
          }),
        }[divisibility],
      ),
  }
}
