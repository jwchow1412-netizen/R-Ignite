'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useFormStatus } from 'react-dom'

import { submitRewardProof } from '@/app/rewards/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type RewardsProofModalProps = {
  onClose: () => void
  returnTab: string
  task: {
    id: string
    title: string
    description: string
    verification: string
    proofPlaceholder?: string
    existingProofUrl: string | null
  }
}

function SubmitProofButton({ hasExistingProof }: { hasExistingProof: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" size="sm" className="h-9 w-full rounded-xl" disabled={pending}>
      {pending ? 'Submitting...' : hasExistingProof ? 'Update proof' : 'Submit proof'}
    </Button>
  )
}

export default function RewardsProofModal({
  onClose,
  returnTab,
  task,
}: RewardsProofModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close proof submission modal"
        className="absolute inset-0 bg-[rgba(8,6,12,0.76)] backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-md rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,11,22,0.96),rgba(12,8,18,0.98))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.44)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(248,244,246,0.52)]">
              Submit proof
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">{task.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-[rgba(248,244,246,0.7)] transition hover:border-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
          <p className="text-sm text-[rgba(248,244,246,0.82)]">{task.description}</p>
          <p className="text-xs text-[rgba(248,244,246,0.56)]">{task.verification}</p>
          {task.existingProofUrl ? (
            <Link
              href={task.existingProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-xs font-semibold text-[#ffd0da] transition hover:text-white"
            >
              View current submitted proof
            </Link>
          ) : null}
        </div>

        <form action={submitRewardProof} encType="multipart/form-data" className="mt-3 space-y-3">
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="returnTab" value={returnTab} />

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.54)]">
              Proof link
            </label>
            <Input
              name="proofUrl"
              type="url"
              defaultValue={task.existingProofUrl ?? ''}
              placeholder={task.proofPlaceholder ?? 'https://...'}
              className="h-10 rounded-xl"
            />
          </div>

          <div className="rounded-2xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-3">
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.54)]">
              Upload screenshot
            </label>
            <Input
              name="proofFile"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
              className="mt-2 h-auto cursor-pointer rounded-xl py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-[rgba(212,100,118,0.16)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#ffd8de]"
            />
            <p className="mt-2 text-xs text-[rgba(248,244,246,0.5)]">
              PNG, JPG, WEBP, HEIC, or HEIF. Max 6 MB.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-9 flex-1 rounded-xl"
              onClick={onClose}
            >
              Cancel
            </Button>
            <div className="flex-1">
              <SubmitProofButton hasExistingProof={Boolean(task.existingProofUrl)} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
