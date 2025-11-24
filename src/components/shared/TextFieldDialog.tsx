import {CaretDown} from '@phosphor-icons/react'
import React, {useContext} from 'react'
import {
  DialogTrigger,
  FieldErrorContext,
  InputContext,
  TextField as RACTextField,
  TextFieldProps as RACTextFieldProps,
  composeRenderProps,
  useSlottedContext,
} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {Button} from './Button'
import {Description} from './Description'
import {FieldError} from './FieldError'
import {FloatingLabel} from './FloatingLabel'
import {wrapTextChildren} from './utils'

export function TextFieldDialog({
  ref,
  size,
  autoFocus,
  label,
  description,
  errorMessage,
  placeholder,
  ...props
}: RACTextFieldProps &
  Pick<React.ComponentPropsWithRef<typeof TextFieldDialogButton>, 'ref' | 'size' | 'autoFocus' | 'label'> & {
    description?: React.ReactNode
    errorMessage?: React.ReactNode
    placeholder?: string
  }) {
  return (
    <InputContext.Provider value={{placeholder}}>
      <RACTextField
        {...props}
        className={composeRenderProps(props.className, (className) => twMerge('group flex flex-col gap-2', className))}
      >
        {composeRenderProps(props.children, (children) => (
          <>
            <DialogTrigger>
              <TextFieldDialogButton ref={ref} size={size} autoFocus={autoFocus} label={label} />

              {children}
            </DialogTrigger>

            <FieldError>{errorMessage}</FieldError>

            {!!description && <Description>{description}</Description>}
          </>
        ))}
      </RACTextField>
    </InputContext.Provider>
  )
}

function TextFieldDialogButton({
  label,
  ...props
}: React.ComponentPropsWithRef<typeof Button> & {
  label?: React.ReactNode
}) {
  const ctx = useSlottedContext(InputContext)
  const validation = useContext(FieldErrorContext)
  return (
    <Button
      {...props}
      data-haslabel={!!label || undefined}
      data-hasvalue={!!ctx?.value || !!ctx?.placeholder || undefined}
      data-invalid={validation?.isInvalid || undefined}
      isDisabled={ctx?.disabled}
      variant="tertiary"
      className={composeRenderProps(props.className, (className) =>
        twMerge(
          'group relative justify-start rounded-md bg-neutral-500/10 text-start text-neutral-800',
          'disabled:text-neutral-800/40',
          'invalid:border-red-700',
          className,
        ),
      )}
    >
      {!!label && <FloatingLabel>{label}</FloatingLabel>}

      <span
        data-placeholder={!ctx?.value || undefined}
        className={twMerge(
          'flex min-w-0 flex-1 items-center gap-[1ch] [&>:is(svg,[role=img])]:text-[1.25em]',
          'placeholder-shown:text-neutral-400',
          'group-data-[haslabel]:translate-y-2',
        )}
      >
        {wrapTextChildren(ctx?.value || ctx?.placeholder || '')}
      </span>

      <CaretDown />
    </Button>
  )
}
