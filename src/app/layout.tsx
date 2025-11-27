import {MyQueryClientProvider} from '@/providers/TanstackQueryProver'
import '@/styles/globals.css'
import {Inter} from 'next/font/google'
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
      <body className={`antialiased`}>
        <MyQueryClientProvider>{children}</MyQueryClientProvider>
      </body>
    </html>
  )
}
