'use client'
import {mergeProps, useFocusRing} from 'react-aria'
import {VariantProps, tv} from 'tailwind-variants'
import {focusableStyles} from './utils'

const inlineAlertStyles = tv({
  extend: focusableStyles,
  base: 'rounded-md [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&>p]:my-2',
  variants: {
    size: {
      md: 'px-4 py-3 text-sm',
      sm: 'px-3 py-2 text-xs',
      xs: 'px-2 py-1 text-xs',
    },
    variant: {
      neutral: 'bg-neutral-600/10 text-neutral-700',
      info: 'bg-primary-600/10 text-primary-700',
      success: 'bg-green-600/10 text-green-700',
      warning: 'bg-amber-600/10 text-amber-700',
      error: 'bg-red-600/10 text-red-700',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'neutral',
  },
})

export function InlineAlert({
  size,
  variant,
  ...props
}: React.ComponentPropsWithRef<'div'> & VariantProps<typeof inlineAlertStyles>) {
  const {isFocusVisible, focusProps} = useFocusRing({within: true})
  return (
    <div
      {...mergeProps(props, focusProps)}
      role="alert"
      tabIndex={-1}
      className={inlineAlertStyles({
        size,
        variant,
        isFocusVisible,
        className: props.className,
      })}
    />
  )
}
