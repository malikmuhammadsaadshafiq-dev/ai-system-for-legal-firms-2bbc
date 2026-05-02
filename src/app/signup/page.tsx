'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scale } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', firm: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Full name is required.'
    if (!form.firm.trim()) e.firm = 'Firm name is required.'
    if (!form.email.includes('@')) e.email = 'Enter a valid email address.'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 1100))
    setLoading(false)
    router.push('/dashboard')
  }

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div className="space-y-1.5">
      <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className={`w-full bg-zinc-900 border text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors ${errors[key] ? 'border-red-600' : 'border-zinc-700'}`} />
      {errors[key] && <p className="text-red-400 text-xs">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-[100dvh] bg-zinc-950 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Lexara</span>
        </Link>

        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Start your 14-day pilot</h1>
        <p className="text-zinc-500 text-sm mb-8">No credit card required. We set everything up for you.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {field('name', 'Full name', 'text', 'Miriam Kessler')}
            {field('firm', 'Firm name', 'text', 'Kessler & Brandt')}
          </div>
          {field('email', 'Work email', 'email', 'miriam@kessler-brandt.de')}
          {field('password', 'Password', 'password', 'Min. 8 characters')}

          <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 text-sm mt-2">
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-zinc-600 text-xs leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="#" className="text-zinc-400 hover:text-zinc-200 underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" className="text-zinc-400 hover:text-zinc-200 underline">Privacy Policy</Link>.
          </p>
        </form>

        <p className="text-zinc-600 text-sm mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
