import {
  OverlayArrow as RACOverlayArrow,
  Popover as RACPopover,
  PopoverContext as RACPopoverContext,
  composeRenderProps,
  useSlottedContext,
} from 'react-aria-components'
import {tv} from 'tailwind-variants'

const popoverStyles = tv({
  base: 'rounded-lg border border-neutral-500/10 bg-white bg-clip-padding text-neutral-700 shadow-xl ring-1 ring-black/5 backdrop-blur-sm transform-gpu will-change-transform',
  variants: {
    isEntering: {
      true: 'duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] animate-in fade-in zoom-in-95 placement-left:slide-in-from-right-2 placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 placement-bottom:slide-in-from-top-2',
    },
    isExiting: {
      true: 'duration-200 ease-in animate-out fade-out zoom-out-95 placement-left:slide-out-to-right-2 placement-right:slide-out-to-left-2 placement-top:slide-out-to-bottom-2 placement-bottom:slide-out-to-top-2',
    },
  },
})

export function PopoverEnhanced({
  showArrow,
  ...props
}: React.ComponentPropsWithRef<typeof RACPopover> & {
  showArrow?: boolean
}) {
  const ctx = useSlottedContext(RACPopoverContext)
  const isSubmenu = ctx?.trigger === 'SubmenuTrigger'
  let offset = showArrow ? 12 : 8
  offset = isSubmenu ? offset - 6 : offset

  return (
    <RACPopover
      {...props}
      offset={props.offset ?? offset}
      className={composeRenderProps(props.className, (className, renderProps) =>
        popoverStyles({...renderProps, className}),
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {showArrow && (
            <RACOverlayArrow className="group">
              <svg
                width={12}
                height={12}
                viewBox="0 0 12 12"
                className="block fill-white stroke-black/10 stroke-1 group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180 drop-shadow-sm"
              >
                <path d="M0 0 L6 6 L12 0" />
              </svg>
            </RACOverlayArrow>
          )}

          <div className="relative">
            {children}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          </div>
        </>
      ))}
    </RACPopover>
  )
}

