import { z } from 'zod';

export interface Filme {
  id: string;
  titulo: string;
  sinopse: string;
  genero: 'Ação' | 'Comédia' | 'Drama' | 'Ficção científica' | 'Terror';
  classificacao: 'livre' | '10' | '12' | '14' | '16' | '18';
  duracao: number;
  dataEstreia: string;
  imagem?: string;
}

export const filmeSchema = z.object({
  titulo: z
    .string({ message: 'Título é obrigatório' })
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  sinopse: z
    .string({ message: 'Sinopse é obrigatória' })
    .min(10, 'Sinopse deve ter no mínimo 10 caracteres')
    .max(500, 'Sinopse deve ter no máximo 500 caracteres'),
  genero: z.enum(['Ação', 'Comédia', 'Drama', 'Ficção científica', 'Terror'], {
    message: 'Selecione um gênero válido',
  }),
  classificacao: z.enum(['livre', '10', '12', '14', '16', '18'], {
    message: 'Selecione uma classificação válida',
  }),
  duracao: z
    .number({ message: 'Duração é obrigatória' })
    .min(1, 'Duração deve ser no mínimo 1 minuto')
    .max(500, 'Duração deve ser no máximo 500 minutos'),
  dataEstreia: z
    .string({ message: 'Data de estreia é obrigatória' })
    .min(1, 'Data de estreia é obrigatória'),
  imagem: z.string().optional(),
});

export type FilmeInput = z.infer<typeof filmeSchema>;

export type FilmeFormData = Omit<Filme, 'id'>;
