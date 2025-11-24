import {twMerge} from 'tailwind-merge'

export function StickyFooter(props: React.ComponentPropsWithRef<'footer'>) {
  return (
    <footer
      {...props}
      className={twMerge(
        'sticky inset-x-0 bottom-0 z-10 flex shrink-0 flex-col border-t border-t-neutral-500/10 bg-white bg-clip-padding pb-[max(0px,calc(env(safe-area-inset-bottom,0px)-var(--keyboard-height,0px)))]',
        props.className,
      )}
    />
  )
}
