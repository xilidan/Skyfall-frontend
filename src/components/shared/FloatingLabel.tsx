import {Label as RACLabel} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'

export function FloatingLabel(props: React.ComponentPropsWithRef<typeof RACLabel>) {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        'absolute inset-0 flex items-center justify-center gap-[1ch] font-medium',
        'h-12 px-4 py-3 text-sm',
        'text-neutral-400',
        'group-invalid:text-red-700',
        props.className,
      )}
    >
      <span
        className={twMerge(
          'flex-1 origin-top-left truncate transition-transform',
          'group-focus-within:-translate-y-2 group-focus-within:scale-75',
          'group-data-[hasvalue]:-translate-y-2 group-data-[hasvalue]:scale-75',
        )}
      >
        {props.children}
      </span>
    </RACLabel>
  )
}
