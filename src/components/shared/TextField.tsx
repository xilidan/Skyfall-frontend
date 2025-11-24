import {
  InputContext,
  TextField as RACTextField,
  TextFieldProps as RACTextFieldProps,
  composeRenderProps,
} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {Description} from './Description'
import {FieldError} from './FieldError'
import {InputGroup} from './InputGroup'

export function TextField({
  ref,
  label,
  description,
  errorMessage,
  placeholder,
  startContent,
  endContent,
  ...props
}: RACTextFieldProps & {
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
      <RACTextField
        {...props}
        className={composeRenderProps(props.className, (className) => twMerge('flex flex-col gap-2', className))}
      >
        <InputGroup ref={ref} label={label} startContent={startContent} endContent={endContent} />

        <FieldError>{errorMessage}</FieldError>

        {!!description && <Description>{description}</Description>}
      </RACTextField>
    </InputContext.Provider>
  )
}
