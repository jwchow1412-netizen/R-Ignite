'use server'

import { createClient } from '@/utils/supabase/server'
import {
  SUPABASE_MISSING_ENV_MESSAGE,
  hasSupabaseEnv,
} from '@/utils/supabase/config'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

function normalizeNextPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/rewards'
  }

  return value
}

export async function signInWithDiscord(formData: FormData) {
  if (!hasSupabaseEnv()) {
    return redirect(
      `/login?message=${encodeURIComponent(SUPABASE_MISSING_ENV_MESSAGE)}`
    )
  }

  const supabase = createClient()
  const headerStore = headers()
  const origin =
    headerStore.get('origin') ??
    new URL(headerStore.get('referer') ?? 'http://localhost:3000').origin
  const next = normalizeNextPath(String(formData.get('next') ?? ''))

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) {
    console.error("Auth Error:", error)
    return redirect('/login?message=Could not authenticate user')
  }

  if (data.url) {
    redirect(data.url) // Navigate to the Discord OAuth provider
  }
}

export async function signOut() {
  if (!hasSupabaseEnv()) {
    return redirect('/')
  }

  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/')
}
