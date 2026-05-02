import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="bg-zinc-950 py-24 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight mb-4">
              Start your 14-day pilot.<br />
              <span className="text-amber-500">No credit card required.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-[52ch]">
              We configure Lexara around your firm in two weeks. By day 15, your team is reviewing contracts in a fraction of the time.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/signup" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200">
                Book a free demo <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
              <Link href="/demo" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 px-7 py-3.5 rounded-lg transition-all duration-200">
                Try the live demo
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="space-y-3 text-right">
              {[
                { label: 'Setup time', value: '14 days' },
                { label: 'Avg time saved', value: '3.1h/week/attorney' },
                { label: 'Contracts analyzed', value: '50+ types' },
                { label: 'Data location', value: 'Frankfurt, DE' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-end gap-4">
                  <span className="text-zinc-500 text-sm">{item.label}</span>
                  <span className="text-zinc-200 font-semibold text-sm tabular-nums w-36 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
