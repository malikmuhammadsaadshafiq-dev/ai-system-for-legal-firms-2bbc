'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  { q: 'What document types does Lexara analyze?', a: 'Lexara works with PDFs, DOCX, and scanned documents (via OCR). It handles NDAs, service agreements, employment contracts, lease agreements, M&A documents, IP licences, and more. If a document type is not yet supported, we add it as part of your onboarding build.' },
  { q: 'How secure is our client data?', a: 'All documents are encrypted in transit (TLS 1.3) and at rest (AES-256). Data is stored exclusively on servers in Frankfurt, Germany. We never use your data to train models. A GDPR-compliant Data Processing Agreement is included with every plan.' },
  { q: "Can Lexara work alongside our existing case management system?", a: 'Yes. The Pro and Firm plans include a REST API that connects Lexara to platforms like Actaport, DATEV, or any custom system. We also provide a Zapier integration for no-code workflows during the build phase.' },
  { q: "What is included in the €2,700 setup fee?", a: 'The setup fee covers a 2-week tailored build: we configure your firm\'s intake forms, upload your document templates, set up user roles, integrate with your existing tools, and provide a 3-hour onboarding session for your team. It is a one-time cost.' },
  { q: 'How accurate is the AI contract analysis?', a: 'In internal benchmarks against German and Austrian law firm associates, Lexara identifies 94.3% of flagged clauses correctly. We recommend treating AI analysis as a first-pass review — a trained eye still makes the final call. Every report includes a confidence score per clause.' },
  { q: 'Is there a free trial?', a: 'We offer a 14-day pilot on the Starter plan at no cost — no credit card required. If you need to test the platform against your own documents before committing, that is exactly what the pilot is designed for. Book a demo to get started.' },
]

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-white py-24 border-t border-zinc-100">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-4">FAQ</p>
          <h2 className="text-4xl font-bold text-zinc-900 tracking-tighter">Common questions.</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-6 text-left group"
              >
                <span className={`text-[0.95rem] font-medium leading-snug transition-colors duration-200 ${open === i ? 'text-zinc-900' : 'text-zinc-700 group-hover:text-zinc-900'}`}>
                  {faq.q}
                </span>
                <span className="flex-shrink-0 mt-0.5">
                  {open === i
                    ? <Minus className="w-4 h-4 text-amber-600" strokeWidth={2} />
                    : <Plus className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" strokeWidth={2} />
                  }
                </span>
              </button>
              {open === i && (
                <p className="mt-4 text-zinc-500 text-sm leading-relaxed pr-10">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
