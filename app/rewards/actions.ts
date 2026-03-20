'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import {
  getAttendanceCheckpoint,
  getCheckInSuccessMessage,
  luckyDrawMinimumPoints,
} from '@/lib/rewards'
import {
  buildCheckInPath,
  chooseLuckyDrawWinner,
  getCheckInRedirectPath,
  getCheckpointBySlugOrRedirect,
  getLuckyDrawDefaultLabel,
  isMissingRelationError,
  requireAdminRewardsUser,
  syncRewardsProfile,
  verifyCheckInToken,
} from '@/lib/rewards-server'
import { createClient } from '@/utils/supabase/server'

function redirectWithMessage(message: string, tab?: string): never {
  const params = new URLSearchParams({ message })

  if (tab === 'earn-points' || tab === 'my-submissions' || tab === 'leaderboard') {
    params.set('tab', tab)
  }

  redirect(`/rewards?${params.toString()}`)
}

function redirectAdminMessage(message: string): never {
  redirect(`/rewards/admin?message=${encodeURIComponent(message)}`)
}

const MAX_PROOF_FILE_SIZE_BYTES = 6 * 1024 * 1024
const ALLOWED_PROOF_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif',
])

function isUploadableProofFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0
}

function getProofFileExtension(file: File) {
  const nameParts = file.name.split('.')
  const extension = nameParts.length > 1 ? nameParts.pop()?.toLowerCase() : null

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension
  }

  if (file.type === 'image/jpeg') {
    return 'jpg'
  }

  if (file.type === 'image/webp') {
    return 'webp'
  }

  if (file.type === 'image/heic') {
    return 'heic'
  }

  if (file.type === 'image/heif') {
    return 'heif'
  }

  return 'png'
}

export async function submitRewardProof(formData: FormData) {
  const taskId = String(formData.get('taskId') ?? '').trim()
  const proofUrl = String(formData.get('proofUrl') ?? '').trim()
  const returnTab = String(formData.get('returnTab') ?? '').trim()
  const proofFileEntry = formData.get('proofFile')
  const proofFile = isUploadableProofFile(proofFileEntry) ? proofFileEntry : null

  if (!taskId || (!proofUrl && !proofFile)) {
    redirectWithMessage('Add a public proof link or upload a screenshot before submitting.', returnTab)
  }

  if (proofUrl) {
    try {
      new URL(proofUrl)
    } catch {
      redirectWithMessage('Use a full proof URL starting with http:// or https://.', returnTab)
    }
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=%2Frewards')
  }

  let resolvedProofUrl = proofUrl

  if (proofFile) {
    if (!ALLOWED_PROOF_MIME_TYPES.has(proofFile.type)) {
      redirectWithMessage('Upload a PNG, JPG, WEBP, HEIC, or HEIF screenshot file.', returnTab)
    }

    if (proofFile.size > MAX_PROOF_FILE_SIZE_BYTES) {
      redirectWithMessage('Screenshot uploads must be 6 MB or smaller.', returnTab)
    }

    const fileExtension = getProofFileExtension(proofFile)
    const storagePath = `${user.id}/${taskId}/${Date.now()}-${randomUUID()}.${fileExtension}`
    const fileBuffer = new Uint8Array(await proofFile.arrayBuffer())

    const { error: uploadError } = await supabase.storage.from('proofs').upload(storagePath, fileBuffer, {
      contentType: proofFile.type,
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadError) {
      redirectWithMessage(
        'Could not upload the screenshot proof. Check that the proofs bucket and storage policies are ready.',
        returnTab
      )
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('proofs').getPublicUrl(storagePath)

    resolvedProofUrl = publicUrl
  }

  const { error } = await supabase.from('submissions').upsert(
    {
      user_id: user.id,
      task_id: taskId,
      proof_url: resolvedProofUrl,
      status: 'pending',
      points_awarded: 0,
    },
    {
      onConflict: 'user_id,task_id',
    }
  )

  if (error) {
    if (error.code === '42P01') {
      redirectWithMessage(
        'Rewards submissions are not live yet. Apply the Supabase rewards schema first.',
        returnTab
      )
    }

    redirectWithMessage('Could not submit proof right now. Please try again.', returnTab)
  }

  revalidatePath('/rewards')
  redirectWithMessage(
    proofFile
      ? 'Screenshot proof uploaded. The organiser team can now review it.'
      : 'Proof submitted. The organiser team can now review it.',
    returnTab
  )
}

export async function reviewRewardSubmission(formData: FormData) {
  const submissionId = String(formData.get('submissionId') ?? '').trim()
  const decision = String(formData.get('decision') ?? '').trim()

  if (!submissionId || !['approved', 'rejected'].includes(decision)) {
    redirectAdminMessage('Invalid moderation request.')
  }

  const { supabase } = await requireAdminRewardsUser('/rewards/admin')

  const { error } = await supabase
    .from('submissions')
    .update({ status: decision })
    .eq('id', submissionId)

  if (error) {
    if (isMissingRelationError(error)) {
      redirectAdminMessage('Rewards moderation requires the latest Supabase rewards schema.')
    }

    redirectAdminMessage('Could not update the submission status.')
  }

  revalidatePath('/rewards')
  revalidatePath('/rewards/admin')
  redirectAdminMessage(
    decision === 'approved' ? 'Submission approved successfully.' : 'Submission rejected.'
  )
}

export async function markTierRedemption(formData: FormData) {
  const participantId = String(formData.get('participantId') ?? '').trim()
  const tierName = String(formData.get('tierName') ?? '').trim()
  const tierPointsRequired = Number(formData.get('tierPointsRequired') ?? 0)

  if (!participantId || !tierName || !Number.isFinite(tierPointsRequired) || tierPointsRequired <= 0) {
    redirectAdminMessage('Invalid tier redemption request.')
  }

  const { supabase, user } = await requireAdminRewardsUser('/rewards/admin')

  const { error } = await supabase.from('tier_redemptions').insert({
    user_id: participantId,
    tier_name: tierName,
    tier_points_required: tierPointsRequired,
    redeemed_by: user.id,
  })

  if (error) {
    if (error.code === '23505') {
      redirectAdminMessage(`The ${tierName} reward has already been marked as claimed.`)
    }

    if (isMissingRelationError(error)) {
      redirectAdminMessage('Tier redemption tracking requires the latest Supabase rewards schema.')
    }

    redirectAdminMessage('Could not record the tier redemption right now.')
  }

  revalidatePath('/rewards')
  revalidatePath('/rewards/admin')
  redirectAdminMessage(`${tierName} marked as claimed.`)
}

export async function recordManualAttendance(formData: FormData) {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()
  const checkpointSlug = String(formData.get('checkpointSlug') ?? '').trim()
  const checkpoint = getAttendanceCheckpoint(checkpointSlug)

  if (!email || !checkpoint) {
    redirectAdminMessage('Add a participant email and a valid checkpoint.')
  }

  const safeCheckpoint = checkpoint

  const { supabase, user } = await requireAdminRewardsUser('/rewards/admin')

  const { data: participant, error: participantError } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('email', email)
    .maybeSingle()

  if (participantError) {
    if (isMissingRelationError(participantError)) {
      redirectAdminMessage('Attendance tools require the latest Supabase rewards schema.')
    }

    redirectAdminMessage('Could not load participant profile for manual check-in.')
  }

  if (!participant) {
    redirectAdminMessage('No participant profile matched that email address.')
  }

  const safeParticipant = participant

  const { error } = await supabase.from('attendance_scans').insert({
    user_id: safeParticipant.id,
    checkpoint_slug: safeCheckpoint.slug,
    checkpoint_name: safeCheckpoint.title,
    points_awarded: safeCheckpoint.points,
    sets_checked_in: safeCheckpoint.setsCheckedIn,
    created_by: user.id,
  })

  if (error) {
    if (error.code === '23505') {
      redirectAdminMessage('That participant has already been recorded for this checkpoint.')
    }

    if (isMissingRelationError(error)) {
      redirectAdminMessage('Attendance tools require the latest Supabase rewards schema.')
    }

    redirectAdminMessage('Could not record manual attendance right now.')
  }

  revalidatePath('/rewards')
  revalidatePath('/rewards/admin')
  redirectAdminMessage(
    `Attendance recorded for ${safeParticipant.email ?? safeParticipant.full_name}.`
  )
}

export async function completeRewardsCheckIn(formData: FormData) {
  const checkpointSlug = String(formData.get('checkpointSlug') ?? '').trim()
  const token = String(formData.get('token') ?? '').trim()
  const checkpoint = getCheckpointBySlugOrRedirect(checkpointSlug)

  if (!verifyCheckInToken(checkpoint.slug, token)) {
    redirect('/rewards?message=Invalid or expired check-in token.')
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const path = buildCheckInPath(checkpoint)
    redirect(`/login?next=${encodeURIComponent(path ?? '/rewards/check-in')}`)
  }

  const { error: profileError } = await syncRewardsProfile(user)

  if (profileError && isMissingRelationError(profileError)) {
    redirect(getCheckInRedirectPath(checkpoint.slug, token, 'Apply the latest rewards schema first.'))
  }

  const { error } = await supabase.from('attendance_scans').insert({
    user_id: user.id,
    checkpoint_slug: checkpoint.slug,
    checkpoint_name: checkpoint.title,
    points_awarded: checkpoint.points,
    sets_checked_in: checkpoint.setsCheckedIn,
  })

  if (error) {
    if (error.code === '23505') {
      redirect(
        getCheckInRedirectPath(checkpoint.slug, token, 'You have already checked in for this checkpoint.')
      )
    }

    if (isMissingRelationError(error)) {
      redirect(getCheckInRedirectPath(checkpoint.slug, token, 'Apply the latest rewards schema first.'))
    }

    redirect(
      getCheckInRedirectPath(checkpoint.slug, token, 'Could not complete check-in. Please ask an organiser.')
    )
  }

  revalidatePath('/rewards')
  revalidatePath('/rewards/admin')
  redirect(
    getCheckInRedirectPath(
      checkpoint.slug,
      token,
      getCheckInSuccessMessage(checkpoint),
      'success'
    )
  )
}

export async function runLuckyDraw(formData: FormData) {
  const drawLabel = String(formData.get('drawLabel') ?? '').trim() || getLuckyDrawDefaultLabel()
  const { supabase, user } = await requireAdminRewardsUser('/rewards/admin')

  const { data: previousWinners, error: previousWinnersError } = await supabase
    .from('lucky_draw_results')
    .select('winner_id')

  if (previousWinnersError) {
    if (isMissingRelationError(previousWinnersError)) {
      redirectAdminMessage('Lucky draw history requires the latest Supabase rewards schema.')
    }

    redirectAdminMessage('Could not load previous lucky draw results.')
  }

  const priorWinnerIds = new Set((previousWinners ?? []).map((row) => row.winner_id))

  const { data: eligibleParticipants, error: eligibleError } = await supabase
    .from('profiles')
    .select('id, email, full_name, total_points, is_checked_in')
    .eq('is_checked_in', true)
    .gte('total_points', luckyDrawMinimumPoints)
    .order('total_points', { ascending: false })

  if (eligibleError) {
    if (isMissingRelationError(eligibleError)) {
      redirectAdminMessage('Lucky draw tools require the latest Supabase rewards schema.')
    }

    redirectAdminMessage('Could not load the eligible lucky draw pool.')
  }

  const remainingPool = (eligibleParticipants ?? []).filter(
    (participant) => !priorWinnerIds.has(participant.id)
  )

  const winner = chooseLuckyDrawWinner(remainingPool)

  if (!winner) {
    redirectAdminMessage('No eligible participants are available for a new draw.')
  }

  const safeWinner = winner

  const { error } = await supabase.from('lucky_draw_results').insert({
    draw_label: drawLabel,
    winner_id: safeWinner.id,
    winner_points: safeWinner.total_points,
    min_points: luckyDrawMinimumPoints,
    drawn_by: user.id,
  })

  if (error) {
    if (isMissingRelationError(error)) {
      redirectAdminMessage('Lucky draw history requires the latest Supabase rewards schema.')
    }

    redirectAdminMessage('Could not save the lucky draw result.')
  }

  revalidatePath('/rewards/admin')
  redirectAdminMessage(
    `Lucky draw winner selected: ${safeWinner.full_name ?? safeWinner.email ?? 'Participant'}.`
  )
}

export async function upsertRewardTask(formData: FormData) {
  const taskId = String(formData.get('taskId') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const points = Number(formData.get('points') ?? 50)
  const type = String(formData.get('type') ?? '').trim()
  const requiresProof = formData.get('requiresProof') === 'on' || formData.get('requiresProof') === 'true'
  const imageFileEntry = formData.get('imageFile')
  const imageFile = isUploadableProofFile(imageFileEntry) ? imageFileEntry : null

  if (!title || !type) {
    redirectAdminMessage('Title and type are required.')
  }

  const { supabase } = await requireAdminRewardsUser('/rewards/admin')

  let resolvedImageUrl: string | null = null

  if (imageFile) {
    if (!ALLOWED_PROOF_MIME_TYPES.has(imageFile.type)) {
      redirectAdminMessage('Upload a PNG, JPG, WEBP, HEIC, or HEIF thumbnail file.')
    }

    if (imageFile.size > MAX_PROOF_FILE_SIZE_BYTES) {
      redirectAdminMessage('Thumbnail uploads must be 6 MB or smaller.')
    }

    const fileExtension = getProofFileExtension(imageFile)
    const storagePath = `tasks/${Date.now()}-${randomUUID()}.${fileExtension}`
    const fileBuffer = new Uint8Array(await imageFile.arrayBuffer())

    const { error: uploadError } = await supabase.storage.from('task-thumbnails').upload(storagePath, fileBuffer, {
      contentType: imageFile.type,
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadError) {
      redirectAdminMessage('Could not upload the thumbnail.')
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('task-thumbnails').getPublicUrl(storagePath)

    resolvedImageUrl = publicUrl
  } else if (formData.get('removeImage') === 'true') {
     resolvedImageUrl = '' // We will interpret empty string as "remove image"
  }

  const payload: {
    title: string
    description: string | null
    points: number
    type: string
    requires_proof: boolean
    image_url?: string | null
  } = {
    title,
    description: description || null,
    points,
    type,
    requires_proof: requiresProof,
  }

  if (resolvedImageUrl === '') {
    payload.image_url = null
  } else if (resolvedImageUrl) {
    payload.image_url = resolvedImageUrl
  }

  const { error } = await (taskId 
    ? supabase.from('tasks').update(payload).eq('id', taskId)
    : supabase.from('tasks').insert(payload))

  if (error) {
    redirectAdminMessage('Could not save the task.')
  }

  revalidatePath('/rewards')
  revalidatePath('/rewards/admin')
  redirectAdminMessage(taskId ? 'Task updated successfully.' : 'Task created successfully.')
}

export async function deleteRewardTask(formData: FormData) {
  const taskId = String(formData.get('taskId') ?? '').trim()

  if (!taskId) {
    redirectAdminMessage('Invalid task ID.')
  }

  const { supabase } = await requireAdminRewardsUser('/rewards/admin')

  const { error } = await supabase.from('tasks').delete().eq('id', taskId)

  if (error) {
    redirectAdminMessage('Could not delete the task. It might have existing submissions.')
  }

  revalidatePath('/rewards')
  revalidatePath('/rewards/admin')
  redirectAdminMessage('Task deleted successfully.')
}

export async function toggleRewardsPortalStatus(isOpen: boolean) {
  const { supabase } = await requireAdminRewardsUser('/rewards/admin')

  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'rewards_portal_status', value: { is_open: isOpen }, updated_at: new Date().toISOString() })

  if (error) {
    redirectAdminMessage('Could not update the Rewards Portal status.')
  }

  revalidatePath('/rewards')
  revalidatePath('/rewards/admin')
  redirectAdminMessage(`Rewards Portal is now ${isOpen ? 'OPEN' : 'LOCKED'}.`)
}
