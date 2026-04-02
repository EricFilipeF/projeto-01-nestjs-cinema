import type { ReactNode } from 'react';

interface ConfirmacaoExclusaoModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  messageSecondary?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: string;
  children?: ReactNode;
}

export function ConfirmacaoExclusaoModal({
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
  title = 'Confirmar Exclusão',
  message = 'Tem certeza que deseja excluir este item?',
  messageSecondary = 'Esta ação não pode ser desfeita.',
  confirmButtonText = 'Excluir',
  cancelButtonText = 'Cancelar',
  confirmButtonVariant = 'danger',
  children,
}: ConfirmacaoExclusaoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">
            {children || (
              <>
                <p>{message}</p>
                {messageSecondary && (
                  <p className="text-muted mb-0">{messageSecondary}</p>
                )}
              </>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelButtonText}
            </button>
            <button
              type="button"
              className={`btn btn-${confirmButtonVariant}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? `${confirmButtonText}...` : confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
