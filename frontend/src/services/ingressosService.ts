import type { Ingresso } from '../models/Ingresso';
import { api } from './api';

const API_URL = '/ingresso';

export const ingressosService = {
  async getAll(): Promise<Ingresso[]> {
    const response = await api.get<Ingresso[]>(API_URL);
    return response.data;
  },

  async getById(id: number | string): Promise<Ingresso> {
    const response = await api.get<Ingresso>(`${API_URL}/${id}`);
    return response.data;
  },

  async create(ingresso: Omit<Ingresso, 'id'>): Promise<Ingresso> {
    const response = await api.post<Ingresso>(API_URL, ingresso);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  },
};
