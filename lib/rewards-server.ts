import 'server-only'

import { createHmac, randomInt, timingSafeEqual } from 'crypto'
import QRCode from 'qrcode'

import type { User } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  getAttendanceCheckpoint,
  luckyDrawMinimumPoints,
  type AttendanceCheckpoint,
} from '@/lib/rewards'
import { createClient } from '@/utils/supabase/server'

export type RewardsProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  total_points: number
  is_checked_in: boolean
  role: string
}

export type AttendanceScanRow = {
  id: string
  checkpoint_slug: string
  checkpoint_name: string
  points_awarded: number
  sets_checked_in: boolean
  created_at: string
}

export type LuckyDrawResultRow = {
  id: string
  draw_label: string
  winner_id: string
  winner_points: number
  min_points: number
  created_at: string
}

export function getDisplayName(fullName: string | null | undefined, email: string | null | undefined) {
  if (fullName?.trim()) {
    return fullName.trim()
  }

  if (email?.trim()) {
    return email.split('@')[0]
  }

  return 'Participant'
}

export function isMissingRelationError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false
  }

  return error.code === '42P01' || error.message?.toLowerCase().includes('relation') === true
}

export function getRequestOrigin() {
  const headerStore = headers()

  const originHeader = headerStore.get('origin')

  if (originHeader) {
    return originHeader
  }

  const forwardedProto = headerStore.get('x-forwarded-proto') ?? 'http'
  const forwardedHost = headerStore.get('x-forwarded-host') ?? headerStore.get('host')

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  const referer = headerStore.get('referer')

  if (referer) {
    return new URL(referer).origin
  }

  return 'http://localhost:3000'
}

export async function getAuthenticatedRewardsSession(nextPath: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }

  return { supabase, user }
}

export async function syncRewardsProfile(user: User) {
  const supabase = createClient()
  const displayName = getDisplayName(
    user.user_metadata?.full_name ?? user.user_metadata?.name,
    user.email
  )

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email ?? null,
        full_name: displayName,
      },
      {
        onConflict: 'id',
      }
    )
    .select('id, email, full_name, total_points, is_checked_in, role')
    .maybeSingle()

  return {
    profile: (data as RewardsProfileRow | null) ?? null,
    error,
    displayName,
  }
}

export async function requireAdminRewardsUser(nextPath = '/rewards/admin') {
  const { supabase, user } = await getAuthenticatedRewardsSession(nextPath)
  const { profile, error } = await syncRewardsProfile(user)

  if (error && isMissingRelationError(error)) {
    redirect(
      `/rewards?message=${encodeURIComponent(
        'Rewards admin tools require the latest Supabase rewards schema.'
      )}`
    )
  }

  if (!profile || profile.role !== 'admin') {
    redirect('/rewards?message=Admin access required.')
  }

  return { supabase, user, profile }
}

export function hasRewardsQrSecret() {
  return Boolean(process.env.REWARDS_QR_SECRET)
}

function signCheckpointSlug(slug: string) {
  const secret = process.env.REWARDS_QR_SECRET

  if (!secret) {
    return null
  }

  return createHmac('sha256', secret).update(slug).digest('hex')
}

export function buildCheckInPath(checkpoint: AttendanceCheckpoint) {
  const token = signCheckpointSlug(checkpoint.slug)

  if (!token) {
    return null
  }

  return `/rewards/check-in?checkpoint=${encodeURIComponent(checkpoint.slug)}&token=${token}`
}

export function buildCheckInUrl(origin: string, checkpoint: AttendanceCheckpoint) {
  const path = buildCheckInPath(checkpoint)

  if (!path) {
    return null
  }

  return `${origin}${path}`
}

export async function buildCheckInQrDataUrl(origin: string, checkpoint: AttendanceCheckpoint) {
  const url = buildCheckInUrl(origin, checkpoint)

  if (!url) {
    return null
  }

  return QRCode.toDataURL(url, {
    margin: 1,
    width: 240,
    color: {
      dark: '#ffffff',
      light: '#00000000',
    },
  })
}

export function verifyCheckInToken(checkpointSlug: string, token: string | null | undefined) {
  if (!token) {
    return false
  }

  const expected = signCheckpointSlug(checkpointSlug)

  if (!expected || expected.length !== token.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}

export function getLuckyDrawDefaultLabel() {
  return `MASA Hackathon 2026: R-Ignite Lucky Draw`
}

export function chooseLuckyDrawWinner<T>(participants: T[]) {
  if (participants.length === 0) {
    return null
  }

  return participants[randomInt(participants.length)]
}

export function getCheckInRedirectPath(
  checkpointSlug: string,
  token: string,
  message: string,
  status: 'info' | 'success' | 'error' = 'info'
) {
  return `/rewards/check-in?checkpoint=${encodeURIComponent(checkpointSlug)}&token=${token}&status=${status}&message=${encodeURIComponent(
    message
  )}`
}

export function getCheckpointBySlugOrRedirect(checkpointSlug: string | null | undefined) {
  const checkpoint = getAttendanceCheckpoint(checkpointSlug)

  if (!checkpoint) {
    redirect('/rewards?message=Invalid attendance checkpoint.')
  }

  return checkpoint
}

export function getLuckyDrawEligibilityMessage(points: number, isCheckedIn: boolean) {
  if (isCheckedIn && points >= luckyDrawMinimumPoints) {
    return 'Eligible for the current lucky draw pool.'
  }

  if (!isCheckedIn) {
    return 'Grand final check-in is still required.'
  }

  return `${Math.max(luckyDrawMinimumPoints - points, 0)} more approved points needed.`
}
