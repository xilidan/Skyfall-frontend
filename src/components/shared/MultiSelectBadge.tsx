import {Check, X} from 'lucide-react'
import React from 'react'
import {VariantProps, tv} from 'tailwind-variants'

const multiSelectBadgeStyles = tv({
  base: 'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer select-none border-2 hover:shadow-md active:scale-95',
  variants: {
    selected: {
      true: 'bg-primary-50 border-primary-500 text-primary-700 hover:bg-primary-100',
      false: 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300',
    },
    size: {
      sm: 'text-xs px-3 py-2',
      md: 'text-sm px-4 py-2.5',
      lg: 'text-base px-5 py-3',
    },
  },
  defaultVariants: {
    selected: false,
    size: 'md',
  },
})

const containerStyles = tv({
  base: 'space-y-3',
})

const headerStyles = tv({
  base: 'flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2',
})

const gridStyles = tv({
  base: 'flex flex-wrap gap-2',
})

interface MultiSelectBadgeProps {
  options: {id: number; name: string}[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
  label: React.ReactNode
  icon?: React.ReactNode
  size?: VariantProps<typeof multiSelectBadgeStyles>['size']
  emptyText?: string
}

export function MultiSelectBadge({
  options,
  selectedIds,
  onChange,
  label,
  icon,
  size = 'md',
  emptyText = 'No options selected',
}: MultiSelectBadgeProps) {
  const toggleOption = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  const selectedCount = selectedIds.length

  return (
    <div className={containerStyles()}>
      <div className={headerStyles()}>
        {icon && <span className="text-primary-600">{icon}</span>}
        <span>{label}</span>
        {selectedCount > 0 && (
          <span className="ml-auto bg-primary-100 text-primary-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
            {selectedCount}
          </span>
        )}
      </div>
      <div className={gridStyles()}>
        {options.length === 0 ? (
          <div className="text-sm text-neutral-400 italic">{emptyText}</div>
        ) : (
          options.map((option) => {
            const isSelected = selectedIds.includes(option.id)
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleOption(option.id)}
                className={multiSelectBadgeStyles({selected: isSelected, size})}
              >
                <span className="relative">
                  {isSelected ? (
                    <Check size={16} className="text-primary-600" strokeWidth={3} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                  )}
                </span>
                <span>{option.name}</span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

const compactBadgeStyles = tv({
  base: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none border',
  variants: {
    selected: {
      true: 'bg-primary-500 border-primary-600 text-white hover:bg-primary-600',
      false: 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200',
    },
  },
  defaultVariants: {
    selected: false,
  },
})

interface CompactMultiSelectBadgeProps {
  options: {id: number; name: string}[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export function CompactMultiSelectBadge({options, selectedIds, onChange}: CompactMultiSelectBadgeProps) {
  const toggleOption = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id)
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => toggleOption(option.id)}
            className={compactBadgeStyles({selected: isSelected})}
          >
            <span>{option.name}</span>
            {isSelected && <X size={12} strokeWidth={3} />}
          </button>
        )
      })}
    </div>
  )
}
