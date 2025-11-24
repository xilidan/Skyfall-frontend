'use client'
import {motion} from 'framer-motion'
import Image from 'next/image'

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100 flex flex-col items-center justify-center p-8">
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
            <Image src="/static/buy-logo.png" alt="Logo" width={72} height={72} className="rounded-2xl" priority />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3, delay: 0.1}}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Title skeleton */}
          <div className="space-y-3 mb-8">
            <motion.div
              className="h-8 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mx-auto"
              style={{width: '60%'}}
              animate={{
                backgroundPosition: ['0%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="h-4 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mx-auto"
              style={{width: '40%'}}
              animate={{
                backgroundPosition: ['0%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.2,
              }}
            />
          </div>

          {/* Form fields skeleton */}
          <div className="space-y-5">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"></div>
            </motion.div>
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.3}}>
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"></div>
            </motion.div>
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.4}}
              className="h-12 bg-linear-to-r from-blue-200 via-blue-300 to-blue-200 rounded-lg mt-6"
            />
          </div>

          {/* Bottom links skeleton */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.5}}
            className="mt-6 text-center"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3, delay: 0.2}}
        className="w-full max-w-sm mt-8"
      >
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full"
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
        transition={{duration: 0.3, delay: 0.3}}
        className="mt-4 text-sm text-gray-600 animate-pulse"
      >
        Loading...
      </motion.p>
    </div>
  )
}
