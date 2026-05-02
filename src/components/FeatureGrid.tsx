import { ScanSearch, ClipboardList, FilePen, FolderOpen, AlertTriangle, Lock } from 'lucide-react'

const features = [
  { icon: ScanSearch, title: 'Contract AI Analysis', body: 'Upload any PDF or DOCX. Lexara extracts every clause, assigns risk levels, flags unusual terms, and produces a human-readable summary report in under 90 seconds.' },
  { icon: ClipboardList, title: 'Smart Client Intake', body: 'Build adaptive intake forms that change based on case type. New client details land directly in your matter management queue — no email chasing.' },
  { icon: FilePen, title: 'Document Generation', body: 'NDAs, engagement letters, demand letters — generated from your firm\'s approved templates with AI-filled variables. Draft in 3 minutes, review for 3.' },
  { icon: FolderOpen, title: 'Matter Management', body: 'Every case in one place. Documents, deadlines, contacts, and communication history organised per matter with real-time status tracking.' },
  { icon: AlertTriangle, title: 'Risk Detection', body: 'Automatic flagging of penalty clauses, overbroad non-competes, missing force majeure provisions, and jurisdiction issues before they become problems.' },
  { icon: Lock, title: 'Secure by Default', body: 'End-to-end encryption, GDPR-compliant data residency in Frankfurt DE, role-based access control, and a full audit trail. ISO 27001 in progress.' },
]

export default function FeatureGrid() {
  return (
    <section id="features" className="bg-stone-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 mb-16 items-end">
          <div>
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-4">Platform features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tighter leading-tight">
              Everything your firm needs, minus the overhead.
            </h2>
          </div>
          <p className="text-zinc-500 text-lg leading-relaxed max-w-[60ch] lg:self-end">
            Six core modules built around how law firms actually work — not how software vendors imagine they do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200/60 border border-zinc-200/60 rounded-2xl overflow-hidden">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-stone-50 p-8 hover:bg-white transition-colors duration-200 group">
              <div className="w-10 h-10 bg-amber-600/10 border border-amber-600/15 rounded-xl flex items-center justify-center mb-5 group-hover:bg-amber-600/15 transition-colors duration-200">
                <Icon className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-zinc-900 font-semibold text-[0.95rem] mb-2">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
