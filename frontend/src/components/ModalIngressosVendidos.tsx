import { useState, useEffect } from 'react';
import type { Pedido } from '../models/Pedido';
import type { Filme } from '../models/Filme';
import type { Sessao } from '../models/Sessao';
import { pedidosService } from '../services/pedidosService';

interface ModalIngressosVendidosProps {
  isOpen: boolean;
  onClose: () => void;
  filmes: Filme[];
  sessoes: Sessao[];
}

export function ModalIngressosVendidos({
  isOpen,
  onClose,
  filmes,
  sessoes,
}: ModalIngressosVendidosProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      carregarPedidos();
    }
  }, [isOpen]);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidosService.getAll();
      setPedidos(
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string): string => {
    return new Date(data).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const getFilmeNomePorSessao = (sessaoId: string): string => {
    const sessao = sessoes.find((s) => String(s.id) === String(sessaoId));
    if (!sessao) return 'Filme não encontrado';

    const filme = filmes.find((f) => String(f.id) === String(sessao.filmeId));
    return filme?.titulo || 'Filme não encontrado';
  };

  const getSessaoHorario = (sessaoId: string): string => {
    const sessao = sessoes.find((s) => String(s.id) === String(sessaoId));
    if (!sessao) return 'Sessão não encontrada';
    return new Date(sessao.horario).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-receipt me-2"></i>
              Ingressos Vendidos
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Nenhum ingresso vendido ainda.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Data/Hora</th>
                      <th>Filme</th>
                      <th>Sessão</th>
                      <th>Inteiras</th>
                      <th>Meias</th>
                      <th>Combos</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => {
                      const sessaoId = pedido.ingresso[0]?.sessaoId;
                      const totalCombos = pedido.lanchePedido.reduce((sum, combo) => sum + (combo.quantidade ?? 1), 0);

                      return (
                        <tr key={pedido.id}>
                          <td>
                            <small className="text-muted">{formatarData(pedido.createdAt)}</small>
                          </td>
                          <td>
                            <strong>{sessaoId ? getFilmeNomePorSessao(sessaoId) : 'Filme não encontrado'}</strong>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {sessaoId ? getSessaoHorario(sessaoId) : 'Sessão não encontrada'}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-primary">
                              {pedido.quantidadeInteira}x
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {pedido.quantidadeMeia}x
                            </span>
                          </td>
                          <td>
                            {totalCombos > 0 ? (
                              <span className="badge bg-warning text-dark">
                                {totalCombos}x
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <strong className="text-success">
                              R$ {pedido.valorTotal.toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan={6} className="text-end">
                        <strong>Total Geral:</strong>
                      </td>
                      <td>
                        <strong className="text-success">
                          R${' '}
                          {pedidos
                            .reduce((sum, p) => sum + p.valorTotal, 0)
                            .toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
