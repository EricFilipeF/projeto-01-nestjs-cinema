import { useState, useEffect } from 'react';
import type { Sessao } from '../models/Sessao';
import type { Filme } from '../models/Filme';
import type { ComboPedido, CreatePedidoInput } from '../models/Pedido';
import type { LancheCombo } from '../models/LancheCombo';
import { lanchesService } from '../services/lanchesService';
import { pedidosService } from '../services/pedidosService';
import type { UseAlertReturn } from '../hooks/useAlert';

interface ModalVendaIngressoProps {
  isOpen: boolean;
  onClose: () => void;
  sessoes: Sessao[];
  filme: Filme;
  onPedidoFinalizado?: () => void;
  alert: UseAlertReturn;
}

export function ModalVendaIngresso({
  isOpen,
  onClose,
  sessoes,
  filme,
  onPedidoFinalizado,
  alert,
}: ModalVendaIngressoProps) {
  const agora = new Date();
  
  const sessoesFuturas = sessoes
    .filter((sessao) => {
      const dataSessao = new Date(sessao.horario);
      const vinte_minutos_apos = new Date(dataSessao.getTime() + 20 * 60 * 1000);
      return vinte_minutos_apos >= agora;
    })
    .sort((a, b) => new Date(a.horario).getTime() - new Date(b.horario).getTime());

  const [sessaoSelecionadaId, setSessaoSelecionadaId] = useState<string>(
    sessoesFuturas.length > 0 ? String(sessoesFuturas[0].id) : ''
  );
  const [qInteira, setQInteira] = useState(0);
  const [qMeia, setQMeia] = useState(0);
  const [combos, setCombos] = useState<ComboPedido[]>([]);
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const [loadingLanches, setLoadingLanches] = useState(false);
  const [salvandoPedido, setSalvandoPedido] = useState(false);

  const sessaoSelecionada = sessoesFuturas.find((s) => String(s.id) === sessaoSelecionadaId) || sessoesFuturas[0];

  useEffect(() => {
    if (isOpen) {
      carregarLanches();
    }
  }, [isOpen]);

  const carregarLanches = async () => {
    try {
      setLoadingLanches(true);
      const data = await lanchesService.getAll();
      setLanches(data);
    } catch (err) {
      console.error('Erro ao carregar lanches:', err);
    } finally {
      setLoadingLanches(false);
    }
  };

  const obterMensagemErro = (err: unknown, fallback: string): string => {
    if (typeof err === 'object' && err && 'response' in err) {
      const response = (err as { response?: { data?: { message?: string } } }).response;
      if (typeof response?.data?.message === 'string') {
        return response.data.message;
      }
    }

    return fallback;
  };
  const valorInteira = sessaoSelecionada?.valorIngresso || 0;
  const valorMeia = (sessaoSelecionada?.valorIngresso || 0) / 2;

  const calcularTotal = (): number => {
    const totalIngressos = qInteira * valorInteira + qMeia * valorMeia;
    const totalCombos = combos.reduce((sum, combo) => sum + combo.quantidade * combo.valorUnitario, 0);
    return totalIngressos + totalCombos;
  };

  const adicionarIngresso = (tipo: 'inteira' | 'meia') => {
    if (tipo === 'inteira') {
      setQInteira((prev) => prev + 1);
    } else {
      setQMeia((prev) => prev + 1);
    }
  };

  const removerIngresso = (tipo: 'inteira' | 'meia') => {
    if (tipo === 'inteira' && qInteira > 0) {
      const novaQInteira = qInteira - 1;
      setQInteira(novaQInteira);
      
      if (novaQInteira === 0 && qMeia === 0) {
        setCombos([]);
      }
    } else if (tipo === 'meia' && qMeia > 0) {
      const novaQMeia = qMeia - 1;
      setQMeia(novaQMeia);
      
      if (qInteira === 0 && novaQMeia === 0) {
        setCombos([]);
      }
    }
  };

  const adicionarLanche = (lanche: LancheCombo) => {
    setCombos((prev) => {
      const comboExistente = prev.find((combo) => combo.nome === lanche.nome);

      if (comboExistente) {
        return prev.map((combo) =>
          combo.nome === lanche.nome
            ? { ...combo, quantidade: combo.quantidade + 1 }
            : combo
        );
      }

      const novoCombo: ComboPedido = {
        nome: lanche.nome,
        descricao: lanche.descricao,
        quantidade: 1,
        valorUnitario: lanche.preco,
      };

      return [...prev, novoCombo];
    });
  };

  const removerLanche = (nomeLanche: string) => {
    setCombos((prev) => {
      const combo = prev.find((c) => c.nome === nomeLanche);
      if (!combo || combo.quantidade <= 1) {
        return prev.filter((c) => c.nome !== nomeLanche);
      }
      return prev.map((c) =>
        c.nome === nomeLanche
          ? { ...c, quantidade: c.quantidade - 1 }
          : c
      );
    });
  };

  const finalizarPedido = async () => {
    try {
      setSalvandoPedido(true);
      
      const ingresso: CreatePedidoInput['ingresso'] = [];
      
      for (let i = 0; i < qInteira; i++) {
        ingresso.push({
          valorInteira: valorInteira,
          valorMeia: valorMeia,
          sessaoId: String(sessaoSelecionada?.id),
        });
      }
      
      for (let i = 0; i < qMeia; i++) {
        ingresso.push({
          valorInteira: valorInteira,
          valorMeia: valorMeia,
          sessaoId: String(sessaoSelecionada?.id),
        });
      }

      const lancheCombo: CreatePedidoInput['lancheCombo'] = combos.map((combo) => ({
        nome: combo.nome,
        descricao: combo.descricao,
        preco: combo.valorUnitario,
        quantidade: combo.quantidade,
      }));
      
      const pedido: CreatePedidoInput = {
        quantidadeInteira: qInteira,
        quantidadeMeia: qMeia,
        ingresso,
        lancheCombo,
      };
      
      await pedidosService.create(pedido);
      
      alert.showSuccess('Ingresso vendido com sucesso!', { title: 'Sucesso' });
      
      limparPedido();
      onClose();
      
      if (onPedidoFinalizado) {
        onPedidoFinalizado();
      }
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      alert.showError(obterMensagemErro(err, 'Erro ao finalizar pedido. Tente novamente.'));
    } finally {
      setSalvandoPedido(false);
    }
  };

  const limparPedido = () => {
    setQInteira(0);
    setQMeia(0);
    setCombos([]);
  };

  const valorTotal = calcularTotal();
  const temItens = qInteira > 0 || qMeia > 0 || combos.length > 0;
  const temSessoesFuturas = sessoesFuturas.length > 0;
  const temIngressos = qInteira > 0 || qMeia > 0;

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="bi bi-ticket-perforated me-2"></i>
              Vender Ingresso
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="card mb-3">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">Filme</h6>
                <h5 className="card-title">{filme.titulo}</h5>
                <p className="mb-1">
                  <strong>Gênero:</strong> {filme.genero} | <strong>Duração:</strong> {filme.duracao} min
                </p>
                
                {sessoesFuturas.length > 1 ? (
                  <div className="mt-3">
                    <label htmlFor="sessaoSelect" className="form-label fw-semibold">
                      Selecione a sessão <span className="text-danger">*</span>
                    </label>
                    <select
                      id="sessaoSelect"
                      className="form-select"
                      value={sessaoSelecionadaId}
                      onChange={(e) => setSessaoSelecionadaId(e.target.value)}
                    >
                      {sessoesFuturas.map((sessao) => (
                        <option key={sessao.id} value={String(sessao.id)}>
                          {new Date(sessao.horario).toLocaleString('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })} - R$ {sessao.valorIngresso.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : sessoesFuturas.length === 1 ? (
                  <p className="mb-0 mt-2">
                    <strong>Horário:</strong>{' '}
                    {sessaoSelecionada && new Date(sessaoSelecionada.horario).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                ) : (
                  <div className="alert alert-warning mt-2 mb-0">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Não há sessões futuras disponíveis para este filme.
                  </div>
                )}
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header bg-light">
                <h6 className="mb-0">
                  <i className="bi bi-ticket me-2"></i>
                  Ingressos
                </h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold">Inteira</span>
                      <span className="badge bg-primary">R$ {valorInteira.toFixed(2)}</span>
                    </div>
                    <div className="input-group">
                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={() => removerIngresso('inteira')}
                        disabled={qInteira === 0 || !temSessoesFuturas}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={qInteira}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={() => adicionarIngresso('inteira')}
                        disabled={!temSessoesFuturas}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold">Meia-entrada</span>
                      <span className="badge bg-primary">R$ {valorMeia.toFixed(2)}</span>
                    </div>
                    <div className="input-group">
                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={() => removerIngresso('meia')}
                        disabled={qMeia === 0 || !temSessoesFuturas}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={qMeia}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={() => adicionarIngresso('meia')}
                        disabled={!temSessoesFuturas}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {(qInteira > 0 || qMeia > 0) && (
                  <div className="alert alert-info mb-0">
                    <strong>Total de ingressos:</strong> {qInteira + qMeia} ingresso(s) - 
                    R$ {(qInteira * valorInteira + qMeia * valorMeia).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header bg-light">
                <h6 className="mb-0">
                  <i className="bi bi-cup-straw me-2"></i>
                  Lanches e Combos
                </h6>
              </div>
              <div className="card-body">
                {loadingLanches ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                  </div>
                ) : lanches.length === 0 ? (
                  <p className="text-muted mb-0">Nenhum combo disponível no momento.</p>
                ) : !temIngressos ? (
                  <div className="alert alert-warning mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Atenção:</strong> Selecione pelo menos um ingresso para adicionar combos.
                  </div>
                ) : (
                  <div className="row g-3">
                    {lanches.map((lanche) => {
                      const comboItem = combos.find(
                        (combo) => combo.nome === lanche.nome
                      );
                      const quantidade = comboItem?.quantidade || 0;

                      return (
                        <div key={lanche.id} className="col-md-6">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="card-title mb-1">{lanche.nome}</h6>
                                  <p className="card-text small text-muted mb-2">
                                    {lanche.descricao}
                                  </p>
                                </div>
                                <span className="badge bg-warning text-dark">
                                  R$ {lanche.preco.toFixed(2)}
                                </span>
                              </div>

                              <div className="input-group input-group-sm">
                                <button
                                  className="btn btn-outline-danger"
                                  type="button"
                                  onClick={() => removerLanche(lanche.nome)}
                                  disabled={quantidade === 0 || !temSessoesFuturas || !temIngressos}
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <input
                                  type="text"
                                  className="form-control text-center"
                                  value={quantidade}
                                  readOnly
                                />
                                <button
                                  className="btn btn-outline-success"
                                  type="button"
                                  onClick={() => adicionarLanche(lanche)}
                                  disabled={!temSessoesFuturas || !temIngressos}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {combos.length > 0 && (
                  <div className="alert alert-warning mt-3 mb-0">
                    <strong>Total de combos:</strong>{' '}
                    {combos.reduce((sum, combo) => sum + combo.quantidade, 0)}{' '}
                    item(ns) - R${' '}
                    {combos
                      .reduce((sum, combo) => sum + combo.quantidade * combo.valorUnitario, 0)
                      .toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer d-flex justify-content-between">
            <div>
              <h5 className="mb-0">
                Total: <span className="text-success">R$ {valorTotal.toFixed(2)}</span>
              </h5>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={limparPedido}
                disabled={!temItens}
              >
                <i className="bi bi-trash me-2"></i>
                Limpar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={finalizarPedido}
                disabled={!temItens || !temSessoesFuturas || salvandoPedido}
              >
                {salvandoPedido ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Finalizando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Finalizar Pedido
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
