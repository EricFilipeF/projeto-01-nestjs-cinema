import type { Filme } from '../models/Filme';

interface FilmeCardProps {
  filme: Filme;
  onVenderIngresso: (filme: Filme) => void;
}

export function FilmeCard({ filme, onVenderIngresso }: FilmeCardProps) {
  const formatarGenero = (genero: string): string => {
    const generos: Record<string, string> = {
      'acao': 'Ação',
      'aventura': 'Aventura',
      'comedia': 'Comédia',
      'drama': 'Drama',
      'ficcao': 'Ficção',
      'terror': 'Terror',
      'romance': 'Romance',
      'suspense': 'Suspense',
      'animacao': 'Animação',
      'documentario': 'Documentário',
    };
    return generos[genero.toLowerCase()] || genero.charAt(0).toUpperCase() + genero.slice(1);
  };

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={filme.imagem || 'https://via.placeholder.com/300x450?text=Sem+Poster'}
        className="card-img-top"
        alt={filme.titulo}
        style={{ height: '400px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{filme.titulo}</h5>
        <div className="mb-2">
          <span className="badge bg-primary me-1">
            <i className="bi bi-film me-1"></i>
            {formatarGenero(filme.genero)}
          </span>
          <span className="badge bg-info me-1">
            <i className="bi bi-clock me-1"></i>
            {filme.duracao} min
          </span>
          <span className="badge bg-warning text-dark">
            {filme.classificacao}+
          </span>
        </div>
        <p className="card-text flex-grow-1 text-muted small">
          {filme.sinopse.length > 80
            ? `${filme.sinopse.substring(0, 80)}...`
            : filme.sinopse}
        </p>
        <div className="d-grid">
          <button
            className="btn btn-success btn-sm"
            onClick={() => onVenderIngresso(filme)}
          >
            <i className="bi bi-ticket-perforated me-2"></i>
            Vender Ingresso
          </button>
        </div>
      </div>
    </div>
  );
}
