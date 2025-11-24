'use client'

import {useLingui} from '@lingui/react/macro'
import {useMemo} from 'react'
import {getFormatter} from './formatter'

export function useFormatter() {
  const {i18n} = useLingui()
  return useMemo(() => getFormatter(i18n), [i18n.locale])
}
