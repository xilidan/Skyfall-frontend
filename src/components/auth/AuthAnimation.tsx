'use client'
import {cn} from '@/lib/utils'
import {Trans} from '@lingui/react/macro'
import Link from 'next/link'
import {AllHTMLAttributes} from 'react'
import {AnimatedLogo} from '../shared/AnimatedLogo'
import {Blink} from '../shared/Blink'

export function AuthAnimation() {
  return (
    <div className="h-full bg-linear-to-br from-slate-950 via-indigo-950/50 to-slate-950 relative overflow-hidden hidden sm:block">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-slate-950/0" />

      <DivAnimationFirst className="lg:left-[calc(50%+200px)] lg:top-[-40px]" />
      <DivAnimationSecond className={'lg:right-[calc(50%+200px)] lg:left-auto lg:top-[-40px]'} />

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-8 lg:px-12">
        <Link href="/" className="mb-8">
          <AnimatedLogo className="mx-auto" />
        </Link>

        <div className="mb-20 max-w-lg">
          <h1 className="text-4xl lg:text-6xl font-light text-white mb-6 tracking-tight leading-none">
            <Trans>Your Intelligent</Trans>
            <span className="block font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-cyan-400 to-indigo-400">
              <Trans>AI Project Manager</Trans>
            </span>
          </h1>

          <div className="w-20 h-1 bg-linear-to-r from-indigo-400/80 via-cyan-400/80 to-transparent mx-auto mb-8"></div>

          <p className="text-slate-300/80 text-lg lg:text-xl font-light leading-relaxed">
            <Trans>
              Automate Jira tasks, transcribe meetings, and analyze Merge Requests. From technical specs to delivery -
              streamline your workflow with AI.
            </Trans>
          </p>
        </div>
      </div>

      <div
        className="absolute top-20 right-20 w-40 h-40 bg-linear-to-br from-indigo-500/20 to-transparent rounded-full blur-2xl animate-pulse"
        style={{animationDuration: '4s'}}
      />
      <div
        className="absolute bottom-32 left-16 w-28 h-28 bg-linear-to-tl from-cyan-500/15 to-transparent rounded-full blur-xl animate-pulse"
        style={{animationDelay: '2s', animationDuration: '6s'}}
      />

      <div
        className="absolute top-1/4 right-1/3 w-3 h-3 border border-indigo-400/30 rotate-45 animate-spin"
        style={{animationDuration: '20s'}}
      />

      <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-indigo-400/60 rounded-full animate-ping" />
      <div
        className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-ping"
        style={{animationDelay: '2s'}}
      />
      <div
        className="absolute bottom-1/4 left-1/2 w-0.5 h-0.5 bg-indigo-400/80 rounded-full animate-ping"
        style={{animationDelay: '4s'}}
      />
    </div>
  )
}

export function DivAnimationFirst({className = '', ...props}: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
  return (
    <div
      className={cn(
        'absolute lg:top-[400px] top-[98px] w-[230px] h-[285px] right-[calc(100%/2+92px)] md:right-[calc(100%/2+136px)] lg:right-[calc(100%/2+336px)]',
        className,
      )}
      {...props}
    >
      <Blink positionLeft="absolute left-[174px] lg:left-[94px]" positionTop="top-0" />
      <Blink positionLeft=" absolute left-[92px] lg:left-0" positionTop="lg:top-[120px] top-[54px]" />
      <Blink positionLeft="absolute lg:left-[38px] left-[147px]" positionTop="lg:top-[163px] top-[70px]" />
      <Blink positionLeft="absolute lg:left-[110px] left-[83px]" positionTop="lg:top-[163px] top-[118px]" />
      <Blink positionLeft="absolute lg:left-[149px] left-[99px]" positionTop="lg:top-[204px] top-[172px]" />
      <Blink positionLeft="absolute lg:left-[108px] left-[60px]" positionTop="lg:top-[245px] top-[172px]" />
      <Blink positionLeft="absolute lg:left-[190px] left-[60px]" positionTop="lg:top-[245px] top-[217px]" />
    </div>
  )
}

export function DivAnimationSecond({className = '', ...props}: Omit<AllHTMLAttributes<HTMLDivElement>, 'children'>) {
  return (
    <div
      className={cn(
        'absolute lg:top-[400px] top-[98px] w-[230px] h-[285px] right-[calc(100%/2+92px)] md:right-[calc(100%/2+136px)] lg:right-[calc(100%/2+336px)]',
        className,
      )}
      {...props}
    >
      <Blink positionLeft="absolute left-[174px] lg:left-[94px]" positionTop="top-0" />
      <Blink positionLeft=" absolute left-[92px] lg:left-0" positionTop="lg:top-[120px] top-[54px]" />
      <Blink positionLeft="absolute lg:left-[38px] left-[147px]" positionTop="lg:top-[163px] top-[70px]" />
      <Blink positionLeft="absolute lg:left-[110px] left-[83px]" positionTop="lg:top-[163px] top-[118px]" />
      <Blink positionLeft="absolute lg:left-[149px] left-[99px]" positionTop="lg:top-[204px] top-[172px]" />
      <Blink positionLeft="absolute lg:left-[108px] left-[60px]" positionTop="lg:top-[245px] top-[172px]" />
      <Blink positionLeft="absolute lg:left-[190px] left-[60px]" positionTop="lg:top-[245px] top-[217px]" />
    </div>
  )
}
