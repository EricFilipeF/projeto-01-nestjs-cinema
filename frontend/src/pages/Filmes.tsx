import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { filmesService } from '../services/filmesService';
import type { Filme } from '../models/Filme';
import { filmeSchema } from '../models/Filme';
import { ConfirmacaoExclusaoModal } from '../components/ModalConfirmacaoExclusao';
import { Alert } from '../components/Alert';
import { Rodape } from '../components/Rodape';
import { FilmesTable } from '../components/FilmesTable';
import { FilmeForm } from '../components/FilmeForm';
import { PageHeader } from '../components/PageHeader';
import { useModal } from '../hooks/useModal';
import { useAlert } from '../hooks/useAlert';

export function Filmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [genero, setGenero] = useState('');
  const [classificacao, setClassificacao] = useState('');
  const [duracao, setDuracao] = useState('');
  const [dataEstreia, setDataEstreia] = useState('');
  const [imagem, setImagem] = useState('');
  const [imagemPreview, setImagemPreview] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const modalExclusao = useModal();
  const alert = useAlert();
  const hasLoaded = useRef(false);

  // Carregar filmes da API ao iniciar
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadFilmes = async () => {
      try {
        setLoading(true);
        const data = await filmesService.getAll();
        setFilmes(data);
      } catch (err) {
        console.error('Erro ao carregar filmes:', err);
        alert.showError('Erro ao carregar filmes. Verifique se o servidor está rodando.');
      } finally {
        setLoading(false);
      }
    };

    loadFilmes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função para carregar filmes da API (reutilizável)
  const carregarFilmes = async () => {
    try {
      setLoading(true);
      const data = await filmesService.getAll();
      setFilmes(data);
    } catch (err) {
      console.error('Erro ao carregar filmes:', err);
      alert.showError('Erro ao carregar filmes. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  // Handler para mudança de imagem
  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setImagem(url);
    setImagemPreview(url);
  };

  // Remover imagem
  const removerImagem = () => {
    setImagem('');
    setImagemPreview('');
  };

  // Cadastrar ou atualizar filme
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validar com Zod
    const formData = {
      titulo: titulo.trim(),
      sinopse: sinopse.trim(),
      genero: genero as any,
      classificacao: classificacao as any,
      duracao: duracao ? parseInt(duracao) : undefined,
      dataEstreia: dataEstreia || undefined,
      imagem: imagem || undefined,
    };

    const result = filmeSchema.safeParse(formData);

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

    // Validar imagem para novo cadastro
    if (!editandoId && !imagem) {
      setErrors({ imagem: 'Por favor, selecione uma imagem para o filme.' });
      return;
    }

    try {
      setLoading(true);

      if (editandoId) {
        // Atualizar filme existente
        await filmesService.update(editandoId, result.data);
        alert.showSuccess('Filme atualizado com sucesso!', { title: 'Sucesso' });
        cancelarEdicao();
      } else {
        // Adicionar novo filme
        await filmesService.create(result.data);
        alert.showSuccess('Filme cadastrado com sucesso!', { title: 'Sucesso' });
        limparFormulario();
      }

      // Recarregar lista
      await carregarFilmes();
    } catch (err) {
      console.error('Erro ao salvar filme:', err);
      alert.showError('Erro ao salvar filme. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Editar filme
  const editarFilme = (id: string) => {
    const filme = filmes.find((f) => f.id === id);
    if (!filme) return;

    setEditandoId(id);
    setTitulo(filme.titulo);
    setSinopse(filme.sinopse);
    setGenero(filme.genero);
    setClassificacao(filme.classificacao);
    setDuracao(filme.duracao.toString());
    setDataEstreia(filme.dataEstreia);
    setImagem(filme.imagem || '');
    setImagemPreview(filme.imagem || '');

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
    setTitulo('');
    setSinopse('');
    setGenero('');
    setClassificacao('');
    setDuracao('');
    setDataEstreia('');
    setImagem('');
    setImagemPreview('');
    setErrors({});
  };

  // Excluir filme
  const confirmarExclusao = (id: string) => {
    modalExclusao.openModal(id);
  };

  // Executar exclusão após confirmação do modal
  const excluirFilme = async () => {
    const filmeId = modalExclusao.data;
    if (!filmeId) return;

    try {
      setLoading(true);
      await filmesService.delete(filmeId);
      alert.showSuccess('Filme excluído com sucesso!', { title: 'Sucesso' });

      // Se estava editando este filme, cancelar a edição
      if (editandoId === filmeId) {
        cancelarEdicao();
      }

      // Recarregar lista
      await carregarFilmes();
    } catch (err) {
      console.error('Erro ao excluir filme:', err);
      alert.showError('Erro ao excluir filme. Tente novamente.');
    } finally {
      setLoading(false);
      modalExclusao.closeModal();
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <PageHeader
        title="Gerenciamento de Filmes"
        subtitle="Adicione novos filmes ao catálogo do CineWeb"
      />

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
            <div className="col-lg-10">
              <FilmeForm
                titulo={titulo}
                sinopse={sinopse}
                genero={genero}
                classificacao={classificacao}
                duracao={duracao}
                dataEstreia={dataEstreia}
                imagem={imagem}
                imagemPreview={imagemPreview}
                errors={errors}
                loading={loading}
                editandoId={editandoId}
                onTituloChange={setTitulo}
                onSinopseChange={setSinopse}
                onGeneroChange={setGenero}
                onClassificacaoChange={setClassificacao}
                onDuracaoChange={setDuracao}
                onDataEstreiaChange={setDataEstreia}
                onImagemChange={handleImagemChange}
                onRemoverImagem={removerImagem}
                onSubmit={handleSubmit}
                onCancelar={cancelarEdicao}
              />

              <FilmesTable
                filmes={filmes}
                loading={loading}
                editandoId={editandoId}
                onEdit={editarFilme}
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
        onConfirm={excluirFilme}
        onCancel={modalExclusao.closeModal}
        title="Confirmar Exclusão de Filme"
        message="Tem certeza que deseja excluir este filme?"
      />
    </div>
  );
}