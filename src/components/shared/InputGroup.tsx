import {useContext} from 'react'
import {
  FieldErrorContext,
  InputContext,
  Group as RACGroup,
  GroupProps as RACGroupProps,
  composeRenderProps,
  useSlottedContext,
} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {FloatingLabel} from './FloatingLabel'
import {Input} from './Input'
import {focusableStyles, wrapTextChildren} from './utils'

export function InputGroup({
  ref,
  label,
  startContent,
  endContent,
  ...props
}: RACGroupProps & {
  ref?: React.Ref<React.ComponentRef<typeof Input>>
  label?: React.ReactNode
  startContent?: React.ReactNode
  endContent?: React.ReactNode
}) {
  const ctx = useSlottedContext(InputContext)
  const validation = useContext(FieldErrorContext)
  return (
    <RACGroup
      {...props}
      data-haslabel={!!label || undefined}
      data-hasvalue={!!ctx?.value || !!ctx?.placeholder || undefined}
      isInvalid={validation?.isInvalid}
      isDisabled={ctx?.disabled}
      className={composeRenderProps(props.className, (className, renderProps) =>
        twMerge(
          focusableStyles(renderProps),
          'group flex h-12 items-center overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50 text-slate-100',
          'transition-all duration-200',
          'hover:border-slate-600 hover:bg-slate-800/50 hover:shadow-md',
          'focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:shadow-lg focus-within:bg-slate-900/80',
          'invalid:border-red-500/50 invalid:focus-within:ring-red-500/20',
          'disabled:bg-slate-900/20 disabled:border-slate-800/50 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ),
      )}
    >
      {!!startContent && (
        <div className="flex h-12 min-w-0 items-center gap-[1ch] px-2 py-3 text-sm font-medium text-white [&>:is(svg,[role=img])]:text-[1.25em]">
          {wrapTextChildren(startContent)}
        </div>
      )}

      <div className="relative flex h-12 flex-1 items-center px-4 py-3">
        {!!label && <FloatingLabel className="cursor-text">{label}</FloatingLabel>}

        <Input ref={ref} className="size-full group-data-haslabel:translate-y-2" />
      </div>

      {!!endContent && (
        <div className="flex h-12 min-w-0 items-center gap-[1ch] px-2 py-3 text-sm font-medium text-neutral-400 [&>:is(svg,[role=img])]:text-[1.25em]">
          {wrapTextChildren(endContent)}
        </div>
      )}
    </RACGroup>
  )
}
