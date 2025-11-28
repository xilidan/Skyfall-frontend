import {useEffectEvent} from '@react-aria/utils'
import {useMemo, useRef, useState} from 'react'

export function usePrevious<T>(value: T) {
  const ref = useRef({value, previous: value})
  return useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value
      ref.current.value = value
    }
    return ref.current.previous
  }, [value])
}

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
