'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, X, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { upsertRewardTask, deleteRewardTask } from '@/app/rewards/actions'

type AdminTaskRow = {
  id: string
  title: string
  description: string | null
  points: number
  type: string
  requires_proof: boolean
  image_url: string | null
}

export default function TaskManagementClient({ tasks }: { tasks: AdminTaskRow[] }) {
  const [editingTask, setEditingTask] = useState<AdminTaskRow | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [removeImage, setRemoveImage] = useState(false)

  const activeTask = editingTask || (isCreating ? {} as Partial<AdminTaskRow> : null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-[rgba(248,244,246,0.58)]">
            Task Configuration
          </p>
          <h2 className="text-2xl text-white">Create & design gamification tasks</h2>
        </div>
        <Button onClick={() => { setIsCreating(true); setEditingTask(null); setRemoveImage(false) }} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {activeTask && (
        <div className="rounded-2xl border border-[rgba(212,100,118,0.28)] bg-[rgba(12,9,18,0.9)] p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{isCreating ? 'Create New Task' : 'Edit Task'}</h3>
            <button onClick={() => { setIsCreating(false); setEditingTask(null) }} className="text-[rgba(248,244,246,0.5)] hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form action={(formData) => {
             if (removeImage) formData.append('removeImage', 'true')
             upsertRewardTask(formData)
             setIsCreating(false)
             setEditingTask(null)
          }} className="space-y-4">
            {editingTask && <input type="hidden" name="taskId" value={editingTask.id} />}
            
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input id="title" name="title" defaultValue={activeTask.title ?? ''} required placeholder="e.g. Share on Instagram" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input id="description" name="description" defaultValue={activeTask.description ?? ''} placeholder="Tell participants what to do" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points Awarded</Label>
                <Input id="points" name="points" type="number" defaultValue={activeTask.points ?? 50} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Task Type</Label>
                <select
                  id="type"
                  name="type"
                  className="flex h-10 w-full rounded-md border border-[rgba(248,244,246,0.15)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  defaultValue={activeTask.type ?? 'social'}
                >
                  <option value="social" className="bg-[#120712]">Social</option>
                  <option value="community" className="bg-[#120712]">Community</option>
                  <option value="attendance" className="bg-[#120712]">Attendance</option>
                  <option value="submission" className="bg-[#120712]">Submission</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="requiresProof" name="requiresProof" defaultChecked={activeTask.requires_proof ?? true} className="h-4 w-4 rounded border-gray-600 bg-gray-800" />
              <Label htmlFor="requiresProof" className="mt-0">Requires Proof Upload?</Label>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="imageFile">Task Thumbnail Poster (Optional)</Label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                {activeTask.image_url && !removeImage && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    <Image src={activeTask.image_url} alt="Thumbnail" fill className="object-cover" />
                    <button type="button" onClick={() => setRemoveImage(true)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-red-500/80">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="flex-1">
                  <Input id="imageFile" name="imageFile" type="file" accept="image/png, image/jpeg, image/webp" />
                  <p className="mt-1 text-xs text-[rgba(248,244,246,0.5)]">Recommended: 16:9 ratio. Used for visual flair in the portal.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Save Task</Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {task.image_url ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <Image src={task.image_url} alt="Thumbnail" fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[rgba(248,244,246,0.3)]">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[rgba(248,244,246,0.64)]">
                    {task.type}
                  </span>
                  <span className="rounded-full border border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.08)] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#ffd0d7]">
                    {task.points} pts
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-semibold text-white">{task.title}</h3>
                <p className="text-sm text-[rgba(248,244,246,0.6)] line-clamp-1">{task.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="icon" variant="secondary" onClick={() => { setEditingTask(task); setIsCreating(false); setRemoveImage(false) }}>
                <Edit className="h-4 w-4" />
              </Button>
              <form action={deleteRewardTask}>
                <input type="hidden" name="taskId" value={task.id} />
                <Button size="icon" variant="destructive" type="submit">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 text-center text-sm text-[rgba(248,244,246,0.72)]">
            No tasks configured. Add one above.
          </div>
        )}
      </div>
    </div>
  )
}
