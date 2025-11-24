'use client'
import {motion} from 'framer-motion'
import Image from 'next/image'

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />

      <motion.div
        initial={{scale: 0.8, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.3, ease: 'easeOut'}}
        className="mb-8 relative z-10"
      >
        <motion.div
          animate={{
            rotate: [0, 3, -3, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <motion.div
            animate={{
              background: [
                'linear-gradient(45deg, #6366f1, #8b5cf6, #06b6d4)',
                'linear-gradient(45deg, #06b6d4, #6366f1, #8b5cf6)',
                'linear-gradient(45deg, #8b5cf6, #06b6d4, #6366f1)',
                'linear-gradient(45deg, #6366f1, #8b5cf6, #06b6d4)',
              ],
            }}
            transition={{duration: 4, repeat: Infinity}}
            className="absolute -inset-4 rounded-3xl blur-lg opacity-40"
          />
          <div className="relative bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-slate-800/60">
            <Image
              src="/static/buy-logo.png"
              alt="Dala Market Logo"
              width={72}
              height={72}
              className="rounded-2xl"
              priority
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3, delay: 0.1}}
        className="w-full max-w-sm relative z-10"
      >
        <div className="relative h-2 bg-slate-800/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full shadow-lg shadow-indigo-900/20"
            initial={{width: '0%'}}
            animate={{width: '100%'}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>

      <motion.p
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.3, delay: 0.2}}
        className="mt-4 text-sm text-slate-400 animate-pulse relative z-10"
      >
        Loading...
      </motion.p>
    </div>
  )
}
