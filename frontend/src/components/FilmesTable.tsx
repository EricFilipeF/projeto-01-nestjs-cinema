import type { Filme } from '../models/Filme';

interface FilmesTableProps {
  filmes: Filme[];
  loading: boolean;
  editandoId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const generoMap: Record<string, string> = {
  acao: 'Ação',
  comedia: 'Comédia',
  drama: 'Drama',
  ficcao: 'Ficção Científica',
  terror: 'Terror',
};

const formatarClassificacao = (classificacao: string): string => {
  return classificacao === 'livre' ? 'Livre' : `${classificacao} anos`;
};

const formatarData = (dataISO: string): string => {
  const data = new Date(dataISO + 'T00:00:00');
  return data.toLocaleDateString('pt-BR');
};

export function FilmesTable({ filmes, loading, editandoId, onEdit, onDelete }: FilmesTableProps) {
  if (loading && filmes.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Carregando filmes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">
          <i className="bi bi-film me-2"></i>Filmes Cadastrados
        </h5>
      </div>
      <div className="card-body p-0">
        {filmes.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-film text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="text-muted mt-3">Nenhum filme cadastrado no momento.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th style={{ width: '100px' }}>Poster</th>
                  <th>Título</th>
                  <th>Gênero</th>
                  <th>Classificação</th>
                  <th>Duração</th>
                  <th>Estreia</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filmes.map((filme) => (
                  <tr
                    key={filme.id}
                    className={editandoId === filme.id ? 'table-warning' : ''}
                  >
                    <td className="fw-bold">#{filme.id}</td>
                    <td>
                      {filme.imagem ? (
                        <img
                          src={filme.imagem}
                          alt={filme.titulo}
                          className="rounded"
                          style={{ width: '50px', height: '75px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/50x75?text=N/A';
                          }}
                        />
                      ) : (
                        <div
                          className="bg-secondary rounded d-flex align-items-center justify-content-center text-white"
                          style={{ width: '50px', height: '75px', fontSize: '0.7rem' }}
                        >
                          N/A
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{filme.titulo}</strong>
                      <br />
                      <small className="text-muted">
                        {filme.sinopse.substring(0, 50)}
                        {filme.sinopse.length > 50 ? '...' : ''}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {generoMap[filme.genero] || filme.genero}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          filme.classificacao === 'livre'
                            ? 'bg-success'
                            : filme.classificacao === '18'
                            ? 'bg-dark'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {formatarClassificacao(filme.classificacao)}
                      </span>
                    </td>
                    <td>{filme.duracao} min</td>
                    <td>{formatarData(filme.dataEstreia)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => onEdit(filme.id)}
                        disabled={loading || editandoId !== null}
                        title="Editar filme"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(filme.id)}
                        disabled={loading || editandoId !== null}
                        title="Excluir filme"
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
