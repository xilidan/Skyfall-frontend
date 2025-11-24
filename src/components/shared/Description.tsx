import {Text as RACText} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'

export function Description(props: React.ComponentPropsWithRef<typeof RACText>) {
  return <RACText {...props} slot="description" className={twMerge('text-xs text-gray-500 mt-1', props.className)} />
}
