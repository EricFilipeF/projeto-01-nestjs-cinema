import { useState, useCallback } from 'react';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

interface AlertMessage {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  autoClose?: number;
}

export type UseAlertReturn = ReturnType<typeof useAlert>;

export function useAlert() {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const adicionarAlerta = useCallback(
    (message: string, type: AlertType = 'info', options?: { title?: string; dismissible?: boolean; autoClose?: number }) => {
      const id = `alert-${Date.now()}-${Math.random()}`;
      setAlerts((prev) => [
        ...prev,
        {
          id,
          type,
          message,
          title: options?.title,
          dismissible: options?.dismissible ?? true,
          autoClose: options?.autoClose ?? 5000,
        },
      ]);
    },
    []
  );

  const removerAlerta = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string, options?: { title?: string; dismissible?: boolean; autoClose?: number }) => {
      adicionarAlerta(message, 'success', options);
    },
    [adicionarAlerta]
  );

  const showError = useCallback(
    (message: string, options?: { title?: string; dismissible?: boolean; autoClose?: number }) => {
      adicionarAlerta(message, 'danger', options);
    },
    [adicionarAlerta]
  );

  const showWarning = useCallback(
    (message: string, options?: { title?: string; dismissible?: boolean; autoClose?: number }) => {
      adicionarAlerta(message, 'warning', options);
    },
    [adicionarAlerta]
  );

  const showInfo = useCallback(
    (message: string, options?: { title?: string; dismissible?: boolean; autoClose?: number }) => {
      adicionarAlerta(message, 'info', options);
    },
    [adicionarAlerta]
  );

  return {
    alerts,
    removerAlerta,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
