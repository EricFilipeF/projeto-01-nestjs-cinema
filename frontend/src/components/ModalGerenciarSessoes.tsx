import { useState, useEffect, type FormEvent } from 'react';
import type { Sessao } from '../models/Sessao';
import type { Filme } from '../models/Filme';
import type { Sala } from '../models/Sala';
import { sessaoSchema } from '../models/Sessao';
import { sessoesService } from '../services/sessoesService';
import { SessaoForm } from './SessaoForm';
import { SessoesTable } from './SessoesTable';
import { ConfirmacaoExclusaoModal } from './ModalConfirmacaoExclusao';
import { Alert } from './Alert';
import { useModal } from '../hooks/useModal';
import { useAlert } from '../hooks/useAlert';

interface ModalGerenciarSessoesProps {
  isOpen: boolean;
  onClose: () => void;
  filmeId?: string;
  filmes: Filme[];
  salas: Sala[];
  onSessoesUpdate: () => void;
}

export function ModalGerenciarSessoes({
  isOpen,
  onClose,
  filmeId: filmeIdProp,
  filmes,
  salas,
  onSessoesUpdate,
}: ModalGerenciarSessoesProps) {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [editandoId, setEditandoId] = useState<number | string | null>(null);
  const [filmeId, setFilmeId] = useState('');
  const [salaId, setSalaId] = useState('');
  const [tipoProjecao, setTipoProjecao] = useState<'2d' | '3d' | ''>('');
  const [horario, setHorario] = useState('');
  const [valorIngresso, setValorIngresso] = useState('');
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
      carregarSessoes();
      if (filmeIdProp) {
        setFilmeId(filmeIdProp);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, filmeIdProp]);

  const carregarSessoes = async () => {
    try {
      setLoading(true);
      const data = await sessoesService.getAll();
      const sessoesOrdenadas = data.sort((a, b) => 
        new Date(a.horario).getTime() - new Date(b.horario).getTime()
      );
      setSessoes(sessoesOrdenadas);
    } catch (err) {
      console.error('Erro ao carregar sessões:', err);
      alert.showError('Erro ao carregar sessões.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      horario: horario || undefined,
      filmeId: filmeId || undefined,
      salaId: salaId || undefined,
      tipoProjecao: tipoProjecao || undefined,
      valorIngresso: valorIngresso ? parseFloat(valorIngresso) : undefined,
    };

    const result = sessaoSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const sessaoData = {
        horario: result.data.horario,
        filmeId: result.data.filmeId,
        salaId: result.data.salaId,
        tipoProjecao: result.data.tipoProjecao,
        valorIngresso: result.data.valorIngresso,
      };

      if (editandoId) {
        await sessoesService.update(editandoId, sessaoData);
        alert.showSuccess('Sessão atualizada com sucesso!', { title: 'Sucesso' });
      } else {
        await sessoesService.create(sessaoData);
        alert.showSuccess('Sessão agendada com sucesso!', { title: 'Sucesso' });
      }

      limparFormulario();
      await carregarSessoes();
      onSessoesUpdate();
    } catch (err) {
      console.error('Erro ao salvar sessão:', err);
      alert.showError(obterMensagemErro(err, 'Erro ao salvar sessão. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  const editarSessao = async (id: number | string) => {
    const sessao = sessoes.find((s) => s.id == id);
    if (!sessao) return;

    setEditandoId(id);
    setFilmeId(String(sessao.filmeId));
    setSalaId(String(sessao.salaId));
    setTipoProjecao(sessao.tipoProjecao);
    setHorario(sessao.horario.slice(0, 16));
    setValorIngresso(String(sessao.valorIngresso));
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    limparFormulario();
  };

  const limparFormulario = () => {
    if (!filmeIdProp) {
      setFilmeId('');
    }
    setSalaId('');
    setTipoProjecao('');
    setHorario('');
    setValorIngresso('');
    setErrors({});
    setEditandoId(null);
  };

  const confirmarExclusao = async (id: number | string) => {
    modalExclusao.openModal(id);
  };

  const excluirSessao = async () => {
    const sessaoId = modalExclusao.data;
    if (!sessaoId) return;

    try {
      setLoading(true);
      await sessoesService.delete(sessaoId);
      alert.showSuccess('Sessão excluída com sucesso!', { title: 'Sucesso' });

      if (editandoId === sessaoId) {
        cancelarEdicao();
      }

      await carregarSessoes();
      onSessoesUpdate();
    } catch (err) {
      console.error('Erro ao excluir sessão:', err);
      alert.showError(obterMensagemErro(err, 'Erro ao excluir sessão. Tente novamente.'));
    } finally {
      setLoading(false);
      modalExclusao.closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-calendar-event me-2"></i>
                Gerenciar Sessões
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

              <SessaoForm
                filmeId={filmeId}
                salaId={salaId}
                tipoProjecao={tipoProjecao}
                horario={horario}
                valorIngresso={valorIngresso}
                errors={errors}
                loading={loading}
                editandoId={editandoId}
                filmes={filmes}
                salas={salas}
                onFilmeIdChange={setFilmeId}
                onSalaIdChange={setSalaId}
                onTipoProjecaoChange={setTipoProjecao}
                onHorarioChange={setHorario}
                onValorIngressoChange={setValorIngresso}
                onSubmit={handleSubmit}
                onCancelar={cancelarEdicao}
              />

              <div className="mt-4">
                <SessoesTable
                  sessoes={sessoes}
                  filmes={filmes}
                  salas={salas}
                  loading={loading}
                  editandoId={editandoId}
                  onEdit={editarSessao}
                  onDelete={confirmarExclusao}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmacaoExclusaoModal
        isOpen={modalExclusao.isOpen}
        isLoading={loading}
        onCancel={modalExclusao.closeModal}
        onConfirm={excluirSessao}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta sessão?"
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
      />
    </>
  );
}
