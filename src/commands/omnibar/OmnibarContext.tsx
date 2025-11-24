import React, {createContext, useContext} from 'react'
import {OverlayTriggerStateContext} from 'react-aria-components'
import {commands} from './commands'

export type OmnibarRoute = {
  [K in keyof typeof commands]: (typeof commands)[K] extends React.ComponentType<infer TParams>
    ? keyof TParams extends never
      ? {command: K; props?: never}
      : {command: K; props?: TParams}
    : never
}[keyof typeof commands]

type OmnibarContextValue = {
  stack: OmnibarRoute[]
  navigate: (route: OmnibarRoute) => void
  goBack: () => void
}

const OmnibarContext = createContext<OmnibarContextValue | undefined>(undefined)

export function OmnibarProvider({value, children}: {value: OmnibarContextValue; children: React.ReactNode}) {
  return <OmnibarContext.Provider value={value}>{children}</OmnibarContext.Provider>
}

export function useOmnibarContext() {
  const ctx = useContext(OmnibarContext)
  const dialog = useContext(OverlayTriggerStateContext)
  if (!ctx) {
    throw new Error('useOmnibarContext must be used within a OmnibarProvider')
  }
  return {
    ...ctx,
    close: () => {
      dialog?.close()
    },
  }
}
