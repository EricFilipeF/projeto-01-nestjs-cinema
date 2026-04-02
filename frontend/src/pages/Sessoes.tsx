import { useState, useEffect, useRef } from 'react';
import { sessoesService } from '../services/sessoesService';
import { filmesService } from '../services/filmesService';
import { salasService } from '../services/salasService';
import type { Sessao } from '../models/Sessao';
import type { Filme } from '../models/Filme';
import type { Sala } from '../models/Sala';
import { Rodape } from '../components/Rodape';
import { PageHeader } from '../components/PageHeader';
import { ModalGerenciarSessoes } from '../components/ModalGerenciarSessoes';
import { ModalVendaIngresso } from '../components/ModalVendaIngresso';
import { ModalGerenciarCombos } from '../components/ModalGerenciarCombos';
import { ModalIngressosVendidos } from '../components/ModalIngressosVendidos';
import { FilmeCard } from '../components/FilmeCard';
import { Alert } from '../components/Alert';
import { useAlert } from '../hooks/useAlert';

export function Sessoes() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalVendaAberto, setModalVendaAberto] = useState(false);
  const [modalCombosAberto, setModalCombosAberto] = useState(false);
  const [modalPedidosAberto, setModalPedidosAberto] = useState(false);
  const [filmeIdSelecionado, setFilmeIdSelecionado] = useState<string | undefined>(undefined);
  const [sessoesSelecionadas, setSessoesSelecionadas] = useState<Sessao[]>([]);
  const [filmeSelecionado, setFilmeSelecionado] = useState<Filme | null>(null);
  const hasLoaded = useRef(false);
  const alert = useAlert();

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    carregarTodosDados();
  }, []);

  const carregarTodosDados = async () => {
    try {
      setLoading(true);
      const [sessoesData, filmesData, salasData] = await Promise.all([
        sessoesService.getAll(),
        filmesService.getAll(),
        salasService.getAll(),
      ]);
      setSessoes(sessoesData);
      setFilmes(filmesData);
      setSalas(salasData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    setFilmeIdSelecionado(undefined);
  };

  const handleSessoesAtualizadas = () => {
    carregarTodosDados();
  };

  const abrirModalNovaSessao = () => {
    setFilmeIdSelecionado(undefined);
    setModalAberto(true);
  };

  const abrirModalVenda = (filme: Filme) => {
    const agora = new Date();
    const sessoesDoFilme = sessoes
      .filter((sessao) => {
        const sessaoFilmeId = String(sessao.filmeId);
        const filmeIdStr = String(filme.id);
        
        if (sessaoFilmeId === filmeIdStr) return true;
        if (sessaoFilmeId == filmeIdStr) return true;
        
        const sessaoFilmeIdNum = parseInt(sessaoFilmeId, 10);
        const filmeIdNum = parseInt(filmeIdStr, 10);
        if (sessaoFilmeIdNum === filmeIdNum) return true;
        
        const sessaoFilmeIdHex = parseInt(sessaoFilmeId, 16);
        const filmeIdHex = parseInt(filmeIdStr, 16);
        if (sessaoFilmeIdHex === filmeIdNum) return true;
        if (filmeIdHex === sessaoFilmeIdNum) return true;
        
        return false;
      })
      .filter((sessao) => {
        const dataSessao = new Date(sessao.horario);
        const vinte_minutos_apos = new Date(dataSessao.getTime() + 20 * 60 * 1000);
        return vinte_minutos_apos >= agora;
      })
      .sort((a, b) => new Date(a.horario).getTime() - new Date(b.horario).getTime()); // Ordem crescente

    if (sessoesDoFilme.length > 0) {
      setSessoesSelecionadas(sessoesDoFilme);
      setFilmeSelecionado(filme);
      setModalVendaAberto(true);
    }
  };

  const fecharModalVenda = () => {
    setModalVendaAberto(false);
    setSessoesSelecionadas([]);
    setFilmeSelecionado(null);
  };

  const abrirModalCombos = () => {
    setModalCombosAberto(true);
  };

  const fecharModalCombos = () => {
    setModalCombosAberto(false);
  };

  const abrirModalPedidos = () => {
    setModalPedidosAberto(true);
  };

  const fecharModalPedidos = () => {
    setModalPedidosAberto(false);
  };

  const filmesComSessoes = filmes.filter((filme) => {
    const agora = new Date();
    return sessoes.some((sessao) => {
      // Verificar se a sessão pertence a este filme
      const sessaoFilmeId = String(sessao.filmeId);
      const filmeIdStr = String(filme.id);
      
      let pertenceAoFilme = false;
      if (sessaoFilmeId === filmeIdStr) pertenceAoFilme = true;
      if (sessaoFilmeId == filmeIdStr) pertenceAoFilme = true;
      
      const sessaoFilmeIdNum = parseInt(sessaoFilmeId, 10);
      const filmeIdNum = parseInt(filmeIdStr, 10);
      if (sessaoFilmeIdNum === filmeIdNum) pertenceAoFilme = true;
      
      const sessaoFilmeIdHex = parseInt(sessaoFilmeId, 16);
      const filmeIdHex = parseInt(filmeIdStr, 16);
      if (sessaoFilmeIdHex === filmeIdNum) pertenceAoFilme = true;
      if (filmeIdHex === sessaoFilmeIdNum) pertenceAoFilme = true;
      
      // Verificar se ainda está dentro do período de 20 minutos após o início
      if (pertenceAoFilme) {
        const dataSessao = new Date(sessao.horario);
        const vinte_minutos_apos = new Date(dataSessao.getTime() + 20 * 60 * 1000);
        return vinte_minutos_apos >= agora;
      }
      return false;
    });
  });

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <PageHeader title="Gerenciamento de Sessões" subtitle="Gerencie sessões, combos e ingressos vendidos" />

      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
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

      <main className="flex-grow-1 py-4">
        <div className="container">
          <div className="mb-4 d-flex justify-content-end">
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={abrirModalNovaSessao}
              >
                <i className="bi bi-calendar-event me-2"></i>
                Gerenciar Sessões
              </button>
              <button
                className="btn btn-warning"
                onClick={abrirModalCombos}
              >
                <i className="bi bi-cup-straw me-2"></i>
                Gerenciar Combos
              </button>
              <button
                className="btn btn-success"
                onClick={abrirModalPedidos}
              >
                <i className="bi bi-receipt me-2"></i>
                Ingressos Vendidos
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : filmesComSessoes.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              Nenhum filme com sessões agendadas no momento.
            </div>
          ) : (
            <div className="row g-4">
              {filmesComSessoes.map((filme) => (
                <div key={filme.id} className="col-md-3">
                  <FilmeCard filme={filme} onVenderIngresso={abrirModalVenda} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Rodape />

      {modalAberto && (
        <ModalGerenciarSessoes
          isOpen={modalAberto}
          onClose={fecharModal}
          filmes={filmes}
          salas={salas}
          filmeId={filmeIdSelecionado}
          onSessoesUpdate={handleSessoesAtualizadas}
        />
      )}

      {modalVendaAberto && sessoesSelecionadas.length > 0 && filmeSelecionado && (
        <ModalVendaIngresso
          isOpen={modalVendaAberto}
          onClose={fecharModalVenda}
          sessoes={sessoesSelecionadas}
          filme={filmeSelecionado}
          onPedidoFinalizado={carregarTodosDados}
          alert={alert}
        />
      )}

      {modalCombosAberto && (
        <ModalGerenciarCombos
          isOpen={modalCombosAberto}
          onClose={fecharModalCombos}
        />
      )}

      {modalPedidosAberto && (
        <ModalIngressosVendidos
          isOpen={modalPedidosAberto}
          onClose={fecharModalPedidos}
          filmes={filmes}
          sessoes={sessoes}
        />
      )}
    </div>
  );
}
