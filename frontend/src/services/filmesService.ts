import axios from 'axios';
import type { Filme, FilmeInput } from '../models/Filme';

const API_URL = 'http://localhost:3000/filme';

export const filmesService = {
  async getAll(): Promise<Filme[]> {
    const response = await axios.get<Filme[]>(API_URL);
    return response.data;
  },

  async getById(id: string): Promise<Filme> {
    const response = await axios.get<Filme>(`${API_URL}/${id}`);
    return response.data;
  },

  async create(filme: FilmeInput): Promise<Filme> {
    const response = await axios.post<Filme>(API_URL, filme);
    return response.data;
  },

  async update(id: string, filme: FilmeInput): Promise<Filme> {
    const response = await axios.patch<Filme>(`${API_URL}/${id}`, filme);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
