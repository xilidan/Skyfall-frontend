import {Trans} from '@lingui/react'
import React, {isValidElement} from 'react'
import {tv} from 'tailwind-variants'

export const focusableStyles = tv({
  base: 'outline outline-0 outline-offset-2 outline-primary-600',
  variants: {
    isFocusVisible: {
      true: 'outline-2',
    },
  },
})

export function wrapTextChildren(_children: React.ReactNode) {
  return (Array.isArray(_children) ? _children : [_children]).map((child: React.ReactNode, idx) => {
    if (typeof child === 'string' || (isValidElement(child) && child.type === Trans)) {
      return (
        <span key={idx} className="truncate">
          {child}
        </span>
      )
    }
    return <React.Fragment key={idx}>{child}</React.Fragment>
  })
}
