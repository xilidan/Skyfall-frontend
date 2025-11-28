import {CheckIcon} from '@phosphor-icons/react'
import {
  Collection as RACCollection,
  Header as RACHeader,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  ListBoxProps as RACListBoxProps,
  Section as RACSection,
  SectionProps as RACSectionProps,
  composeRenderProps,
} from 'react-aria-components'
import {isTruthy} from 'remeda'
import {twMerge} from 'tailwind-merge'
import {VariantProps, tv} from 'tailwind-variants'
import {focusableStyles, wrapTextChildren} from './utils'

export function ListBox<T extends object>(props: Omit<RACListBoxProps<T>, 'layout' | 'orientation'>) {
  return (
    <RACListBox
      {...props}
      aria-label={props['aria-label'] || 'Listbox'}
      className={composeRenderProps(props.className, (className) =>
        twMerge('rounded-md border border-neutral-400/20 p-1 [outline:none]', className),
      )}
    />
  )
}

export const itemStyles = tv({
  extend: focusableStyles,
  base: 'group relative flex cursor-default select-none items-center gap-8 rounded-md px-3 py-2 text-sm font-medium will-change-transform',
  variants: {
    isSelected: {
      false: 'text-neutral-700 -outline-offset-2 hover:bg-neutral-200',
      true: 'outline-white[&+[data-selected]]:rounded-t-0 bg-primary-600 text-white -outline-offset-4 [&:has(+[data-selected])]:rounded-b-0',
    },
    isDisabled: {
      true: 'text-neutral-300',
    },
  },
})

export function ListBoxItem(props: React.ComponentPropsWithoutRef<typeof RACListBoxItem>) {
  const textValue = props.textValue ?? (typeof props.children === 'string' ? props.children : undefined)
  return (
    <RACListBoxItem {...props} textValue={textValue} className={itemStyles}>
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <div className="absolute inset-x-4 bottom-0 hidden h-px bg-white/20 [.group[data-selected]:has(+[data-selected])_&]:block" />
        </>
      ))}
    </RACListBoxItem>
  )
}

export const dropdownItemStyles = tv({
  base: 'group relative flex cursor-default select-none items-center gap-8 rounded-md px-3 py-2 text-sm font-medium [outline:none]',
  variants: {
    variant: {
      default: 'text-neutral-900',
      negative: 'text-red-700',
    },
    isDisabled: {
      true: 'text-neutral-300',
    },
    isFocused: {
      true: 'bg-primary-600 text-white',
    },
  },
  compoundVariants: [
    {
      isFocused: false,
      isOpen: true,
      className: 'bg-neutral-100',
    },
  ],
})

export function DropdownItem({
  variant,
  ...props
}: React.ComponentPropsWithoutRef<typeof RACListBoxItem> & VariantProps<typeof dropdownItemStyles>) {
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
        dropdownItemStyles({...renderProps, variant, className}),
      )}
    >
      {composeRenderProps(props.children, (children, {isSelected}) => (
        <>
          <span className="group-selected:font-semibold flex flex-1 items-center gap-2 truncate [&>svg]:text-[1.25em]">
            {wrapTextChildren(children)}
          </span>

          {isSelected && <CheckIcon />}
        </>
      ))}
    </RACListBoxItem>
  )
}

export type DropdownSectionProps<T extends object> = RACSectionProps<T> & {
  title?: string
}

export function DropdownSection<T extends object>(props: DropdownSectionProps<T>) {
  return (
    <RACSection className="after:block after:h-[5px] after:content-[''] first:mt-[-5px]">
      <RACHeader className="sticky top-[-5px] z-10 -mx-1 -mt-px truncate border-y border-neutral-400/20 bg-neutral-400/20 px-4 py-1 text-sm font-semibold text-neutral-500 [&+*]:mt-1">
        {props.title}
      </RACHeader>

      <RACCollection items={props.items}>{props.children}</RACCollection>
    </RACSection>
  )
}
