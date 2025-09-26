import { InfoTec } from '../types';

export const initialInfoTecs: InfoTec[] = [
  {
    id: '1',
    name: 'Desenvolvimento de Sistemas',
    period: 'matutino',
    modality: 'presencial',
    color: '#3B82F6',
    startDate: '2024-02-01',
    studentDays: 'Segunda a Sexta',
    classDays: 'Segunda, Quarta e Sexta',
    duration: 1200,
    priority: 'alta'
  },
  {
    id: '2',
    name: 'Redes de Computadores',
    period: 'vespertino',
    modality: 'presencial',
    color: '#10B981',
    startDate: '2024-02-01',
    studentDays: 'Segunda a Sexta',
    classDays: 'Terça e Quinta',
    duration: 800,
    priority: 'media'
  },
  {
    id: '3',
    name: 'Segurança da Informação',
    period: 'noturno',
    modality: 'EAD',
    color: '#8B5CF6',
    startDate: '2024-03-01',
    studentDays: 'Segunda a Sexta',
    classDays: 'Segunda e Quarta',
    duration: 600,
    priority: 'baixa'
  }
];