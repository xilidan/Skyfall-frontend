'use client'
import {motion} from 'framer-motion'
import Image from 'next/image'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{scale: 0.8, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.3, ease: 'easeOut'}}
        className="mb-8"
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
                'linear-gradient(45deg, #3b82f6, #8b5cf6, #10b981)',
                'linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6)',
                'linear-gradient(45deg, #8b5cf6, #10b981, #3b82f6)',
                'linear-gradient(45deg, #3b82f6, #8b5cf6, #10b981)',
              ],
            }}
            transition={{duration: 4, repeat: Infinity}}
            className="absolute -inset-4 rounded-3xl blur-lg opacity-60"
          />
          <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-gray-100">
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
        className="w-full max-w-sm"
      >
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full"
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
        className="mt-4 text-sm text-gray-600 animate-pulse"
      >
        Loading...
      </motion.p>
    </div>
  )
}
