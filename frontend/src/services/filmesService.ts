import type { Filme, FilmeInput } from '../models/Filme';
import { api } from './api';

const API_URL = '/filme';

export const filmesService = {
  async getAll(): Promise<Filme[]> {
    const response = await api.get<Filme[]>(API_URL);
    return response.data;
  },

  async getById(id: string): Promise<Filme> {
    const response = await api.get<Filme>(`${API_URL}/${id}`);
    return response.data;
  },

  async create(filme: FilmeInput): Promise<Filme> {
    const response = await api.post<Filme>(API_URL, filme);
    return response.data;
  },

  async update(id: string, filme: FilmeInput): Promise<Filme> {
    const response = await api.patch<Filme>(`${API_URL}/${id}`, filme);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  },
};
