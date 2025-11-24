import {
  composeRenderProps,
  Tab as RACTab,
  TabList as RACTabList,
  TabListProps as RACTabListProps,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {tv} from 'tailwind-variants'
import {focusableStyles, wrapTextChildren} from './utils'

export function Tabs(props: React.ComponentPropsWithoutRef<typeof RACTabs>) {
  return (
    <RACTabs
      {...props}
      className={composeRenderProps(props.className, (className) =>
        twMerge('group flex', 'orientation-horizontal:flex-col', 'orientation-vertical:flex-row', className),
      )}
    />
  )
}

export function TabList<T extends object>(props: RACTabListProps<T>) {
  return (
    <RACTabList
      {...props}
      className={composeRenderProps(props.className, (className) =>
        twMerge(
          'flex *:min-w-0 *:flex-1 *:shrink-0',
          'shadow-[inset_0_-0.5px_0_0_theme(colors.neutral.500/10%)]',
          'group-orientation-horizontal:flex-row',
          'group-orientation-vertical:flex-col',
          className,
        ),
      )}
    />
  )
}

const tabStyles = tv({
  extend: focusableStyles,
  base: [
    'flex select-none items-center justify-center gap-[1ch] whitespace-nowrap border-b-[2px] border-transparent bg-transparent bg-clip-border font-medium transition [&>:is(svg,[role=img])]:text-[1.25em]',
    'text-neutral-800 hover:bg-neutral-500/20 pressed:bg-neutral-500/30',
    'selected:border-neutral-800',
    'invalid:border-red-700 invalid:pressed:border-red-800',
  ],
  variants: {
    size: {
      md: 'h-12 px-4 py-3 text-sm',
      sm: 'h-10 px-3 py-2 text-sm',
      xs: 'h-8 px-3 py-1 text-xs',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export function Tab(props: React.ComponentPropsWithoutRef<typeof RACTab>) {
  return (
    <RACTab
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabStyles({...renderProps, className}),
      )}
    >
      {composeRenderProps(props.children, (children) => wrapTextChildren(children))}
    </RACTab>
  )
}

const tabPanelStyles = tv({
  extend: focusableStyles,
  base: 'flex-1',
})

export function TabPanel(props: React.ComponentPropsWithoutRef<typeof RACTabPanel>) {
  return (
    <RACTabPanel
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabPanelStyles({...renderProps, className}),
      )}
    />
  )
}
