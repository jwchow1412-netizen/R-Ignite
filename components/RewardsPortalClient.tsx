'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  Gift,
  Lock,
  Trophy,
  ScanLine
} from 'lucide-react'
import { startTransition, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

import RewardsProofModal from '@/components/RewardsProofModal'
import RewardsQrScannerModal from '@/components/RewardsQrScannerModal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { submitDailyCheckIn } from '@/app/rewards/actions'

type RewardsTabId = 'earn-points' | 'my-submissions' | 'leaderboard'

type RewardsPortalTaskItem = {
  id: string
  slug: string
  title: string
  description: string
  points: number
  type: 'social' | 'community' | 'attendance' | 'submission'
  requiresProof: boolean
  verification: string
  proofPlaceholder?: string
  source: 'live' | 'fallback'
  status: 'pending' | 'approved' | 'rejected' | 'not-started' | 'planned'
  proofUrl: string | null
  imageUrl: string | null
}

type RewardsPortalLeaderboardItem = {
  id: string
  displayName: string
  totalPoints: number
  isCheckedIn: boolean
}

type RewardsPortalTierItem = {
  name: string
  pointsRequired: number
  reward: string
  note: string
}

type RewardsPortalClientProps = {
  userId: string
  displayName: string
  email: string | null
  currentPoints: number
  checkedIn: boolean
  dailyCheckInsCount: number
  lastCheckInDate: string | null
  eligibleForLuckyDraw: boolean
  nextTierName: string | null
  remainingToNextTier: number
  progressPercent: number
  progressToLuckyDraw: number
  proofSubmissionEnabled: boolean
  profileReady: boolean
  isAdmin: boolean
  message: string | null
  setupMessage: string | null
  initialTab: RewardsTabId
  luckyDrawDate: string
  luckyDrawMinimumPoints: number
  luckyDrawRules: string[]
  tasks: RewardsPortalTaskItem[]
  tiers: RewardsPortalTierItem[]
  claimedTierNames: string[]
  leaderboard: RewardsPortalLeaderboardItem[]
  leaderboardReady: boolean
  personalRank: number | null
  isPortalOpen?: boolean
}

const tabs: { id: RewardsTabId; label: string }[] = [
  { id: 'earn-points', label: 'Earn Points' },
  { id: 'my-submissions', label: 'My Submissions' },
  { id: 'leaderboard', label: 'Leaderboard' },
]

function getStorageKey(userId: string) {
  return `rignite:rewards:last-points:${userId}`
}

function getStatusTone(status: RewardsPortalTaskItem['status']) {
  if (status === 'approved') {
    return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
  }

  if (status === 'pending') {
    return 'border-[rgba(244,165,96,0.28)] bg-[rgba(244,165,96,0.08)] text-[#ffe8d4]'
  }

  if (status === 'rejected') {
    return 'border-rose-400/20 bg-rose-400/10 text-rose-100'
  }

  if (status === 'planned') {
    return 'border-white/10 bg-white/5 text-[rgba(248,244,246,0.58)]'
  }

  return 'border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.08)] text-[#ffd0d7]'
}

function getStatusLabel(status: RewardsPortalTaskItem['status']) {
  if (status === 'not-started') {
    return 'Not started'
  }

  return status
}

function getTypeLabel(type: RewardsPortalTaskItem['type']) {
  if (type === 'community') {
    return 'Community'
  }

  if (type === 'attendance') {
    return 'Attendance'
  }

  if (type === 'submission') {
    return 'Submission'
  }

  return 'Social'
}

function SubmitCheckInButton({ claimedToday }: { claimedToday: boolean }) {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit"
      disabled={claimedToday || pending}
      className={cn(
        "w-full h-14 rounded-full text-sm font-bold uppercase tracking-wide transition-all",
        claimedToday
          ? "bg-[#27151c] text-[#854b5a] shadow-none hover:bg-[#27151c]"
          : "bg-[#e11d48] text-white hover:bg-[#be123c] hover:-translate-y-0.5 shadow-[0_8px_30px_rgba(225,29,72,0.3)]"
      )}
    >
      {pending ? "Claiming..." : claimedToday ? "Claimed Today" : "Claim Daily Points"}
    </Button>
  )
}

export default function RewardsPortalClient({
  userId,
  currentPoints,
  dailyCheckInsCount,
  lastCheckInDate,
  eligibleForLuckyDraw,
  progressToLuckyDraw,
  proofSubmissionEnabled,
  isAdmin,
  message,
  setupMessage,
  initialTab,
  luckyDrawMinimumPoints,
  tasks,
  leaderboard,
  leaderboardReady,
  personalRank,
  isPortalOpen = true,
}: RewardsPortalClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<RewardsTabId>(initialTab)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  useEffect(() => {
    const storageKey = getStorageKey(userId)
    const previousValue = window.localStorage.getItem(storageKey)
    const previousPoints = previousValue ? Number.parseInt(previousValue, 10) : Number.NaN

    if (Number.isNaN(previousPoints)) {
      window.localStorage.setItem(storageKey, String(currentPoints))
      return
    }

    if (currentPoints > previousPoints) {
      window.localStorage.setItem(storageKey, String(currentPoints))
      return
    }

    window.localStorage.setItem(storageKey, String(currentPoints))
  }, [currentPoints, userId])

  useEffect(() => {
    const supabase = createClient()
    let refreshTimeoutId: number | null = null

    const scheduleRefresh = () => {
      if (refreshTimeoutId) {
        window.clearTimeout(refreshTimeoutId)
      }

      refreshTimeoutId = window.setTimeout(() => {
        startTransition(() => {
          router.refresh()
        })
      }, 220)
    }

    const channel = supabase
      .channel(`rewards-portal-${userId}`)
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, scheduleRefresh)
      .on(
        'postgres_changes' as any,
        { event: '*', schema: 'public', table: 'submissions', filter: `user_id=eq.${userId}` },
        scheduleRefresh
      )
      .on(
        'postgres_changes' as any,
        { event: '*', table: 'tier_redemptions', filter: `user_id=eq.${userId}` },
        scheduleRefresh
      )
      .subscribe()

    return () => {
      if (refreshTimeoutId) {
        window.clearTimeout(refreshTimeoutId)
      }

      void supabase.removeChannel(channel)
    }
  }, [router, userId])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel('public:tasks').on('postgres_changes' as any, { event: '*', schema: 'public', table: 'tasks' }, () => {
      router.refresh()
    }).subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [router])

  const todayStr = new Date().toISOString().split('T')[0]
  const lastCheckInStr = lastCheckInDate ? new Date(lastCheckInDate).toISOString().split('T')[0] : null
  const claimedToday = todayStr === lastCheckInStr
  // Generate the array of daily bubbles dynamically up to 30 days
  const totalDaysToShow = 30
  const daysArray = Array.from({ length: totalDaysToShow }, (_, i) => i + 1)

  if (!isPortalOpen) {
    return (
      <div className="relative flex min-h-[calc(100vh-140px)] items-center justify-center overflow-hidden px-4 bg-hero-gradient bg-fixed">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl p-8 text-center shadow-card md:p-12"
        >
          <motion.div
             animate={{ rotate: [-5, 5, -5] }}
             transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
             className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[rgba(212,100,118,0.12)] text-[#ffd3da] border border-[rgba(212,100,118,0.28)]"
          >
            <Lock className="h-10 w-10" />
          </motion.div>
          <p className="mb-3 text-3xl font-extrabold tracking-tight text-white">Rewards Portal Locked</p>
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-[rgba(248,244,246,0.72)]">
            The organisers have temporarily paused the Rewards Portal. Submissions, points, and the leaderboard are currently hidden.
            <br/><br/>
            Check Discord for updates on when the portal will formally reopen!
          </p>

          {isAdmin && (
             <div className="mt-8">
               <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white rounded-full h-12 px-6">
                 <Link href="/rewards/admin">Unlock in Admin Panel</Link>
               </Button>
             </div>
          )}
        </motion.div>
      </div>
    )
  }

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null
  const submissions = tasks.filter((task) =>
    ['pending', 'approved', 'rejected'].includes(task.status)
  )
  const isUserInTopFive = leaderboard.some((entry) => entry.id === userId)

  return (
    <div className="relative min-h-screen bg-[#0b060c] bg-hero-gradient bg-fixed pb-20">
      {/* Edge-to-Edge Banner */}
      <div className="w-full pointer-events-none [mask-image:linear-gradient(to_bottom,white_85%,transparent_100%)] relative z-0">
        <Image 
          src="/lucky-draw-banner.png" 
          alt="Lucky Draw Carnival Season" 
          width={1920}
          height={600}
          priority
          className="w-full h-auto"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-12 md:px-6 -mt-8 sm:-mt-16">

        {/* Daily Check-in Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl p-6 sm:p-8 relative"
        >
          <div className="absolute top-0 right-0 h-64 w-64 bg-[#ec7196] opacity-10 blur-[100px] pointer-events-none rounded-full" />

          <div className="mb-6 flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-black text-white">Daily Check-in</h2>
              <p className="mt-1 text-sm font-medium text-[rgba(248,244,246,0.68)]">Check in to accumulate points.</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-[#ff8ba7] glow-text">{currentPoints}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgba(248,244,246,0.58)]">Total Points</span>
            </div>
          </div>

          <div className="mb-6 flex justify-start gap-3 overflow-x-auto pb-6 pt-2 px-2 -mx-2 hide-scrollbar relative z-10">
            {daysArray.map((day) => {
              const isPast = day <= dailyCheckInsCount
              const isToday = day === dailyCheckInsCount + 1 && !claimedToday
              const pointsForDay = Math.ceil(day / 7) * 5
              
              return (
                <div 
                  key={day}
                  className={cn(
                    "flex min-w-[76px] flex-col items-center justify-center rounded-[20px] p-3 transition-all border shrink-0",
                    isPast ? "bg-[#132c22] border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.15)]" : 
                    isToday ? "bg-[#380e1b] border-[#e11d48] scale-105 shadow-[0_0_20px_rgba(225,29,72,0.3)]" : 
                    "bg-black border-[#27151c] opacity-80"
                  )}
                >
                  <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[rgba(248,244,246,0.58)]">
                    Day {day}
                  </span>
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full mb-1", 
                    isPast ? "bg-[#064e3b]" : isToday ? "bg-[#e11d48]/20" : "bg-[#180a10]"
                  )}>
                    {isPast ? (
                      <CheckCircle2 className="h-5 w-5 text-[#10b981]" />
                    ) : (
                      <Gift className={cn("h-5 w-5", isToday ? "text-[#e11d48]" : "text-[#3f1d2b]")} />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-black mt-1",
                    isPast ? "text-[#10b981]" : 
                    isToday ? "text-[#e11d48]" : 
                    "text-[#3f1d2b]"
                  )}>
                    +{pointsForDay}
                  </span>
                </div>
              )
            })}
          </div>

          <form action={submitDailyCheckIn} className="relative z-10">
            <SubmitCheckInButton claimedToday={claimedToday} />
          </form>
        </motion.div>

        {/* Dashboard Progress Cards */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          {/* Lucky Draw Status */}
          <div className="rounded-3xl border border-[#27151c] bg-black p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-32 w-32 bg-[#d46476] opacity-20 blur-[50px] pointer-events-none rounded-full" />
            <div className="flex items-center justify-between gap-2 relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[rgba(248,244,246,0.58)]">
                Lucky Draw
              </p>
              <span
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]',
                  eligibleForLuckyDraw
                    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                    : 'border-white/10 bg-white/5 text-[rgba(248,244,246,0.58)]'
                )}
              >
                {eligibleForLuckyDraw ? 'Eligible' : 'Pending'}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10 relative z-10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToLuckyDraw}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className={cn("h-full rounded-full", eligibleForLuckyDraw ? "bg-emerald-400" : "bg-[#f4a560]")}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-medium text-[rgba(248,244,246,0.68)] relative z-10">
               <span>🎯 200 points per lucky draw entry</span>
               <span>{luckyDrawMinimumPoints} pts min</span>
            </div>
            {eligibleForLuckyDraw && (
              <div className="mt-2 text-[11px] font-bold text-[#ffd0d7] relative z-10">
                Tickets: {1 + Math.floor(currentPoints / luckyDrawMinimumPoints)} 
                <span className="text-[rgba(248,244,246,0.58)] ml-1">(1 base + {Math.floor(currentPoints / luckyDrawMinimumPoints)} extra)</span>
              </div>
            )}
            <div className="mt-4 rounded-xl border border-[rgba(212,100,118,0.15)] bg-[rgba(212,100,118,0.05)] p-3 text-[10px] leading-relaxed text-[rgba(248,244,246,0.58)] relative z-10">
               <strong className="text-[#ffd0d7]">Disclaimer:</strong> Attending the Grand Final automatically secures your <strong>1 base entry</strong> to the lucky draw. This portal helps you earn <strong>additional entries</strong> for every 200 points accumulated!
            </div>
          </div>
        </motion.section>

        {/* Alerts */}
        {(message || setupMessage) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-3"
          >
            {message && (
              <div className="rounded-2xl border border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.1)] px-4 py-3 text-sm font-semibold text-[#ffd6dd]">
                {message}
              </div>
            )}
            {setupMessage && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[rgba(248,244,246,0.8)]">
                {setupMessage}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 flex w-full flex-wrap items-center gap-2 overflow-x-auto p-1 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative rounded-full px-5 py-2.5 text-sm font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#d46476]"
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-full border border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.15)] shadow-[0_0_15px_rgba(212,100,118,0.2)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={cn("relative z-10", activeTab === tab.id ? "text-white" : "text-[rgba(248,244,246,0.58)] hover:text-white")}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content Grid - No longer split into columns */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'earn-points' && (
              <motion.div
                key="earn-points"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="mb-4 px-1">
                  <h2 className="text-xl font-black text-white">Earn Points</h2>
                </div>

                <div className="grid gap-3">
                  {tasks.map((task, idx) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-[#27151c] bg-black p-5 transition-all hover:border-[#e11d48]/50 hover:bg-[#130a14]"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {task.imageUrl && (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#27151c] bg-[#180a10]">
                            <Image src={task.imageUrl} alt={task.title} fill className="object-cover" unoptimized={task.imageUrl.includes('supabase')} />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="inline-block rounded-full border border-[#27151c] bg-[#180a10] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[rgba(248,244,246,0.58)]">
                              {getTypeLabel(task.type)}
                            </span>
                            <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em]', getStatusTone(task.status))}>
                              {getStatusLabel(task.status)}
                            </span>
                          </div>
                          <h3 className="text-base font-bold leading-tight text-white line-clamp-1 group-hover:line-clamp-none transition-all">{task.title}</h3>
                          <p className="mt-1.5 text-xs text-[rgba(248,244,246,0.68)] hidden group-hover:block transition-all">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <span className="inline-flex items-center justify-center rounded-full border border-[#380e1b] bg-[#380e1b] px-3 py-1 text-sm font-black text-[#e11d48]">
                          +{task.points} pts
                        </span>
                        
                        {task.type === 'attendance' ? (
                          <Button
                            type="button"
                            size="sm"
                            className="rounded-full bg-[#e11d48] text-white hover:bg-[#be123c] transition-all font-black"
                            onClick={() => setIsScannerOpen(true)}
                            disabled={!isPortalOpen}
                          >
                            <ScanLine className="w-4 h-4 mr-1.5" />
                            {isPortalOpen ? 'Scan QR' : 'Locked'}
                          </Button>
                        ) : task.requiresProof && task.source === 'live' && proofSubmissionEnabled ? (
                          <Button
                            type="button"
                            size="sm"
                            className="rounded-full bg-white text-black hover:bg-gray-200 transition-all font-black"
                            onClick={() => setSelectedTaskId(task.id)}
                            disabled={!isPortalOpen}
                          >
                            {isPortalOpen ? (task.proofUrl ? 'Update' : 'Submit') : 'Locked'}
                          </Button>
                        ) : (
                          <div className="rounded-full bg-[#180a10] px-3 py-1.5 text-[10px] font-bold text-[rgba(248,244,246,0.58)]">
                            {task.requiresProof ? 'No Schema' : 'Auto'}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'my-submissions' && (
              <motion.div
                key="my-submissions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 px-1">
                  <h2 className="text-xl font-black text-white">My Submissions</h2>
                </div>

                {submissions.length > 0 ? (
                  <div className="grid gap-3">
                    {submissions.map((submission, idx) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-black/40 backdrop-blur-md p-4"
                      >
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em]', getStatusTone(submission.status))}>
                              {getStatusLabel(submission.status)}
                            </span>
                          </div>
                          <h3 className="text-sm font-black text-white line-clamp-1">{submission.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {submission.proofUrl && (
                            <Button asChild variant="outline" size="sm" className="h-8 rounded-full border-white/10 bg-white/5 font-bold text-white hover:bg-white/10">
                              <Link href={submission.proofUrl} target="_blank" rel="noopener noreferrer">
                                View
                              </Link>
                            </Button>
                          )}
                          {submission.requiresProof && proofSubmissionEnabled && (
                            <Button
                              type="button"
                              size="sm"
                              className="h-8 rounded-full bg-white text-black hover:bg-gray-200 font-bold"
                              onClick={() => setSelectedTaskId(submission.id)}
                              disabled={!isPortalOpen}
                            >
                              {isPortalOpen ? 'Update' : 'Locked'}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-[32px] border border-white/10 bg-black/40 py-16 text-center">
                    <div className="mb-4 rounded-2xl border border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.12)] p-4 text-[#ffd3da]">
                      <Gift className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-black text-white">No submissions yet</h3>
                    <p className="mt-1 text-sm font-medium text-[rgba(248,244,246,0.68)]">
                      Complete tasks to see them here.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 px-1">
                  <h2 className="text-xl font-black text-white">Leaderboard</h2>
                </div>

                {leaderboardReady && leaderboard.length > 0 ? (
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-md">
                      {leaderboard.map((entry, index) => (
                        <div 
                          key={entry.id} 
                          className={cn(
                            "flex items-center justify-between p-4 transition-colors hover:bg-white/5",
                            index !== leaderboard.length - 1 && "border-b border-white/5",
                            entry.id === userId && "bg-[rgba(212,100,118,0.1)]"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full font-black text-xs",
                              index === 0 ? "border border-amber-400/30 bg-amber-400/20 text-amber-200" :
                              index === 1 ? "border border-slate-300/30 bg-slate-300/20 text-slate-200" :
                              index === 2 ? "border border-orange-400/30 bg-orange-400/20 text-orange-200" :
                              "border border-white/10 bg-white/5 text-[rgba(248,244,246,0.58)]"
                            )}>
                              #{index + 1}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{entry.displayName}</p>
                              <span className={cn(
                                'mt-0.5 inline-flex rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]',
                                entry.isCheckedIn
                                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                                  : 'border-white/10 bg-white/5 text-[rgba(248,244,246,0.58)]'
                              )}>
                                {entry.isCheckedIn ? 'Checked in' : 'Unchecked'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-black text-[#ff8ba7] glow-text">{entry.totalPoints}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {personalRank && (
                      <div className="rounded-2xl border border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.08)] p-4 text-center text-sm font-bold text-[#ffd0d7]">
                        {isUserInTopFive
                          ? `🔥 You are in the top 5 at rank #${personalRank}!`
                          : `Your current rank is #${personalRank}. Keep going!`}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-[32px] border border-white/10 bg-black/40 p-10 text-center text-sm font-bold text-[rgba(248,244,246,0.58)]">
                    The leaderboard will appear once scores are available.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 w-full"
          >
            <Button asChild className="h-14 w-full rounded-full border border-white/10 bg-white/5 text-[rgba(248,244,246,0.72)] hover:bg-white/10 hover:text-white font-black shadow-sm backdrop-blur-md">
              <Link href="/rewards/admin" className="flex items-center justify-center gap-2">
                Organiser Admin Panel
                <Trophy className="h-5 w-5 text-[rgba(248,244,246,0.58)]" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>

      {selectedTask && proofSubmissionEnabled && selectedTask.requiresProof && (
        <RewardsProofModal
          onClose={() => setSelectedTaskId(null)}
          returnTab={activeTab}
          task={{
            id: selectedTask.id,
            title: selectedTask.title,
            description: selectedTask.description,
            verification: selectedTask.verification,
            proofPlaceholder: selectedTask.proofPlaceholder,
            existingProofUrl: selectedTask.proofUrl,
          }}
        />
      )}

      <RewardsQrScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
      />
    </div>
  )
}
