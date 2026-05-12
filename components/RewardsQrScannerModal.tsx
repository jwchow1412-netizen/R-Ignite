'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Scanner } from '@yudiel/react-qr-scanner'
import { X, Camera, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type RewardsQrScannerModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function RewardsQrScannerModal({ isOpen, onClose }: RewardsQrScannerModalProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  // Clear errors when reopening
  useEffect(() => {
    if (isOpen) {
      setError(null)
      setProcessing(false)
    }
  }, [isOpen])

  const handleScan = (detectedCodes: { rawValue: string }[]) => {
    if (processing || !detectedCodes || detectedCodes.length === 0) return

    const result = detectedCodes[0].rawValue

    if (!result) return

    try {
      const url = new URL(result)
      if (url.pathname === '/rewards/check-in' && url.searchParams.has('checkpoint')) {
        setProcessing(true)
        // Valid check-in URL, redirect the user
        router.push(url.pathname + url.search)
        onClose()
      } else {
        setError('Invalid QR code. Please scan an official Organizer QR code.')
      }
    } catch (err) {
      setError('Unrecognized QR code format.')
    }
  }

  const handleError = (error: unknown) => {
    console.error(error)
    setError('Failed to access camera. Please check your browser permissions.')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-[#27151c] bg-[#0b060c] shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[#27151c] p-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Camera className="w-6 h-6 text-[#e11d48]" />
                Scan Organizer QR
              </h2>
              <p className="text-xs font-medium text-[rgba(248,244,246,0.68)] mt-1">
                Point your camera at the Grand Final QR code to check in automatically.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-white/5 p-2 text-[rgba(248,244,246,0.68)] transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="overflow-hidden rounded-2xl border border-[#27151c] bg-black">
              {processing ? (
                <div className="flex h-64 flex-col items-center justify-center text-center p-6">
                   <div className="w-10 h-10 border-4 border-t-[#e11d48] border-white/10 rounded-full animate-spin mb-4" />
                   <p className="font-bold text-white text-lg">Checking you in...</p>
                </div>
              ) : (
                <div className="relative aspect-square w-full">
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    components={{
                      audio: false,
                      finder: true,
                    }}
                    styles={{
                       container: { width: '100%', height: '100%' },
                    }}
                  />
                </div>
              )}
            </div>

            {error && !processing && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <p>{error}</p>
              </div>
            )}

            <Button
              variant="outline"
              onClick={onClose}
              className="mt-6 w-full rounded-full border border-white/10 bg-transparent text-white hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
