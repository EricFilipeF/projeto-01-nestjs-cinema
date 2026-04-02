export interface ComboPedido {
  nome: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Pedido {
  id: string;
  quantidadeInteira: number;
  quantidadeMeia: number;
  valorTotal: number;
  createdAt: string;
  ingresso: {
    id: string;
    valorInteira: number;
    valorMeia: number;
    sessaoId: string;
  }[];
  lancheCombo: {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
  }[];
}

export interface CreatePedidoInput {
  quantidadeInteira: number;
  quantidadeMeia: number;
  ingresso: {
    valorInteira: number;
    valorMeia: number;
    sessaoId: string;
  }[];
  lancheCombo: {
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
  }[];
}
