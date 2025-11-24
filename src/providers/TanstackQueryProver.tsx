'use client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {FetchError} from 'ofetch'
import {useState} from 'react'

export function MyQueryClientProvider({children}: {children: React.ReactNode}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Number.POSITIVE_INFINITY,
            retry: (failureCount, error) => {
              if (failureCount >= 1) {
                return false
              }
              if (error instanceof FetchError) {
                return typeof error.status === 'number' && RETRY_STATUS_CODES.includes(error.status)
              }
              return true
            },
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

const RETRY_STATUS_CODES = [408, 409, 425, 429, 500, 502, 503, 504]
