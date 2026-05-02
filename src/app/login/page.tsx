'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scale, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Both fields are required.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-950 flex">
      <div className="hidden lg:flex flex-col justify-between w-[45%] border-r border-zinc-800 p-14">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Lexara</span>
        </Link>
        <div>
          <blockquote className="text-2xl font-medium text-zinc-200 tracking-tight leading-snug mb-6 max-w-[36ch]">
            "Lexara cut our contract review time by two thirds. It paid for itself in the first month."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-600/20 border border-amber-600/30 flex items-center justify-center text-amber-500 text-xs font-bold">TB</div>
            <div>
              <div className="text-zinc-300 text-sm font-medium">Thomas Brandt</div>
              <div className="text-zinc-600 text-xs">Senior Partner, Kessler & Brandt</div>
            </div>
          </div>
        </div>
        <p className="text-zinc-700 text-xs">© 2024 Lexara GmbH</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-white font-semibold tracking-tight">Lexara</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Welcome back</h1>
          <p className="text-zinc-500 text-sm mb-8">Sign in to your firm account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="miriam@kessler-brandt.de" className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-xs bg-red-950/40 border border-red-800/30 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 text-sm">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-zinc-600 text-sm mt-6 text-center">
            No account?{' '}
            <Link href="/signup" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
