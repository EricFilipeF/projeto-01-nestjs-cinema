import type { Sessao } from '../models/Sessao';
import type { Filme } from '../models/Filme';
import type { Sala } from '../models/Sala';

interface SessoesTableProps {
  sessoes: Sessao[];
  filmes: Filme[];
  salas: Sala[];
  loading: boolean;
  editandoId: number | string | null;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
}

export function SessoesTable({
  sessoes,
  filmes,
  salas,
  loading,
  editandoId,
  onEdit,
  onDelete,
}: SessoesTableProps) {
  const getFilmeNome = (filmeId: string): string => {
    const filme = filmes.find((f) => {
      const strIdA = String(f.id);
      const strIdB = String(filmeId);
      
      // Comparação direta
      if (f.id === filmeId) return true;
      
      // Comparação de strings
      if (strIdA === strIdB) return true;
      
      // Comparação frouxa
      if (f.id == filmeId) return true;
      
      // Tentar comparar como números decimais
      const numA = parseInt(strIdA, 10);
      const numB = parseInt(strIdB, 10);
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      
      // Tentar f.id como hex, filmeId como decimal
      const hexA = parseInt(strIdA, 16);
      if (!isNaN(hexA) && !isNaN(numB) && hexA === numB) return true;
      
      // Tentar filmeId como hex, f.id como decimal
      const hexB = parseInt(strIdB, 16);
      if (!isNaN(numA) && !isNaN(hexB) && numA === hexB) return true;
      
      return false;
    });
    
    return filme?.titulo || 'Filme não encontrado';
  };

  const getSalaNome = (salaId: string): string => {
    const sala = salas.find((s) => {
      const strIdA = String(s.id);
      const strIdB = String(salaId);
      
      // Comparação direta
      if (s.id === salaId) return true;
      
      // Comparação de strings
      if (strIdA === strIdB) return true;
      
      // Comparação frouxa
      if (s.id == salaId) return true;
      
      // Tentar comparar como números decimais
      const numA = parseInt(strIdA, 10);
      const numB = parseInt(strIdB, 10);
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      
      // Tentar s.id como hex, salaId como decimal
      const hexA = parseInt(strIdA, 16);
      if (!isNaN(hexA) && !isNaN(numB) && hexA === numB) return true;
      
      // Tentar salaId como hex, s.id como decimal
      const hexB = parseInt(strIdB, 16);
      if (!isNaN(numA) && !isNaN(hexB) && numA === hexB) return true;
      
      return false;
    });
    
    return sala?.nome || 'Sala não encontrada';
  };

  const formatarDataHora = (horario: string): string => {
    try {
      return new Date(horario).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return horario;
    }
  };

  if (loading && sessoes.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Carregando sessões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">
          <i className="bi bi-calendar-event me-2"></i>Sessões Agendadas
        </h5>
      </div>
      <div className="card-body p-0">
        {sessoes.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="text-muted mt-3">Nenhuma sessão agendada no momento.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Filme</th>
                  <th>Sala</th>
                  <th>Tipo</th>
                  <th>Data e Horário</th>
                  <th>Valor</th>
                  <th style={{ width: '180px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sessoes.map((sessao) => (
                  <tr
                    key={sessao.id}
                    className={editandoId === sessao.id ? 'table-warning' : ''}
                  >
                    <td className="fw-bold">#{sessao.id}</td>
                    <td>{getFilmeNome(sessao.filmeId)}</td>
                    <td>
                      <span className="badge bg-secondary">{getSalaNome(sessao.salaId)}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          sessao.tipoProjecao === '3d' ? 'bg-primary' : 'bg-info text-dark'
                        }`}
                      >
                        {sessao.tipoProjecao?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <i className="bi bi-clock me-1"></i>
                      {formatarDataHora(sessao.horario)}
                    </td>
                    <td>
                      <span className="badge bg-success">
                        R$ {sessao.valorIngresso.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => onEdit(sessao.id)}
                        disabled={loading || editandoId !== null || (sessao.ingressosVendidos ?? 0) > 0}
                        title={
                          (sessao.ingressosVendidos ?? 0) > 0
                            ? 'Não é possível editar sessão com ingressos vendidos'
                            : 'Editar sessão'
                        }
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(sessao.id)}
                        disabled={loading || editandoId !== null || (sessao.ingressosVendidos ?? 0) > 0}
                        title={
                          (sessao.ingressosVendidos ?? 0) > 0
                            ? 'Não é possível excluir sessão com ingressos vendidos'
                            : 'Excluir sessão'
                        }
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
