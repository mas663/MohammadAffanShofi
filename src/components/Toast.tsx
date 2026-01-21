"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-green-500/10 border-green-500/50 text-green-400",
    error: "bg-red-500/10 border-red-500/50 text-red-400",
    info: "bg-blue-500/10 border-blue-500/50 text-blue-400",
    warning: "bg-yellow-500/10 border-yellow-500/50 text-yellow-400",
  };

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-top-5 ${colors[type]}`}
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
