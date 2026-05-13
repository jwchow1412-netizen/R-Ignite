'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateDailyCheckInPoints } from '@/app/rewards/actions'

export default function DailyCheckInPointsEditor({ currentPoints }: { currentPoints: number }) {
  const [points, setPoints] = useState(currentPoints.toString())
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    const newPoints = parseInt(points, 10)
    if (isNaN(newPoints) || newPoints < 0) {
      alert('Please enter a valid positive number for points.')
      return
    }
    setIsUpdating(true)
    await updateDailyCheckInPoints(newPoints)
    setIsUpdating(false)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-5">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-white">Daily Check-In Points</p>
        <p className="text-sm text-[rgba(248,244,246,0.7)] mt-1">
          Set the number of points awarded for daily check-ins. Currently: {currentPoints} points.
        </p>
      </div>
      <div className="flex gap-3 shrink-0 items-end">
        <div className="space-y-2">
          <Label htmlFor="points">Points</Label>
          <Input
            id="points"
            type="number"
            min="0"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-24"
          />
        </div>
        <Button onClick={handleUpdate} disabled={isUpdating} variant="default">
          <Settings className="mr-2 h-4 w-4" />
          Update
        </Button>
      </div>
    </div>
  )
}