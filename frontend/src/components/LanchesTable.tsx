import type { LancheCombo } from '../models/LancheCombo';

interface LanchesTableProps {
  lanches: LancheCombo[];
  onEditar: (lanche: LancheCombo) => void;
  onExcluir: (id: number | string) => void;
  editandoId: number | string | null;
  isLoading: boolean;
}

export function LanchesTable({
  lanches,
  onEditar,
  onExcluir,
  editandoId,
  isLoading,
}: LanchesTableProps) {
  const formatarPreco = (preco: number): string => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (lanches.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2" />
        Nenhum combo cadastrado.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th style={{ width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {lanches.map((lanche) => (
            <tr key={lanche.id}>
              <td>{lanche.nome}</td>
              <td>{lanche.descricao}</td>
              <td>
                <span className="badge bg-success">
                  {formatarPreco(lanche.preco)}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => onEditar(lanche)}
                  disabled={isLoading || editandoId !== null}
                  title="Editar combo"
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onExcluir(lanche.id)}
                  disabled={isLoading || editandoId !== null}
                  title="Excluir combo"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
