import {Trans} from '@lingui/react/macro'
import {twMerge} from 'tailwind-merge'
import {InlineAlert} from './InlineAlert'

export function FallbackError({error, ...props}: React.ComponentPropsWithRef<'div'> & {error?: {message: string}}) {
  return (
    <div {...props} className={twMerge('flex flex-1 items-center justify-center', props.className)}>
      <InlineAlert variant="error">
        <Trans>An error occurred.</Trans>
      </InlineAlert>
    </div>
  )
}
