import {useLingui} from '@lingui/react/macro'
import {CaretDownIcon} from '@phosphor-icons/react'
import {forwardRef} from 'react'
import {
  ListBox as RACListBox,
  ListBoxProps as RACListBoxProps,
  Select as RACSelect,
  SelectProps as RACSelectProps,
  SelectValue as RACSelectValue,
  SelectValueRenderProps,
  ValidationResult,
  composeRenderProps,
} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {Button} from './Button'
import {Description, FieldError, Label} from './Field'
import {DropdownItem, DropdownSection, DropdownSectionProps} from './ListBox'
import {Popover} from './Popover'
import {wrapTextChildren} from './utils'

type SelectProps<T extends object> = Omit<RACSelectProps<T>, 'children'> &
  Pick<RACListBoxProps<T>, 'items' | 'children'> &
  Pick<React.ComponentPropsWithoutRef<typeof Button>, 'variant' | 'size'> & {
    label?: React.ReactNode
    description?: string
    errorMessage?: string | ((validation: ValidationResult) => string)
    renderValue?: (values: SelectValueRenderProps<T>) => React.ReactNode
  }

export const Select = forwardRef<
  React.ComponentRef<typeof RACSelect>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SelectProps<any>
>(function Select({variant, size, autoFocus, label, description, errorMessage, items, renderValue, ...props}, ref) {
  const {t} = useLingui()
  return (
    <RACSelect
      {...props}
      ref={ref}
      // HACK: Silence accessibility warnings
      aria-label={props['aria-label'] || 'Select'}
      placeholder={props.placeholder ?? t`Select an option…`}
      className={composeRenderProps(props.className, (className) => twMerge('group flex flex-col gap-1', className))}
    >
      {!!label && <Label>{label}</Label>}

      <Button
        variant={variant}
        size={size}
        autoFocus={autoFocus}
        className="h-12 w-full justify-between group-invalid:border-red-500/50 rounded-xl border border-slate-700/50 bg-slate-900/50 text-slate-100 hover:border-slate-600 hover:bg-slate-800/50 hover:shadow-md focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:shadow-lg transition-all duration-200 disabled:bg-slate-900/20 disabled:border-slate-800/50 disabled:opacity-50 px-4 focus:outline-none"
      >
        <RACSelectValue className="flex-1 overflow-hidden text-start text-sm font-medium text-slate-200 placeholder-shown:italic placeholder-shown:font-normal placeholder:text-slate-500">
          {renderValue}
        </RACSelectValue>

        <CaretDownIcon
          className="text-slate-400 group-disabled:text-slate-600 transition-colors shrink-0 ml-2"
          weight="bold"
          size={16}
        />
      </Button>

      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>

      <Popover className="w-[--trigger-width]">
        <RACListBox
          items={items}
          className="max-h-[inherit] overflow-auto p-1 [clip-path:inset(0_0_0_0_round_.75rem)] [outline:none] w-full"
        >
          {props.children}
        </RACListBox>
      </Popover>
    </RACSelect>
  )
}) as <T extends object>(
  props: SelectProps<T> & {
    ref?: React.Ref<React.ComponentRef<typeof RACSelect>>
  },
) => React.ReactElement | null

export function SelectItem(props: React.ComponentPropsWithoutRef<typeof DropdownItem>) {
  return (
    <DropdownItem {...props}>
      {composeRenderProps(props.children, (children) => wrapTextChildren(children))}
    </DropdownItem>
  )
}

export function SelectSection<T extends object>(props: DropdownSectionProps<T>) {
  return <DropdownSection {...props} />
}
