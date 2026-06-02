import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const fromPath = state?.from?.pathname || '/';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate(fromPath, { replace: true });
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;

      setErrorMessage(message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-screen py-5">
      <div className="container">
        <div className="row justify-content-center align-items-stretch min-vh-100 g-0">
          <div className="col-12 col-xl-10">
            <div className="login-shell shadow-lg">
              <div className="login-brand-panel text-white">
                <div className="login-brand-badge mb-4">
                  <span className="login-brand-logo-wrap">
                    <img src="/logo-cineweb.png" alt="CineWeb" className="login-brand-logo" />
                  </span>
                  <span className="fw-bold">CineWeb</span>
                </div>

                <h1 className="login-brand-title mb-0">Painel administrativo</h1>
              </div>

              <div className="login-form-panel bg-white">
                <div className="text-center mb-4">
                  <h2 className="h3 fw-bold mb-0 text-primary">Entrar</h2>
                </div>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <form onSubmit={handleSubmit} className="d-grid gap-3">
                  <div>
                    <label htmlFor="email" className="form-label fw-semibold text-secondary">
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg login-input"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      placeholder="Seu e-mail"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="form-label fw-semibold text-secondary">
                      Senha
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control form-control-lg login-input"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      placeholder="Sua senha"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg fw-semibold" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>

                <div className="mt-3 text-end">
                  <Link to="/recuperar-senha" className="text-decoration-none small">
                    Esqueci minha senha
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}