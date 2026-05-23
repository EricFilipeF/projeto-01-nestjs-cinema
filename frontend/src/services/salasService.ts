import type { Sala, SalaInput } from '../models/Sala';
import { api } from './api';

const API_URL = '/sala';

export const salasService = {
  // Buscar todas as salas
  getAll: async (): Promise<Sala[]> => {
    const response = await api.get<Sala[]>(API_URL);
    return response.data;
  },

  // Buscar sala por ID
  getById: async (id: string): Promise<Sala> => {
    const response = await api.get<Sala>(`${API_URL}/${id}`);
    return response.data;
  },

  // Criar nova sala
  create: async (sala: SalaInput): Promise<Sala> => {
    const response = await api.post<Sala>(API_URL, sala);
    return response.data;
  },

  // Atualizar sala existente
  update: async (id: string, sala: SalaInput): Promise<Sala> => {
    const response = await api.patch<Sala>(`${API_URL}/${id}`, sala);
    return response.data;
  },

  // Excluir sala
  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  },
};
