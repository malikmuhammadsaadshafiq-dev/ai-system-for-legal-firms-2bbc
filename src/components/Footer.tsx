import Link from 'next/link'
import { Scale } from 'lucide-react'

const columns = [
  { heading: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Live Demo', href: '/demo' }, { label: 'Changelog', href: '#' }] },
  { heading: 'Platform', links: [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Case Management', href: '/dashboard/cases' }, { label: 'Document AI', href: '/dashboard/documents' }, { label: 'Client Intake', href: '/dashboard/intake' }] },
  { heading: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Privacy Policy', href: '#' }, { label: 'Terms of Service', href: '#' }, { label: 'Contact', href: '#' }] },
]

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-white font-semibold tracking-tight">Lexara</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[30ch]">
              AI built for law firms that want to spend more time on law.
            </p>
            <p className="text-zinc-600 text-xs mt-6">
              From €2,700 build · €1,300/mo
            </p>
          </div>
          {columns.map(col => (
            <div key={col.heading}>
              <h4 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-4">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors duration-200">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs">© 2024 Lexara GmbH. All rights reserved.</p>
          <p className="text-zinc-600 text-xs">GDPR compliant · ISO 27001 · Hosted in Frankfurt, DE</p>
        </div>
      </div>
    </footer>
  )
}
