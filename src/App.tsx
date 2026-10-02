import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HomePage } from './pages/HomePage';
import { PlansPricingPage } from './pages/PlansPricingPage';
import { ProjectRequestModal } from './components/ProjectRequestModal';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgressButton } from './components/ScrollProgressButton';
import { PlanOption, ServiceOption } from './types/projectRequest';

type PublicPage = 'home' | 'plans';

export default function App() {
  const [activePage, setActivePage] = useState<PublicPage>('home');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [preselectedPlan, setPreselectedPlan] = useState<PlanOption | ''>('');
  const [preselectedService, setPreselectedService] = useState<ServiceOption | ''>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleOpenRequestModal = (options?: {
    plan?: PlanOption;
    service?: ServiceOption;
  }) => {
    setPreselectedPlan(options?.plan || '');
    setPreselectedService(options?.service || '');
    setIsModalOpen(true);
  };

  const handleNavigate = (page: PublicPage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSubmissionSuccess = useCallback(
    (details: {
      requestId: string;
      submittedAt: string;
      businessName: string;
      service: string;
      plan: string;
    }) => {
      const toastId = `submission-${details.requestId}-${Date.now()}`;
      setToasts((prev) => [
        ...prev.filter((t) => t.referenceId !== details.requestId),
        {
          id: toastId,
          title: 'Project Request Received',
          description: `Thanks for submitting ${
            details.businessName ? `for ${details.businessName}` : 'your project'
          }. We'll review your request and contact you with the next steps.`,
          referenceId: details.requestId,
          meta: details.service || details.plan,
          durationMs: 10000
        }
      ]);
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#090A0F] text-[#F8FAFC] bg-tech-grid selection:bg-blue-600 selection:text-white relative">
      {/* Custom Tech Interactive Cursor */}
      <CustomCursor />

      {/* Floating Scroll to Top Progress Button */}
      <ScrollProgressButton />

      {/* Ambient Gradient Mesh Lights */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* =====================================================================
       * TOP NAVIGATION BAR (Strict 3-Zone Contract)
       * Zone 1: Brand Wordmark (Goodsify Development)
       * Zone 2: Clean text navigation links (Home & Plans & Pricing)
       * Zone 3: Primary action ("Start Your Project")
       * ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#090A0F]/85 backdrop-blur-md border-b border-[#1A1D27]/80 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark (single text element) */}
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors text-left whitespace-nowrap shrink-0 cursor-pointer"
          >
            Goodsify Development
          </button>

          {/* Zone 2: Clean Text Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className={`py-1 transition-all whitespace-nowrap shrink-0 border-b-2 ${
                activePage === 'home'
                  ? 'text-white border-blue-500 font-semibold shadow-[0_2px_8px_rgba(59,130,246,0.5)]'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('plans')}
              className={`py-1 transition-all whitespace-nowrap shrink-0 border-b-2 ${
                activePage === 'plans'
                  ? 'text-white border-blue-500 font-semibold shadow-[0_2px_8px_rgba(59,130,246,0.5)]'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Plans &amp; Pricing
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenRequestModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all whitespace-nowrap shrink-0 hover:scale-[1.03] active:scale-[0.98]"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
       * MAIN CONTENT WITH PAGE TRANSITION ANIMATIONS (2 Public Pages)
       * ===================================================================== */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activePage === 'home' ? (
            <motion.div
              key="home-page"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <HomePage
                onOpenRequestModal={handleOpenRequestModal}
                onNavigateToPlans={() => handleNavigate('plans')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="plans-page"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <PlansPricingPage onOpenRequestModal={handleOpenRequestModal} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* =====================================================================
       * QUIET FOOTER
       * ===================================================================== */}
      <footer className="border-t border-[#161822] bg-[#06070A] relative z-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-base font-bold text-white">
              Goodsify Development
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Web Development · E-Commerce Storefronts · Custom Applications
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-400">
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('plans')}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Plans &amp; Pricing
            </button>
            <button
              type="button"
              onClick={() => handleOpenRequestModal()}
              className="text-blue-400 font-semibold hover:text-blue-300 transition-colors whitespace-nowrap"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="border-t border-[#12141C] max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} Goodsify Development. All rights reserved.</span>
          <span className="font-mono">All packages listed in CAD · Powered by Google Sheets Sync</span>
        </div>
      </footer>

      {/* =====================================================================
       * 5-STEP PROJECT REQUEST MODAL
       * ===================================================================== */}
      <ProjectRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPlan={preselectedPlan}
        initialService={preselectedService}
        onSubmissionSuccess={handleSubmissionSuccess}
      />

      {/* =====================================================================
       * PERSISTENT TOAST NOTIFICATIONS
       * ===================================================================== */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
