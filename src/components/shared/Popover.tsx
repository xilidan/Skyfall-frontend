import {
  OverlayArrow as RACOverlayArrow,
  Popover as RACPopover,
  PopoverContext as RACPopoverContext,
  composeRenderProps,
  useSlottedContext,
} from 'react-aria-components'
import {tv} from 'tailwind-variants'

const popoverStyles = tv({
  base: 'rounded-md border border-neutral-500/10 bg-white bg-clip-padding text-neutral-700 shadow-lg',
  variants: {
    isEntering: {
      true: 'duration-150 ease-out animate-in fade-in placement-left:slide-in-from-right-1 placement-right:slide-in-from-left-1 placement-top:slide-in-from-bottom-1 placement-bottom:slide-in-from-top-1',
    },
    isExiting: {
      true: 'duration-100 ease-in animate-out fade-out placement-left:slide-out-to-right-1 placement-right:slide-out-to-left-1 placement-top:slide-out-to-bottom-1 placement-bottom:slide-out-to-top-1',
    },
  },
})

export function Popover({
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
                className="block fill-white stroke-black/10 stroke-1 group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180"
              >
                <path d="M0 0 L6 6 L12 0" />
              </svg>
            </RACOverlayArrow>
          )}

          {children}
        </>
      ))}
    </RACPopover>
  )
}
