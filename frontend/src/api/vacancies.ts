import api from './client';
import type { Vacancy, VacancyCreate } from '../types/vacancy';

export const vacanciesApi = {
  getAll: () => api.get<Vacancy[]>('/vacancies').then(res => res.data),
  getById: (id: number) => api.get<Vacancy>(`/vacancies/${id}`).then(res => res.data),
  create: (data: VacancyCreate) => api.post<Vacancy>('/vacancies', data).then(res => res.data),
};