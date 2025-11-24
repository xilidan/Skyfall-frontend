import {Trans} from '@lingui/react/macro'
import {twMerge} from 'tailwind-merge'
import {InlineAlert} from './InlineAlert'

export function FallbackEmptyState({...props}: React.ComponentPropsWithRef<'div'>) {
  return (
    <div {...props} className={twMerge('flex flex-1 items-center justify-center', props.className)}>
      <InlineAlert variant="info">
        <Trans>No properties found.</Trans>
      </InlineAlert>
    </div>
  )
}
