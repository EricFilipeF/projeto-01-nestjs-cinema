import type { FormEvent } from 'react';
import type { Filme } from '../models/Filme';
import type { Sala } from '../models/Sala';

interface SessaoFormProps {
  filmeId: string;
  salaId: string;
  horario: string;
  valorIngresso: string;
  tipoProjecao: '2d' | '3d' | '';
  errors: Record<string, string>;
  loading: boolean;
  editandoId: number | string | null;
  filmes: Filme[];
  salas: Sala[];
  onFilmeIdChange: (value: string) => void;
  onSalaIdChange: (value: string) => void;
  onTipoProjecaoChange: (value: '2d' | '3d' | '') => void;
  onHorarioChange: (value: string) => void;
  onValorIngressoChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onCancelar: () => void;
}

export function SessaoForm({
  filmeId,
  salaId,
  horario,
  valorIngresso,
  tipoProjecao,
  errors,
  loading,
  editandoId,
  filmes,
  salas,
  onFilmeIdChange,
  onSalaIdChange,
  onTipoProjecaoChange,
  onHorarioChange,
  onValorIngressoChange,
  onSubmit,
  onCancelar,
}: SessaoFormProps) {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">
          {editandoId ? (
            <>
              <i className="bi bi-pencil-square me-2"></i>Editar Sessão
            </>
          ) : (
            <>
              <i className="bi bi-calendar-plus me-2"></i>Agendar Nova Sessão
            </>
          )}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={onSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="filmeId" className="form-label fw-semibold">
                Filme <span className="text-danger">*</span>
              </label>
              <select
                id="filmeId"
                className={`form-select ${errors.filmeId ? 'is-invalid' : ''}`}
                value={filmeId}
                onChange={(e) => onFilmeIdChange(e.target.value)}
                disabled={loading}
              >
                <option value="">Selecione um filme</option>
                {filmes.map((filme) => (
                  <option key={filme.id} value={filme.id}>
                    {filme.titulo}
                  </option>
                ))}
              </select>
              {errors.filmeId && <div className="invalid-feedback">{errors.filmeId}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="salaId" className="form-label fw-semibold">
                Sala <span className="text-danger">*</span>
              </label>
              <select
                id="salaId"
                className={`form-select ${errors.salaId ? 'is-invalid' : ''}`}
                value={salaId}
                onChange={(e) => onSalaIdChange(e.target.value)}
                disabled={loading}
              >
                <option value="">Selecione uma sala</option>
                {salas.map((sala) => (
                  <option key={sala.id} value={sala.id}>
                    {sala.nome} - Capacidade: {sala.capacidade}
                  </option>
                ))}
              </select>
              {errors.salaId && <div className="invalid-feedback">{errors.salaId}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="horario" className="form-label fw-semibold">
                Data e Horário <span className="text-danger">*</span>
              </label>
              <input
                type="datetime-local"
                id="horario"
                className={`form-control ${errors.horario ? 'is-invalid' : ''}`}
                value={horario}
                onChange={(e) => onHorarioChange(e.target.value)}
                disabled={loading}
              />
              {errors.horario && <div className="invalid-feedback">{errors.horario}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="tipoProjecao" className="form-label fw-semibold">
                Tipo de Sessão <span className="text-danger">*</span>
              </label>
              <select
                id="tipoProjecao"
                className={`form-select ${errors.tipoProjecao ? 'is-invalid' : ''}`}
                value={tipoProjecao}
                onChange={(e) => onTipoProjecaoChange(e.target.value as '2d' | '3d' | '')}
                disabled={loading}
              >
                <option value="" disabled>Selecione o tipo de sessão</option>
                <option value="2d">2D</option>
                <option value="3d">3D</option>
              </select>
              {errors.tipoProjecao && <div className="invalid-feedback">{errors.tipoProjecao}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="valorIngresso" className="form-label fw-semibold">
                Valor do Ingresso (R$) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                id="valorIngresso"
                className={`form-control ${errors.valorIngresso ? 'is-invalid' : ''}`}
                value={valorIngresso}
                onChange={(e) => onValorIngressoChange(e.target.value)}
                disabled={loading}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              {errors.valorIngresso && <div className="invalid-feedback">{errors.valorIngresso}</div>}
            </div>
          </div>

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
                  {editandoId ? 'Atualizar Sessão' : 'Agendar Sessão'}
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
        </form>
      </div>
    </div>
  );
}
