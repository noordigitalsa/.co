import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Sparkles, Layers, Cpu, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { PlanOption, ServiceOption } from '../types/projectRequest';
import { TypewriterText } from '../components/TypewriterText';
import { R3FLaptopCanvas } from '../components/R3FLaptopCanvas';
import { CountUpNumber } from '../components/CountUpNumber';
import showcaseCommerceImage from '../assets/images/showcase_ecommerce_architecture_1790880821416.jpg';

interface HomePageProps {
  onOpenRequestModal: (options?: {
    plan?: PlanOption;
    service?: ServiceOption;
  }) => void;
  onNavigateToPlans: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenRequestModal,
  onNavigateToPlans
}) => {
  const [showcaseImgError, setShowcaseImgError] = useState(false);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 relative overflow-hidden">
      {/* Dynamic 3D ambient radial glow mesh */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* =====================================================================
       * 1. HERO SECTION WITH R3F 3D FALLING LAPTOP & TYPEWRITER HEADLINE
       * ===================================================================== */}
      <section className="pt-8 sm:pt-14 max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs font-mono text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-semibold">Goodsify Development</span>
              <span aria-hidden="true" className="text-blue-500/60">·</span>
              <span>Fixed CAD Pricing</span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              Websites, storefronts, and{' '}
              <TypewriterText
                phrases={[
                  'custom web apps.',
                  'e-commerce platforms.',
                  'high-speed portals.',
                  'mobile applications.'
                ]}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                cursorClassName="bg-blue-400"
              />
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Goodsify Development engineers fast, mobile-first business websites, e-commerce storefronts, and custom digital software. Real-time Google Sheets project intake with transparent fixed packages starting at $70 CAD.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onOpenRequestModal()}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_25px_rgba(37,99,235,0.45)] hover:shadow-[0_0_35px_rgba(37,99,235,0.7)] transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToPlans}
                className="px-6 py-3.5 bg-slate-900/80 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 hover:bg-slate-800/80"
              >
                View Plans &amp; Pricing
              </button>
            </div>

            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                  <CountUpNumber end={70} prefix="$" suffix=" CAD" />
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Starter Package</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
                  <CountUpNumber end={100} suffix="%" />
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Core Web Vitals</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-sky-400 tabular-nums">
                  <CountUpNumber end={5} suffix="-Step" />
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Live Intake Form</p>
              </div>
            </div>
          </motion.div>

          {/* React Three Fiber 3D Laptop Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="w-full max-w-[560px] bg-gradient-to-b from-slate-900/70 via-slate-950/80 to-[#0b0d14] border border-slate-800/90 rounded-2xl p-3 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-md relative group">
              <div className="absolute -top-px -left-px right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <R3FLaptopCanvas />
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
       * 2. CORE CAPABILITIES (BENTO GRID WITH SCROLL REVEAL ANIMATIONS)
       * ===================================================================== */}
      <section id="capabilities" className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="border-t border-slate-800/80 pt-12 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-xs font-mono text-blue-400 mb-2 uppercase tracking-wider font-semibold">
              Capabilities &amp; Deliverables
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Engineered for clarity, conversion, and long-term ownership.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenRequestModal()}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start md:self-auto group"
          >
            <span>Get Started with a Custom Brief</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Span-2 Card: Business & Informational Websites */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 bg-[#0F111A]/90 backdrop-blur-sm border border-[#1E2333] hover:border-blue-500/50 rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_35px_rgba(37,99,235,0.15)] group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4 font-mono">
                <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  01. Web Presence
                </span>
                <span>Starter ($70 CAD) · Business ($100 CAD)</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                01. Informational &amp; Business Websites
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mb-6">
                Clean, fast-loading websites structured for local businesses, service providers, and growing brands. Designed with crisp typography, mobile responsiveness, and direct lead capture without bloated templates.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 border-t border-slate-800/80 pt-5 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Mobile &amp; desktop responsive layouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Custom brand typography &amp; color system</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Service breakdowns &amp; inquiry routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Domain &amp; hosting setup guidance</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() =>
                  onOpenRequestModal({
                    service: 'Business Website',
                    plan: 'Business — $100 CAD'
                  })
                }
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started — Business Website
              </button>
              <button
                type="button"
                onClick={() =>
                  onOpenRequestModal({
                    service: 'Informational Website',
                    plan: 'Starter — $70 CAD'
                  })
                }
                className="text-xs font-medium text-slate-400 hover:text-white underline transition-colors whitespace-nowrap"
              >
                Request Informational Site ($70 CAD)
              </button>
            </div>
          </motion.div>

          {/* Span-1 Card: E-Commerce Storefronts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#0F111A]/90 backdrop-blur-sm border border-[#1E2333] hover:border-blue-500/50 rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_35px_rgba(37,99,235,0.15)] group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors" />

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4 font-mono">
                <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  02. Online Retail
                </span>
                <span className="text-emerald-400 font-semibold">$250 CAD</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                02. E-Commerce Websites
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Structured product catalogs, collection filtering, and streamlined checkout flows for physical or digital goods.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-5 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Product catalog &amp; SKU architecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Mobile-optimized photography grids</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Payment &amp; shipping configuration</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() =>
                onOpenRequestModal({
                  service: 'E-Commerce Website',
                  plan: 'Professional — $250 CAD'
                })
              }
              className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all whitespace-nowrap text-center hover:scale-[1.02] active:scale-[0.98]"
            >
              Start E-Commerce Project
            </button>
          </motion.div>

          {/* Bottom Row: Custom Web & Mobile Applications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 bg-[#0F111A]/90 backdrop-blur-sm border border-[#1E2333] hover:border-blue-500/50 rounded-2xl p-7 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-300 hover:shadow-[0_0_35px_rgba(37,99,235,0.15)] group relative overflow-hidden"
          >
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  03. Custom Engineering
                </span>
                <span aria-hidden="true">·</span>
                <span>Web Applications &amp; Mobile Apps</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                03. Custom Web Applications &amp; Mobile Apps
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Need a custom booking workflow, internal business tool, client portal, or cross-platform mobile application? Submit your technical requirements, reference links, and target deadline for a tailored engineering roadmap.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onOpenRequestModal({
                      service: 'Custom Web Application',
                      plan: 'Custom Project'
                    })
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                >
                  Request Custom Web App
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onOpenRequestModal({
                      service: 'Custom Mobile App',
                      plan: 'Custom Project'
                    })
                  }
                  className="px-4 py-2 border border-slate-700 bg-slate-900/80 hover:border-slate-500 text-slate-200 text-xs font-medium rounded-lg transition-colors whitespace-nowrap hover:bg-slate-800"
                >
                  Request Custom Mobile App
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-[#090A0F] shadow-lg group-hover:border-blue-500/40 transition-colors">
                {!showcaseImgError ? (
                  <img
                    src={showcaseCommerceImage}
                    alt="Minimalist responsive e-commerce and web application display on laptop and mobile"
                    referrerPolicy="no-referrer"
                    onError={() => setShowcaseImgError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 text-xs font-mono text-slate-500">
                    Responsive Multi-Device Architecture
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
       * 3. HOW IT WORKS — CLIENT INTAKE TO LAUNCH WITH SCROLL STAGGER
       * ===================================================================== */}
      <section id="process" className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="border-t border-slate-800/80 pt-12 mb-10"
        >
          <p className="text-xs font-mono text-blue-400 mb-2 uppercase tracking-wider font-semibold">
            Structured Project Workflow
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            From project brief to live deployment in four clear steps.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Submit Project Brief',
              description:
                'Complete our 5-step Project Request Form with your service type, selected plan, deadline, and existing brand assets.'
            },
            {
              step: '02',
              title: 'Scope & Asset Review',
              description:
                'We review your submission, verify your domain, hosting, and product content needs, and confirm your build schedule.'
            },
            {
              step: '03',
              title: 'Design & Development',
              description:
                'We build your responsive website or application with clean typography, structured navigation, and fast load performance.'
            },
            {
              step: '04',
              title: 'Quality Check & Launch',
              description:
                'After you review the live preview on mobile and desktop, we connect your domain and launch your project.'
            }
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#0F111A]/90 backdrop-blur-sm border border-[#1E2333] hover:border-blue-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(37,99,235,0.1)] group"
            >
              <div>
                <span className="font-mono text-xs text-blue-400 block mb-3 font-semibold group-hover:text-blue-300 transition-colors">
                  Step {item.step}
                </span>
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =====================================================================
       * 4. PRIMARY CALL TO ACTION SECTION WITH GLOW & PARTICLES
       * ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-950/70 via-slate-900/90 to-indigo-950/70 border border-blue-500/30 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-[0_0_50px_rgba(37,99,235,0.2)] backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 max-w-xl relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Goodsify Development Intake</span>
            </div>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              Tell us what you are building and receive your project roadmap.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Takes less than two minutes. Choose your service tier, let us know which assets you already have, and submit your request directly to our Google Sheets backend.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0 relative z-10">
            <button
              type="button"
              onClick={() => onOpenRequestModal()}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_25px_rgba(37,99,235,0.45)] transition-all flex items-center gap-2 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onNavigateToPlans}
              className="px-5 py-3.5 border border-slate-700 bg-slate-900/80 hover:border-slate-500 text-slate-200 text-sm font-medium rounded-lg transition-colors whitespace-nowrap hover:bg-slate-800"
            >
              Compare Plans
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
