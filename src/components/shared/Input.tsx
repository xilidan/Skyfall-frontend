import {Input as RACInput, composeRenderProps} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'

export function Input(props: React.ComponentPropsWithRef<typeof RACInput>) {
  return (
    <RACInput
      {...props}
      className={composeRenderProps(props.className, (className) =>
        twMerge(
          'min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 [outline:none]',
          'placeholder:text-gray-400 placeholder:font-normal',
          'disabled:cursor-not-allowed disabled:text-gray-400',
          className,
        ),
      )}
    />
  )
}
