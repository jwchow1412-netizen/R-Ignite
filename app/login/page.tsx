import { signInWithDiscord } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { SUPABASE_MISSING_ENV_MESSAGE, hasSupabaseEnv } from '@/utils/supabase/config'
import Image from 'next/image'

type LoginPageProps = {
  searchParams?: {
    message?: string | string[]
    next?: string | string[]
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const authEnabled = hasSupabaseEnv()
  const messageParam = searchParams?.message
  const nextParam = searchParams?.next
  const nextPath =
    typeof nextParam === 'string' && nextParam.startsWith('/') && !nextParam.startsWith('//')
      ? nextParam
      : '/rewards'
  const message =
    typeof messageParam === 'string'
      ? messageParam
      : !authEnabled
        ? SUPABASE_MISSING_ENV_MESSAGE
        : null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0e080f] px-4 selection:bg-[#D46476]/30">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(88,101,242,0.15)] via-[rgba(88,101,242,0.05)] to-transparent blur-3xl pointer-events-none" />

      <div className="z-10 w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-black/40 p-10 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto h-24 w-24 relative mb-4">
            <Image 
                src="/logo.svg" 
                alt="R-Ignite" 
                fill 
                className="object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Rewards Portal</h2>
          <p className="text-sm text-white/60">
            Sign in to track your hackathon points, submit proofs, and enter the lucky draw!
          </p>
        </div>

        {message ? (
          <p className="rounded-2xl border border-[#D46476]/30 bg-[#D46476]/10 px-4 py-3 text-sm text-[#ffd7dd]">
            {message}
          </p>
        ) : null}

        {authEnabled ? (
          <form action={signInWithDiscord} className="mt-8">
            <input type="hidden" name="next" value={nextPath} />
            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#5865F2] text-white hover:bg-[#4752C4] font-semibold flex items-center justify-center gap-3 transition-transform hover:scale-105"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
              Sign in with Discord
            </Button>
          </form>
        ) : (
          <Button
            type="button"
            size="lg"
            disabled
            className="mt-8 w-full bg-[#5865F2]/60 text-white/80 font-semibold flex items-center justify-center gap-3"
          >
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
            Sign in with Discord
          </Button>
        )}
        
        <p className="mt-6 text-xs text-white/40">
           By connecting your Discord, you agree to our hackathon terms of participation.
        </p>
      </div>
    </div>
  )
}
