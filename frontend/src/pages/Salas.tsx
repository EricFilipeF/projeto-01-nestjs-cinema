import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { salasService } from '../services/salasService';
import type { Sala } from '../models/Sala';
import { salaSchema } from '../models/Sala';
import { ConfirmacaoExclusaoModal } from '../components/ModalConfirmacaoExclusao';
import { Alert } from '../components/Alert';
import { Rodape } from '../components/Rodape';
import { SalasTable } from '../components/SalasTable';
import { SalaForm } from '../components/SalasForm';
import { PageHeader } from '../components/PageHeader';
import { useModal } from '../hooks/useModal';
import { useAlert } from '../hooks/useAlert';

export function Salas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const modalExclusao = useModal();
  const alert = useAlert();
  const hasLoaded = useRef(false);

  // Carregar salas da API ao iniciar
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadSalas = async () => {
      try {
        setLoading(true);
        const data = await salasService.getAll();
        setSalas(data);
      } catch (err) {
        console.error('Erro ao carregar salas:', err);
        alert.showError('Erro ao carregar salas. Verifique se o servidor está rodando.');
      } finally {
        setLoading(false);
      }
    };

    loadSalas();
  }, []);

  // Função para carregar salas da API 
  const carregarSalas = async () => {
    try {
      setLoading(true);
      const data = await salasService.getAll();
      setSalas(data);
    } catch (err) {
      console.error('Erro ao carregar salas:', err);
      alert.showError('Erro ao carregar salas. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  // Cadastrar ou atualizar sala
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validar com Zod
    const formData = {
      nome: nome.trim(),
      capacidade: capacidade ? parseInt(capacidade) : undefined,
    };

    const result = salaSchema.safeParse(formData);

    if (!result.success) {
      // Mapear erros do Zod para o state
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

      if (editandoId) {
        // Atualizar sala existente
        await salasService.update(editandoId, result.data);
        alert.showSuccess('Sala atualizada com sucesso!', { title: 'Sucesso' });
        cancelarEdicao();
      } else {
        // Adicionar nova sala
        await salasService.create(result.data);
        alert.showSuccess('Sala cadastrada com sucesso!', { title: 'Sucesso' });
        limparFormulario();
      }

      // Recarregar lista
      await carregarSalas();
    } catch (err) {
      console.error('Erro ao salvar sala:', err);
      alert.showError('Erro ao salvar sala. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Editar sala
  const editarSala = (id: string) => {
    const sala = salas.find((s) => s.id === id);
    if (!sala) return;

    setEditandoId(id);
    setNome(sala.nome);
    setCapacidade(sala.capacidade.toString());

    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditandoId(null);
    limparFormulario();
  };

  // Limpar formulário
  const limparFormulario = () => {
    setNome('');
    setCapacidade('');
    setErrors({});
  };

  // Excluir sala
  const confirmarExclusao = (id: string) => {
    modalExclusao.openModal(id);
  };

  // Executar exclusão após confirmação do modal
  const excluirSala = async () => {
    const salaId = modalExclusao.data;
    if (!salaId) return;

    try {
      setLoading(true);
      await salasService.delete(salaId);
      alert.showSuccess('Sala excluída com sucesso!', { title: 'Sucesso' });

      // Se estava editando esta sala, cancelar a edição
      if (editandoId === salaId) {
        cancelarEdicao();
      }

      // Recarregar lista
      await carregarSalas();
    } catch (err) {
      console.error('Erro ao excluir sala:', err);
      alert.showError('Erro ao excluir sala. Tente novamente.');
    } finally {
      setLoading(false);
      modalExclusao.closeModal();
    }
  };



  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <PageHeader title="Gerenciamento de Salas" subtitle="Gerencie as salas disponíveis no CineWeb" />

      {/* Container de alertas */}
      <div className="container mt-4" style={{ position: 'relative', zIndex: 1000 }}>
        {alert.alerts.map((alertMessage) => (
          <Alert
            key={alertMessage.id}
            id={alertMessage.id}
            type={alertMessage.type}
            title={alertMessage.title}
            message={alertMessage.message}
            dismissible={alertMessage.dismissible}
            autoClose={alertMessage.autoClose}
            onClose={alert.removerAlerta}
          />
        ))}
      </div>

      <main className="py-5 flex-grow-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <SalaForm
                nome={nome}
                capacidade={capacidade}
                errors={errors}
                loading={loading}
                editandoId={editandoId}
                onNomeChange={setNome}
                onCapacidadeChange={setCapacidade}
                onSubmit={handleSubmit}
                onCancelar={cancelarEdicao}
              />

              <SalasTable
                salas={salas}
                loading={loading}
                editandoId={editandoId}
                onEdit={editarSala}
                onDelete={confirmarExclusao}
              />
            </div>
          </div>
        </div>
      </main>

      <Rodape />

      {/* Modal de confirmação de exclusão */}
      <ConfirmacaoExclusaoModal
        isOpen={modalExclusao.isOpen}
        isLoading={loading}
        onConfirm={excluirSala}
        onCancel={modalExclusao.closeModal}
        title="Confirmar Exclusão de Sala"
        message="Tem certeza que deseja excluir esta sala?"
      />
    </div>
  );
}