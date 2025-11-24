import {forwardRef} from 'react'
import {
  FieldError as RACFieldError,
  Group as RACGroup,
  Input as RACInput,
  Label as RACLabel,
  Text as RACText,
  TextArea as RACTextArea,
  composeRenderProps,
} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {tv} from 'tailwind-variants'
import {focusableStyles} from './utils'

export function Label(props: React.ComponentPropsWithoutRef<typeof RACLabel>) {
  return (
    <RACLabel {...props} className={twMerge('cursor-default text-sm font-semibold text-gray-700 mb-1.5', props.className)} />
  )
}

export function Description(props: React.ComponentPropsWithoutRef<typeof RACText>) {
  return (
    <RACText {...props} slot="description" className={twMerge('text-xs text-gray-500 mt-1', props.className)} />
  )
}

export function FieldError(props: React.ComponentPropsWithoutRef<typeof RACFieldError>) {
  return (
    <RACFieldError
      {...props}
      className={composeRenderProps(props.className, (className) => twMerge('text-sm font-medium text-red-600 mt-1', className))}
    />
  )
}

export const fieldBorderStyles = tv({
  variants: {
    isFocusWithin: {
      false: 'border-gray-200',
      true: 'border-primary-500 ring-2 ring-primary-100',
    },
    isInvalid: {
      true: 'border-red-500 focus-within:ring-red-100',
    },
    isDisabled: {
      true: 'border-gray-200 bg-gray-50',
    },
  },
})

export const fieldGroupStyles = tv({
  extend: focusableStyles,
  base: 'group flex overflow-hidden rounded-lg border-2 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-sm',
  variants: fieldBorderStyles.variants,
})

export function FieldGroup(props: React.ComponentPropsWithoutRef<typeof RACGroup>) {
  return (
    <RACGroup
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({...renderProps, className}),
      )}
    />
  )
}

export const Input = forwardRef<React.ComponentRef<typeof RACInput>, React.ComponentPropsWithoutRef<typeof RACInput>>(
  function Input(props, ref) {
    return (
      <RACInput
        {...props}
        ref={ref}
        className={composeRenderProps(props.className, (className) =>
          twMerge(
            'min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-gray-900 [outline:none]',
            'placeholder:text-gray-400 placeholder:font-normal',
            'disabled:text-gray-400 disabled:cursor-not-allowed [fieldset:disabled_&]:text-gray-400',
            className,
          ),
        )}
      />
    )
  },
)

export const TextArea = forwardRef<
  React.ComponentRef<typeof RACTextArea>,
  React.ComponentPropsWithoutRef<typeof RACTextArea>
>(function TextArea(props, ref) {
  return (
    <RACTextArea
      {...props}
      ref={ref}
      className={composeRenderProps(props.className, (className) =>
        twMerge(
          'min-h-20 min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-gray-900 [field-sizing:content] [outline:none]',
          'placeholder:text-gray-400 placeholder:font-normal',
          'disabled:text-gray-400 disabled:cursor-not-allowed [fieldset:disabled_&]:text-gray-400',
          className,
        ),
      )}
    />
  )
})
