import {appApiFetchClient} from '@/lib/appApiFetchClient'
import {useQuery, UseQueryOptions} from '@tanstack/react-query'
import {getCookie} from 'cookies-next/client'
import {FetchError} from 'ofetch'
import {z} from 'zod'

export function getApi() {
  return {
    login: async (values: {email: string; password: string}) => {
      return appApiFetchClient(`/auth/login`, {
        method: 'POST',
        responseBodySchema: z.object({
          token: z.string(),
        }),
        body: values,
      })
    },

    register: async (body: {
      email: string
      password: string
      name: string
      surname: string
      password_confirm: string
    }) => {
      return appApiFetchClient(`/auth/register`, {
        method: 'POST',
        body,
        responseBodySchema: z.object({
          token: z.string(),
        }),
      })
    },

    chatStream: async function* (prompt: string) {
      const accessToken = getCookie('accessToken')
      const response = await fetch('https://api.azed.kz/api/v1/chat/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
        },
        body: JSON.stringify({prompt}),
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const {done, value} = await reader.read()
        if (done) break

        buffer += decoder.decode(value, {stream: true})
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const json = JSON.parse(line)
            if (json.content) {
              yield json.content
            }
          } catch (e) {
            console.error('Error parsing stream chunk', e)
          }
        }
      }
    },

    getMe: async () => {
      return appApiFetchClient('/auth/profile', {
        method: 'GET',
        responseBodySchema: z.object({
          user: z.object({
            id: z.string(),
            email: z.string(),
            name: z.string(),
            surname: z.string(),
            position_id: z.number().optional(),
            job: z.string().optional(),
          }),
        }),
      })
    },

    getOrganization: async () => {
      return appApiFetchClient('/organization', {
        method: 'GET',
        responseBodySchema: z.object({
          organization: z.object({
            id: z.string(),
            name: z.string(),
            positions: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                isReviewer: z.boolean(),
              }),
            ),
            users: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                surname: z.string(),
                email: z.string(),
                positionId: z.string().optional(),
                job: z.string().optional(),
              }),
            ),
          }),
        }),
      })
    },

    createOrganization: async (body: {
      name: string
      positions: {
        id: number
        name: string
        is_reviewer: boolean
      }[]
      users: {
        name: string
        surname: string
        email: string
        position_id: number
        job_domain: string
      }[]
    }) => {
      return appApiFetchClient('/organization', {
        method: 'POST',
        body,
        responseBodySchema: z.any(),
      })
    },

    getOrganizationPositions: async () => {
      return appApiFetchClient('/organization/positions', {
        method: 'GET',
        responseBodySchema: z.object({
          positions: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              is_reviewer: z.boolean(),
            }),
          ),
        }),
      })
    },

    updateOrganization: async (body: {
      name: string
      positions: {
        id: number
        name: string
        is_reviewer: boolean
      }[]
      users: {
        name: string
        surname?: string
        email: string
        position_id?: number
        job_domain?: string
      }[]
    }) => {
      return appApiFetchClient('/organization', {
        method: 'PUT',
        body,
        responseBodySchema: z.any(),
      })
    },
  }
}

export type Api = ReturnType<typeof getApi>

export function useApiQuery<TMethod extends keyof Api>(
  [method, ...params]: [method: TMethod, ...params: Parameters<Api[TMethod]>],
  opts?: Omit<
    UseQueryOptions<Awaited<ReturnType<Api[TMethod]>>, FetchError | Error, Awaited<ReturnType<Api[TMethod]>>>,
    'queryKey' | 'queryFn'
  >,
) {
  const api = getApi()

  return useQuery<Awaited<ReturnType<Api[TMethod]>>, FetchError | Error, Awaited<ReturnType<Api[TMethod]>>>({
    queryKey: makeApiQueryKey(method, ...(params as Parameters<Api[TMethod]>)),

    queryFn: () =>
      (api[method] as unknown as (...args: Parameters<Api[TMethod]>) => ReturnType<Api[TMethod]>)(...params) as Awaited<
        ReturnType<Api[TMethod]>
      >,
    ...opts,
  })
}

export function makeApiQueryKey<TMethod extends keyof Api>(method: TMethod, ...params: Parameters<Api[TMethod]>) {
  return [method, ...params] as const
}
