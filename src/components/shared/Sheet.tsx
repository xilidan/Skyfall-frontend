import {X} from '@phosphor-icons/react'
import {ClearPressResponder} from '@react-aria/interactions'
import {useContext} from 'react'
import {FocusScope} from 'react-aria'
import {OverlayTriggerStateContext} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {Drawer} from 'vaul'
import {Button} from './Button'
import {wrapTextChildren} from './utils'

export function Sheet({
  size = 'auto',
  position = 'bottom',
  ...props
}: React.ComponentPropsWithRef<typeof Drawer.Root> & {
  size?: 'auto' | 'full'
  position?: 'bottom' | 'right'
}) {
  const overlay = useContext(OverlayTriggerStateContext)
  return (
    <Drawer.Root
      open={overlay?.isOpen}
      onOpenChange={(v) => overlay?.setOpen(v)}
      direction={position === 'right' ? 'right' : 'bottom'}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 isolate z-[100] bg-black/40" />
        <Drawer.Title className="text-[17px]/[22px] font-semibold text-black">31231</Drawer.Title>
        <Drawer.Content
          // HACK: Silence accessibility warnings
          aria-describedby={undefined}
          className={twMerge(
            'fixed z-[100] flex flex-col bg-white bg-clip-padding text-neutral-700 shadow-2xl outline-none',
            position === 'bottom' && 'inset-x-0 bottom-0 rounded-t-md',
            position === 'right' && 'inset-y-0 right-0 rounded-l-md',
            position === 'bottom' && size === 'full' && 'h-[calc(100%-max(20px,env(safe-area-inset-top,0)))]',
            position === 'bottom' && size === 'auto' && 'max-h-[calc(100%-max(20px,env(safe-area-inset-top,0)))]',
            position === 'right' && size === 'full' && 'w-[calc(100%-max(20px,env(safe-area-inset-left,0)))]',
            position === 'right' && size === 'auto' && 'w-[min(90vw,480px)]',
          )}
        >
          {position === 'bottom' ? <Drawer.Handle data-testid="handle" className="my-2" /> : null}
          <ClearPressResponder>
            <FocusScope restoreFocus autoFocus contain>
              <div className="flex flex-1 flex-col overflow-y-auto">{props.children}</div>
            </FocusScope>
          </ClearPressResponder>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export function SheetHeader({
  title,
  startContent,
  endContent,
  children,
}: {
  title: React.ReactNode
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  children?: React.ReactNode
}) {
  const overlay = useContext(OverlayTriggerStateContext)
  return (
    <div className="sticky top-0 z-10 flex flex-col justify-end border-b border-b-neutral-500/10 bg-white bg-clip-padding">
      <div className="flex h-[56px] items-center gap-4 px-2">
        <div className="flex min-w-fit flex-1 items-center gap-[1ch] overflow-hidden text-[17px]/[22px]">
          {wrapTextChildren(startContent)}
        </div>

        <Drawer.Title className="truncate text-center text-[17px]/[22px] font-semibold">{title}</Drawer.Title>

        <div className="flex min-w-fit flex-1 items-center justify-end gap-[1ch] overflow-hidden text-[17px]/[22px]">
          {wrapTextChildren(endContent)}

          <Button onPress={() => overlay?.close()} size="xs" variant="secondary" isIconOnly>
            <X />
          </Button>
        </div>
      </div>

      {children}
    </div>
  )
}
