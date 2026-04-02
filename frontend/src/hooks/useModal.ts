import { useState, useCallback } from 'react';

interface ModalState {
  isOpen: boolean;
  data?: any;
}

export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    data: undefined,
  });

  const openModal = useCallback((data?: any) => {
    setModalState({ isOpen: true, data });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, data: undefined });
  }, []);

  return {
    isOpen: modalState.isOpen,
    data: modalState.data,
    openModal,
    closeModal,
  };
}
