import { QrCode, ShieldCheck, Sparkles } from 'lucide-react'
import { redirect } from 'next/navigation'

import CheckInSuccessScreen from '@/components/CheckInSuccessScreen'
import { Button } from '@/components/ui/button'
import {
  getAttendanceCheckpoint,
  getCheckInSuccessMessage,
  luckyDrawMinimumPoints,
} from '@/lib/rewards'
import {
  buildCheckInPath,
  getCheckInRedirectPath,
  getLuckyDrawEligibilityMessage,
  getRequestOrigin,
  hasRewardsQrSecret,
  syncRewardsProfile,
  verifyCheckInToken,
} from '@/lib/rewards-server'
import { createClient } from '@/utils/supabase/server'

import { completeRewardsCheckIn } from '../actions'

export const metadata = {
  title: 'Event Check-In | MASA Hackathon 2026: R-Ignite',
}

type CheckInPageProps = {
  searchParams?: {
    checkpoint?: string | string[]
    token?: string | string[]
    status?: string | string[]
    message?: string | string[]
  }
}

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function RewardsCheckInPage({ searchParams }: CheckInPageProps) {
  const checkpointSlug = getValue(searchParams?.checkpoint)
  const token = getValue(searchParams?.token) ?? ''
  const status = getValue(searchParams?.status) ?? 'info'
  const message = getValue(searchParams?.message)
  const checkpoint = getAttendanceCheckpoint(checkpointSlug)

  if (!checkpoint) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <div className="glass-panel p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Invalid check-in link</h1>
          <p className="mt-3 text-[rgba(248,244,246,0.78)]">
            This QR code does not match a configured MASA Hackathon 2026: R-Ignite checkpoint.
          </p>
        </div>
      </div>
    )
  }

  if (!hasRewardsQrSecret() || !verifyCheckInToken(checkpoint.slug, token)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <div className="glass-panel p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Check-in token unavailable</h1>
          <p className="mt-3 text-[rgba(248,244,246,0.78)]">
            Ask an organiser for the latest QR code or check-in link.
          </p>
        </div>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const path = buildCheckInPath(checkpoint)
    redirect(`/login?next=${encodeURIComponent(path ?? '/rewards/check-in')}`)
  }

  const { data: attendanceRecord } = await supabase
    .from('attendance_scans')
    .select('id')
    .eq('user_id', user.id)
    .eq('checkpoint_slug', checkpoint.slug)
    .maybeSingle()

  if (attendanceRecord && status !== 'success') {
    redirect(
      `/rewards?message=${encodeURIComponent(
        `You have already checked in for ${checkpoint.title}.`
      )}`
    )
  }

  const { profile, displayName } = await syncRewardsProfile(user)
  const eligibilityMessage = getLuckyDrawEligibilityMessage(
    profile?.total_points ?? 0,
    profile?.is_checked_in ?? false
  )
  const isSuccess = status === 'success'
  const requestOrigin = getRequestOrigin()
  const refreshPath =
    buildCheckInPath(checkpoint) ?? getCheckInRedirectPath(checkpoint.slug, token, '')

  if (isSuccess) {
    return (
      <CheckInSuccessScreen
        checkpointTitle={checkpoint.title}
        message={message ?? getCheckInSuccessMessage(checkpoint)}
        redirectHref={`/rewards?message=${encodeURIComponent(
          message ?? getCheckInSuccessMessage(checkpoint)
        )}`}
      />
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(212,100,118,0.18),transparent_40%)]" />
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-18">
        <section className="glass-panel overflow-hidden p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="space-y-5">
              <span className="badge-soft">
                <QrCode className="h-4 w-4" />
                Live Event Check-In
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.6)]">
                  MASA Hackathon 2026: R-Ignite
                </p>
                <h1 className="mt-3 text-4xl font-bold text-white">{checkpoint.title}</h1>
                <p className="mt-3 max-w-2xl text-[rgba(248,244,246,0.78)]">{checkpoint.description}</p>
              </div>

              {message ? (
                <div className="rounded-2xl border border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.1)] px-4 py-3 text-sm text-[#ffd6dd]">
                  {message}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                  <p className="text-sm text-[rgba(248,244,246,0.62)]">Signed in as</p>
                  <p className="mt-2 text-xl font-semibold text-white">{displayName}</p>
                  <p className="mt-2 text-sm text-[rgba(248,244,246,0.72)]">{user.email}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                  <p className="text-sm text-[rgba(248,244,246,0.62)]">Reward effect</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {checkpoint.points > 0 ? `+${checkpoint.points} points` : 'Attendance required'}
                  </p>
                  <p className="mt-2 text-sm text-[rgba(248,244,246,0.72)]">
                    {checkpoint.setsCheckedIn
                      ? `This scan marks you as physically present for lucky draw eligibility above ${luckyDrawMinimumPoints} points.`
                      : 'This scan confirms your workshop participation.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-[rgba(212,100,118,0.12)] p-3 text-[#ffd3da]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[rgba(248,244,246,0.58)]">
                    Confirmation
                  </p>
                  <h2 className="text-2xl text-white">Ready to record attendance</h2>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-sm text-[rgba(248,244,246,0.62)]">Current eligibility snapshot</p>
                <p className="mt-2 text-base font-semibold text-white">{eligibilityMessage}</p>
                <p className="mt-2 text-sm text-[rgba(248,244,246,0.72)]">
                  If the scan succeeds, your rewards profile will refresh immediately.
                </p>
              </div>

              <form action={completeRewardsCheckIn} className="mt-6 space-y-4">
                <input type="hidden" name="checkpointSlug" value={checkpoint.slug} />
                <input type="hidden" name="token" value={token} />
                <Button type="submit" size="lg" className="w-full">
                  <Sparkles className="h-4 w-4" />
                  Confirm Check-In
                </Button>
              </form>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="secondary" className="flex-1">
                  <a href={`${requestOrigin}/rewards`}>Back to Rewards</a>
                </Button>
                <Button asChild variant="secondary" className="flex-1">
                  <a href={`${requestOrigin}${refreshPath}`}>Refresh QR Page</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
