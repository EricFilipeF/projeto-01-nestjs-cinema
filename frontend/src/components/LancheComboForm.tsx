import type { FormEvent } from 'react';

interface LancheComboFormProps {
  nome: string;
  descricao: string;
  preco: string;
  onNomeChange: (value: string) => void;
  onDescricaoChange: (value: string) => void;
  onPrecoChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  errors: Record<string, string>;
  editandoId: number | string | null;
  onCancelar: () => void;
  isLoading: boolean;
}

export function LancheComboForm({
  nome,
  descricao,
  preco,
  onNomeChange,
  onDescricaoChange,
  onPrecoChange,
  onSubmit,
  errors,
  editandoId,
  onCancelar,
  isLoading,
}: LancheComboFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="nome" className="form-label">
            Nome <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
            id="nome"
            value={nome}
            onChange={(e) => onNomeChange(e.target.value)}
            placeholder="Ex: Combo Médio"
            disabled={isLoading}
          />
          {errors.nome && (
            <div className="invalid-feedback">{errors.nome}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="preco" className="form-label">
            Preço (R$) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className={`form-control ${errors.preco ? 'is-invalid' : ''}`}
            id="preco"
            value={preco}
            onChange={(e) => onPrecoChange(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            disabled={isLoading}
          />
          {errors.preco && (
            <div className="invalid-feedback">{errors.preco}</div>
          )}
        </div>

        <div className="col-12">
          <label htmlFor="descricao" className="form-label">
            Descrição <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
            id="descricao"
            value={descricao}
            onChange={(e) => onDescricaoChange(e.target.value)}
            placeholder="Descrição do combo"
            rows={3}
            disabled={isLoading}
          />
          {errors.descricao && (
            <div className="invalid-feedback">{errors.descricao}</div>
          )}
        </div>

        <div className="col-12">
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2" />
                  {editandoId ? 'Atualizar' : 'Cadastrar'}
                </>
              )}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelar}
                disabled={isLoading}
              >
                <i className="bi bi-x-circle me-2" />
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
