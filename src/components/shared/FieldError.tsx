import {FieldError as RACFieldError, composeRenderProps} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'

export function FieldError(props: React.ComponentPropsWithRef<typeof RACFieldError>) {
  return (
    <RACFieldError
      {...props}
      className={composeRenderProps(props.className, (className) =>
        twMerge('text-sm font-medium text-red-700', className),
      )}
    />
  )
}
