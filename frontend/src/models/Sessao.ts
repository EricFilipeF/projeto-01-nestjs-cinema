import { z } from 'zod';

export interface Sessao {
  id: number | string;
  horario: string;
  filmeId: string;
  salaId: string;
  tipoProjecao: '2d' | '3d';
  valorIngresso: number;
  ingressosVendidos?: number;
}

export type SessaoInput = Omit<Sessao, 'id'>;

export const sessaoSchema = z.object({
  horario: z
    .string({ message: 'Data e horário são obrigatórios' })
    .min(1, 'Data e horário são obrigatórios')
    .refine(
      (horario) => {
        // Converte a string do datetime-local para uma data local
        const [date, time] = horario.split('T');
        const [year, month, day] = date.split('-');
        const [hour, minute] = time.split(':');
        
        const dataSessao = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute)
        );
        
        const agora = new Date();
        return dataSessao >= agora;
      },
      { message: 'A data e horário da sessão não podem ser retroativos' }
    ),
  filmeId: z
    .string({ message: 'Filme é obrigatório' })
    .min(1, 'Selecione um filme'),
  salaId: z
    .string({ message: 'Sala é obrigatória' })
    .min(1, 'Selecione uma sala'),
  tipoProjecao: z.enum(['2d', '3d'], { message: 'Tipo de sessão é obrigatório' }),
  valorIngresso: z
    .number({ message: 'Valor do ingresso é obrigatório' })
    .min(0.01, 'O valor do ingresso deve ser maior que zero'),
});

export type SessaoFormData = z.infer<typeof sessaoSchema>;
