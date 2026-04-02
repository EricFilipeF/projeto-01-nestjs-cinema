import type { FormEvent } from 'react';

interface SalaFormProps {
  nome: string;
  capacidade: string;
  errors: Record<string, string>;
  loading: boolean;
  editandoId: string | null;
  onNomeChange: (value: string) => void;
  onCapacidadeChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onCancelar: () => void;
}

export function SalaForm({
  nome,
  capacidade,
  errors,
  loading,
  editandoId,
  onNomeChange,
  onCapacidadeChange,
  onSubmit,
  onCancelar,
}: SalaFormProps) {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">
          {editandoId ? (
            <>
              <i className="bi bi-pencil-square me-2"></i>Editar Sala
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-2"></i>Cadastrar Nova Sala
            </>
          )}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nome-sala" className="form-label fw-bold">
                Nome da Sala <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                id="nome-sala"
                placeholder="Ex.: Sala Premium"
                value={nome}
                onChange={(e) => onNomeChange(e.target.value)}
              />
              {errors.nome && (
                <div className="invalid-feedback">{errors.nome}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="capacidade-sala" className="form-label fw-bold">
                Capacidade <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`}
                id="capacidade-sala"
                placeholder="Ex.: 120"
                min="1"
                value={capacidade}
                onChange={(e) => onCapacidadeChange(e.target.value)}
              />
              {errors.capacidade && (
                <div className="invalid-feedback">{errors.capacidade}</div>
              )}
            </div>

            <div className="col-12 mt-4">
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      {editandoId ? 'Atualizar Sala' : 'Cadastrar Sala'}
                    </>
                  )}
                </button>
                {editandoId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancelar}
                    disabled={loading}
                  >
                    <i className="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
