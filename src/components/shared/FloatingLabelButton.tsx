import {composeRenderProps} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {Button} from './Button'
import {FloatingLabel} from './FloatingLabel'
import {wrapTextChildren} from './utils'

export function FloatingLabelButton({
  label,
  ...props
}: React.ComponentPropsWithRef<typeof Button> & {
  label: React.ReactNode
}) {
  return (
    <Button
      {...props}
      data-haslabel
      data-hasvalue
      className={composeRenderProps(props.className, (className) =>
        twMerge('group relative justify-start text-start', className),
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          <FloatingLabel>{label}</FloatingLabel>

          <span className="flex min-w-0 flex-1 translate-y-2 items-center gap-[1ch] [&>:is(svg,[role=img])]:text-[1.25em]">
            {wrapTextChildren(children)}
          </span>
        </>
      ))}
    </Button>
  )
}
