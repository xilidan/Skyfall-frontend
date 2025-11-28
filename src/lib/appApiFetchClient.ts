import {getCookie} from 'cookies-next/client'
import {makeTfetch} from './tfetch'

export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL

export const appApiFetchClient = makeTfetch({
  baseURL: APP_BASE_URL,
  timeout: 10000,
  onRequest: async (ctx) => {
    const tokens = {
      accessToken: getCookie('accessToken'),
      refreshToken: getCookie('refreshToken'),
    }
    if (tokens.accessToken) {
      ctx.options.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
    }
  },
  onResponseError: async (ctx) => {
  },
})
