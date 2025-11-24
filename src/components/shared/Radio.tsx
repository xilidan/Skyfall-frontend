import {Circle, RadioButton} from '@phosphor-icons/react'
import {composeRenderProps, Radio as RACRadio, RadioGroup as RACRadioGroup} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {tv, VariantProps} from 'tailwind-variants'
import {Description} from './Description'
import {FieldError} from './FieldError'
import {Label} from './Label'
import {focusableStyles, wrapTextChildren} from './utils'

export function RadioGroup({
  label,
  description,
  errorMessage,
  containerClassName,
  ...props
}: React.ComponentPropsWithRef<typeof RACRadioGroup> & {
  label?: React.ReactNode
  description?: React.ReactNode
  errorMessage?: React.ReactNode
  containerClassName?: string
}) {
  return (
    <RACRadioGroup
      {...props}
      className={composeRenderProps(props.className, (className) => twMerge('group flex flex-col gap-2', className))}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {!!label && <Label>{label}</Label>}

          <div
            className={twMerge(
              'flex gap-2',
              'group-orientation-horizontal:flex-row',
              'group-orientation-vertical:flex-col',
              containerClassName,
            )}
          >
            {children}
          </div>

          <FieldError>{errorMessage}</FieldError>

          {!!description && <Description>{description}</Description>}
        </>
      ))}
    </RACRadioGroup>
  )
}

export const radioStyles = tv({
  extend: focusableStyles,
  base: [
    'relative flex select-none items-center gap-[1ch] whitespace-nowrap rounded-md border-1 border-transparent bg-clip-border font-medium transition [&>:is(svg,[role=img])]:text-[1.25em]',
    'border-neutral-500/10 bg-white text-neutral-800 hover:bg-neutral-500/20 pressed:bg-neutral-500/30',
    'selected:border-primary-600 selected:bg-primary-600/10 selected:hover:bg-primary-600/20 selected:pressed:bg-primary-600/30 [&>:is(svg,[role=img])]:selected:text-primary-600',
    'invalid:border-red-700 invalid:pressed:border-red-800',
    'disabled:cursor-not-allowed disabled:text-neutral-800/40',
  ],
  variants: {
    size: {
      md: 'h-12 px-4 py-3 text-sm',
      sm: 'h-10 px-3 py-2 text-sm',
      xs: 'h-8 px-3 py-1 text-xs',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export function Radio({
  size,
  hasIndicator,
  ...props
}: React.ComponentPropsWithRef<typeof RACRadio> &
  VariantProps<typeof radioStyles> & {
    hasIndicator?: boolean
  }) {
  return (
    <RACRadio
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        radioStyles({
          ...renderProps,
          size,
          className,
        }),
      )}
    >
      {composeRenderProps(props.children, (children, renderProps) => (
        <>
          {hasIndicator && (renderProps.isSelected ? <RadioButton weight="fill" /> : <Circle />)}

          {wrapTextChildren(children)}
        </>
      ))}
    </RACRadio>
  )
}
