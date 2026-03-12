import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative glass w-full max-w-lg rounded-2xl p-6 sm:p-8 transform transition-all shadow-2xl scale-100 opacity-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
