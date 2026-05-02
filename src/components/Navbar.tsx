'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Scale } from 'lucide-react'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/demo', label: 'Live Demo' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/96 backdrop-blur-sm border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-white font-semibold text-[1.05rem] tracking-tight">Lexara</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-zinc-400 hover:text-white text-sm transition-colors duration-200">
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="text-zinc-400 hover:text-white text-sm transition-colors duration-200">Log in</Link>
          <Link href="/signup" className="bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200">
            Book a Demo
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-zinc-400 hover:text-white transition-colors p-1">
          {open ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-6 py-5 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-zinc-300 text-sm" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/login" className="text-zinc-300 text-sm" onClick={() => setOpen(false)}>Log in</Link>
          <Link href="/signup" className="bg-amber-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg text-center mt-1" onClick={() => setOpen(false)}>
            Book a Demo
          </Link>
        </div>
      )}
    </nav>
  )
}
