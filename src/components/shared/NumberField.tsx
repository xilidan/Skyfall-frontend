import {useMemo} from 'react'
import {
  InputContext,
  NumberField as RACNumberField,
  NumberFieldProps as RACNumberFieldProps,
  composeRenderProps,
} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {Description} from './Description'
import {FieldError} from './FieldError'
import {InputGroup} from './InputGroup'

export function NumberField({
  ref,
  label,
  description,
  errorMessage,
  placeholder,
  startContent,
  endContent,
  ...props
}: RACNumberFieldProps & {
  ref?: React.Ref<React.ComponentRef<typeof InputGroup>>
  label?: React.ReactNode
  description?: React.ReactNode
  errorMessage?: React.ReactNode
  placeholder?: string
  startContent?: React.ReactNode
  endContent?: React.ReactNode
}) {
  return (
    <InputContext.Provider value={{placeholder}}>
      <RACNumberField
        {...props}
        // HACK: Freeze `formatOptions` to prevent weird behavior
        formatOptions={useMemo(
          () => ({
            useGrouping: false,
            ...props.formatOptions,
          }),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [],
        )}
        className={composeRenderProps(props.className, (className) => twMerge('flex flex-col gap-2', className))}
      >
        <InputGroup ref={ref} label={label} startContent={startContent} endContent={endContent} />

        <FieldError>{errorMessage}</FieldError>

        {!!description && <Description>{description}</Description>}
      </RACNumberField>
    </InputContext.Provider>
  )
}
