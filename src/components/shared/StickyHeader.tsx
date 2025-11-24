import {twMerge} from 'tailwind-merge'

export function StickyHeader(props: React.ComponentPropsWithRef<'header'>) {
  return (
    <header
      {...props}
      className={twMerge(
        'sticky inset-x-0 top-0 z-[1] flex shrink-0 flex-col justify-end border-b border-b-neutral-500/10 bg-white bg-clip-padding pt-[env(safe-area-inset-top,0px)]',
        props.className,
      )}
    />
  )
}
