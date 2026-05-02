import Link from 'next/link'
import { Check } from 'lucide-react'

const tiers = [
  {
    name: 'Starter', price: '€1,300', period: '/mo', setup: '+ €2,700 one-time build',
    description: 'For small firms of 1–5 attorneys getting started with AI.',
    highlight: false,
    features: ['50 AI document analyses/mo', 'Contract risk review', 'NDA & letter generation', 'Client intake forms', 'Up to 5 user seats', 'Email support'],
  },
  {
    name: 'Pro', price: '€2,100', period: '/mo', setup: '+ €2,700 one-time build',
    description: 'For growing firms of 6–15 attorneys scaling their operations.',
    highlight: true,
    features: ['200 AI document analyses/mo', 'Everything in Starter', 'Custom intake workflows', 'API access (REST)', 'Priority support (< 4h)', 'Slack integration', 'Advanced analytics'],
  },
  {
    name: 'Firm', price: '€3,800', period: '/mo', setup: '+ €2,700 one-time build',
    description: 'For established firms that want white-label and unlimited scale.',
    highlight: false,
    features: ['Unlimited AI analyses', 'Everything in Pro', 'White-label branding', 'Dedicated account manager', '99.9% SLA guarantee', 'Custom model fine-tuning', 'On-premise option'],
  },
]

export default function PricingTable() {
  return (
    <section id="pricing" className="bg-white py-24 lg:py-32 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-16">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tighter leading-tight">
            Straightforward pricing, built for firms.
          </h2>
          <p className="text-zinc-500 text-base mt-4 leading-relaxed">
            Every plan starts with a €2,700 tailored build. No hidden fees, no per-seat surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map(tier => (
            <div key={tier.name} className={`rounded-2xl p-8 flex flex-col ${tier.highlight ? 'bg-zinc-950 ring-1 ring-amber-600/30' : 'bg-stone-50 border border-zinc-200/80'}`}>
              {tier.highlight && (
                <span className="inline-block bg-amber-600/15 border border-amber-600/25 text-amber-500 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-5 w-fit">
                  Most popular
                </span>
              )}
              <h3 className={`text-lg font-bold tracking-tight ${tier.highlight ? 'text-white' : 'text-zinc-900'}`}>{tier.name}</h3>
              <div className="mt-3 mb-1">
                <span className={`text-4xl font-bold tracking-tighter ${tier.highlight ? 'text-white' : 'text-zinc-900'}`}>{tier.price}</span>
                <span className={`text-sm ml-1 ${tier.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>{tier.period}</span>
              </div>
              <p className={`text-xs mb-5 ${tier.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>{tier.setup}</p>
              <p className={`text-sm leading-relaxed mb-7 ${tier.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>{tier.description}</p>
              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.highlight ? 'text-amber-500' : 'text-amber-600'}`} strokeWidth={2.5} />
                    <span className={`text-sm ${tier.highlight ? 'text-zinc-300' : 'text-zinc-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`block text-center text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 active:scale-[0.98] ${tier.highlight ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}`}>
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
