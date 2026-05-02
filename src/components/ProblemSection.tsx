const stats = [
  { value: '73%', label: 'of a lawyer\'s time spent on non-billable work', source: 'McKinsey Legal Ops Report' },
  { value: '4.2h', label: 'average manual review time per contract', source: 'LegalTech Benchmark 2023' },
  { value: '€340', label: 'average cost of a manually drafted NDA', source: 'DACH Law Firm Survey' },
]

const problems = [
  { title: 'Document overload', body: 'Associates spend entire weeks reviewing contracts line by line. High-value time disappears into repetitive work that software can handle more consistently.' },
  { title: 'Manual client intake', body: 'Intake forms go back and forth by email. By the time a new matter is opened, the client has already called three times asking for a status update.' },
  { title: 'Repetitive drafting', body: 'The same NDA gets rewritten from a blank page every month. Institutional knowledge stays locked in individual attorneys rather than becoming firm infrastructure.' },
]

export default function ProblemSection() {
  return (
    <section className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800/50 rounded-2xl overflow-hidden mb-20">
          {stats.map(s => (
            <div key={s.value} className="bg-zinc-950 px-8 py-10">
              <div className="text-5xl font-bold text-amber-500 tracking-tighter tabular-nums">{s.value}</div>
              <div className="text-zinc-300 text-sm mt-3 leading-snug max-w-[22ch]">{s.label}</div>
              <div className="text-zinc-600 text-xs mt-2">{s.source}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
          <div>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">The problem</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter leading-tight">
              Law firms lose hours to work that should take minutes.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {problems.map(p => (
              <div key={p.title} className="border-t border-zinc-700 pt-5">
                <h3 className="text-zinc-200 font-semibold text-sm mb-2">{p.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
