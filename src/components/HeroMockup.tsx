const clauses = [
  { label: 'Confidentiality Period', value: '3 years', risk: 'low' as const },
  { label: 'Jurisdiction', value: 'Berlin courts', risk: 'low' as const },
  { label: 'Penalty Clause', value: '€50,000/breach', risk: 'high' as const },
  { label: 'Non-Compete Scope', value: 'EU-wide · 24 mo', risk: 'medium' as const },
  { label: 'Data Processing', value: 'GDPR Art. 28', risk: 'medium' as const },
]

const rowClass = {
  low: 'bg-emerald-950/50 border-emerald-800/25',
  medium: 'bg-amber-950/50 border-amber-800/25',
  high: 'bg-red-950/50 border-red-800/30',
}
const dotClass = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-400',
  high: 'bg-red-400',
}

export default function HeroMockup() {
  return (
    <div className="w-full max-w-[460px]">
      <div className="bg-zinc-900 border border-zinc-700/40 rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
        <div className="bg-zinc-800/70 px-4 py-3 flex items-center gap-3 border-b border-zinc-700/40">
          <div className="flex gap-1.5">
            {['bg-red-500/50', 'bg-yellow-500/50', 'bg-green-500/50'].map((c, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
            ))}
          </div>
          <div className="flex-1 bg-zinc-700/50 rounded h-5 flex items-center px-2.5">
            <span className="text-zinc-500 text-xs truncate">NDA_Richter_Holding_2024.pdf — AI Analysis</span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold">Extracted Clauses</span>
            <span className="text-zinc-600 text-[10px]">5 found · 2 risks</span>
          </div>
          <div className="space-y-1.5">
            {clauses.map(({ label, value, risk }) => (
              <div key={label} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${rowClass[risk]}`}>
                <span className="text-zinc-300 text-xs font-medium">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-xs font-mono">{value}</span>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass[risk]}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="bg-zinc-800/80 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-amber-400 text-xs font-semibold">2 risks flagged</div>
              <div className="text-zinc-500 text-[11px] mt-0.5">Penalty clause · Non-compete scope</div>
            </div>
            <div className="bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer">
              Generate Report
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
