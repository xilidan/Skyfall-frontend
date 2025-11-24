import {VariantProps, tv} from 'tailwind-variants'
import {wrapTextChildren} from './utils'

const badgeStyles = tv({
  base: 'inline-flex w-fit max-w-full select-none items-center gap-[1ch] whitespace-nowrap rounded-full font-semibold [&>:is(svg,[role=img])]:text-[1.25em]',
  variants: {
    size: {
      md: 'h-10 px-4 py-2 text-sm',
      sm: 'h-8 px-3 py-1 text-xs',
      xs: 'h-6 px-2 py-1 text-xs',
    },
    variant: {
      neutral: 'bg-neutral-500/20 text-neutral-700',
      info: 'bg-primary-500/20 text-primary-700',
      success: 'bg-green-500/20 text-green-700',
      warning: 'bg-amber-500/20 text-amber-700',
      error: 'bg-red-500/20 text-red-700',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'neutral',
  },
})

export function Badge({
  size,
  variant,
  ...props
}: React.ComponentPropsWithRef<'div'> & VariantProps<typeof badgeStyles>) {
  return (
    <div {...props} className={badgeStyles({variant, size, className: props.className})}>
      {wrapTextChildren(props.children)}
    </div>
  )
}
