import {twMerge} from 'tailwind-merge'

export function Spinner(props: React.ComponentPropsWithRef<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={twMerge('h-[1.5em]', props.className)}
    >
      <g fill="currentcolor" className="origin-center animate-[spinner_.75s_step-end_infinite]">
        <path d="M11 1h2v5h-2z" opacity={0.14} />
        <path d="m16.634 1.974 1.732 1-2.5 4.33-1.732-1z" opacity={0.29} />
        <path d="m21.026 5.634 1 1.732-4.33 2.5-1-1.732z" opacity={0.43} />
        <path d="M23 11v2h-5v-2z" opacity={0.57} />
        <path d="m22.026 16.634-1 1.732-4.33-2.5 1-1.732z" opacity={0.71} />
        <path d="m18.366 21.026-1.732 1-2.5-4.33 1.732-1z" opacity={0.86} />
        <path d="M13 23h-2v-5h2z" />
      </g>
    </svg>
  )
}
