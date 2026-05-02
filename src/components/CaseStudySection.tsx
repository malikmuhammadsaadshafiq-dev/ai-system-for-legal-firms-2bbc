const metrics = [
  { value: '67%', label: 'reduction in document review time' },
  { value: '3.1h', label: 'saved per attorney per week' },
  { value: '214', label: 'contracts analyzed in first 6 months' },
]

export default function CaseStudySection() {
  return (
    <section className="bg-stone-50 py-24 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 items-center">

          <div>
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-6">Client result</p>
            <blockquote className="text-2xl md:text-3xl font-medium text-zinc-900 tracking-tight leading-snug mb-8">
              "We used to spend Monday mornings assigning document review. Now those hours go into preparation that actually changes outcomes for clients."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-amber-600/15 border border-amber-600/20 flex items-center justify-center text-amber-600 font-bold text-sm flex-shrink-0">
                MK
              </div>
              <div>
                <div className="text-zinc-900 font-semibold text-sm">Miriam Kessler</div>
                <div className="text-zinc-500 text-sm">Founding Partner, Kessler & Brandt Rechtsanwälte, Berlin</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px bg-zinc-200/60 rounded-2xl overflow-hidden border border-zinc-200/60">
            {metrics.map(m => (
              <div key={m.value} className="bg-stone-50 px-8 py-7">
                <div className="text-4xl font-bold text-amber-600 tracking-tighter tabular-nums">{m.value}</div>
                <div className="text-zinc-500 text-sm mt-1.5">{m.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
