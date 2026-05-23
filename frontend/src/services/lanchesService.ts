import type { LancheCombo, LancheComboInput } from '../models/LancheCombo';
import { api } from './api';

const API_URL = '/combo';

export const lanchesService = {
  async getAll(): Promise<LancheCombo[]> {
    const response = await api.get<LancheCombo[]>(API_URL);
    return response.data;
  },

  async getById(id: number | string): Promise<LancheCombo> {
    const response = await api.get<LancheCombo>(`${API_URL}/${id}`);
    return response.data;
  },

  async create(lanche: LancheComboInput): Promise<LancheCombo> {
    const response = await api.post<LancheCombo>(API_URL, lanche);
    return response.data;
  },

  async update(id: number | string, lanche: LancheComboInput): Promise<LancheCombo> {
    const response = await api.patch<LancheCombo>(`${API_URL}/${id}`, lanche);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  },
};
