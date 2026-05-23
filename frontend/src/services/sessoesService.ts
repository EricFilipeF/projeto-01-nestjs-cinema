import type { Sessao, SessaoInput } from '../models/Sessao';
import { api } from './api';

const API_URL = '/sessao';

export const sessoesService = {
  async getAll(): Promise<Sessao[]> {
    const response = await api.get<Sessao[]>(API_URL);
    return response.data;
  },

  async getById(id: number | string): Promise<Sessao> {
    const response = await api.get<Sessao>(`${API_URL}/${id}`);
    return response.data;
  },

  async create(sessao: SessaoInput): Promise<Sessao> {
    const response = await api.post<Sessao>(API_URL, sessao);
    return response.data;
  },

  async update(id: number | string, sessao: SessaoInput): Promise<Sessao> {
    const response = await api.patch<Sessao>(`${API_URL}/${id}`, sessao);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  },
};
