import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated || location.pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark cineweb-navbar mb-4 py-3">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <span className="fw-bold">CineWeb</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

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
            <li className="nav-item d-flex align-items-center ms-lg-3 mt-3 mt-lg-0">
              <span className="text-white-50 small me-3 d-none d-lg-inline">
                {user?.email}
              </span>
              <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}