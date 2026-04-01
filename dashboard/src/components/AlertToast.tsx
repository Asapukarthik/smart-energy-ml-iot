import { useEffect, useState } from "react";

export type AlertType = "warning" | "error" | "info";

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
}

interface AlertToastProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export default function AlertToast({ alerts, onDismiss }: AlertToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      {alerts.map((alert) => (
        <ToastItem key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 4000); // Slightly longer for readability
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss(alert.id);
    }, 400); 
  }

  const getTheme = () => {
    switch (alert.type) {
      case "error":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          accent: "bg-red-500",
          text: "text-red-600 dark:text-red-400",
          icon: <svg className="w-5 h-5 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
        };
      case "warning":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          accent: "bg-amber-500",
          text: "text-amber-700 dark:text-amber-400",
          icon: <svg className="w-5 h-5 text-amber-700 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        };
      default:
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          accent: "bg-blue-500",
          text: "text-blue-600 dark:text-blue-400",
          icon: <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        };
    }
  };

  const theme = getTheme();

  return (
    <div 
      className={`
        relative group overflow-hidden rounded-xl border p-4 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${theme.bg} ${theme.border}
        ${isClosing ? 'translate-x-[120%] opacity-0 scale-95 blur-sm' : 'translate-x-0 opacity-100 animate-slide-in-right'}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${theme.bg} ${theme.border} ring-1 ring-white/5`}>
          {theme.icon}
        </div>
        <div className="flex-1 pt-1">
          <p className="text-sm font-bold text-white/90 leading-tight tracking-wide">{alert.message}</p>
          <p className="text-[10px] mt-1 uppercase font-black tracking-widest opacity-40">{alert.type}</p>
        </div>
        <button 
          onClick={handleDismiss}
          className="p-1 rounded-md hover:bg-white/5 text-white/40 hover:text-white transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Glossy overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Dynamic Progress Loader */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
        <div className={`h-full transition-all duration-100 ${theme.accent} animate-shrink shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
      </div>
    </div>
  );
}
