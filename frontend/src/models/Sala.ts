import { z } from 'zod';

export interface Sala {
  id: string;
  nome: string;
  capacidade: number;
}

export type SalaInput = Omit<Sala, 'id'>;

// Schema de validação com Zod
export const salaSchema = z.object({
  nome: z.string({ message: 'Nome é obrigatório' })
    .min(1, { message: 'Nome é obrigatório' })
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
    .max(50, { message: 'Nome deve ter no máximo 50 caracteres' }),
  capacidade: z.number({ message: 'Capacidade deve ser um número' })
    .int({ message: 'Capacidade deve ser um número inteiro' })
    .min(1, { message: 'Capacidade deve ser no mínimo 1' })
    .max(1000, { message: 'Capacidade deve ser no máximo 1000' }),
});

export type SalaFormData = z.infer<typeof salaSchema>;
