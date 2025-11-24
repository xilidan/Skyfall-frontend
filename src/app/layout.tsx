import {MyQueryClientProvider} from '@/providers/TanstackQueryProver'
import '@/styles/globals.css'
import {Inter} from 'next/font/google'
import Script from 'next/script'
import React from 'react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html className={`${inter.variable} dark`} suppressHydrationWarning>
      <Script src="https://api-maps.yandex.ru/v3/?apikey=ad335dff-3945-42fe-a196-d9fbb3a0be58&lang=en_US" />
      <body className={`antialiased`}>
        <MyQueryClientProvider>{children}</MyQueryClientProvider>
      </body>
    </html>
  )
}
