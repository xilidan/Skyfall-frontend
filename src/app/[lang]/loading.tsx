'use client'
import {motion} from 'framer-motion'
import {useEffect, useState} from 'react'

export default function Loading() {
  const [mousePosition, setMousePosition] = useState({x: 50, y: 50})

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({x, y})
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_120%,rgba(8,47,73,0.4),transparent)]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,black_70%,transparent)]" />

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div
          className="absolute inset-0 transition-opacity duration-300 ease-out"
          style={{
            background: `radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.08), transparent 70%)`,
            opacity: 1,
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            background: `radial-gradient(circle 400px at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.12), transparent 60%)`,
            opacity: 1,
          }}
        />
      </div>

      <motion.div
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.5, ease: 'easeOut'}}
        className="mb-12 relative z-10"
      >
        <motion.h1
          animate={{
            backgroundPosition: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-size-[200%_auto]"
          style={{
            backgroundImage: 'linear-gradient(90deg, #818cf8, #a78bfa, #06b6d4, #a78bfa, #818cf8)',
          }}
        >
          Skyfall AI
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4, delay: 0.1}}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative h-2.5 bg-slate-800/60 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full shadow-lg shadow-indigo-900/30"
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

      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.4, delay: 0.2}}
        className="mt-6 relative z-10"
      >
        <motion.p
          animate={{opacity: [0.5, 1, 0.5]}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-sm font-medium text-slate-300"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  )
}
