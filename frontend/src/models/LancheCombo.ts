import { z } from 'zod';

export interface LancheCombo {
  id: number | string;
  nome: string;
  descricao: string;
  preco: number;
}

export type LancheComboInput = Omit<LancheCombo, 'id'>;

export const lancheComboSchema = z.object({
  nome: z
    .string({ message: 'Nome é obrigatório' })
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  descricao: z
    .string({ message: 'Descrição é obrigatória' })
    .min(1, 'Descrição é obrigatória')
    .max(300, 'Descrição deve ter no máximo 300 caracteres'),
  preco: z
    .number({ message: 'Preço é obrigatório' })
    .min(0.01, 'O preço deve ser maior que zero'),
});

export type LancheComboFormData = z.infer<typeof lancheComboSchema>;
