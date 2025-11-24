import { cookies } from 'next/headers'
import { makeTfetch } from './tfetch'

export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL

export const appApiFetchServer = makeTfetch({
  baseURL: APP_BASE_URL,
  timeout: 10000,
  onRequest: async (ctx) => {
    const tokens = {
      accessToken: (await cookies()).get('accessToken')?.value,
      refreshToken: (await cookies()).get('refreshToken')?.value,
    }
    if (tokens.accessToken) {
      ctx.options.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
    }
  },
  onResponseError: async (_ctx) => {},
})

export const nextApiFetch = makeTfetch({
  baseURL: '/api',
  timeout: 10000,
  onRequest: async (ctx) => {
    const tokens = {
      accessToken: (await cookies()).get('accessToken')?.value,
      refreshToken: (await cookies()).get('refreshToken')?.value,
    }
    if (tokens.accessToken) {
      ctx.options.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
    }
    if (tokens.refreshToken) {
      ctx.options.headers.set('Refresh-Token', tokens.refreshToken)
    }
  },
  onResponseError: async (_ctx) => {},
})
