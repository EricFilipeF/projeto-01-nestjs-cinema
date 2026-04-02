import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rodape } from '../components/Rodape';
import { ModalVendaIngresso } from '../components/ModalVendaIngresso';
import { FilmeCard } from '../components/FilmeCard';
import type { Filme } from '../models/Filme';
import type { Sessao } from '../models/Sessao';
import { Alert } from '../components/Alert';
import { useAlert } from '../hooks/useAlert';
import { filmesService } from '../services/filmesService';
import { sessoesService } from '../services/sessoesService';

export function Home() {
  const [filmesComSessao, setFilmesComSessao] = useState<Filme[]>([]);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVendaAberto, setModalVendaAberto] = useState(false);
  const [filmeSelecionado, setFilmeSelecionado] = useState<Filme | null>(null);
  const [sessoesSelecionadas, setSessoesSelecionadas] = useState<Sessao[]>([]);
  const alert = useAlert();

  useEffect(() => {
    const carregarFilmesComSessao = async () => {
      try {
        setLoading(true);
        
        const [filmes, sessoesData] = await Promise.all([
          filmesService.getAll(),
          sessoesService.getAll(),
        ]);

        const agora = new Date();
        const proximasSessoes = sessoesData.filter((sessao) => {
          const dataSessao = new Date(sessao.horario);
          const vinte_minutos_apos = new Date(dataSessao.getTime() + 20 * 60 * 1000);
          return vinte_minutos_apos >= agora;
        });

        const filmesComSessaoProxima = filmes.filter((filme) => {
          return proximasSessoes.some((sessao) => {
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
          });
        });

        setFilmesComSessao(filmesComSessaoProxima);
        setSessoes(proximasSessoes);
      } catch (error) {
        console.error('Erro ao carregar filmes com sessões:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarFilmesComSessao();
  }, []);

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
      .sort((a, b) => new Date(a.horario).getTime() - new Date(b.horario).getTime());

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

  return (
    <>
      {/* Cabeçalho */}
      <header className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold">Bem-vindo ao CineWeb</h1>
              <p className="lead">Confira a programação e garanta já o seu ingresso!</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="bg-white rounded p-3 d-inline-block">
                <h2 className="text-primary mb-0">CineWeb</h2>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filmes em Cartaz */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Filmes em Exibição</h2>
          
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : filmesComSessao.length === 0 ? (
            <div className="alert alert-info text-center">
              Nenhum filme com sessões agendadas no momento.
            </div>
          ) : (
            <div className="row g-4" id="filmes-cartaz">
              {filmesComSessao.map((filme) => (
                <div key={filme.id} className="col-md-3">
                  <FilmeCard filme={filme} onVenderIngresso={abrirModalVenda} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção de Acesso Rápido */}
      <section className="bg-light py-5">
        <div className="container">
          <h3 className="text-center mb-4">Acesso Rápido</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card text-center h-100">
                <div className="card-body">
                  <i className="bi bi-film fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Cadastrar Filme</h5>
                  <p className="card-text">Adicione novos filmes ao catálogo</p>
                  <Link to="/filmes" className="btn btn-outline-primary">
                    Acessar
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center h-100">
                <div className="card-body">
                  <i className="bi bi-door-open fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Cadastrar Salas</h5>
                  <p className="card-text">Cadastre as salas do cinema</p>
                  <Link to="/salas" className="btn btn-outline-primary">
                    Acessar
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center h-100">
                <div className="card-body">
                  <i className="bi bi-ticket-perforated fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Gerenciar Sessões</h5>
                  <p className="card-text">Crie e gerencie as sessões</p>
                  <Link to="/sessoes" className="btn btn-outline-primary">
                    Acessar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <Rodape />

      {modalVendaAberto && sessoesSelecionadas.length > 0 && filmeSelecionado && (
        <ModalVendaIngresso
          isOpen={modalVendaAberto}
          onClose={fecharModalVenda}
          sessoes={sessoesSelecionadas}
          filme={filmeSelecionado}
          alert={alert}
        />
      )}

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
    </>
  );
}