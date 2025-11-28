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

    chatStream: async function* (prompt: string, sessionId: string, files?: File[]) {
      const accessToken = getCookie('accessToken')

      const headers: HeadersInit = {
        ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
      }

      const formData = new FormData()
      formData.append('message', prompt)
      formData.append('session_id', sessionId)
      if (files && files.length > 0) {
        formData.append(`file`, files[0])
      }

      const response = await fetch('https://scrum.azed.kz/chat', {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status} ${response.statusText}`)
      }

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const {done, value} = await reader.read()
          if (done) break

          buffer += decoder.decode(value, {stream: true})
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim()) continue

            // Handle SSE format (data: {...})
            let jsonLine = line.trim()
            if (jsonLine.startsWith('data: ')) {
              jsonLine = jsonLine.slice(6)
            }

            // Skip SSE metadata lines
            if (jsonLine === '[DONE]' || jsonLine.startsWith('event:') || jsonLine.startsWith('id:')) {
              continue
            }

            try {
              const json = JSON.parse(jsonLine)

              // Handle different JSON structures
              // Try common field names for the content
              let content = ''
              if (typeof json === 'string') {
                content = json
              } else if (json.content) {
                content = json.content
              } else if (json.data) {
                content = json.data
              } else if (json.text) {
                content = json.text
              } else if (json.message) {
                content = json.message
              } else if (json.delta?.content) {
                content = json.delta.content
              } else if (json.choices?.[0]?.delta?.content) {
                content = json.choices[0].delta.content
              } else if (json.choices?.[0]?.text) {
                content = json.choices[0].text
              }

              if (content) {
                yield content
              }
            } catch {
              // If it's not JSON, try to yield it as plain text (might be just the content)
              if (jsonLine && jsonLine.length > 0 && !jsonLine.startsWith(':')) {
                yield jsonLine
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
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
