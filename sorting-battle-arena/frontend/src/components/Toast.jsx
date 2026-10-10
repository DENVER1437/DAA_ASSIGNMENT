import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-md w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
              error: <AlertCircle className="w-5 h-5 text-[#FF3B47] shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
              info: <Info className="w-5 h-5 text-[#C62832] shrink-0" />
            };

            const borderColors = {
              success: 'border-emerald-500/30 bg-[#111216]/95 text-emerald-200',
              error: 'border-[#C62832]/50 bg-[#111216]/95 text-[#F2F2F3]',
              warning: 'border-amber-500/30 bg-[#111216]/95 text-amber-200',
              info: 'border-[#C62832]/30 bg-[#111216]/95 text-[#F2F2F3]'
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl relative overflow-hidden ${borderColors[toast.type] || borderColors.info}`}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C62832]/40 to-transparent" />
                {icons[toast.type] || icons.info}
                <div className="flex-1 text-xs font-mono leading-relaxed">{toast.message}</div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="opacity-70 hover:opacity-100 transition-opacity p-0.5 text-[#A1A1AA]"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
