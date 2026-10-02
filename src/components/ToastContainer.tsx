import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, Copy, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  referenceId?: string;
  meta?: string;
  durationMs?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-3 w-[calc(100vw-2.5rem)] max-w-md pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const duration = toast.durationMs ?? 9000;

  useEffect(() => {
    if (isHovered) return;
    const timer = window.setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [toast.id, duration, isHovered, onDismiss]);

  const handleCopyReference = async () => {
    if (!toast.referenceId) return;
    try {
      await navigator.clipboard.writeText(toast.referenceId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard permission errors in restricted contexts
    }
  };

  return (
    <div
      role="status"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="pointer-events-auto bg-[#0E1018] text-[#F8FAFC] border border-[#22283A] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-4 sm:p-5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3.5">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg shrink-0 mt-0.5 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <CheckCircle2 className="w-4 h-4" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400">
              <span>PROJECT REQUEST RECORDED</span>
              {toast.meta && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="truncate text-slate-400">{toast.meta}</span>
                </>
              )}
            </div>

            <p className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
              {toast.title}
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">
              {toast.description}
            </p>

            {toast.referenceId && (
              <div className="pt-2 flex items-center gap-3">
                <span className="font-mono text-xs text-white tabular-nums">
                  ID: {toast.referenceId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyReference}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
