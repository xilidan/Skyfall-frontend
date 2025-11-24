import {forwardRef} from 'react'
import {composeRenderProps, Button as RACButton} from 'react-aria-components'
import {tv, VariantProps} from 'tailwind-variants'
import {focusableStyles, wrapTextChildren} from './utils'

export const buttonStyles = tv({
  extend: focusableStyles,
  base: 'flex cursor-pointer select-none items-center justify-center gap-[1ch] whitespace-nowrap rounded-md border border-transparent bg-clip-border font-medium transition [&>svg]:text-[1.25em]',
  variants: {
    variant: {
      default:
        'bg-primary-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:bg-primary-700 pressed:bg-primary-800 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg',
      secondary:
        'border-neutral-400/40 bg-white text-neutral-800 shadow-sm hover:bg-neutral-100 pressed:bg-neutral-200',
      tertiary: 'bg-transparent text-neutral-800 hover:bg-neutral-400/20 pressed:bg-neutral-400/40',
      negative:
        'bg-red-700 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:bg-red-800 pressed:bg-red-900',
    },
    size: {
      md: 'h-10 px-3 py-2 text-sm',
      sm: 'h-8 px-2 py-1 text-xs',
      xs: 'h-6 px-2 py-1 text-xs',
    },
    isIconOnly: {
      true: 'shrink-0 rounded-full',
    },
    isPending: {
      true: 'animate-pulse cursor-wait',
    },
    isDisabled: {
      true: 'border-neutral-400/20 bg-neutral-400/5 text-neutral-300 shadow-none',
    },
  },
  compoundVariants: [
    {
      size: 'md',
      isIconOnly: true,
      className: 'size-10 p-2',
    },
    {
      size: 'sm',
      isIconOnly: true,
      className: 'size-8 p-1 shadow-none',
    },
    {
      size: 'xs',
      isIconOnly: true,
      className: 'size-6 p-1 shadow-none',
    },
    {
      variant: 'negative',
      isDisabled: true,
      className: 'text-red-300',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
    isIconOnly: false,
  },
})

export const Button = forwardRef<
  React.ComponentRef<typeof RACButton>,
  React.ComponentPropsWithoutRef<typeof RACButton> & VariantProps<typeof buttonStyles>
>(function Button({variant, size, isIconOnly, isPending, ...props}, ref) {
  return (
    <RACButton
      {...props}
      ref={ref}
      isDisabled={props.isDisabled || isPending}
      className={composeRenderProps(props.className, (className, renderProps) =>
        buttonStyles({
          ...renderProps,
          variant,
          size,
          isIconOnly,
          isPending,
          className,
        }),
      )}
    >
      {composeRenderProps(props.children, (children) => wrapTextChildren(children))}
    </RACButton>
  )
})
