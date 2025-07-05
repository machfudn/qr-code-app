import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { IconCheck, IconInfo, IconXmark } from '@/components/Icons';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  message: string;
  type: ToastType;
  icon?: ReactNode;
};

type ToastContextType = {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
  };
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, icon: ReactNode, message: string) => {
    const id = toastId++;
    const newToast: Toast = { id, type, message, icon };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const toast = {
    success: (msg: string) => showToast('success', <IconCheck className='w-4 h-4 fill-current' />, msg),
    error: (msg: string) => showToast('error', <IconXmark className='w-4 h-4 fill-current' />, msg),
    info: (msg: string) => showToast('info', <IconInfo className='w-4 h-4 fill-current' />, msg),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className='fixed top-6 left-1/2 transform -translate-x-1/2 space-y-2 z-50'>
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow text-white flex items-center gap-2 ${
              t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-600'
            }`}
            style={{
              animation: 'slideUpFade 3s forwards',
            }}>
            {t.icon && <span>{t.icon}</span>}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context.toast;
};
