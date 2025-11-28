'use client'
import {usePrevious} from '@/lib/hooks'
import {useCallback, useContext, useEffect, useState} from 'react'
import {OverlayTriggerStateContext} from 'react-aria-components'
import {Dialog} from '../../components/shared/Dialog'
import {Modal} from '../../components/shared/Modal'
import {OmnibarProvider, OmnibarRoute} from './OmnibarContext'
import {commands} from './commands'
import {IndexCommandScope} from './indexCommand'

let omnibarScope: IndexCommandScope = {type: 'global'}
export function resetOmnibarScope(scope: IndexCommandScope = {type: 'global'}) {
  omnibarScope = scope
}

const openOmnibarListeners = new Set<(route?: OmnibarRoute) => void>()
export function openOmnibar(route?: OmnibarRoute) {
  for (const listener of openOmnibarListeners) {
    listener(route)
  }
}

export function Omnibar() {
  const dialog = useContext(OverlayTriggerStateContext)

  const [stack, setStack] = useState<OmnibarRoute[]>([{command: 'index', props: {scope: {type: 'global'}}}])

  const route = stack[stack.length - 1]
  const CommandComponent = commands[route.command] as React.ComponentType<Record<string, unknown>>
  const navigate = useCallback((route: OmnibarRoute) => {
    setStack((s) => [...s, route])
  }, [])
  const goBack = useCallback(() => {
    setStack((s) => {
      if (s.length > 1) {
        return s.slice(0, -1)
      }
      return s
    })
  }, [])

  useEffect(() => {
    function openOmnibar(route?: OmnibarRoute) {
      if (route) {
        navigate(route)
      }
      dialog?.open()
    }
    openOmnibarListeners.add(openOmnibar)
    return () => {
      openOmnibarListeners.delete(openOmnibar)
    }
  }, [dialog, navigate])

  const prevIsOpen = usePrevious(dialog?.isOpen)
  useEffect(() => {
    if (prevIsOpen && !dialog?.isOpen) {
      setTimeout(() => {
        setStack([{command: 'index', props: {scope: omnibarScope}}])
      }, 200)
    }
  }, [dialog?.isOpen, prevIsOpen, navigate])

  const modalSize = route.command === 'addOrganization' ? 'xl' : 'lg'

  return (
    <OmnibarProvider value={{stack, navigate, goBack}}>
      <Modal isDismissable size={modalSize}>
        <Dialog>
          <CommandComponent {...(route.props ?? {})} />
        </Dialog>
      </Modal>
    </OmnibarProvider>
  )
}
