'use client'

import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleRewardsPortalStatus } from '@/app/rewards/actions'

export default function PortalStatusToggleClient({ isPortalOpen }: { isPortalOpen: boolean }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async (newState: boolean) => {
    if (newState === isPortalOpen) return
    setIsUpdating(true)
    await toggleRewardsPortalStatus(newState)
    setIsUpdating(false)
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition-all ${isPortalOpen ? 'border-accent/40 bg-accent/10' : 'border-red-500/40 bg-red-500/10'}`}>
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-white">Master Killswitch</p>
        <p className="text-sm text-[rgba(248,244,246,0.7)] mt-1">
          {isPortalOpen 
            ? 'The portal is currently OPEN. Participants can submit proof and claim rewards.' 
            : 'The portal is currently LOCKED. Participants can only view the leaderboard and past points.'}
        </p>
      </div>
      <div className="flex gap-3 shrink-0">
        <Button 
          onClick={() => handleToggle(true)} 
          disabled={isUpdating || isPortalOpen}
          variant="secondary"
          className={isPortalOpen ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white hover:bg-white/20'}
        >
          <Unlock className="mr-2 h-4 w-4" /> Unlock
        </Button>
        <Button 
          onClick={() => handleToggle(false)} 
          disabled={isUpdating || !isPortalOpen}
          variant="default"
          className={!isPortalOpen ? 'bg-red-500 text-white font-semibold' : 'bg-red-500/20 text-red-400 hover:bg-red-500/40'}
        >
          <Lock className="mr-2 h-4 w-4" /> Lock
        </Button>
      </div>
    </div>
  )
}
