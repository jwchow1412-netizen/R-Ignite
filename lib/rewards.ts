export type RewardTaskBlueprint = {
  slug: string
  title: string
  description: string
  points: number
  type: 'social' | 'community' | 'attendance' | 'submission'
  requiresProof: boolean
  verification: string
  proofPlaceholder?: string
}

export type AttendanceCheckpoint = {
  slug: string
  title: string
  description: string
  points: number
  setsCheckedIn: boolean
}

export const luckyDrawMinimumPoints = 200
export const luckyDrawDate = '6 June 2026'

export const engagementGoals = [
  {
    title: 'Promote the hackathon',
    description:
      'Turn every share, repost, and progress update into wider visibility for MASA Hackathon 2026: R-Ignite.',
  },
  {
    title: 'Build community energy',
    description:
      'Reward participants for interacting with other teams and helping the event feel active before the grand final.',
  },
  {
    title: 'Show up in person',
    description:
      'Use on-site check-ins and workshop attendance to connect online engagement with physical event participation.',
  },
]

export const rewardTaskBlueprints: RewardTaskBlueprint[] = [
  {
    slug: 'share-official-post',
    title: 'Share an official MASA Hackathon post',
    description:
      'Repost an official MASA Hackathon banner or campaign update on Instagram, Facebook, or LinkedIn.',
    points: 50,
    type: 'social',
    requiresProof: true,
    verification: 'Paste a public post link or a shareable screenshot URL.',
    proofPlaceholder: 'https://www.linkedin.com/posts/... or screenshot drive link',
  },
  {
    slug: 'team-progress-post',
    title: "Post your team's progress story",
    description:
      'Publish a LinkedIn post or blog entry about your team progress, approach, or insights during the hackathon.',
    points: 100,
    type: 'social',
    requiresProof: true,
    verification: 'Submit the public post URL for organiser review.',
    proofPlaceholder: 'https://www.linkedin.com/feed/update/... or blog URL',
  },
  {
    slug: 'comment-on-other-team',
    title: 'Comment on another team post',
    description:
      'Leave a meaningful comment that supports or engages another participant team during the campaign period.',
    points: 10,
    type: 'community',
    requiresProof: true,
    verification: 'Paste the comment or thread URL so moderators can verify context.',
    proofPlaceholder: 'https://www.instagram.com/p/... or discussion link',
  },
  {
    slug: 'attend-workshop',
    title: 'Attend an in-person workshop',
    description:
      'Earn points when you scan the event QR code at the workshop entrance or organiser checkpoint.',
    points: 50,
    type: 'attendance',
    requiresProof: false,
    verification: 'Verified by organiser QR scan at the venue.',
  },
  {
    slug: 'grand-final-check-in',
    title: 'Grand final event check-in',
    description:
      'Physical attendance is required to redeem gifts on site and to qualify for the lucky draw.',
    points: 0,
    type: 'attendance',
    requiresProof: false,
    verification: 'Mandatory QR check-in at the grand final venue.',
  },
  {
    slug: 'submit-project-deliverables',
    title: 'Submit preliminary round deliverables',
    description:
      'Complete your team submission on time to unlock another milestone in the rewards journey.',
    points: 120,
    type: 'submission',
    requiresProof: true,
    verification: 'Paste your submission receipt, drive folder, or confirmation link.',
    proofPlaceholder: 'https://drive.google.com/... or submission receipt URL',
  },
]

export const giftTiers = [
  {
    name: 'Momentum Tier',
    pointsRequired: 300,
    reward: 'Sponsor voucher or premium merchandise',
    note: 'Ideal target for highly active participants before the grand final.',
  },
  {
    name: 'Ignite Tier',
    pointsRequired: 450,
    reward: 'Priority merch pool and bonus lucky draw momentum',
    note: 'Top-engagement tier for participants who show up online and on site.',
  },
]

export const luckyDrawRules = [
  'Only registered hackathon participants are eligible to earn points.',
  'Physical grand final check-in is mandatory for lucky draw eligibility.',
  `A minimum of ${luckyDrawMinimumPoints} approved engagement points is required to enter the draw.`,
  'Unredeemed points do not guarantee prizes. They strengthen your standing before the draw.',
  `The lucky draw is planned for ${luckyDrawDate} during the closing ceremony.`,
]

export const attendanceCheckpoints: AttendanceCheckpoint[] = [
  {
    slug: 'workshop-entry',
    title: 'Workshop Check-In',
    description:
      'Scan at the workshop venue to confirm physical attendance and unlock the workshop participation reward.',
    points: 50,
    setsCheckedIn: false,
  },
  {
    slug: 'grand-final-entry',
    title: 'Grand Final Check-In',
    description:
      'Mandatory on-site check-in for the grand final. Required for physical redemption and lucky draw eligibility.',
    points: 0,
    setsCheckedIn: true,
  },
]

export function getAttendanceCheckpoint(slug: string | null | undefined) {
  if (!slug) {
    return null
  }

  return attendanceCheckpoints.find((checkpoint) => checkpoint.slug === slug) ?? null
}

export function getCheckInSuccessMessage(checkpoint: AttendanceCheckpoint) {
  return checkpoint.setsCheckedIn
    ? 'Grand final check-in confirmed.'
    : `Attendance confirmed. ${checkpoint.points} points will appear in your rewards profile.`
}
