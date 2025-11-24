'use client'
import {composeRenderProps, Link as RACLink} from 'react-aria-components'
import {VariantProps} from 'tailwind-variants'
import {buttonStyles} from './Button'
import {wrapTextChildren} from './utils'

export function ButtonLink({
  size,
  variant,
  isIconOnly,
  ...props
}: React.ComponentPropsWithRef<typeof RACLink> & VariantProps<typeof buttonStyles>) {
  return (
    <RACLink
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        buttonStyles({
          ...renderProps,
          size,
          variant,
          isIconOnly,
          className,
        }),
      )}
    >
      {composeRenderProps(props.children, (children) => wrapTextChildren(children))}
    </RACLink>
  )
}
