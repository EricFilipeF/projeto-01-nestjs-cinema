import axios from 'axios';
import type { Sala, SalaInput } from '../models/Sala';

const API_URL = 'http://localhost:3000/sala';

export const salasService = {
  // Buscar todas as salas
  getAll: async (): Promise<Sala[]> => {
    const response = await axios.get<Sala[]>(API_URL);
    return response.data;
  },

  // Buscar sala por ID
  getById: async (id: string): Promise<Sala> => {
    const response = await axios.get<Sala>(`${API_URL}/${id}`);
    return response.data;
  },

  // Criar nova sala
  create: async (sala: SalaInput): Promise<Sala> => {
    const response = await axios.post<Sala>(API_URL, sala);
    return response.data;
  },

  // Atualizar sala existente
  update: async (id: string, sala: SalaInput): Promise<Sala> => {
    const response = await axios.patch<Sala>(`${API_URL}/${id}`, sala);
    return response.data;
  },

  // Excluir sala
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
