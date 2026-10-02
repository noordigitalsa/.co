import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  X
} from 'lucide-react';
import {
  EXISTING_RESOURCE_KEYS,
  ExistingResourcesMap,
  PLAN_OPTIONS,
  PlanOption,
  ProjectRequestFormData,
  SERVICE_OPTIONS,
  ServiceOption,
  YesNoChoice
} from '../types/projectRequest';
import {
  getActiveAppsScriptUrl,
  submitProjectRequestToGoogleSheets
} from '../config/appsScript';

interface ProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: PlanOption | '';
  initialService?: ServiceOption | '';
  onSubmissionSuccess?: (details: {
    requestId: string;
    submittedAt: string;
    businessName: string;
    service: string;
    plan: string;
  }) => void;
}

const STEP_LABELS = [
  { number: '01', title: 'Project' },
  { number: '02', title: 'Business' },
  { number: '03', title: 'Project Details' },
  { number: '04', title: 'Existing Resources' },
  { number: '05', title: 'Additional Notes' }
];

const INITIAL_RESOURCES: ExistingResourcesMap = {
  'Domain': '',
  'Hosting': '',
  'Logo / Branding': '',
  'Product Photos': '',
  'Product Information': '',
  'Social Media': '',
  'Website Content': ''
};

function getInitialFormState(
  initialPlan?: PlanOption | '',
  initialService?: ServiceOption | ''
): ProjectRequestFormData {
  let defaultBudget = '';
  if (initialPlan === 'Starter — $70 CAD') defaultBudget = '$70 CAD';
  else if (initialPlan === 'Business — $100 CAD') defaultBudget = '$100 CAD';
  else if (initialPlan === 'Professional — $250 CAD') defaultBudget = '$250 CAD';

  return {
    service: initialService || '',
    plan: initialPlan || '',
    fullName: '',
    businessName: '',
    email: '',
    instagram: '',
    websiteType: '',
    numberOfProducts: '',
    budget: defaultBudget,
    desiredDeadline: '',
    projectDescription: '',
    referenceWebsites: '',
    existingResources: { ...INITIAL_RESOURCES },
    additionalNotes: ''
  };
}

export const ProjectRequestModal: React.FC<ProjectRequestModalProps> = ({
  isOpen,
  onClose,
  initialPlan = '',
  initialService = '',
  onSubmissionSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ProjectRequestFormData>(() =>
    getInitialFormState(initialPlan, initialService)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<{
    requestId: string;
    submittedAt: string;
  } | null>(null);

  // Sync initialPlan / initialService when modal opens
  useEffect(() => {
    if (isOpen) {
      if (!submittedRecord) {
        setFormData((prev) => {
          const nextPlan = initialPlan || prev.plan;
          let nextBudget = prev.budget;
          if (!nextBudget && nextPlan) {
            if (nextPlan === 'Starter — $70 CAD') nextBudget = '$70 CAD';
            else if (nextPlan === 'Business — $100 CAD') nextBudget = '$100 CAD';
            else if (nextPlan === 'Professional — $250 CAD') nextBudget = '$250 CAD';
          }
          return {
            ...prev,
            plan: nextPlan,
            service: initialService || prev.service,
            budget: nextBudget
          };
        });
      }
    }
  }, [isOpen, initialPlan, initialService, submittedRecord]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const clearFieldError = (fieldKey: string) => {
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
    }
    if (submitError) setSubmitError(null);
  };

  const handleSelectService = (service: ServiceOption) => {
    setFormData((prev) => ({
      ...prev,
      service,
      // Pre-fill websiteType if empty to save the client typing time
      websiteType: prev.websiteType || (service !== 'Other' ? service : '')
    }));
    clearFieldError('service');
  };

  const handleSelectPlan = (plan: PlanOption) => {
    let defaultBudget = formData.budget;
    if (plan === 'Starter — $70 CAD') defaultBudget = '$70 CAD';
    else if (plan === 'Business — $100 CAD') defaultBudget = '$100 CAD';
    else if (plan === 'Professional — $250 CAD') defaultBudget = '$250 CAD';
    else if (
      plan === 'Custom Project' &&
      ['$70 CAD', '$100 CAD', '$250 CAD'].includes(formData.budget)
    ) {
      defaultBudget = '';
    }

    setFormData((prev) => ({
      ...prev,
      plan,
      budget: defaultBudget
    }));
    clearFieldError('plan');
  };

  const handleResourceChoice = (key: keyof ExistingResourcesMap, choice: YesNoChoice) => {
    setFormData((prev) => ({
      ...prev,
      existingResources: {
        ...prev.existingResources,
        [key]: choice
      }
    }));
    clearFieldError(`resource_${key}`);
    clearFieldError('existingResources');
  };

  const handleMarkRemainingNo = () => {
    setFormData((prev) => {
      const updated = { ...prev.existingResources };
      for (const key of EXISTING_RESOURCE_KEYS) {
        if (!updated[key]) {
          updated[key] = 'No';
        }
      }
      return { ...prev, existingResources: updated };
    });
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.service) {
        newErrors.service = 'Please select what type of project you need.';
      }
      if (!formData.plan) {
        newErrors.plan = 'Please select the plan you are interested in.';
      }
    } else if (step === 2) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required.';
      }
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business or brand name is required.';
      }
      const emailTrimmed = formData.email.trim();
      if (!emailTrimmed) {
        newErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
        newErrors.email = 'Please enter a valid email address (e.g., name@domain.com).';
      }
    } else if (step === 3) {
      if (!formData.websiteType.trim()) {
        newErrors.websiteType = 'Please specify the website or application type.';
      }
      if (!formData.numberOfProducts.trim()) {
        newErrors.numberOfProducts = 'Please enter the number of products (enter 0 if none).';
      }
      if (!formData.budget.trim()) {
        newErrors.budget = 'Please enter your estimated budget.';
      }
      if (!formData.desiredDeadline.trim()) {
        newErrors.desiredDeadline = 'Please specify your desired deadline or timeframe.';
      }
      if (!formData.projectDescription.trim()) {
        newErrors.projectDescription = 'Please provide a brief description of your project.';
      }
    } else if (step === 4) {
      const unanswered = EXISTING_RESOURCE_KEYS.filter(
        (key) => !formData.existingResources[key]
      );
      if (unanswered.length > 0) {
        newErrors.existingResources = `Please select Yes or No for all items (${unanswered.length} remaining).`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      handleNextStep();
      return;
    }

    // Validate all prior steps just in case
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const activeUrl = getActiveAppsScriptUrl();
      if (!activeUrl) {
        throw new Error('Google Apps Script Web App URL is not configured.');
      }
      const result = await submitProjectRequestToGoogleSheets(formData);
      setSubmittedRecord({
        requestId: result.requestId,
        submittedAt: result.submittedAt
      });
      onSubmissionSuccess?.({
        requestId: result.requestId,
        submittedAt: result.submittedAt,
        businessName: formData.businessName.trim(),
        service: formData.service,
        plan: formData.plan
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to reach the Google Apps Script endpoint. Please verify your Web App URL and deployment permissions.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    if (submittedRecord) {
      onSubmissionSuccess?.({
        requestId: submittedRecord.requestId,
        submittedAt: submittedRecord.submittedAt,
        businessName: formData.businessName.trim(),
        service: formData.service,
        plan: formData.plan
      });
    }
    setSubmittedRecord(null);
    setCurrentStep(1);
    setFormData(getInitialFormState('', ''));
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-request-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#0D0F17] border border-[#202538] text-white shadow-2xl rounded-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#121522] border-b border-[#202538] shrink-0">
          <div>
            <p className="text-xs font-mono text-blue-400">
              GOODSiFY Development · Project Intake
            </p>
            <h2
              id="project-request-modal-title"
              className="font-display text-lg sm:text-xl font-bold text-white tracking-tight"
            >
              {submittedRecord ? 'Submission Confirmed' : 'Start Your Project'}
            </h2>
          </div>

          <button
            type="button"
            onClick={submittedRecord ? handleResetAndClose : onClose}
            disabled={isSubmitting}
            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-blue-500"
            aria-label="Close project request modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator (Hidden after submission) */}
        {!submittedRecord && (
          <div className="bg-[#10131E] border-b border-[#202538] px-6 pt-3 pb-4 shrink-0">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              {STEP_LABELS.map((step, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => {
                      if (stepNum < currentStep) {
                        setErrors({});
                        setSubmitError(null);
                        setCurrentStep(stepNum);
                      }
                    }}
                    disabled={stepNum > currentStep}
                    className={`group flex items-center gap-1.5 text-left transition-colors ${
                      stepNum < currentStep ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-[0_0_12px_rgba(37,99,235,0.5)] border border-blue-400'
                          : isCompleted
                          ? 'bg-[#1E2436] text-blue-300 border border-[#2B344D]'
                          : 'bg-[#141724] text-slate-500 border border-[#22273A]'
                      }`}
                    >
                      {isCompleted ? '✓' : step.number}
                    </span>
                    <span
                      className={`hidden sm:inline text-xs whitespace-nowrap ${
                        isActive
                          ? 'font-semibold text-white'
                          : isCompleted
                          ? 'font-medium text-slate-300 group-hover:text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Thin Progress Bar */}
            <div className="w-full h-1 bg-[#181C2A] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-transform duration-200 origin-left shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                style={{ transform: `scaleX(${progressPercentage / 100})` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-200">
          {submittedRecord ? (
            /* ================================================================
             * AFTER SUBMISSION: PROFESSIONAL SUCCESS SCREEN (DARK THEME)
             * ================================================================ */
            <div className="py-6">
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-xl mb-6 shadow-[0_0_25px_rgba(37,99,235,0.5)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <p className="font-mono text-xs text-blue-400 mb-2 font-semibold">
                REFERENCE ID · {submittedRecord.requestId}
              </p>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                PROJECT REQUEST RECEIVED
              </h3>

              <p className="text-base text-slate-300 leading-relaxed max-w-xl mb-8">
                Thanks for submitting your project. We&apos;ll review your request and contact you with the next steps.
              </p>

              <div className="bg-[#121522] border border-[#22273A] rounded-xl p-5 mb-8">
                <p className="text-xs font-mono text-slate-400 mb-3 pb-2 border-b border-slate-800">
                  Submitted Project Summary
                </p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div>
                    <dt className="text-xs text-slate-400">Client &amp; Business</dt>
                    <dd className="font-medium text-white">
                      {formData.fullName} · {formData.businessName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-400">Contact Email</dt>
                    <dd className="font-mono text-xs text-slate-200 mt-0.5">
                      {formData.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-400">Service &amp; Plan</dt>
                    <dd className="font-medium text-white">
                      {formData.service} · {formData.plan}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-400">Target Deadline &amp; Budget</dt>
                    <dd className="font-mono text-xs text-slate-200 mt-0.5">
                      {formData.desiredDeadline} · {formData.budget}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all whitespace-nowrap"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            /* ================================================================
             * MULTI-STEP FORM (STEPS 1 TO 5 - DARK THEME)
             * ================================================================ */
            <form id="goodsify-project-form" onSubmit={handleSubmit} noValidate>
              {/* STEP 1 — PROJECT */}
              {currentStep === 1 && (
                <div className="space-y-7">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <label className="block text-base font-semibold text-white">
                        What do you need? <span className="text-rose-400">*</span>
                      </label>
                      <span className="text-xs font-mono text-slate-400">Step 1 of 5</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3.5">
                      Select the primary digital product or website category for your build.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SERVICE_OPTIONS.map((option) => {
                        const selected = formData.service === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelectService(option.value)}
                            className={`text-left p-4 rounded-lg border transition-all flex flex-col justify-between ${
                              selected
                                ? 'bg-[#182035] border-blue-500 ring-1 ring-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.25)]'
                                : 'bg-[#141724] border-[#22273A] hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 w-full mb-1">
                              <span className="text-sm font-semibold text-white">
                                {option.value}
                              </span>
                              <span
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                  selected
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'border-slate-600'
                                }`}
                              >
                                {selected && <Check className="w-3 h-3" />}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 leading-relaxed">
                              {option.summary}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.service && (
                      <p className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.service}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-base font-semibold text-white mb-1">
                      Which plan are you interested in? <span className="text-rose-400">*</span>
                    </label>
                    <p className="text-xs text-slate-400 mb-3.5">
                      Choose a fixed-tier package or request a custom project specification.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PLAN_OPTIONS.map((plan) => {
                        const selected = formData.plan === plan.value;
                        return (
                          <button
                            key={plan.value}
                            type="button"
                            onClick={() => handleSelectPlan(plan.value)}
                            className={`text-left p-4 rounded-lg border transition-all flex flex-col justify-between ${
                              selected
                                ? 'bg-[#182035] border-blue-500 ring-1 ring-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.25)]'
                                : 'bg-[#141724] border-[#22273A] hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-baseline justify-between gap-2 w-full mb-1">
                              <span className="text-sm font-semibold text-white">
                                {plan.title}
                              </span>
                              <span className="font-mono text-xs font-semibold text-blue-400">
                                {plan.price}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 leading-relaxed">
                              {plan.summary}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.plan && (
                      <p className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.plan}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2 — BUSINESS */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="border-b border-slate-800 pb-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base font-semibold text-white">
                        Business &amp; Contact Information
                      </h3>
                      <span className="text-xs font-mono text-slate-400">Step 2 of 5</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tell us who we&apos;ll be collaborating with on this build.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="field-fullName"
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                    >
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="field-fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                        clearFieldError('fullName');
                      }}
                      placeholder="e.g., Jordan Vance"
                      className="w-full px-3.5 py-2.5 bg-[#151824] border border-[#262C40] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="field-businessName"
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                    >
                      Business / Brand Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="field-businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, businessName: e.target.value }));
                        clearFieldError('businessName');
                      }}
                      placeholder="e.g., Vance Studio Inc."
                      className="w-full px-3.5 py-2.5 bg-[#151824] border border-[#262C40] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.businessName && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.businessName}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="field-email"
                        className="block text-xs font-semibold text-slate-300 mb-1.5"
                      >
                        Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="field-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, email: e.target.value }));
                          clearFieldError('email');
                        }}
                        placeholder="you@company.com"
                        className="w-full px-3.5 py-2.5 bg-[#151824] border border-[#262C40] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="field-instagram"
                        className="block text-xs font-semibold text-slate-300 mb-1.5"
                      >
                        Instagram username <span className="text-slate-500 font-normal">(optional)</span>
                      </label>
                      <input
                        id="field-instagram"
                        type="text"
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, instagram: e.target.value }))
                        }
                        placeholder="@yourbrand"
                        className="w-full px-3.5 py-2.5 bg-[#151824] border border-[#262C40] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — PROJECT DETAILS */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="border-b border-slate-800 pb-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base font-semibold text-white">
                        Project Details &amp; Scope
                      </h3>
                      <span className="text-xs font-mono text-slate-400">Step 3 of 5</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Define your architecture, catalog size, budget, and target timeline.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="field-websiteType"
                        className="block text-xs font-semibold text-slate-300 mb-1.5"
                      >
                        Website type <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="field-websiteType"
                        type="text"
                        value={formData.websiteType}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, websiteType: e.target.value }));
                          clearFieldError('websiteType');
                        }}
                        placeholder="e.g., Retail Storefront, Service Booking, Portfolio"
                        className="w-full px-3.5 py-2.5 bg-[#151824] border border-[#262C40] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      {errors.websiteType && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.websiteType}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="field-numberOfProducts"
                        className="block text-xs font-semibold text-slate-300 mb-1.5"
                      >
                        Number of products <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="field-numberOfProducts"
                        type="text"
                        value={formData.numberOfProducts}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            numberOfProducts: e.target.value
                          }));
                          clearFieldError('numberOfProducts');
                        }}
                        placeholder="e.g., 0 (Service only), 12 products, 50+ SKUs"
                        className="w-full px-3.5 py-2.5 bg-[#151824] border border-[#262C40] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {['0 (Not applicable)', '1–10', '11–50', '50+'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                numberOfProducts: preset
                              }));
                              clearFieldError('numberOfProducts');
                            }}
                            className={`px-2 py-0.5 text-xs font-mono rounded border transition-colors ${
                              formData.numberOfProducts === preset
                                ? 'bg-blue-600 text-white border-blue-500'
                                : 'bg-[#181C2A] text-slate-400 border-[#262C40] hover:border-slate-500'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                      {errors.numberOfProducts && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.numberOfProducts}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="field-budget"
                        className="block text-xs font-semibold text-slate-300 mb-1.5"
                      >
                        Budget <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="field-budget"
                        type="text"
                        value={formData.budget}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, budget: e.target.value }));
                          clearFieldError('budget');
                        }}
                        placeholder="e.g., $100 CAD, $250 CAD, $500 CAD"
                        className="w-full px-3.5 py-2.5 bg-[#151824] border border-[#262C40] rounded-lg text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      {errors.budget && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.budget}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="field-desiredDeadline"
                        className="block text-xs font-semibold text-slate-300 mb-1.5"
                      >
                        Desired deadline <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="field-desiredDeadline"
                        type="text"
                        value={formData.desiredDeadline}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            desiredDeadline: e.target.value
                          }));
                          clearFieldError('desiredDeadline');
                        }}
                        placeholder="e.g., Within 2 weeks, Nov 15, or Flexible"
                        className="w-full px-3.5 py-2.5 bg-[#151824] border border-[#262C40] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {['1–2 Weeks', '2–4 Weeks', '1–2 Months', 'Flexible'].map(
                          (timeframe) => (
                            <button
                              key={timeframe}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  desiredDeadline: timeframe
                                }));
                                clearFieldError('desiredDeadline');
                              }}
                              className={`px-2 py-0.5 text-xs font-mono rounded border transition-colors ${
                                formData.desiredDeadline === timeframe
                                  ? 'bg-blue-600 text-white border-blue-500'
                                  : 'bg-[#181C2A] text-slate-400 border-[#262C40] hover:border-slate-500'
                              }`}
                            >
                              {timeframe}
                            </button>
                          )
                        )}
                      </div>
                      {errors.desiredDeadline && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.desiredDeadline}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="field-projectDescription"
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                    >
                      Project description <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      id="field-projectDescription"
                      rows={3}
                      value={formData.projectDescription}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          projectDescription: e.target.value
                        }));
                        clearFieldError('projectDescription');
                      }}
                      placeholder="Describe what your business offers, the primary goal of the site, and any key features visitors need..."
                      className="w-full px-3.5 py-2.5 bg-[#151824] border border-[#262C40] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.projectDescription && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.projectDescription}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="field-referenceWebsites"
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                    >
                      Reference websites{' '}
                      <span className="text-slate-500 font-normal">
                        (optional — links or brands whose style you admire)
                      </span>
                    </label>
                    <input
                      id="field-referenceWebsites"
                      type="text"
                      value={formData.referenceWebsites}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          referenceWebsites: e.target.value
                        }))
                      }
                      placeholder="e.g., aesop.com, Teenage Engineering, or existing site URL"
                      className="w-full px-3.5 py-2.5 bg-[#151824] border border-[#262C40] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4 — EXISTING RESOURCES */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="border-b border-slate-800 pb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Existing Resources
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Do you already have the following assets ready for your project?
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleMarkRemainingNo}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 underline whitespace-nowrap"
                      >
                        Mark remaining as No
                      </button>
                      <span className="text-xs font-mono text-slate-400">Step 4 of 5</span>
                    </div>
                  </div>

                  <div className="divide-y divide-[#1E2333] border border-[#22273A] rounded-xl bg-[#141724] overflow-hidden">
                    {EXISTING_RESOURCE_KEYS.map((resourceKey) => {
                      const currentChoice = formData.existingResources[resourceKey];
                      return (
                        <div
                          key={resourceKey}
                          className="flex items-center justify-between px-4 py-3 gap-4"
                        >
                          <span className="text-sm font-medium text-slate-200">
                            {resourceKey}
                          </span>

                          <div className="flex items-center gap-2 shrink-0">
                            {(['Yes', 'No'] as const).map((option) => {
                              const active = currentChoice === option;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleResourceChoice(resourceKey, option)}
                                  className={`px-4 py-1.5 text-xs font-mono font-semibold rounded transition-all whitespace-nowrap ${
                                    active
                                      ? option === 'Yes'
                                        ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] border border-blue-400'
                                        : 'bg-slate-700 text-white border border-slate-600'
                                      : 'bg-[#181C2A] text-slate-400 border border-[#262C40] hover:border-slate-500 hover:text-white'
                                  }`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {errors.existingResources && (
                    <p className="text-xs text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.existingResources}</span>
                    </p>
                  )}
                </div>
              )}

              {/* STEP 5 — ADDITIONAL REQUIREMENTS & SUBMISSION */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base font-semibold text-white">
                        Additional Requirements
                      </h3>
                      <span className="text-xs font-mono text-slate-400">Step 5 of 5</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Share any final details, special integrations, or questions before submitting.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="field-additionalNotes"
                      className="block text-sm font-semibold text-white mb-2"
                    >
                      Anything else we should know?
                    </label>
                    <textarea
                      id="field-additionalNotes"
                      rows={5}
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          additionalNotes: e.target.value
                        }))
                      }
                      placeholder="Optional — mention specific payment gateways, domain registrars, bilingual needs, or preferred communication times..."
                      className="w-full px-4 py-3 bg-[#151824] border border-[#262C40] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Pre-Submission Summary (Dark Theme) */}
                  <div className="bg-[#121522] border border-[#22273A] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
                      <span className="text-xs font-mono text-blue-400 font-semibold">
                        Request Verification
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Status: NEW · Priority: NORMAL
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <span className="text-slate-400">Service: </span>
                        <span className="font-semibold text-white">{formData.service}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Plan: </span>
                        <span className="font-semibold text-blue-300">{formData.plan}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Client: </span>
                        <span className="font-semibold text-white">
                          {formData.fullName} ({formData.businessName})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Email: </span>
                        <span className="font-mono text-slate-200">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Budget &amp; Deadline: </span>
                        <span className="font-mono text-emerald-400">
                          {formData.budget} · {formData.desiredDeadline}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Ready Assets: </span>
                        <span className="font-mono text-blue-300">
                          {
                            EXISTING_RESOURCE_KEYS.filter(
                              (k) => formData.existingResources[k] === 'Yes'
                            ).length
                          }{' '}
                          of {EXISTING_RESOURCE_KEYS.length} Yes
                        </span>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-4 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-200 text-xs leading-relaxed flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <div>
                        <p className="font-semibold mb-0.5">Submission Not Sent</p>
                        <p>{submitError}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Modal Footer Navigation */}
        {!submittedRecord && (
          <div className="px-6 py-4 bg-[#121522] border-t border-[#202538] flex items-center justify-between gap-4 shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="px-4 py-2.5 border border-slate-700 bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="goodsify-project-form"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SENDING TO GOOGLE SHEETS...</span>
                  </>
                ) : (
                  <span>SUBMIT PROJECT REQUEST</span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
