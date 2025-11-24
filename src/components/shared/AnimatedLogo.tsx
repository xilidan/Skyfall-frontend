'use client'

import {motion} from 'framer-motion'

export function AnimatedLogo({className = ''}: {className?: string}) {
  return (
    <div className={`relative w-32 h-32 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Defs for gradients */}
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" /> {/* Blue-400 */}
            <stop offset="100%" stopColor="#A78BFA" /> {/* Purple-400 */}
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Connecting Lines */}
        <motion.g initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1, delay: 0.5}}>
          <motion.line
            x1="50"
            y1="50"
            x2="50"
            y2="20"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{pathLength: 0}}
            animate={{pathLength: 1}}
            transition={{duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut'}}
          />
          <motion.line
            x1="50"
            y1="50"
            x2="24"
            y2="65"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{pathLength: 0}}
            animate={{pathLength: 1}}
            transition={{duration: 1.5, delay: 0.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut'}}
          />
          <motion.line
            x1="50"
            y1="50"
            x2="76"
            y2="65"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{pathLength: 0}}
            animate={{pathLength: 1}}
            transition={{duration: 1.5, delay: 0.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut'}}
          />
        </motion.g>

        {/* Orbiting Nodes */}
        <motion.g
          animate={{rotate: 360}}
          transition={{duration: 10, repeat: Infinity, ease: 'linear'}}
          style={{originX: '50px', originY: '50px'}}
        >
          <circle cx="50" cy="20" r="4" fill="#60A5FA" className="drop-shadow-lg" />
          <circle cx="24" cy="65" r="4" fill="#A78BFA" className="drop-shadow-lg" />
          <circle cx="76" cy="65" r="4" fill="#34D399" className="drop-shadow-lg" />
        </motion.g>

        {/* Central Brain/Core */}
        <motion.circle
          cx="50"
          cy="50"
          r="15"
          fill="url(#brainGradient)"
          initial={{scale: 0}}
          animate={{scale: [1, 1.1, 1]}}
          transition={{duration: 3, repeat: Infinity, ease: 'easeInOut'}}
          className="drop-shadow-xl"
        />

        {/* Checkmark overlay */}
        <motion.path
          d="M42 50 L48 56 L58 44"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{pathLength: 0, opacity: 0}}
          animate={{pathLength: 1, opacity: 1}}
          transition={{duration: 0.8, delay: 1, repeat: Infinity, repeatDelay: 3}}
        />
      </svg>

      {/* Glow effect behind */}
      <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full -z-10 animate-pulse" />
    </div>
  )
}
