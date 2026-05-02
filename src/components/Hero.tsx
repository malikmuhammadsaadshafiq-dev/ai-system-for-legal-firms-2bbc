import Link from 'next/link'
import { ArrowRight, ShieldCheck, Clock3, FileText } from 'lucide-react'
import HeroMockup from './HeroMockup'

const badges = [
  { icon: ShieldCheck, label: 'GDPR compliant' },
  { icon: Clock3, label: '67% faster review' },
  { icon: FileText, label: '50+ document types' },
]

export default function Hero() {
  return (
    <section className="min-h-[100dvh] bg-zinc-950 flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-6 w-full py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-600/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-slow block" />
              <span className="text-amber-500 text-xs font-semibold tracking-widest uppercase">AI Legal Platform</span>
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white tracking-tighter leading-[1.06]">
              Legal work,<br />
              <span className="text-amber-500">done in hours.</span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-[50ch]">
              Lexara handles contract review, client intake, and document drafting — so your attorneys spend time on arguments that win, not admin that does not.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-semibold px-6 py-3.5 rounded-lg transition-all duration-200">
                Book a free demo
              </Link>
              <Link href="/demo" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 px-6 py-3.5 rounded-lg transition-all duration-200 group">
                See it live <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
              </Link>
            </div>

            <div className="flex flex-wrap gap-6">
              {badges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-zinc-500 text-sm">
                  <Icon className="w-4 h-4 text-amber-600/80" strokeWidth={1.5} />
                  {label}
                </div>
              ))}
            </div>

            <p className="text-zinc-600 text-sm border-t border-zinc-800 pt-5">
              From{' '}
              <span className="text-zinc-300 font-medium">€2,700 build</span>
              {' '}+{' '}
              <span className="text-zinc-300 font-medium">€1,300/mo</span>
              {' '}— one-time setup, no hidden costs
            </p>
          </div>

          <div className="hidden lg:flex justify-center lg:justify-end">
            <HeroMockup />
          </div>

        </div>
      </div>
    </section>
  )
}
