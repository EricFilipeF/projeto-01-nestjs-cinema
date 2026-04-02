import { z } from 'zod';

export type TipoIngresso = 'inteira' | 'meia';

export interface Ingresso {
  id: number | string;
  tipo: TipoIngresso;
  valor: number;
  sessaoId: string;
}

export type IngressoInput = Omit<Ingresso, 'id'>;

export const ingressoSchema = z.object({
  tipo: z.enum(['inteira', 'meia'], { message: 'Tipo de ingresso é obrigatório' }),
  valor: z
    .number({ message: 'Valor é obrigatório' })
    .min(0.01, 'O valor deve ser maior que zero'),
  sessaoId: z
    .string({ message: 'Sessão é obrigatória' })
    .min(1, 'Selecione uma sessão'),
});

export type IngressoFormData = z.infer<typeof ingressoSchema>;
