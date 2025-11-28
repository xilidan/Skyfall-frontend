import {Modal as RACModal, ModalOverlay as RACModalOverlay, composeRenderProps} from 'react-aria-components'
import {tv} from 'tailwind-variants'

const overlayStyles = tv({
  base: 'fixed inset-0 isolate z-[100] flex w-full items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 text-center',
  variants: {
    isEntering: {
      true: 'animate-[fade-in_200ms_ease-out]',
    },
    isExiting: {
      true: 'animate-[fade-out_150ms_ease-in]',
    },
  },
})

const modalStyles = tv({
  base: 'relative flex max-h-[90vh] w-full flex-col rounded-2xl border border-slate-800/60 bg-slate-950/95 backdrop-blur-xl text-left align-middle text-slate-100 shadow-2xl shadow-black/50 p-0 overflow-hidden',
  variants: {
    size: {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      '2xl': 'max-w-7xl',
    },
    isEntering: {
      true: 'animate-[modal-enter_300ms_ease-out]',
    },
    isExiting: {
      true: 'animate-[modal-exit_200ms_ease-in]',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

export function Modal(
  props: React.ComponentPropsWithoutRef<typeof RACModalOverlay> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  },
) {
  const {size = 'lg', ...restProps} = props
  return (
    <RACModalOverlay
      {...restProps}
      className={composeRenderProps(restProps.className, (className, renderProps) =>
        overlayStyles({...renderProps, className}),
      )}
    >
      <RACModal
        className={composeRenderProps(restProps.className, (className, renderProps) =>
          modalStyles({size, ...renderProps, className}),
        )}
      >
        {restProps.children}
      </RACModal>
    </RACModalOverlay>
  )
}
