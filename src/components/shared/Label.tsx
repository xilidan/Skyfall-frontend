import {Label as RACLabel} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'

export function Label(props: React.ComponentPropsWithRef<typeof RACLabel>) {
  return (
    <RACLabel
      {...props}
      className={twMerge('w-fit cursor-default text-sm font-semibold text-gray-700 mb-1.5', props.className)}
    />
  )
}
