import axios from 'axios';
import type { CreatePedidoInput, Pedido } from '../models/Pedido';

const API_URL = 'http://localhost:3000/pedido';

export const pedidosService = {
  // Buscar todos os pedidos
  getAll: async (): Promise<Pedido[]> => {
    const response = await axios.get<Pedido[]>(API_URL);
    return response.data;
  },

  // Buscar pedido por ID
  getById: async (id: string): Promise<Pedido> => {
    const response = await axios.get<Pedido>(`${API_URL}/${id}`);
    return response.data;
  },

  // Criar novo pedido
  create: async (pedido: CreatePedidoInput): Promise<Pedido> => {
    const response = await axios.post<Pedido>(API_URL, pedido);
    return response.data;
  },

  // Excluir pedido
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
