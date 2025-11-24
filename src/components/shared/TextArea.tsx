import {forwardRef} from 'react'
import {
  Group as RACGroup,
  TextArea as RACTextArea,
  TextField as RACTextField,
  TextAreaProps,
  composeRenderProps,
} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {tv} from 'tailwind-variants'
import {Description} from './Description'
import {Label} from './Label'
import {focusableStyles} from './utils'

export function TextAreaField({
  ref,
  label,
  description,
  isInvalid,
  errorMessage,
  placeholder,
  startContent,
  endContent,
  ...props
}: TextAreaProps & {
  ref?: React.Ref<React.ComponentRef<typeof RACTextArea>>
  label?: React.ReactNode
  description?: React.ReactNode
  isInvalid?: boolean
  errorMessage?: React.ReactNode
  placeholder?: string
  startContent?: React.ReactNode
  endContent?: React.ReactNode
}) {
  return (
    <RACTextField
      {...props}
      aria-label={props['aria-label'] || placeholder || 'Input'}
      placeholder={placeholder}
      //@ts-ignore
      className={composeRenderProps(props.className, (className) => twMerge('flex flex-col gap-2', className))}
    >
      {!!label && <Label>{label}</Label>}

      <FieldGroup isInvalid={isInvalid} className={twMerge('flex')}>
        {!!startContent && <div className="ml-2 text-sm text-gray-600">{startContent}</div>}
        <TextArea ref={ref as any} placeholder={placeholder} onInvalid={() => {}} />
        {!!endContent && <div className="mr-2 text-sm text-gray-600">{endContent}</div>}
      </FieldGroup>

      {errorMessage && <span className="text-sm font-medium text-red-600 mt-1">{errorMessage}</span>}

      {description && <Description>{description}</Description>}
    </RACTextField>
  )
}

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
          'min-h-20 min-w-0 flex-1 px-3 py-2.5 text-sm font-medium text-slate-200 field-sizing-content [outline:none] border-transparent',
          'placeholder:text-slate-500 placeholder:font-normal',
          'disabled:text-slate-500 disabled:cursor-not-allowed [fieldset:disabled_&]:text-slate-500',
          className,
        ),
      )}
    />
  )
})

export const fieldBorderStyles = tv({
  variants: {
    isFocusWithin: {
      false: 'border-slate-700/50',
      true: 'border-slate-600',
    },
    isInvalid: {
      true: '',
      false: '',
    },
    isDisabled: {
      true: 'border-slate-800/50',
    },
  },
})

export const fieldGroupStyles = tv({
  extend: focusableStyles,
  base: 'group flex overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800/50 hover:shadow-md focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:shadow-lg focus-within:bg-slate-900/80',
  variants: {
    ...fieldBorderStyles.variants,
    isInvalid: {
      true: 'border-red-500/50 focus-within:ring-red-500/20',
      false: '',
    },
    isDisabled: {
      true: 'bg-slate-900/20 border-slate-800/50 cursor-not-allowed opacity-50',
    },
  },
})

export function FieldGroup(props: React.ComponentPropsWithoutRef<typeof RACGroup> & {isInvalid?: boolean}) {
  return (
    <RACGroup
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({...renderProps, className, isInvalid: props.isInvalid}),
      )}
    />
  )
}
