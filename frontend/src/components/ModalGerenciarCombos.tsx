import { useState, useEffect, type FormEvent } from 'react';
import type { LancheCombo } from '../models/LancheCombo';
import { lancheComboSchema } from '../models/LancheCombo';
import { lanchesService } from '../services/lanchesService';
import { LancheComboForm } from './LancheComboForm';
import { LanchesTable } from './LanchesTable';
import { ConfirmacaoExclusaoModal } from './ModalConfirmacaoExclusao';
import { Alert } from './Alert';
import { useModal } from '../hooks/useModal';
import { useAlert } from '../hooks/useAlert';

interface ModalGerenciarCombosProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalGerenciarCombos({
  isOpen,
  onClose,
}: ModalGerenciarCombosProps) {
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const [editandoId, setEditandoId] = useState<number | string | null>(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const modalExclusao = useModal();
  const alert = useAlert();

  const obterMensagemErro = (err: unknown, fallback: string): string => {
    if (typeof err === 'object' && err && 'response' in err) {
      const response = (err as { response?: { data?: { message?: string } } }).response;
      if (typeof response?.data?.message === 'string') {
        return response.data.message;
      }
    }

    return fallback;
  };

  useEffect(() => {
    if (isOpen) {
      carregarLanches();
    }
  }, [isOpen]);

  const carregarLanches = async () => {
    try {
      setLoading(true);
      const data = await lanchesService.getAll();
      setLanches(data);
    } catch (err) {
      console.error('Erro ao carregar combos:', err);
      alert.showError('Erro ao carregar combos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      nome: nome || undefined,
      descricao: descricao || undefined,
      preco: preco ? parseFloat(preco) : undefined,
    };

    const result = lancheComboSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      if (editandoId) {
        await lanchesService.update(editandoId, result.data);
        alert.showSuccess('Combo atualizado com sucesso!');
      } else {
        await lanchesService.create(result.data);
        alert.showSuccess('Combo cadastrado com sucesso!');
      }
      limparFormulario();
      carregarLanches();
    } catch (err) {
      console.error('Erro ao salvar combo:', err);
      alert.showError('Erro ao salvar combo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (lanche: LancheCombo) => {
    setEditandoId(lanche.id);
    setNome(lanche.nome);
    setDescricao(lanche.descricao);
    setPreco(lanche.preco.toString());
    setErrors({});
  };

  const handleCancelar = () => {
    limparFormulario();
  };

  const handleExcluir = (id: number | string) => {
    setEditandoId(id);
    modalExclusao.openModal();
  };

  const confirmarExclusao = async () => {
    if (!editandoId) return;

    try {
      setLoading(true);
      await lanchesService.delete(editandoId);
      alert.showSuccess('Combo excluído com sucesso!');
      limparFormulario();
      carregarLanches();
      modalExclusao.closeModal();
    } catch (err) {
      console.error('Erro ao excluir combo:', err);
      alert.showError(obterMensagemErro(err, 'Erro ao excluir combo.'));
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-cup-straw me-2"></i>
                Gerenciar Combos
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>
            <div className="modal-body">
              {alert.alerts.map((alertItem) => (
                <Alert
                  key={alertItem.id}
                  id={alertItem.id}
                  type={alertItem.type}
                  title={alertItem.title}
                  message={alertItem.message}
                  dismissible={alertItem.dismissible}
                  autoClose={alertItem.autoClose}
                  onClose={alert.removerAlerta}
                />
              ))}

              <LancheComboForm
                nome={nome}
                descricao={descricao}
                preco={preco}
                onNomeChange={setNome}
                onDescricaoChange={setDescricao}
                onPrecoChange={setPreco}
                onSubmit={handleSubmit}
                errors={errors}
                editandoId={editandoId}
                onCancelar={handleCancelar}
                isLoading={loading}
              />

              <div className="mt-4">
                <LanchesTable
                  lanches={lanches}
                  onEditar={handleEditar}
                  onExcluir={handleExcluir}
                  editandoId={editandoId}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmacaoExclusaoModal
        isOpen={modalExclusao.isOpen}
        onConfirm={confirmarExclusao}
        onCancel={() => {
          modalExclusao.closeModal();
          setEditandoId(null);
        }}
        isLoading={loading}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este combo?"
        messageSecondary="Esta ação não pode ser desfeita."
      />
    </>
  );
}
