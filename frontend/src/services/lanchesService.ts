import axios from 'axios';
import type { LancheCombo, LancheComboInput } from '../models/LancheCombo';

const API_URL = 'http://localhost:3000/combo';

export const lanchesService = {
  async getAll(): Promise<LancheCombo[]> {
    const response = await axios.get<LancheCombo[]>(API_URL);
    return response.data;
  },

  async getById(id: number | string): Promise<LancheCombo> {
    const response = await axios.get<LancheCombo>(`${API_URL}/${id}`);
    return response.data;
  },

  async create(lanche: LancheComboInput): Promise<LancheCombo> {
    const response = await axios.post<LancheCombo>(API_URL, lanche);
    return response.data;
  },

  async update(id: number | string, lanche: LancheComboInput): Promise<LancheCombo> {
    const response = await axios.put<LancheCombo>(`${API_URL}/${id}`, lanche);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
