'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

type CheckInSuccessScreenProps = {
  checkpointTitle: string
  message: string
  redirectHref: string
}

export default function CheckInSuccessScreen({
  checkpointTitle,
  message,
  redirectHref,
}: CheckInSuccessScreenProps) {
  const router = useRouter()
  const [isReadyToContinue, setIsReadyToContinue] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsReadyToContinue(true)
    }, 1200)

    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <button
      type="button"
      onClick={() => {
        if (isReadyToContinue) {
          router.replace(redirectHref)
        }
      }}
      disabled={!isReadyToContinue}
      className={`relative flex min-h-screen w-full appearance-none items-center justify-center overflow-hidden border-0 bg-transparent px-4 py-10 text-left transition focus:outline-none ${
        isReadyToContinue ? 'cursor-pointer' : 'cursor-default'
      }`}
      aria-label="Return to Rewards Portal"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_36%),radial-gradient(circle_at_bottom,rgba(212,100,118,0.16),transparent_32%),linear-gradient(180deg,#0b060c,#120712)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 mx-auto w-full max-w-2xl rounded-[32px] border border-emerald-400/20 bg-[linear-gradient(180deg,rgba(15,38,30,0.9),rgba(9,21,17,0.92))] px-8 py-10 text-center shadow-[0_32px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10"
        >
          <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true">
            <motion.circle
              cx="60"
              cy="60"
              r="42"
              fill="none"
              stroke="rgba(110, 231, 183, 0.28)"
              strokeWidth="6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <motion.path
              d="M38 61.5L53 76L84 45"
              fill="none"
              stroke="#86efac"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.45, duration: 0.55, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          className="mt-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
            Check-In Complete
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">Attendance recorded</h1>
          <p className="mt-4 text-lg text-emerald-50/88">{message}</p>
          <p className="mt-3 text-sm text-emerald-100/70">{checkpointTitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="mt-10"
        >
          <div className="rounded-[22px] border border-emerald-300/16 bg-white/5 px-5 py-4">
            <p className="text-sm text-[rgba(240,253,244,0.8)]">
              {isReadyToContinue
                ? 'Tap anywhere to return to the Rewards Portal and view your latest points.'
                : 'Preparing your updated rewards snapshot.'}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: isReadyToContinue ? 1 : 0,
                y: isReadyToContinue ? 0 : 8,
              }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="mt-4 inline-flex items-center rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100"
            >
              Continue to portal
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </button>
  )
}
