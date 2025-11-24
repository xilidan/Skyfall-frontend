import {Modal as RACModal, ModalOverlay as RACModalOverlay, composeRenderProps} from 'react-aria-components'
import {tv} from 'tailwind-variants'

const overlayStyles = tv({
  base: 'fixed inset-0 isolate z-[100] flex w-full items-center justify-center bg-black/[50%] p-4 text-center',
  variants: {
    isEntering: {
      true: '[animation:fade-in-keyframe_150ms_ease-out]',
    },
    isExiting: {
      true: '[animation:fade-out-keyframe_100ms_ease-in]',
    },
  },
})

const modalStyles = tv({
  base: 'relative flex max-h-full w-full max-w-xl flex-col rounded-md border border-slate-800/60 bg-slate-950/50 backdrop-blur-xl text-left align-middle text-slate-100 shadow-2xl p-4 max-w-[923px]',
  variants: {
    isEntering: {
      true: '[animation:zoom-in-105_150ms_ease-out]',
    },
    isExiting: {
      true: '[animation:zoom-out-95_100ms_ease-in]',
    },
  },
})

export function Modal(props: React.ComponentPropsWithoutRef<typeof RACModalOverlay>) {
  return (
    <RACModalOverlay
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        overlayStyles({...renderProps, className}),
      )}
    >
      <RACModal className={modalStyles}>{props.children}</RACModal>
    </RACModalOverlay>
  )
}
