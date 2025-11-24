import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useCallback, useMemo} from 'react'

export function useQueryParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const key in paramsToUpdate) {
        params.set(key, paramsToUpdate[key])
      }
      return params.toString()
    },
    [searchParams],
  )

  const updateQueryParams = useCallback(
    (paramsToUpdate: Record<string, string>) => {
      const queryString = createQueryString(paramsToUpdate)
      router.replace(pathname + '?' + queryString)
    },
    [router, pathname, createQueryString],
  )

  const getQueryParams = useCallback(
    (param: string) => {
      return searchParams.get(param) || ''
    },
    [searchParams],
  )

  return {updateQueryParams, getQueryParams}
}

export function useQueryState<T>(
  key: string,
  defaultValue: T,
  options?: {
    serialize?: (value: T) => string
    deserialize?: (value: string) => T
  },
): [T, (value: T | ((prev: T) => T)) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Determine if we should use identity (for strings) or JSON (for other types)
  const useIdentity = typeof defaultValue === 'string'

  const serialize =
    options?.serialize ??
    ((val: T) => {
      // For strings, use identity function
      if (useIdentity) {
        return val as unknown as string
      }
      // For other types, use JSON
      return JSON.stringify(val)
    })
  const deserialize =
    options?.deserialize ??
    ((val: string) => {
      // For strings, use identity function
      if (useIdentity) {
        return val as unknown as T
      }
      // For other types, parse JSON
      try {
        return JSON.parse(val) as T
      } catch {
        // If parsing fails, return default value
        return defaultValue
      }
    })

  const value = useMemo(() => {
    const paramValue = searchParams.get(key)
    if (paramValue === null) {
      return defaultValue
    }
    try {
      return deserialize(paramValue)
    } catch {
      return defaultValue
    }
  }, [searchParams, key, defaultValue, deserialize])

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const valueToSet = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue

      // Check if value equals default (deep equality for objects)
      const isDefault = JSON.stringify(valueToSet) === JSON.stringify(defaultValue)

      if (isDefault || (typeof valueToSet === 'string' && valueToSet === '')) {
        // Remove the param if it's empty or matches default
        const params = new URLSearchParams(searchParams.toString())
        params.delete(key)
        const queryString = params.toString()
        router.replace(pathname + (queryString ? '?' + queryString : ''))
      } else {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, serialize(valueToSet))
        const queryString = params.toString()
        router.replace(pathname + '?' + queryString)
      }
    },
    [key, value, defaultValue, searchParams, router, pathname, serialize],
  )

  return [value, setValue]
}
