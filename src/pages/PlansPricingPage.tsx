import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PlanOption, ServiceOption } from '../types/projectRequest';
import { CountUpNumber } from '../components/CountUpNumber';

interface PlansPricingPageProps {
  onOpenRequestModal: (options?: {
    plan?: PlanOption;
    service?: ServiceOption;
  }) => void;
}

interface PricingTier {
  id: string;
  name: string;
  planValue: PlanOption;
  defaultService: ServiceOption;
  priceNumber: number | null;
  priceDisplay: string;
  billingNote: string;
  recommendedFor: string;
  description: string;
  deliverables: string[];
  highlighted?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    planValue: 'Starter — $70 CAD',
    defaultService: 'Informational Website',
    priceNumber: 70,
    priceDisplay: '$70 CAD',
    billingNote: 'One-time build fee',
    recommendedFor: 'Informational Websites · New Launches',
    description:
      'Essential web presence for new brands, personal businesses, and single-focus service offerings.',
    deliverables: [
      'Clean responsive layout (Mobile & Desktop)',
      'Core informational sections & brand introduction',
      'Contact & inquiry routing setup',
      'Social media profile integration',
      'Domain connection guidance'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    planValue: 'Business — $100 CAD',
    defaultService: 'Business Website',
    priceNumber: 100,
    priceDisplay: '$100 CAD',
    billingNote: 'One-time build fee',
    recommendedFor: 'Service Businesses · Growing Brands',
    description:
      'Complete multi-section business website built to establish credibility, showcase services, and convert visitors.',
    deliverables: [
      'Multi-section architecture & custom navigation',
      'Detailed service or portfolio showcase',
      'Validated client lead-capture workflow',
      'On-page search engine structure (titles & metadata)',
      'Performance & mobile speed optimization',
      'Domain & hosting setup assistance'
    ],
    highlighted: true
  },
  {
    id: 'professional',
    name: 'Professional',
    planValue: 'Professional — $250 CAD',
    defaultService: 'E-Commerce Website',
    priceNumber: 250,
    priceDisplay: '$250 CAD',
    billingNote: 'One-time build fee',
    recommendedFor: 'E-Commerce Storefronts · Full Catalogs',
    description:
      'Full-featured digital storefront or comprehensive multi-page platform ready for online product sales.',
    deliverables: [
      'E-Commerce product catalog & category structure',
      'Product detail views, photos & pricing configuration',
      'Cart & checkout workflow setup',
      'Mobile-first retail experience',
      'Existing brand & content integration',
      'Launch checklist & handover walkthrough'
    ]
  },
  {
    id: 'custom',
    name: 'Custom Project',
    planValue: 'Custom Project',
    defaultService: 'Custom Web Application',
    priceNumber: null,
    priceDisplay: 'Custom',
    billingNote: 'Scoped to specification',
    recommendedFor: 'Web Applications · Mobile Apps · Bespoke Systems',
    description:
      'Tailored architecture for custom web applications, mobile apps, booking engines, or specialized integrations.',
    deliverables: [
      'Custom technical architecture & database design',
      'Web application or cross-platform mobile build',
      'Custom user flows & business logic',
      'Third-party API & workflow integrations',
      'Dedicated milestone schedule & deployment support'
    ]
  }
];

export const PlansPricingPage: React.FC<PlansPricingPageProps> = ({
  onOpenRequestModal
}) => {
  return (
    <div className="space-y-20 pb-20 relative overflow-hidden">
      {/* Background glow mesh */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[400px] bg-gradient-to-b from-blue-600/10 via-sky-600/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* =====================================================================
       * 1. HEADER & PRICING CARDS WITH STAGGER ANIMATIONS
       * ===================================================================== */}
      <section className="pt-10 sm:pt-16 max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs font-mono text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Goodsify Development</span>
            <span aria-hidden="true">·</span>
            <span>Transparent CAD Packages</span>
          </div>

          <h1
            className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4"
            style={{ textWrap: 'balance' }}
          >
            Straightforward pricing for every stage of your business.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Select the package that matches your project requirements, or request a custom specification for web and mobile applications. Clicking any plan opens the 5-step Project Request Form.
          </p>
        </motion.div>

        {/* 4-Tier Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_TIERS.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bg-[#0F111A]/95 backdrop-blur-sm border rounded-2xl flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 hover:scale-[1.02] ${
                tier.highlighted
                  ? 'border-blue-500 plan-glow ring-1 ring-blue-500/60'
                  : 'border-[#1E2333] hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(37,99,235,0.18)]'
              }`}
            >
              <div>
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h2 className="font-display text-xl font-bold text-white">
                    {tier.name}
                  </h2>
                  {tier.highlighted && (
                    <span className="font-mono text-[11px] text-blue-300 font-semibold px-2 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                      Most Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-5">{tier.recommendedFor}</p>

                <div className="pb-5 mb-5 border-b border-slate-800/80">
                  <div className="font-mono text-3xl font-bold text-white tabular-nums">
                    {tier.priceNumber !== null ? (
                      <CountUpNumber end={tier.priceNumber} prefix="$" suffix=" CAD" />
                    ) : (
                      tier.priceDisplay
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{tier.billingNote}</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {tier.description}
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200 mb-8">
                  {tier.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() =>
                  onOpenRequestModal({
                    plan: tier.planValue,
                    defaultService: tier.defaultService
                  } as any)
                }
                className={`w-full py-3 px-4 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                  tier.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.45)] hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =====================================================================
       * 2. SPECIFICATION & DELIVERABLE COMPARISON TABLE
       * ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-slate-800/80 pt-12 mb-8"
        >
          <p className="text-xs font-mono text-blue-400 mb-2 uppercase tracking-wider font-semibold">
            Package Comparison
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            What is included in each tier.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0F111A]/95 border border-[#1E2333] rounded-2xl overflow-x-auto shadow-2xl backdrop-blur-sm"
        >
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[#1E2333] bg-[#141724] text-xs font-mono text-slate-300">
                <th className="py-3.5 px-5 font-semibold">Deliverable / Feature</th>
                <th className="py-3.5 px-4 font-semibold tabular-nums">Starter ($70 CAD)</th>
                <th className="py-3.5 px-4 font-semibold tabular-nums text-blue-400">Business ($100 CAD)</th>
                <th className="py-3.5 px-4 font-semibold tabular-nums">Professional ($250 CAD)</th>
                <th className="py-3.5 px-4 font-semibold">Custom Project</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2333] text-xs text-slate-300">
              {[
                {
                  feature: 'Primary Use Case',
                  starter: 'Informational Site',
                  business: 'Business & Lead Gen',
                  professional: 'E-Commerce & Retail',
                  custom: 'Web / Mobile App'
                },
                {
                  feature: 'Mobile & Desktop Responsive',
                  starter: 'Included',
                  business: 'Included',
                  professional: 'Included',
                  custom: 'Included'
                },
                {
                  feature: 'Product Catalog Setup',
                  starter: '—',
                  business: 'Up to 5 items',
                  professional: 'Full Store Catalog',
                  custom: 'Custom Architecture'
                },
                {
                  feature: 'Existing Brand & Asset Integration',
                  starter: 'Included',
                  business: 'Included',
                  professional: 'Included',
                  custom: 'Included'
                },
                {
                  feature: 'Domain & Hosting Guidance',
                  starter: 'Included',
                  business: 'Included',
                  professional: 'Included',
                  custom: 'Included'
                },
                {
                  feature: 'Custom Database / App Logic',
                  starter: '—',
                  business: '—',
                  professional: 'Standard Checkout',
                  custom: 'Full Custom Spec'
                }
              ].map((row) => (
                <tr key={row.feature} className="hover:bg-[#161926] transition-colors">
                  <td className="py-3.5 px-5 font-medium text-white">{row.feature}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{row.starter}</td>
                  <td className="py-3.5 px-4 font-mono text-blue-300 font-semibold">
                    {row.business}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-200 font-medium">
                    {row.professional}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-indigo-400 font-semibold">{row.custom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* =====================================================================
       * 3. FREQUENTLY ASKED QUESTIONS & DIRECT CTA
       * ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="border-t border-slate-800/80 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              Common Questions
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Everything you need to know before starting.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Not sure which package fits your project? Open the Project Request Form and select the closest option—we review every submission personally before work begins.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenRequestModal()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.45)] transition-all inline-flex items-center gap-2 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                q: 'What if I do not have a domain or hosting yet?',
                a: 'No problem. In Step 4 of our Project Request Form, simply mark "No" for Domain or Hosting. We will guide you through registering and connecting them.'
              },
              {
                q: 'What if I do not have a logo or website text ready?',
                a: 'You can mark which assets you already have (Yes/No) in the form. We can work with your existing materials or help structure clean typography and layout content.'
              },
              {
                q: 'Are the prices listed in Canadian Dollars?',
                a: 'Yes. Starter ($70 CAD), Business ($100 CAD), and Professional ($250 CAD) are listed in Canadian Dollars with transparent scope.'
              },
              {
                q: 'What happens immediately after I submit the form?',
                a: 'Your project request is recorded in our project system with Status = NEW. We review your scope, deadline, and reference websites, then email you with the next steps.'
              }
            ].map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#0F111A]/95 border border-[#1E2333] hover:border-slate-700 rounded-2xl p-5 transition-colors"
              >
                <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
