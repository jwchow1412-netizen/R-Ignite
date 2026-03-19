import { redirect } from 'next/navigation'

import RewardsPortalClient from '@/components/RewardsPortalClient'
import {
  giftTiers,
  luckyDrawDate,
  luckyDrawMinimumPoints,
  luckyDrawRules,
  rewardTaskBlueprints,
  type RewardTaskBlueprint,
} from '@/lib/rewards'
import { createClient } from '@/utils/supabase/server'

export const metadata = {
  title: 'Rewards | MASA Hackathon 2026: R-Ignite',
}

type RewardsPageProps = {
  searchParams?: {
    message?: string | string[]
    tab?: string | string[]
  }
}

type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  total_points: number
  is_checked_in: boolean
  role: string
}

type TaskRow = {
  id: string
  title: string
  description: string | null
  points: number
  type: string
  requires_proof: boolean
}

type SubmissionRow = {
  task_id: string
  proof_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  points_awarded: number
  created_at: string
}

type LeaderboardRow = {
  id: string
  email: string | null
  full_name: string | null
  total_points: number
  is_checked_in: boolean
}

type RewardsTask = RewardTaskBlueprint & {
  id: string
  source: 'live' | 'fallback'
}

function getDisplayName(fullName: string | null | undefined, email: string | null | undefined) {
  if (fullName?.trim()) {
    return fullName.trim()
  }

  if (email?.trim()) {
    return email.split('@')[0]
  }

  return 'Participant'
}

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function isMissingRelationError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false
  }

  return error.code === '42P01' || error.message?.toLowerCase().includes('relation') === true
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function defaultVerificationCopy(task: Pick<TaskRow, 'type' | 'requires_proof'>) {
  if (!task.requires_proof) {
    return task.type === 'attendance'
      ? 'Verified by organiser QR scan at the venue.'
      : 'Verified by organiser moderation.'
  }

  if (task.type === 'submission') {
    return 'Paste the submission confirmation or drive link for organiser review.'
  }

  return 'Paste a public post or proof link for organiser review.'
}

function defaultProofPlaceholder(task: Pick<TaskRow, 'type'>) {
  if (task.type === 'submission') {
    return 'https://drive.google.com/... or submission receipt URL'
  }

  return 'https://www.linkedin.com/... or screenshot drive link'
}

export default async function RewardsPage({ searchParams }: RewardsPageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=%2Frewards')
  }

  const displayName = getDisplayName(
    user.user_metadata?.full_name ?? user.user_metadata?.name,
    user.email
  )

  let profile: ProfileRow | null = null
  let profileReady = false
  let submissionsReady = false
  let liveTasksReady = false
  let leaderboardReady = false
  let setupMessage: string | null = null

  const { data: profileData, error: profileError } = await supabase
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

  if (!profileError && profileData) {
    profile = profileData as ProfileRow
    profileReady = true
  } else if (!isMissingRelationError(profileError)) {
    setupMessage = 'Profile sync is temporarily unavailable, but the portal is still visible.'
  }

  const { data: liveTasksData, error: liveTasksError } = await supabase
    .from('tasks')
    .select('id, title, description, points, type, requires_proof')
    .order('points', { ascending: false })

  if (!liveTasksError && liveTasksData) {
    liveTasksReady = true
  } else if (!isMissingRelationError(liveTasksError)) {
    setupMessage =
      setupMessage ??
      'Task configuration could not be loaded from Supabase. Showing the programme blueprint instead.'
  }

  const { data: submissionsData, error: submissionsError } = await supabase
    .from('submissions')
    .select('task_id, proof_url, status, points_awarded, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!submissionsError && submissionsData) {
    submissionsReady = true
  } else if (!isMissingRelationError(submissionsError)) {
    setupMessage =
      setupMessage ??
      'Submission history is temporarily unavailable. You can still review the reward structure below.'
  }

  const { data: leaderboardData, error: leaderboardError } = await supabase
    .from('profiles')
    .select('id, email, full_name, total_points, is_checked_in')
    .order('total_points', { ascending: false })
    .limit(5)

  if (!leaderboardError && leaderboardData) {
    leaderboardReady = true
  } else if (!isMissingRelationError(leaderboardError)) {
    setupMessage =
      setupMessage ??
      'Leaderboard data is temporarily unavailable. The rest of the rewards portal remains accessible.'
  }

  const liveTasks = (liveTasksData ?? []) as TaskRow[]
  const liveSubmissions = (submissionsData ?? []) as SubmissionRow[]
  const leaderboard = (leaderboardData ?? []) as LeaderboardRow[]

  const blueprintBySlug = new Map(rewardTaskBlueprints.map((task) => [task.slug, task]))

  const tasks: RewardsTask[] =
    liveTasksReady && liveTasks.length > 0
      ? liveTasks.map((task) => {
          const matchedBlueprint = blueprintBySlug.get(slugify(task.title))

          return {
            id: task.id,
            slug: matchedBlueprint?.slug ?? slugify(task.title),
            title: task.title,
            description:
              task.description ?? matchedBlueprint?.description ?? 'Reward criteria configured by organisers.',
            points: task.points,
            type: (task.type as RewardTaskBlueprint['type']) ?? 'social',
            requiresProof: task.requires_proof,
            verification: matchedBlueprint?.verification ?? defaultVerificationCopy(task),
            proofPlaceholder:
              matchedBlueprint?.proofPlaceholder ?? defaultProofPlaceholder(task),
            source: 'live',
          }
        })
      : rewardTaskBlueprints.map((task) => ({
          ...task,
          id: task.slug,
          source: 'fallback' as const,
        }))

  const submissionsByTaskId = new Map(liveSubmissions.map((submission) => [submission.task_id, submission]))
  const approvedPointsFromSubmissions = liveSubmissions.reduce((sum, submission) => {
    return submission.status === 'approved' ? sum + submission.points_awarded : sum
  }, 0)
  const currentPoints = profile?.total_points ?? approvedPointsFromSubmissions
  const checkedIn = profile?.is_checked_in ?? false
  const eligibleForLuckyDraw = checkedIn && currentPoints >= luckyDrawMinimumPoints
  const nextTier = giftTiers.find((tier) => currentPoints < tier.pointsRequired) ?? null
  const progressTarget = nextTier?.pointsRequired ?? giftTiers[giftTiers.length - 1].pointsRequired
  const progressPercent = Math.min((currentPoints / progressTarget) * 100, 100)
  const progressToLuckyDraw = Math.min((currentPoints / luckyDrawMinimumPoints) * 100, 100)
  const proofSubmissionEnabled = liveTasksReady && submissionsReady
  const message = getSearchParamValue(searchParams?.message)
  const initialTabParam = getSearchParamValue(searchParams?.tab)
  const initialTab =
    initialTabParam === 'my-submissions' || initialTabParam === 'leaderboard'
      ? initialTabParam
      : 'earn-points'

  const taskItems = tasks.map((task) => {
    const submission = submissionsByTaskId.get(task.id)
    const status: 'pending' | 'approved' | 'rejected' | 'not-started' | 'planned' = submission
      ? submission.status
      : task.source === 'live'
        ? 'not-started'
        : 'planned'

    return {
      ...task,
      status,
      proofUrl: submission?.proof_url ?? null,
    }
  })

  const leaderboardItems = leaderboard.map((entry) => ({
    id: entry.id,
    displayName: getDisplayName(entry.full_name, entry.email),
    totalPoints: entry.total_points,
    isCheckedIn: entry.is_checked_in,
  }))

  return (
    <RewardsPortalClient
      userId={user.id}
      displayName={displayName}
      email={user.email ?? null}
      currentPoints={currentPoints}
      checkedIn={checkedIn}
      eligibleForLuckyDraw={eligibleForLuckyDraw}
      nextTierName={nextTier?.name ?? null}
      remainingToNextTier={Math.max((nextTier?.pointsRequired ?? 0) - currentPoints, 0)}
      progressPercent={progressPercent}
      progressToLuckyDraw={progressToLuckyDraw}
      proofSubmissionEnabled={proofSubmissionEnabled}
      profileReady={profileReady}
      isAdmin={profile?.role === 'admin'}
      message={message ?? null}
      setupMessage={setupMessage}
      initialTab={initialTab}
      luckyDrawDate={luckyDrawDate}
      luckyDrawMinimumPoints={luckyDrawMinimumPoints}
      luckyDrawRules={luckyDrawRules}
      tasks={taskItems}
      tiers={giftTiers}
      leaderboard={leaderboardItems}
      leaderboardReady={leaderboardReady}
    />
  )
}
