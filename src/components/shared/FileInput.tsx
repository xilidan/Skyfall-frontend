import {useControllableState} from '@/lib/hooks'
import {Trans} from '@lingui/react/macro'
import {FileIcon, XIcon} from '@phosphor-icons/react'
import React, {forwardRef} from 'react'
import {FileDropItem} from 'react-aria'
import {DropZone, FileTrigger, Button as RACButton} from 'react-aria-components'
import {twMerge} from 'tailwind-merge'
import {tv} from 'tailwind-variants'
import {Button} from './Button'
import {focusableStyles} from './utils'

const dropZoneStyles = tv({
  extend: focusableStyles,
  base: 'flex flex-col items-center rounded-xl border border-dashed bg-slate-900/30 px-2 py-8 text-sm text-slate-200 [outline:none] transition-all duration-200 hover:bg-slate-900/50 w-full',
  variants: {
    isDropTarget: {
      true: 'border-indigo-500 bg-indigo-500/10',
      false: 'border-slate-700/50',
    },
    isDisabled: {
      true: 'border-slate-800/50 text-slate-500',
    },
  },
})

export const FileInput = forwardRef<
  React.ComponentRef<typeof FileTrigger>,
  React.ComponentPropsWithoutRef<typeof FileTrigger> & {
    files: File[]
    onSelectFiles: (files: File[]) => void
    label?: React.ReactNode
    isPending?: boolean
  }
>(function FileInput({files: filesProp, onSelectFiles, label, isPending, ...props}, ref) {
  const [files, setFiles] = useControllableState({
    value: filesProp,
    onChange: onSelectFiles,
  })
  return (
    <div className={twMerge('flex flex-col gap-2 w-full', isPending && 'animate-pulse opacity-50')}>
      {(files.length === 0 || props.allowsMultiple) && (
        <DropZone
          getDropOperation={(types) => (props.acceptedFileTypes?.some((t) => types.has(t)) ? 'copy' : 'cancel')}
          onDrop={async (e) => {
            const items = e.items
              .filter((file): file is FileDropItem => file.kind === 'file')
              .slice(0, props.allowsMultiple ? undefined : 1)
            const newFiles = await Promise.all(items.map((file) => file.getFile()))
            if (props.allowsMultiple) {
              setFiles((v) => [...v, ...newFiles])
            } else {
              setFiles(newFiles)
            }
          }}
        >
          {({isDropTarget}) => (
            <FileTrigger
              {...props}
              ref={ref}
              onSelect={(flist) => {
                props.onSelect?.(flist)
                const newFiles = flist ? Array.from(flist) : []
                if (props.allowsMultiple) {
                  setFiles((v) => [...v, ...newFiles])
                } else {
                  setFiles(newFiles)
                }
              }}
            >
              <RACButton className={dropZoneStyles({isDropTarget})}>
                <span className="truncate text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  <Trans>Drag and drop files here or click to upload</Trans>
                </span>

                {!!label && (
                  <span className="mt-1 truncate rounded-md border border-slate-700/50 px-2 py-1 text-xs text-slate-500">
                    {label}
                  </span>
                )}
              </RACButton>
            </FileTrigger>
          )}
        </DropZone>
      )}

      {files.length > 0 && (
        <div className="flex gap-2">
          {files.map((f) => (
            <div
              key={f.name}
              className="flex h-10 w-fit max-w-full items-center gap-2 rounded-md border border-slate-700/50 bg-slate-800/50 py-2 pl-3 pr-2 text-slate-300"
            >
              <FileIcon />

              <span className="truncate text-sm">{f.name}</span>

              <Button
                onPress={() => {
                  setFiles((v) => v.filter((aFile) => aFile !== f))
                }}
                size="sm"
                variant="tertiary"
                isIconOnly
              >
                <XIcon />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
