'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  Gift,
  QrCode,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import RewardsProofModal from '@/components/RewardsProofModal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  leaderboard: RewardsPortalLeaderboardItem[]
  leaderboardReady: boolean
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
    return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
  }

  if (status === 'pending') {
    return 'border-amber-300/30 bg-amber-300/10 text-amber-100'
  }

  if (status === 'rejected') {
    return 'border-rose-300/30 bg-rose-400/10 text-rose-100'
  }

  if (status === 'planned') {
    return 'border-white/12 bg-white/5 text-[rgba(248,244,246,0.62)]'
  }

  return 'border-white/12 bg-white/5 text-[rgba(248,244,246,0.74)]'
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

function getTierPillTone(unlocked: boolean) {
  return unlocked
    ? 'border-emerald-400/24 bg-emerald-400/10 text-emerald-100'
    : 'border-white/12 bg-white/5 text-[rgba(248,244,246,0.68)]'
}

export default function RewardsPortalClient({
  userId,
  displayName,
  email,
  currentPoints,
  checkedIn,
  eligibleForLuckyDraw,
  nextTierName,
  remainingToNextTier,
  progressPercent,
  progressToLuckyDraw,
  proofSubmissionEnabled,
  profileReady,
  isAdmin,
  message,
  setupMessage,
  initialTab,
  luckyDrawDate,
  luckyDrawMinimumPoints,
  luckyDrawRules,
  tasks,
  tiers,
  leaderboard,
  leaderboardReady,
}: RewardsPortalClientProps) {
  const [activeTab, setActiveTab] = useState<RewardsTabId>(initialTab)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [pointsDelta, setPointsDelta] = useState<number | null>(null)

  useEffect(() => {
    const storageKey = getStorageKey(userId)
    const previousValue = window.localStorage.getItem(storageKey)
    const previousPoints = previousValue ? Number.parseInt(previousValue, 10) : Number.NaN

    if (Number.isNaN(previousPoints)) {
      window.localStorage.setItem(storageKey, String(currentPoints))
      return
    }

    if (currentPoints > previousPoints) {
      setPointsDelta(currentPoints - previousPoints)
      window.localStorage.setItem(storageKey, String(currentPoints))

      const timeoutId = window.setTimeout(() => {
        setPointsDelta(null)
      }, 2600)

      return () => window.clearTimeout(timeoutId)
    }

    window.localStorage.setItem(storageKey, String(currentPoints))
  }, [currentPoints, userId])

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null
  const submissions = tasks.filter((task) =>
    ['pending', 'approved', 'rejected'].includes(task.status)
  )

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top_left,rgba(212,100,118,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(71,140,255,0.12),transparent_24%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgba(248,244,246,0.5)]">
              MASA Hackathon 2026: R-Ignite
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white md:text-3xl">Gamification & rewards</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[rgba(248,244,246,0.72)]">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                proofSubmissionEnabled ? 'bg-emerald-300' : 'bg-amber-300'
              )}
            />
            {proofSubmissionEnabled ? 'Live rewards data connected' : 'Blueprint mode'}
          </div>
        </div>

        <section className="sticky top-20 z-30 rounded-[22px] border border-white/10 bg-[rgba(12,9,18,0.84)] px-3 py-3 shadow-[0_22px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="grid gap-3 xl:grid-cols-[1.15fr_1fr_1fr_auto]">
            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.54)]">
                Participant
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{displayName}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[rgba(248,244,246,0.68)]">
                  {profileReady ? 'Live' : 'Preview'}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-[rgba(248,244,246,0.52)]">
                {email ?? 'Signed-in participant account'}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[rgba(212,100,118,0.18)] bg-[linear-gradient(135deg,rgba(157,31,67,0.18),rgba(244,143,116,0.08))] px-3 py-2.5">
              <AnimatePresence>
                {pointsDelta ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#ffd36f]/35 bg-[rgba(255,211,111,0.16)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fff0bc]"
                  >
                    <Sparkles className="h-3 w-3" />
                    +{pointsDelta}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.56)]">
                Total points
              </p>
              <div className="mt-1 flex items-end gap-2">
                <motion.p
                  key={currentPoints}
                  initial={pointsDelta ? { opacity: 0.7, y: 6 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="text-3xl font-semibold leading-none text-white"
                >
                  {currentPoints}
                </motion.p>
                <span className="pb-1 text-[11px] uppercase tracking-[0.18em] text-[rgba(248,244,246,0.5)]">
                  pts
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#d46476] via-[#ef8f74] to-[#ffd07b]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[rgba(248,244,246,0.68)]">
                {nextTierName ? `${remainingToNextTier} points to ${nextTierName}.` : 'Top tier reached.'}
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(99,194,255,0.16)] bg-[linear-gradient(135deg,rgba(35,81,121,0.18),rgba(73,166,255,0.06))] px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.56)]">
                  Lucky draw status
                </p>
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]',
                    eligibleForLuckyDraw
                      ? 'border-emerald-400/24 bg-emerald-400/10 text-emerald-100'
                      : 'border-white/12 bg-white/5 text-[rgba(248,244,246,0.72)]'
                  )}
                >
                  {eligibleForLuckyDraw ? 'Eligible' : 'Pending'}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]',
                    checkedIn
                      ? 'border-emerald-400/24 bg-emerald-400/10 text-emerald-100'
                      : 'border-amber-300/24 bg-amber-300/10 text-amber-100'
                  )}
                >
                  {checkedIn ? 'Checked in' : 'Attendance required'}
                </span>
                <span className="text-xs text-[rgba(248,244,246,0.64)]">
                  {luckyDrawMinimumPoints} point threshold
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2d6fa6] via-[#3ea2ff] to-[#7fd4ff]"
                  style={{ width: `${progressToLuckyDraw}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[rgba(248,244,246,0.68)]">
                {eligibleForLuckyDraw
                  ? `On track for the ${luckyDrawDate} live draw.`
                  : `Earn approved points and complete check-in to unlock entry.`}
              </p>
            </div>

            <div className="flex items-stretch gap-2 xl:flex-col xl:justify-between">
              {isAdmin ? (
                <Button asChild variant="secondary" size="sm" className="h-10 rounded-xl px-4">
                  <Link href="/rewards/admin">Admin Panel</Link>
                </Button>
              ) : null}
              <div className="flex flex-1 items-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-[rgba(248,244,246,0.66)] xl:flex-none">
                Compact rewards control surface
              </div>
            </div>
          </div>
        </section>

        {message || setupMessage ? (
          <div className="mt-3 space-y-2">
            {message ? (
              <div className="rounded-2xl border border-[rgba(212,100,118,0.24)] bg-[rgba(212,100,118,0.1)] px-3 py-2 text-sm text-[#ffd6dd]">
                {message}
              </div>
            ) : null}
            {setupMessage ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[rgba(248,244,246,0.78)]">
                {setupMessage}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[20px] border border-white/10 bg-[rgba(10,8,16,0.7)] p-1.5 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition',
                activeTab === tab.id
                  ? 'bg-[linear-gradient(135deg,rgba(159,31,67,0.9),rgba(212,100,118,0.88))] text-white shadow-[0_10px_24px_rgba(212,100,118,0.2)]'
                  : 'text-[rgba(248,244,246,0.62)] hover:bg-white/5 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto hidden text-[11px] uppercase tracking-[0.18em] text-[rgba(248,244,246,0.46)] md:block">
            Dense view · modal proof flow
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr,0.85fr]">
          <section className="rounded-[22px] border border-white/10 bg-[rgba(12,9,18,0.72)] p-3 shadow-[0_16px_44px_rgba(0,0,0,0.22)]">
            {activeTab === 'earn-points' ? (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.52)]">
                      Earn points
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-white">Complete tasks and submit proof fast</h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[rgba(248,244,246,0.62)]">
                    {tasks.length} tasks
                  </span>
                </div>

                <div className="overflow-x-auto rounded-[18px] border border-white/10">
                  <table className="min-w-[760px] w-full text-left">
                    <thead className="bg-[rgba(255,255,255,0.03)]">
                      <tr className="text-[10px] uppercase tracking-[0.18em] text-[rgba(248,244,246,0.45)]">
                        <th className="px-3 py-2 font-medium">Task</th>
                        <th className="px-3 py-2 font-medium">Points</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8">
                      {tasks.map((task) => (
                        <tr key={task.id} className="align-top">
                          <td className="px-3 py-2.5">
                            <div className="flex items-start gap-3">
                              <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.62)]">
                                {getTypeLabel(task.type)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-white">{task.title}</p>
                                  {task.source === 'fallback' ? (
                                    <span className="rounded-full border border-[rgba(212,100,118,0.24)] bg-[rgba(212,100,118,0.08)] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#ffd0d7]">
                                      Planned
                                    </span>
                                  ) : null}
                                </div>
                                <p className="mt-1 text-xs leading-5 text-[rgba(248,244,246,0.6)]">
                                  {task.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="inline-flex rounded-xl border border-[rgba(212,100,118,0.2)] bg-[rgba(212,100,118,0.1)] px-2.5 py-1 text-sm font-semibold text-white">
                              {task.points}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="space-y-1.5">
                              <span
                                className={cn(
                                  'inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]',
                                  getStatusTone(task.status)
                                )}
                              >
                                {getStatusLabel(task.status)}
                              </span>
                              {task.proofUrl ? (
                                <Link
                                  href={task.proofUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-[#ffd4db] transition hover:text-white"
                                >
                                  View proof
                                  <ArrowUpRight className="h-3 w-3" />
                                </Link>
                              ) : (
                                <p className="text-xs text-[rgba(248,244,246,0.46)]">{task.verification}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            {task.requiresProof && task.source === 'live' && proofSubmissionEnabled ? (
                              <Button
                                type="button"
                                size="sm"
                                className="h-8 rounded-xl px-3 text-xs"
                                onClick={() => setSelectedTaskId(task.id)}
                              >
                                {task.proofUrl ? 'Update proof' : 'Submit proof'}
                              </Button>
                            ) : task.requiresProof ? (
                              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[rgba(248,244,246,0.56)]">
                                Schema needed
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[rgba(248,244,246,0.56)]">
                                Venue QR
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {activeTab === 'my-submissions' ? (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.52)]">
                      My submissions
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-white">Track pending, approved, and rejected proof</h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[rgba(248,244,246,0.62)]">
                    {submissions.length} items
                  </span>
                </div>

                {submissions.length > 0 ? (
                  <div className="space-y-2">
                    {submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-white">{submission.title}</p>
                              <span
                                className={cn(
                                  'inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]',
                                  getStatusTone(submission.status)
                                )}
                              >
                                {getStatusLabel(submission.status)}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[rgba(248,244,246,0.58)]">
                              {submission.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {submission.proofUrl ? (
                              <Button asChild variant="secondary" size="sm" className="h-8 rounded-xl px-3 text-xs">
                                <Link href={submission.proofUrl} target="_blank" rel="noopener noreferrer">
                                  View proof
                                </Link>
                              </Button>
                            ) : null}
                            {submission.requiresProof && proofSubmissionEnabled ? (
                              <Button
                                type="button"
                                size="sm"
                                className="h-8 rounded-xl px-3 text-xs"
                                onClick={() => setSelectedTaskId(submission.id)}
                              >
                                Update
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-5 text-sm text-[rgba(248,244,246,0.72)]">
                    No proof submissions yet. Submit your first social or deliverable task from the Earn Points tab.
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === 'leaderboard' ? (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.52)]">
                      Leaderboard
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-white">See who is driving the most momentum</h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[rgba(248,244,246,0.62)]">
                    Top 5
                  </span>
                </div>

                {leaderboardReady && leaderboard.length > 0 ? (
                  <div className="overflow-hidden rounded-[18px] border border-white/10">
                    <table className="w-full">
                      <thead className="bg-[rgba(255,255,255,0.03)]">
                        <tr className="text-[10px] uppercase tracking-[0.18em] text-[rgba(248,244,246,0.45)]">
                          <th className="px-3 py-2 text-left font-medium">Rank</th>
                          <th className="px-3 py-2 text-left font-medium">Participant</th>
                          <th className="px-3 py-2 text-left font-medium">Attendance</th>
                          <th className="px-3 py-2 text-right font-medium">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/8">
                        {leaderboard.map((entry, index) => (
                          <tr key={entry.id}>
                            <td className="px-3 py-2.5 text-sm font-semibold text-white">#{index + 1}</td>
                            <td className="px-3 py-2.5 text-sm text-white">{entry.displayName}</td>
                            <td className="px-3 py-2.5">
                              <span
                                className={cn(
                                  'inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]',
                                  entry.isCheckedIn
                                    ? 'border-emerald-400/24 bg-emerald-400/10 text-emerald-100'
                                    : 'border-white/12 bg-white/5 text-[rgba(248,244,246,0.66)]'
                                )}
                              >
                                {entry.isCheckedIn ? 'Checked in' : 'Not checked in'}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right text-base font-semibold text-white">
                              {entry.totalPoints}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-5 text-sm text-[rgba(248,244,246,0.72)]">
                    The leaderboard will appear once organiser scoring data is available in Supabase.
                  </div>
                )}
              </div>
            ) : null}
          </section>

          <aside className="space-y-4">
            <div className="rounded-[22px] border border-white/10 bg-[rgba(12,9,18,0.72)] p-3">
              <div className="flex items-center gap-2">
                <div className="rounded-xl border border-white/10 bg-[rgba(212,100,118,0.12)] p-2 text-[#ffd3da]">
                  <Gift className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.52)]">
                    Redemption tiers
                  </p>
                  <h3 className="text-sm font-semibold text-white">Compact tier ladder</h3>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {tiers.map((tier) => {
                  const unlocked = currentPoints >= tier.pointsRequired

                  return (
                    <div
                      key={tier.name}
                      className="rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{tier.name}</p>
                          <p className="text-xs text-[rgba(248,244,246,0.62)]">{tier.reward}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">{tier.pointsRequired}</p>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-[rgba(248,244,246,0.5)]">
                            pts
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-xs text-[rgba(248,244,246,0.56)]">{tier.note}</p>
                        <span
                          className={cn(
                            'shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]',
                            getTierPillTone(unlocked)
                          )}
                        >
                          {unlocked ? 'Unlocked' : `${Math.max(tier.pointsRequired - currentPoints, 0)} left`}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-[rgba(12,9,18,0.72)] p-3">
              <div className="flex items-center gap-2">
                <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] p-2 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.52)]">
                    Lucky draw
                  </p>
                  <h3 className="text-sm font-semibold text-white">Eligibility checklist</h3>
                </div>
              </div>

              <ul className="mt-3 space-y-2">
                {luckyDrawRules.map((rule) => (
                  <li key={rule} className="flex gap-2 text-xs leading-5 text-[rgba(248,244,246,0.72)]">
                    <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ffb1be]" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-[rgba(12,9,18,0.72)] p-3">
              <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-[#ffd5dc]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.54)]">
                      Venue tasks
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-[rgba(248,244,246,0.72)]">
                    Attendance-based tasks are verified through live QR check-in instead of proof uploads.
                  </p>
                </div>

                <div className="rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[#ffd5dc]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.54)]">
                      Moderation
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-[rgba(248,244,246,0.72)]">
                    Online proofs stay pending until organisers review and approve them.
                  </p>
                </div>

                <div className="rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#ffd5dc]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.54)]">
                      Social push
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-[rgba(248,244,246,0.72)]">
                    Prioritise posts, comments, and deliverables to move up the leaderboard quickly.
                  </p>
                </div>
              </div>
            </div>

            {isAdmin ? (
              <Button asChild variant="secondary" className="h-10 w-full rounded-xl">
                <Link href="/rewards/admin">
                  Open admin workspace
                  <Trophy className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </aside>
        </div>
      </div>

      {selectedTask && proofSubmissionEnabled && selectedTask.requiresProof ? (
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
      ) : null}
    </div>
  )
}
