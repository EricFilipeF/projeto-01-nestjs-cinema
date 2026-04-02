import axios from 'axios';
import type { Ingresso } from '../models/Ingresso';

const API_URL = 'http://localhost:3000/ingresso';

export const ingressosService = {
  async getAll(): Promise<Ingresso[]> {
    const response = await axios.get<Ingresso[]>(API_URL);
    return response.data;
  },

  async getById(id: number | string): Promise<Ingresso> {
    const response = await axios.get<Ingresso>(`${API_URL}/${id}`);
    return response.data;
  },

  async create(ingresso: Omit<Ingresso, 'id'>): Promise<Ingresso> {
    const response = await axios.post<Ingresso>(API_URL, ingresso);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
