import {Link as RACLink, composeRenderProps} from 'react-aria-components'
import {focusableStyles, wrapTextChildren} from './utils'

export function UnstyledLink(props: React.ComponentPropsWithRef<typeof RACLink>) {
  return (
    <RACLink
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        focusableStyles({...renderProps, className}),
      )}
    >
      {composeRenderProps(props.children, (children) => wrapTextChildren(children))}
    </RACLink>
  )
}
