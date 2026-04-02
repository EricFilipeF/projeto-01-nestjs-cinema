import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 py-3">
      <div className="container">
        {/* Marca do Site (Leva para a Home) */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <span className="fw-bold">CineWeb</span>
        </Link>

        {/* Botão para Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links do Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/filmes" className="nav-link">Filmes</Link>
            </li>
            <li className="nav-item">
              <Link to="/salas" className="nav-link">Salas</Link>
            </li>
            <li className="nav-item">
              <Link to="/sessoes" className="nav-link">Sessões</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}