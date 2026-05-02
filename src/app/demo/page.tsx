'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scale, ScanSearch, ArrowRight } from 'lucide-react'
import { mockClauses } from '@/lib/mockData'

const SAMPLE_CONTRACT = `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of January 15, 2024, between Richter Holding AG, a company incorporated under the laws of Germany ("Disclosing Party"), and Schulz GmbH, a company incorporated under the laws of Germany ("Receiving Party").

1. CONFIDENTIAL INFORMATION
"Confidential Information" means any technical or business information disclosed by the Disclosing Party.

2. CONFIDENTIALITY PERIOD
All confidential information disclosed under this Agreement shall remain protected for a period of three (3) years from the date of disclosure.

3. GOVERNING LAW
This Agreement shall be governed by the laws of the Federal Republic of Germany. Any disputes shall be subject to the exclusive jurisdiction of the courts in Berlin.

4. PENALTY CLAUSE
In the event of any breach of the confidentiality obligations under Section 4, the breaching party shall pay liquidated damages of FIFTY THOUSAND EUROS (€50,000) per individual breach, regardless of actual damages incurred.

5. NON-COMPETE
The receiving party agrees not to engage, directly or indirectly, in any competing business activity within the European Union for a period of twenty-four (24) months following termination.

6. DATA PROCESSING
The parties acknowledge that personal data may be shared under this agreement and agree that each party acts as an independent data controller under GDPR.

7. TERM
This Agreement shall remain in force for two (2) years and automatically renew for successive one-year terms unless terminated with sixty (60) days written notice.`

const riskBg = { low: 'bg-emerald-50 border-emerald-200 text-emerald-700', medium: 'bg-amber-50 border-amber-200 text-amber-700', high: 'bg-red-50 border-red-200 text-red-700' }
const riskLabel = { low: 'Low risk', medium: 'Review', high: 'High risk' }

export default function DemoPage() {
  const [contractText, setContractText] = useState(SAMPLE_CONTRACT)
  const [step, setStep] = useState<'idle' | 'analyzing' | 'done'>('idle')
  const [progress, setProgress] = useState(0)

  async function runAnalysis() {
    setStep('analyzing')
    setProgress(0)
    for (let i = 1; i <= 10; i++) {
      await new Promise(r => setTimeout(r, 180))
      setProgress(i * 10)
    }
    setStep('done')
  }

  return (
    <div className="min-h-[100dvh] bg-stone-50">
      <nav className="bg-zinc-950 border-b border-zinc-800 h-14 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center">
            <Scale className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">Lexara</span>
        </Link>
        <span className="text-zinc-600 text-sm ml-4">/ Live Demo</span>
        <Link href="/signup" className="ml-auto bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          Start free pilot
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">Contract Analysis Demo</h1>
          <p className="text-zinc-500 text-sm">Paste any contract text below and watch Lexara extract clauses, assign risk levels, and flag issues in real time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-zinc-700 text-sm font-medium">Contract text</label>
              <span className="text-zinc-400 text-xs">{contractText.length} characters</span>
            </div>
            <textarea value={contractText} onChange={e => setContractText(e.target.value)} rows={22} className="w-full bg-white border border-zinc-200 text-zinc-700 text-xs leading-relaxed rounded-xl px-5 py-4 resize-none focus:outline-none focus:border-amber-500 transition-colors font-mono" />
            <button onClick={runAnalysis} disabled={step === 'analyzing' || !contractText.trim()} className="w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm">
              <ScanSearch className="w-4 h-4" strokeWidth={2} />
              {step === 'analyzing' ? `Analyzing... ${progress}%` : 'Analyze Contract'}
            </button>
            {step === 'analyzing' && (
              <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          <div>
            {step === 'idle' && (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-zinc-200 rounded-xl">
                <ScanSearch className="w-10 h-10 text-zinc-300 mb-4" strokeWidth={1} />
                <p className="text-zinc-400 font-medium text-sm">Results appear here</p>
                <p className="text-zinc-300 text-xs mt-1">Run an analysis to see extracted clauses</p>
              </div>
            )}
            {step === 'analyzing' && (
              <div className="space-y-3 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-zinc-200/60 rounded-xl" style={{ opacity: 1 - i * 0.12 }} />
                ))}
              </div>
            )}
            {step === 'done' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-zinc-900 font-semibold text-sm">{mockClauses.length} clauses extracted</h3>
                  <div className="flex gap-2">
                    <span className="text-[11px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-medium">1 high</span>
                    <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">2 medium</span>
                  </div>
                </div>
                {mockClauses.map(clause => (
                  <div key={clause.id} className="bg-white border border-zinc-100 rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-zinc-900 font-semibold text-xs">{clause.heading}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${riskBg[clause.risk]}`}>{riskLabel[clause.risk]}</span>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-2">{clause.text}</p>
                    <p className="text-zinc-400 text-xs border-t border-zinc-100 pt-2">{clause.note}</p>
                  </div>
                ))}
                <div className="mt-4 flex items-center gap-3">
                  <Link href="/signup" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold py-2.5 rounded-xl text-center transition-colors">
                    Analyse your own contracts
                  </Link>
                  <Link href="/signup" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-700 text-xs transition-colors">
                    Export PDF <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
