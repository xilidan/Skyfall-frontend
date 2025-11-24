import {FetchOptions, FetchRequest, ofetch} from 'ofetch'
import {ZodType} from 'zod'

export const tfetch = makeTfetch()

export function makeTfetch(defaults: FetchOptions = {}) {
  const $fetch = ofetch.create(defaults)
  return async function tfetch<TOutput>(
    request: FetchRequest,
    {
      responseBodySchema,
      ...options
    }: FetchOptions<any> & {
      responseBodySchema: ZodType<TOutput>
    },
  ) {
    try {
      const responseBody = await $fetch<unknown>(request, options)
      try {
        return responseBodySchema.parse(responseBody)
      } catch (err) {
        const payload = {request, options, responseBody}
        console.error(payload)
        throw err
      }
    } catch (error) {
      const handler = (options as any)?.onResponseError ?? (options as any)?.onRequestError
      if (typeof handler === 'function') {
        try {
          await handler(error)
        } catch {}
      }
      const payload = {request, options, error}
      // Rethrow network/HTTP error so callers (e.g., react-query) receive a rejected promise
      throw error as any
    }
  }
}
