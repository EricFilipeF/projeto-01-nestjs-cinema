import axios from 'axios';
import type { Sessao, SessaoInput } from '../models/Sessao';

const API_URL = 'http://localhost:3000/sessao';

export const sessoesService = {
  async getAll(): Promise<Sessao[]> {
    const response = await axios.get<Sessao[]>(API_URL);
    return response.data;
  },

  async getById(id: number | string): Promise<Sessao> {
    const response = await axios.get<Sessao>(`${API_URL}/${id}`);
    return response.data;
  },

  async create(sessao: SessaoInput): Promise<Sessao> {
    const response = await axios.post<Sessao>(API_URL, sessao);
    return response.data;
  },

  async update(id: number | string, sessao: SessaoInput): Promise<Sessao> {
    const response = await axios.put<Sessao>(`${API_URL}/${id}`, sessao);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
