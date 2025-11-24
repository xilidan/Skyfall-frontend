import {Dialog as RACDialog} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'

export function Dialog(props: React.ComponentPropsWithoutRef<typeof RACDialog>) {
  return (
    <RACDialog
      {...props}
      className={twMerge('relative max-h-[inherit] overflow-auto rounded-md [outline:none]', props.className)}
    />
  )
}
