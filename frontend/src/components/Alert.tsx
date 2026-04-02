import { useState, useEffect } from 'react';
import type { AlertType } from '../hooks/useAlert';

interface AlertProps {
  id: string;
  type?: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  autoClose?: number; // tempo em ms para fechar automaticamente (0 = não fecha)
  onClose: (id: string) => void;
}

const alertStyles: Record<AlertType, { bg: string; text: string; icon: string }> = {
  success: {
    bg: 'alert-success',
    text: 'text-success',
    icon: '✓',
  },
  danger: {
    bg: 'alert-danger',
    text: 'text-danger',
    icon: '✕',
  },
  warning: {
    bg: 'alert-warning',
    text: 'text-warning',
    icon: '!',
  },
  info: {
    bg: 'alert-info',
    text: 'text-info',
    icon: 'ℹ',
  },
};

export function Alert({
  id,
  type = 'info',
  title,
  message,
  dismissible = true,
  autoClose = 5000,
  onClose,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose(id);
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!isVisible) return null;

  const style = alertStyles[type];

  const handleClose = () => {
    setIsVisible(false);
    onClose(id);
  };

  return (
    <div className={`alert ${style.bg} alert-dismissible fade show`} role="alert">
      <div className="d-flex align-items-start">
        <span className={`${style.text} me-2 fw-bold`} style={{ fontSize: '1.2em' }}>
          {style.icon}
        </span>
        <div className="flex-grow-1">
          {title && <h4 className="alert-heading">{title}</h4>}
          <p className="mb-0">{message}</p>
        </div>
        {dismissible && (
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
            aria-label="Fechar"
          ></button>
        )}
      </div>
    </div>
  );
}
