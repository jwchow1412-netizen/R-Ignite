import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowUpRight,
  Gift,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  attendanceCheckpoints,
  luckyDrawMinimumPoints,
} from '@/lib/rewards'
import {
  buildCheckInQrDataUrl,
  buildCheckInUrl,
  getDisplayName,
  getRequestOrigin,
  hasRewardsQrSecret,
  isMissingRelationError,
  requireAdminRewardsUser,
} from '@/lib/rewards-server'

import {
  recordManualAttendance,
  reviewRewardSubmission,
  runLuckyDraw,
} from '../actions'

export const metadata = {
  title: 'Rewards Admin | MASA Hackathon 2026: R-Ignite',
}

type AdminPageProps = {
  searchParams?: {
    message?: string | string[]
  }
}

type PendingSubmissionRow = {
  id: string
  proof_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  participant: {
    full_name: string | null
    email: string | null
  } | null
  task: {
    title: string
    points: number
    type: string
  } | null
}

type AttendanceScanWithParticipant = {
  id: string
  checkpoint_name: string
  points_awarded: number
  created_at: string
  participant: {
    full_name: string | null
    email: string | null
  } | null
}

type LuckyDrawResultWithWinner = {
  id: string
  draw_label: string
  winner_points: number
  created_at: string
  winner: {
    full_name: string | null
    email: string | null
  } | null
}

type EligibleParticipant = {
  id: string
  full_name: string | null
  email: string | null
  total_points: number
  is_checked_in: boolean
}

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function takeFirst<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default async function RewardsAdminPage({ searchParams }: AdminPageProps) {
  const message = getValue(searchParams?.message)
  const origin = getRequestOrigin()
  const qrReady = hasRewardsQrSecret()
  const { supabase, profile } = await requireAdminRewardsUser('/rewards/admin')

  const [
    pendingSubmissionsResult,
    checkedInResult,
    eligibleParticipantsResult,
    recentScansResult,
    recentDrawsResult,
  ] = await Promise.all([
    supabase
      .from('submissions')
      .select(
        'id, proof_url, status, created_at, participant:profiles!submissions_user_id_fkey(full_name, email), task:tasks(title, points, type)'
      )
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(12),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_checked_in', true),
    supabase
      .from('profiles')
      .select('id, full_name, email, total_points, is_checked_in')
      .eq('is_checked_in', true)
      .gte('total_points', luckyDrawMinimumPoints)
      .order('total_points', { ascending: false })
      .limit(12),
    supabase
      .from('attendance_scans')
      .select(
        'id, checkpoint_name, points_awarded, created_at, participant:profiles!attendance_scans_user_id_fkey(full_name, email)'
      )
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('lucky_draw_results')
      .select(
        'id, draw_label, winner_points, created_at, winner:profiles!lucky_draw_results_winner_id_fkey(full_name, email)'
      )
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const schemaReady =
    !pendingSubmissionsResult.error ||
    !checkedInResult.error ||
    !eligibleParticipantsResult.error ||
    !recentScansResult.error ||
    !recentDrawsResult.error

  const setupMessage =
    [
      pendingSubmissionsResult.error,
      checkedInResult.error,
      eligibleParticipantsResult.error,
      recentScansResult.error,
      recentDrawsResult.error,
    ].find((error) => error && isMissingRelationError(error)) != null
      ? 'Admin tools need the latest rewards schema before moderation, attendance scans, and lucky draw history can go live.'
      : null

  const pendingSubmissions = ((pendingSubmissionsResult.data ?? []) as Array<{
    id: string
    proof_url: string | null
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    participant:
      | {
          full_name: string | null
          email: string | null
        }
      | {
          full_name: string | null
          email: string | null
        }[]
      | null
    task:
      | {
          title: string
          points: number
          type: string
        }
      | {
          title: string
          points: number
          type: string
        }[]
      | null
  }>).map((submission) => ({
    ...submission,
    participant: takeFirst(submission.participant),
    task: takeFirst(submission.task),
  })) as PendingSubmissionRow[]
  const checkedInCount = checkedInResult.count ?? 0
  const eligibleParticipants = (eligibleParticipantsResult.data ?? []) as EligibleParticipant[]
  const recentScans = ((recentScansResult.data ?? []) as Array<{
    id: string
    checkpoint_name: string
    points_awarded: number
    created_at: string
    participant:
      | {
          full_name: string | null
          email: string | null
        }
      | {
          full_name: string | null
          email: string | null
        }[]
      | null
  }>).map((scan) => ({
    ...scan,
    participant: takeFirst(scan.participant),
  })) as AttendanceScanWithParticipant[]
  const recentDraws = ((recentDrawsResult.data ?? []) as Array<{
    id: string
    draw_label: string
    winner_points: number
    created_at: string
    winner:
      | {
          full_name: string | null
          email: string | null
        }
      | {
          full_name: string | null
          email: string | null
        }[]
      | null
  }>).map((draw) => ({
    ...draw,
    winner: takeFirst(draw.winner),
  })) as LuckyDrawResultWithWinner[]
  const qrCards = await Promise.all(
    attendanceCheckpoints.map(async (checkpoint) => ({
      checkpoint,
      url: buildCheckInUrl(origin, checkpoint),
      qrDataUrl: await buildCheckInQrDataUrl(origin, checkpoint),
    }))
  )

  if (!schemaReady && setupMessage) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="glass-panel p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.58)]">
            Rewards Admin
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Schema setup still required</h1>
          <p className="mt-4 text-[rgba(248,244,246,0.8)]">{setupMessage}</p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/rewards">Back to Rewards</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_top_left,rgba(212,100,118,0.24),transparent_36%),radial-gradient(circle_at_top_right,rgba(244,165,96,0.16),transparent_28%)]" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <section className="glass-panel overflow-hidden p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-5">
              <span className="badge-soft">
                <ShieldCheck className="h-4 w-4" />
                Admin Operations
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.58)]">
                  MASA Hackathon 2026: R-Ignite
                </p>
                <h1 className="mt-3 text-4xl font-bold text-white">
                  Moderate submissions, manage event attendance, and run the lucky draw live.
                </h1>
                <p className="mt-3 max-w-3xl text-[rgba(248,244,246,0.8)]">
                  This admin workspace is scoped to organisers. It keeps moderation, QR operations, and
                  winner selection inside the same rewards system participants already use.
                </p>
              </div>

              {message ? (
                <div className="rounded-2xl border border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.1)] px-4 py-3 text-sm text-[#ffd6dd]">
                  {message}
                </div>
              ) : null}

              {setupMessage ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[rgba(248,244,246,0.8)]">
                  {setupMessage}
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-sm text-[rgba(248,244,246,0.62)]">Pending submissions</p>
                <p className="mt-2 text-3xl font-bold text-white">{pendingSubmissions.length}</p>
                <p className="mt-2 text-sm text-[rgba(248,244,246,0.72)]">Awaiting approve or reject review.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-sm text-[rgba(248,244,246,0.62)]">Checked-in participants</p>
                <p className="mt-2 text-3xl font-bold text-white">{checkedInCount}</p>
                <p className="mt-2 text-sm text-[rgba(248,244,246,0.72)]">Physical attendance recorded.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-sm text-[rgba(248,244,246,0.62)]">Eligible lucky draw pool</p>
                <p className="mt-2 text-3xl font-bold text-white">{eligibleParticipants.length}</p>
                <p className="mt-2 text-sm text-[rgba(248,244,246,0.72)]">
                  Checked in and at least {luckyDrawMinimumPoints} points.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-sm text-[rgba(248,244,246,0.62)]">Signed in as</p>
                <p className="mt-2 text-xl font-bold text-white">
                  {getDisplayName(profile.full_name, profile.email)}
                </p>
                <p className="mt-2 text-sm text-[rgba(248,244,246,0.72)]">Admin role confirmed.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.25fr,0.75fr]">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-[rgba(212,100,118,0.12)] p-3 text-[#ffd3da]">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-[rgba(248,244,246,0.58)]">
                  Moderation queue
                </p>
                <h2 className="text-2xl text-white">Review reward evidence submissions</h2>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {pendingSubmissions.length > 0 ? (
                pendingSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.64)]">
                            {submission.task?.type ?? 'task'}
                          </span>
                          <span className="rounded-full border border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.08)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ffd0d7]">
                            Pending
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {submission.task?.title ?? 'Submission'}
                        </h3>
                        <p className="text-sm text-[rgba(248,244,246,0.72)]">
                          {getDisplayName(
                            submission.participant?.full_name,
                            submission.participant?.email
                          )}{' '}
                          · {submission.participant?.email ?? 'No email'} · {submission.task?.points ?? 0} pts
                        </p>
                        {submission.proof_url ? (
                          <Link
                            href={submission.proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffd5dc] hover:text-white"
                          >
                            View proof
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <p className="text-sm text-[rgba(248,244,246,0.62)]">No proof URL attached.</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <form action={reviewRewardSubmission}>
                          <input type="hidden" name="submissionId" value={submission.id} />
                          <input type="hidden" name="decision" value="approved" />
                          <Button type="submit">Approve</Button>
                        </form>
                        <form action={reviewRewardSubmission}>
                          <input type="hidden" name="submissionId" value={submission.id} />
                          <input type="hidden" name="decision" value="rejected" />
                          <Button type="submit" variant="secondary">
                            Reject
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[rgba(248,244,246,0.72)]">
                  No pending submissions right now.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.06)] p-3 text-white">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[rgba(248,244,246,0.58)]">
                    Lucky draw
                  </p>
                  <h2 className="text-2xl text-white">Run the live winner selection</h2>
                </div>
              </div>

              <form action={runLuckyDraw} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="drawLabel">Draw label</Label>
                  <Input
                    id="drawLabel"
                    name="drawLabel"
                    placeholder="MASA Hackathon 2026: R-Ignite Lucky Draw"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Sparkles className="h-4 w-4" />
                  Draw Winner
                </Button>
              </form>

              <div className="mt-5 space-y-3">
                {recentDraws.length > 0 ? (
                  recentDraws.map((result) => (
                    <div
                      key={result.id}
                      className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4"
                    >
                      <p className="text-sm text-[rgba(248,244,246,0.62)]">{result.draw_label}</p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {getDisplayName(result.winner?.full_name, result.winner?.email)}
                      </p>
                      <p className="mt-1 text-sm text-[rgba(248,244,246,0.72)]">
                        {result.winner_points} points
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[rgba(248,244,246,0.72)]">
                    No lucky draw winners recorded yet.
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.06)] p-3 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[rgba(248,244,246,0.58)]">
                    Eligible participants
                  </p>
                  <h2 className="text-2xl text-white">Current draw pool</h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {eligibleParticipants.length > 0 ? (
                  eligibleParticipants.map((participant, index) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm text-[rgba(248,244,246,0.58)]">#{index + 1}</p>
                        <p className="text-base font-semibold text-white">
                          {getDisplayName(participant.full_name, participant.email)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-white">{participant.total_points}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-[rgba(248,244,246,0.55)]">
                          points
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[rgba(248,244,246,0.72)]">
                    No participants meet the current lucky draw rules yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-[rgba(212,100,118,0.12)] p-3 text-[#ffd3da]">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-[rgba(248,244,246,0.58)]">
                  QR operations
                </p>
                <h2 className="text-2xl text-white">Generate participant check-in links</h2>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {qrCards.map(({ checkpoint, url, qrDataUrl }) => {

                return (
                  <div
                    key={checkpoint.slug}
                    className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{checkpoint.title}</p>
                        <p className="mt-1 text-sm text-[rgba(248,244,246,0.72)]">{checkpoint.description}</p>
                      </div>
                      <span className="rounded-full border border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffd0d7]">
                        {checkpoint.points > 0 ? `+${checkpoint.points} pts` : 'Attendance gate'}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[240px,1fr] lg:items-start">
                      <div className="flex justify-center rounded-2xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.02)] p-4">
                        {qrDataUrl ? (
                          <Image
                            src={qrDataUrl}
                            alt={`${checkpoint.title} QR code`}
                            width={220}
                            height={220}
                            className="rounded-xl"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] text-center text-sm text-[rgba(248,244,246,0.7)]">
                            Set `REWARDS_QR_SECRET` to generate QR codes.
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                      <Label htmlFor={checkpoint.slug}>Check-in URL</Label>
                      <Input
                        id={checkpoint.slug}
                        readOnly
                        value={url ?? 'Set REWARDS_QR_SECRET to generate signed QR links.'}
                      />
                        <p className="text-sm text-[rgba(248,244,246,0.68)]">
                          Display this QR code at the venue. Participants scan it, log in if needed, and confirm attendance on their phone.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {!qrReady ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[rgba(248,244,246,0.78)]">
                Add `REWARDS_QR_SECRET` to the environment before generating live QR links.
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.06)] p-3 text-white">
                  <ScanLine className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[rgba(248,244,246,0.58)]">
                    Manual fallback
                  </p>
                  <h2 className="text-2xl text-white">Record attendance without QR</h2>
                </div>
              </div>

              <form action={recordManualAttendance} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Participant email</Label>
                  <Input id="email" name="email" type="email" placeholder="participant@university.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkpointSlug">Checkpoint</Label>
                  <select
                    id="checkpointSlug"
                    name="checkpointSlug"
                    className="flex h-10 w-full rounded-md border border-[rgba(248,244,246,0.15)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    defaultValue={attendanceCheckpoints[0]?.slug}
                  >
                    {attendanceCheckpoints.map((checkpoint) => (
                      <option key={checkpoint.slug} value={checkpoint.slug} className="bg-[#120712]">
                        {checkpoint.title}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Record Attendance
                </Button>
              </form>
            </div>

            <div className="glass-panel p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.06)] p-3 text-white">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[rgba(248,244,246,0.58)]">
                    Recent scans
                  </p>
                  <h2 className="text-2xl text-white">Latest attendance activity</h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {recentScans.length > 0 ? (
                  recentScans.map((scan) => (
                    <div
                      key={scan.id}
                      className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3"
                    >
                      <p className="text-base font-semibold text-white">
                        {getDisplayName(scan.participant?.full_name, scan.participant?.email)}
                      </p>
                      <p className="mt-1 text-sm text-[rgba(248,244,246,0.72)]">
                        {scan.checkpoint_name} · {scan.points_awarded} pts
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm text-[rgba(248,244,246,0.72)]">
                    No attendance scans recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/rewards">
              Participant view
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/faq">
              Event FAQ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
