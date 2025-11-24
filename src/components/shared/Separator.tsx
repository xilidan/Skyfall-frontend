import {Separator as RACSeparator} from 'react-aria-components'
import {tv} from 'tailwind-variants'

const separatorStyles = tv({
  base: 'border-0 bg-black',
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export function Separator(props: React.ComponentPropsWithRef<typeof RACSeparator>) {
  return (
    <RACSeparator
      {...props}
      className={separatorStyles({
        orientation: props.orientation,
        className: props.className,
      })}
    />
  )
}
