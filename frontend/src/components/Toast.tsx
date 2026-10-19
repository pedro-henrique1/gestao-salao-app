import { useEffect } from 'react';

type ToastProps = {
  message: string;
  onClose: () => void;
};

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
      <button type="button" className="toast-close" onClick={onClose} aria-label="Fechar aviso">
        Fechar
      </button>
    </div>
  );
}
