import {useEffectEvent} from '@react-aria/utils'
import {useMemo, useRef, useState} from 'react'

// Based on https://github.com/radix-ui/primitives/blob/b32a93318cdfce383c2eec095710d35ffbd33a1c/packages/react/use-previous/src/usePrevious.tsx
export function usePrevious<T>(value: T) {
  const ref = useRef({value, previous: value})
  // We compare values before making an update to ensure that a change has
  // been made. This ensures the previous value is persisted correctly between
  // renders.
  return useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value
      ref.current.value = value
    }
    return ref.current.previous
  }, [value])
}

// Based on https://github.com/radix-ui/primitives/blob/b32a93318cdfce383c2eec095710d35ffbd33a1c/packages/react/use-controllable-state/src/useControllableState.tsx
export function useControllableState<T>({
  value: valueProp,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}) {
  const [uncontrolledState, setUncontrolledState] = useState(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : (uncontrolledState as T)
  const setValue = useEffectEvent((next: React.SetStateAction<T>) => {
    const nextValue = typeof next === 'function' ? (next as (prevState?: T) => T)(value) : next
    if (value === nextValue) {
      return
    }

    if (!isControlled) {
      setUncontrolledState(nextValue)
    }

    onChange?.(nextValue)
  })
  return [value, setValue] as const
}
