import { useEffect } from 'react';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineX } from 'react-icons/hi';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

export default function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  const Icon = toast.type === 'success' ? HiOutlineCheckCircle : HiOutlineXCircle;

  return (
    <div
      className={`${styles[toast.type]} border px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 hover:opacity-70 transition-opacity"
      >
        <HiOutlineX className="w-4 h-4" />
      </button>
    </div>
  );
}
