import type { Sala } from '../models/Sala';

interface SalasTableProps {
  salas: Sala[];
  loading: boolean;
  editandoId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SalasTable({ salas, loading, editandoId, onEdit, onDelete }: SalasTableProps) {
  if (loading && salas.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Carregando salas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">
          <i className="bi bi-door-open me-2"></i>Salas Cadastradas
        </h5>
      </div>
      <div className="card-body p-0">
        {salas.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-door-open text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="text-muted mt-3">Nenhuma sala cadastrada no momento.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Nome</th>
                  <th>Capacidade</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {salas.map((sala) => (
                  <tr
                    key={sala.id}
                    className={editandoId === sala.id ? 'table-warning' : ''}
                  >
                    <td className="fw-bold">#{sala.id}</td>
                    <td className="fw-semibold">{sala.nome}</td>
                    <td>
                      <span className="badge bg-secondary">{sala.capacidade} lugares</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => onEdit(sala.id)}
                        disabled={loading || editandoId !== null}
                        title="Editar sala"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(sala.id)}
                        disabled={loading || editandoId !== null}
                        title="Excluir sala"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
