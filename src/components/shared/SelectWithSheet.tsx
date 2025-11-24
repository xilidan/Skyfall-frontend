import {CaretDownIcon} from '@phosphor-icons/react'
import {useIsHidden} from '@react-aria/collections'
import React, {useContext} from 'react'
import {
  FieldErrorContext,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  ListBoxProps as RACListBoxProps,
  Select as RACSelect,
  SelectProps as RACSelectProps,
  SelectValue as RACSelectValue,
  SelectContext,
  SelectStateContext,
  SelectValueRenderProps,
  composeRenderProps,
  useSlottedContext,
} from 'react-aria-components'
import {isTruthy} from 'remeda'
import {twMerge} from 'tailwind-merge'
import {VariantProps, tv} from 'tailwind-variants'
import {Button} from './Button'
import {Description} from './Description'
import {FieldError} from './FieldError'
import {FloatingLabel} from './FloatingLabel'
import {Sheet, SheetHeader} from './Sheet'
import {wrapTextChildren} from './utils'

export type SelectProps<T extends object> = RACSelectProps<T> &
  Pick<React.ComponentPropsWithRef<typeof SelectButton>, 'ref' | 'size' | 'autoFocus' | 'label'> & {
    description?: React.ReactNode
    errorMessage?: React.ReactNode
    renderValue?: (
      renderProps: SelectValueRenderProps<T> & {
        defaultChildren: React.ReactNode
      },
    ) => React.ReactNode
    renderListBox?: () => React.ReactNode
    items?: T[]
    children?: React.ReactNode | ((item: T) => React.ReactNode)
  }

export function Select<T extends object>({
  ref,
  size,
  autoFocus,
  label,
  description,
  errorMessage,
  renderValue,
  renderListBox,
  items,
  children,
  ...props
}: SelectProps<T>) {
  return (
    <RACSelect
      {...props}
      // HACK: Disable default placeholder
      placeholder={props.placeholder ?? ''}
      className={composeRenderProps(props.className, (className) => twMerge('group flex flex-col gap-2', className))}
    >
      <SelectButton ref={ref} size={size} autoFocus={autoFocus} label={label} renderValue={renderValue} />

      <FieldError>{errorMessage}</FieldError>

      {!!description && <Description>{description}</Description>}

      {renderListBox?.() ?? (
        <SelectSheet label={label ?? props['aria-label']} items={items}>
          {children}
        </SelectSheet>
      )}
    </RACSelect>
  )
}

export function SelectButton<T extends object>({
  label,
  renderValue,
  ...props
}: React.ComponentPropsWithRef<typeof Button> & {
  label?: React.ReactNode
  renderValue?: (renderProps: SelectValueRenderProps<T> & {defaultChildren: React.ReactNode}) => React.ReactNode
}) {
  const ctx = useSlottedContext(SelectContext)
  const state = useContext(SelectStateContext)
  const validation = useContext(FieldErrorContext)
  return (
    <Button
      {...props}
      data-haslabel={!!label || undefined}
      data-hasvalue={!!state?.selectedKey || !!ctx?.placeholder || undefined}
      data-invalid={validation?.isInvalid || undefined}
      isDisabled={ctx?.isDisabled}
      variant="tertiary"
      className={composeRenderProps(props.className, (className) =>
        twMerge(
          'group relative justify-start rounded-md bg-transparent text-start text-white',
          'disabled:text-neutral-800/40',
          'invalid:border-red-700',
          className,
        ),
      )}
    >
      {!!label && <FloatingLabel>{label}</FloatingLabel>}

      <RACSelectValue
        className={twMerge(
          'flex min-w-0 flex-1 items-center gap-[1ch] [&>:is(svg,[role=img])]:text-[1.25em]',
          'placeholder-shown:text-neutral-400',
          'group-data-[haslabel]:translate-y-2',
        )}
      >
        {renderValue}
      </RACSelectValue>

      <CaretDownIcon />
    </Button>
  )
}

export function SelectSheet<T extends object>({
  label,
  ...props
}: RACListBoxProps<T> & {
  ref?: React.Ref<React.ComponentRef<typeof RACListBox>>
  label?: React.ReactNode
}) {
  const isHidden = useIsHidden()
  if (isHidden) {
    // HACK: Populate list state
    return <RACListBox {...props} />
  }
  return (
    <Sheet>
      <SheetHeader title={label || 'Select an option'} />
      <SelectListBox {...props} />
    </Sheet>
  )
}

export function SelectListBox<T extends object>(
  props: RACListBoxProps<T> & {
    ref?: React.Ref<React.ComponentRef<typeof RACListBox>>
  },
) {
  return (
    <RACListBox
      {...props}
      className={composeRenderProps(props.className, (className) =>
        twMerge(
          'flex flex-col gap-2 p-4 pb-[calc(env(safe-area-inset-bottom,0px)+theme(space.4))] [outline:none]',
          className,
        ),
      )}
    />
  )
}

const selectItemStyles = tv({
  base: [
    'relative flex select-none items-center gap-[1ch] whitespace-nowrap rounded-md border-1 border-transparent bg-clip-border font-medium transition [outline:none] [&:is(button)]:cursor-default [&>:is(svg,[role=img])]:text-[1.25em]',
    'border-neutral-500/10 bg-white text-neutral-800 hover:bg-neutral-500/20 pressed:bg-neutral-500/30',
    'focus:bg-primary-600/10 focus:hover:bg-primary-600/20 focus:pressed:bg-primary-600/30 [&>:is(svg,[role=img])]:focus:text-primary-600',
    'selected:border-primary-600',
    'disabled:cursor-not-allowed disabled:text-neutral-500/40',
  ],
  variants: {
    size: {
      md: 'h-12 px-4 py-3 text-sm',
      sm: 'h-10 px-3 py-2 text-sm',
      xs: 'h-8 px-3 py-1 text-xs',
    },
    tone: {
      default: '',
      negative: 'text-red-800 disabled:text-red-800/40',
      positive: 'text-green-800 disabled:text-green-800/40',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
})

export function SelectItem({
  tone,
  ...props
}: React.ComponentPropsWithRef<typeof RACListBoxItem> & VariantProps<typeof selectItemStyles>) {
  let textValue = props.textValue
  if (!textValue && typeof props.children === 'string') {
    textValue = props.children
  }
  if (!textValue && Array.isArray(props.children)) {
    textValue = props.children
      .map((child) => (typeof child === 'string' ? child : undefined))
      .filter(isTruthy)
      .join(' ')
  }
  return (
    <RACListBoxItem
      {...props}
      textValue={textValue}
      className={composeRenderProps(props.className, (className, renderProps) =>
        selectItemStyles({...renderProps, tone, className}),
      )}
    >
      {composeRenderProps(props.children, (children) => wrapTextChildren(children))}
    </RACListBoxItem>
  )
}
