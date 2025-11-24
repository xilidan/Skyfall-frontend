import {OmnibarWithTrigger} from '@/commands/omnibar/OmnibarWithTrigger'
import {Toaster} from '@/components/shadcn/sonner'
import {allMessages} from '@/config/i18'
import {PageLangParam, initLingui} from '@/config/initLingui'
import {LinguiClientProvider} from '@/providers/LinguiClientProvider'
import '@/styles/globals.css'
import {Locale} from '@/types/global'
import {PropsWithChildren} from 'react'
import {twMerge} from 'tailwind-merge'

export default async function LanguageLayout({children, params}: PropsWithChildren<PageLangParam>) {
  const lang = (await params).lang as Locale
  initLingui(lang)

  return (
    <LinguiClientProvider initialLocale={lang} initialMessages={allMessages[lang]!}>
      <Shell>{children}</Shell>
    </LinguiClientProvider>
  )
}

function Shell({children}: {children?: React.ReactNode}) {
  return (
    <div className={twMerge('flex min-h-[calc(100dvh-var(--keyboard-height,0px))] flex-col bg-slate-950')}>
      {children}
      <Toaster />
      <OmnibarWithTrigger />
    </div>
  )
}
