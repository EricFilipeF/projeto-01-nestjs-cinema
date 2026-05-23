import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

type ModalVariant = 'success' | 'danger';

interface FeedbackModalState {
  isOpen: boolean;
  title: string;
  message: string;
  variant: ModalVariant;
}

const initialModalState: FeedbackModalState = {
  isOpen: false,
  title: '',
  message: '',
  variant: 'success',
};

const passwordPolicyPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}';
const passwordPolicyMessage = 'Use pelo menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo.';

interface FeedbackModalProps extends FeedbackModalState {
  onClose: () => void;
}

function FeedbackModal({ isOpen, title, message, variant, onClose }: FeedbackModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className={`modal-header text-white bg-${variant}`}>
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Fechar" onClick={onClose} />
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecoverPassword() {
  const [email, setEmail] = useState('ericfilipe85@gmail.com');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>(initialModalState);

  const closeFeedbackModal = () => {
    setFeedbackModal(initialModalState);
  };

  const openFeedbackModal = (title: string, message: string, variant: ModalVariant) => {
    setFeedbackModal({
      isOpen: true,
      title,
      message,
      variant,
    });
  };

  const handleRequestToken = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await authService.requestPasswordReset(email);
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível enviar o código de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setResetting(true);

    try {
      const response = await authService.resetPassword(token, newPassword);
      openFeedbackModal('Senha alterada com sucesso', response.message, 'success');
      setToken('');
      setNewPassword('');
    } catch (error) {
      openFeedbackModal(
        'Código inválido',
        error instanceof Error ? error.message : 'Código de recuperação inválido ou expirado.',
        'danger',
      );
    } finally {
      setResetting(false);
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
                <h1 className="login-brand-title mb-0">Recuperar senha</h1>
              </div>

              <div className="login-form-panel bg-white">
                <div className="text-center mb-4">
                  <h2 className="h3 fw-bold mb-0 text-primary">Recuperação de acesso</h2>
                </div>

                {message && <div className="alert alert-info">{message}</div>}

                <form onSubmit={handleRequestToken} className="d-grid gap-3 mb-4">
                  <div>
                    <label htmlFor="email" className="form-label fw-semibold text-secondary">
                      Email da conta
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg login-input"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="seuemail@exemplo.com"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-outline-primary fw-semibold" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar código de recuperação'}
                  </button>
                </form>

                <hr className="my-4" />

                <form onSubmit={handleResetPassword} className="d-grid gap-3">
                  <div>
                    <label htmlFor="token" className="form-label fw-semibold text-secondary">
                      Código de recuperação
                    </label>
                    <input
                      id="token"
                      type="text"
                      className="form-control form-control-lg login-input"
                      value={token}
                      onChange={(event) => setToken(event.target.value)}
                      placeholder="Cole o código recebido"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="form-label fw-semibold text-secondary">
                      Nova senha
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      className="form-control form-control-lg login-input"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Digite a nova senha"
                      minLength={8}
                      pattern={passwordPolicyPattern}
                      title={passwordPolicyMessage}
                      autoComplete="new-password"
                      required
                    />
                    <div className="form-text">{passwordPolicyMessage}</div>
                  </div>

                  <button type="submit" className="btn btn-primary fw-semibold" disabled={resetting}>
                    {resetting ? 'Redefinindo...' : 'Redefinir senha'}
                  </button>
                </form>

                <div className="mt-4">
                  <Link to="/login" className="text-decoration-none">
                    Voltar para o login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal {...feedbackModal} onClose={closeFeedbackModal} />
    </main>
  );
}